"use client";

import { use, useEffect, useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ServerDown from "@/components/ServerDown";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/api";

interface Event {
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  slug: string;
}

interface BookingForm {
  name: string;
  email: string;
  tickets: number;
}

interface Booking {
  _id: string;
  name: string;
  email: string;
  tickets: number;
  createdAt: string;
}

const INITIAL_BOOKING: BookingForm = { name: "", email: "", tickets: 1 };

const EventPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params);
  const router = useRouter();
  const { isAuthenticated, authHeader } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverDown, setServerDown] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Booking form state
  const [booking, setBooking] = useState<BookingForm>(INITIAL_BOOKING);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Bookings list state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  async function fetchBookings() {
    setBookingsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings/${slug}`);
      const data = await res.json();
      if (data.success) setBookings(data.data);
    } finally {
      setBookingsLoading(false);
    }
  }

  useEffect(() => {
    const getEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events/${slug}`);
        if (!response.ok) throw new Error("Event not found");
        const data = await response.json();
        setEvent(data.data);
      } catch (err: unknown) {
        if (err instanceof TypeError) {
          setServerDown(true);
        } else {
          setError(err instanceof Error ? err.message : "Unexpected error");
        }
      } finally {
        setLoading(false);
      }
    };

    getEvent();
    fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  function handleBookingChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: name === "tickets" ? Number(value) : value }));
  }

  async function handleBookingSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBookingError(null);
    setBookingLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ eventSlug: slug, ...booking }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Something went wrong");
      setBookingSuccess(true);
      setBooking(INITIAL_BOOKING);
      fetchBookings();
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setBookingLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/events/${slug}`, {
        method: "DELETE",
        headers: { ...authHeader() },
      });
      if (!res.ok) throw new Error("Failed to delete event");
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-white/50">Loading event…</p>
      </div>
    );
  }

  if (serverDown) return <ServerDown />;

  if (error || !event) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-red-400">{error ?? "Event not found"}</p>
      </div>
    );
  }

  return (
    <div id="event">
      <div className="header">
        <h1>{event.title}</h1>
        <p>{event.description}</p>

        {isAuthenticated && (
          <div className="flex gap-3 mt-6">
            <Link
              href={`/events/${slug}/edit`}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors text-sm font-medium"
            >
              Edit Event
            </Link>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">Are you sure?</span>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 transition-colors text-sm font-medium"
                >
                  {deleting ? "Deleting…" : "Yes, delete"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-5 py-2 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
              >
                Delete Event
              </button>
            )}
          </div>
        )}
      </div>
      <div className="details">
        <div className="content">
          <Image
            src={event.image}
            alt={event.title}
            width={410}
            height={300}
            className="banner"
          />
        </div>
        <div className="booking">
          <h2>Book a Ticket</h2>
          <p className="text-white/50 text-sm mb-6">Secure your spot for this event.</p>

          {!isAuthenticated ? (
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-8 text-center space-y-3">
              <p className="text-white/60 text-sm">You must be signed in to book a ticket.</p>
              <Link
                href={`/login?from=/events/${slug}`}
                className="inline-block mt-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors text-sm font-medium"
              >
                Sign In to Book
              </Link>
            </div>
          ) : bookingSuccess ? (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-8 text-center space-y-3">
              <p className="text-2xl">🎉</p>
              <p className="font-semibold text-green-400">You&apos;re booked!</p>
              <p className="text-white/50 text-sm">
                A confirmation has been recorded. See you there!
              </p>
              <button
                onClick={() => setBookingSuccess(false)}
                className="mt-2 text-xs text-white/30 hover:text-white/60 underline transition-colors"
              >
                Book another ticket
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/80">
                  Name <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={booking.name}
                  onChange={handleBookingChange}
                  placeholder="Jane Doe"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm placeholder-white/20 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/80">
                  Email <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={booking.email}
                  onChange={handleBookingChange}
                  placeholder="jane@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm placeholder-white/20 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/80">
                  Number of Tickets <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="number"
                  name="tickets"
                  value={booking.tickets}
                  onChange={handleBookingChange}
                  min={1}
                  max={10}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-white"
                />
              </div>

              {bookingError && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-3">
                  {bookingError}
                </p>
              )}

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
              >
                {bookingLoading ? "Processing…" : "Confirm Booking"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bookings list */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-6">
          Attendees
          {!bookingsLoading && (
            <span className="ml-2 text-sm font-normal text-white/40">
              ({bookings.reduce((sum, b) => sum + b.tickets, 0)} tickets across {bookings.length}{" "}
              {bookings.length === 1 ? "booking" : "bookings"})
            </span>
          )}
        </h2>

        {bookingsLoading ? (
          <p className="text-white/40 text-sm">Loading bookings…</p>
        ) : bookings.length === 0 ? (
          <p className="text-white/40 text-sm">No bookings yet. Be the first!</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-left">
                  <th className="px-5 py-3 font-medium">#</th>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Tickets</th>
                  <th className="px-5 py-3 font-medium">Booked At</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr
                    key={b._id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3 text-white/30">{i + 1}</td>
                    <td className="px-5 py-3 text-white/80">{b.name}</td>
                    <td className="px-5 py-3 text-white/50">{b.email}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-300">
                        {b.tickets} {b.tickets === 1 ? "ticket" : "tickets"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-white/30">
                      {new Date(b.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;

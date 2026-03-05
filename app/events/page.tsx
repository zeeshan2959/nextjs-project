'use client';
import EventCard from "@/components/EventCard";
import ServerDown from "@/components/ServerDown";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function Page() {
  const [events, setEvents] = useState([]);
  const [serverDown, setServerDown] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then((r) => r.json())
      .then((data) => { if (data.data) setEvents(data.data); })
      .catch((err: unknown) => { if (err instanceof TypeError) setServerDown(true); });
  }, []);

  if (serverDown) return <ServerDown />;

  return (
    <section>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">All Events</h1>
          <p className="text-white/50">Browse all upcoming developer events</p>
        </div>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 cursor-pointer">
          <Link href="/events/add">
            <Plus className="w-4 h-4" />
            Add New Event
          </Link>
        </Button>
      </div>

      <ul className="events list-none">
        {events.map((event: any) => (
          <li key={event.title}>
            <EventCard {...event} />
          </li>
        ))}
      </ul>
    </section>
  );
}

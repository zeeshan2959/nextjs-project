'use client';

import { use, useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface EventFormData {
  title: string;
  image: string;
  date: string;
  time: string;
  slug: string;
  location: string;
  description: string;
}

interface ApiError {
  success: false;
  message: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

export default function EditEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  const [form, setForm] = useState<EventFormData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Event not found');
        return r.json();
      })
      .then((data) => {
        const { title, image, date, time, slug: s, location, description } = data.data;
        setForm({ title, image, date, time, slug: s, location, description });
      })
      .catch((err: unknown) =>
        setLoadError(err instanceof Error ? err.message : 'Unexpected error')
      );
  }, [slug]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [name]: value };
      if (name === 'title') updated.slug = slugify(value);
      return updated;
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form) return;
    setSubmitError(null);
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/events/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data: { success: boolean; data?: EventFormData } | ApiError = await res.json();

      if (!res.ok || !data.success) {
        throw new Error((data as ApiError).message || 'Something went wrong');
      }

      const newSlug = (data as { success: true; data: EventFormData }).data.slug;
      router.push(`/events/${newSlug}`);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  if (loadError) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-red-400">{loadError}</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-white/50">Loading event…</p>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Edit Event</h1>
      <p className="text-white/50 mb-10">Update the details below and save your changes.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field label="Title" required>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </Field>

        <Field label="Image URL" required>
          <input
            type="url"
            name="image"
            value={form.image}
            onChange={handleChange}
            required
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Date" required>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </Field>
          <Field label="Time" required>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </Field>
        </div>

        <Field label="Location" required>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </Field>

        <Field label="Slug" hint="Auto-generated from title — edit if needed" required>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
          />
        </Field>

        <Field label="Description">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
          />
        </Field>

        {submitError && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-3">
            {submitError}
          </p>
        )}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg border border-white/20 hover:border-white/40 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-white/80">
        {label}
        {required && <span className="text-indigo-400 ml-0.5">*</span>}
        {hint && <span className="ml-2 text-white/30 font-normal text-xs">{hint}</span>}
      </label>
      <div
        className="
          [&_input]:w-full [&_input]:bg-white/5 [&_input]:border [&_input]:border-white/10
          [&_input]:rounded-lg [&_input]:px-4 [&_input]:py-2.5 [&_input]:text-sm
          [&_input]:placeholder-white/20 [&_input]:outline-none
          [&_input]:focus:border-indigo-500 [&_input]:focus:ring-1 [&_input]:focus:ring-indigo-500
          [&_input]:transition-colors [&_input]:text-white
          [&_textarea]:w-full [&_textarea]:bg-white/5 [&_textarea]:border [&_textarea]:border-white/10
          [&_textarea]:rounded-lg [&_textarea]:px-4 [&_textarea]:py-2.5 [&_textarea]:text-sm
          [&_textarea]:placeholder-white/20 [&_textarea]:outline-none [&_textarea]:resize-none
          [&_textarea]:focus:border-indigo-500 [&_textarea]:focus:ring-1 [&_textarea]:focus:ring-indigo-500
          [&_textarea]:transition-colors [&_textarea]:text-white
        "
      >
        {children}
      </div>
    </div>
  );
}

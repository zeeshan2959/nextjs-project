'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ServerDown from '@/components/ServerDown';
import { useAuth } from '@/contexts/AuthContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { API_URL } from '@/lib/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EVENT_TYPES = [
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'meetup', label: 'Meetup' },
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'webinar', label: 'Webinar' },
  { value: 'other', label: 'Other' },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  image: Yup.string().url('Must be a valid URL').required('Image URL is required'),
  date: Yup.string().required('Date is required'),
  time: Yup.string().required('Time is required'),
  location: Yup.string().required('Location is required'),
  slug: Yup.string()
    .matches(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .required('Slug is required'),
  eventType: Yup.string().required('Event type is required'),
  description: Yup.string(),
});

export default function EditEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { authHeader } = useAuth();
  const { isAuthenticated } = useRequireAuth();

  const EMPTY_VALUES = {
    title: '',
    image: '',
    date: '',
    time: '',
    slug: '',
    location: '',
    eventType: '',
    description: '',
  };

  const [initialValues, setInitialValues] = useState(EMPTY_VALUES);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [serverDown, setServerDown] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/events/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Event not found');
        return r.json();
      })
      .then((data) => {
        const { title, image, date, time, slug: s, location, eventType, description } = data.data;
        setInitialValues({
          title: title ?? '',
          image: image ?? '',
          date: date ?? '',
          time: time ?? '',
          slug: s ?? '',
          location: location ?? '',
          eventType: eventType ?? '',
          description: description ?? '',
        });
        setIsLoaded(true);
      })
      .catch((err: unknown) => {
        if (err instanceof TypeError) {
          setServerDown(true);
        } else {
          setLoadError(err instanceof Error ? err.message : 'Failed to load event');
        }
        setIsLoaded(true);
      });
  }, [slug]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setStatus }) => {
      try {
        const res = await fetch(`${API_URL}/api/events/${slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...authHeader() },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Something went wrong');
        }

        const newSlug = data.data?.slug ?? slug;
        router.push(`/events/${newSlug}`);
      } catch (err: unknown) {
        setStatus(err instanceof Error ? err.message : 'Unexpected error');
      }
    },
  });

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    formik.handleChange(e);
    if (!formik.touched.slug) {
      formik.setFieldValue('slug', slugify(e.target.value));
    }
  }

  if (!isAuthenticated) return null;

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-white/50">Loading event…</p>
      </div>
    );
  }

  if (serverDown) return <ServerDown />;

  if (loadError) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-red-400">{loadError}</p>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Edit Event</h1>
      <p className="text-white/50 mb-10">Update the details below and save your changes.</p>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">
            Title <span className="text-indigo-400">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Next.js Conf 2026"
            value={formik.values.title}
            onChange={handleTitleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.title && formik.errors.title ? 'border-red-500' : ''}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-400 text-xs">{formik.errors.title}</p>
          )}
        </div>

        {/* Image URL */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="image">
            Image URL <span className="text-indigo-400">*</span>
          </Label>
          <Input
            id="image"
            name="image"
            type="url"
            placeholder="https://example.com/image.png"
            value={formik.values.image}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.image && formik.errors.image ? 'border-red-500' : ''}
          />
          {formik.touched.image && formik.errors.image && (
            <p className="text-red-400 text-xs">{formik.errors.image}</p>
          )}
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date">
              Date <span className="text-indigo-400">*</span>
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.date && formik.errors.date ? 'border-red-500' : ''}
            />
            {formik.touched.date && formik.errors.date && (
              <p className="text-red-400 text-xs">{formik.errors.date}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="time">
              Time <span className="text-indigo-400">*</span>
            </Label>
            <Input
              id="time"
              name="time"
              type="time"
              value={formik.values.time}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.time && formik.errors.time ? 'border-red-500' : ''}
            />
            {formik.touched.time && formik.errors.time && (
              <p className="text-red-400 text-xs">{formik.errors.time}</p>
            )}
          </div>
        </div>

        {/* Event Type */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="eventType">
            Event Type <span className="text-indigo-400">*</span>
          </Label>
          <Select
            value={formik.values.eventType}
            onValueChange={(val) => formik.setFieldValue('eventType', val)}
          >
            <SelectTrigger
              id="eventType"
              className={formik.touched.eventType && formik.errors.eventType ? 'border-red-500' : ''}
            >
              <SelectValue placeholder="Select event type…" />
            </SelectTrigger>
            <SelectContent>
              {EVENT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.eventType && formik.errors.eventType && (
            <p className="text-red-400 text-xs">{formik.errors.eventType}</p>
          )}
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location">
            Location <span className="text-indigo-400">*</span>
          </Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g. San Francisco, CA"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.location && formik.errors.location ? 'border-red-500' : ''}
          />
          {formik.touched.location && formik.errors.location && (
            <p className="text-red-400 text-xs">{formik.errors.location}</p>
          )}
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">
            Slug <span className="text-indigo-400">*</span>
            <span className="ml-2 text-white/30 font-normal text-xs">Auto-generated from title — edit if needed</span>
          </Label>
          <Input
            id="slug"
            name="slug"
            placeholder="e.g. nextjs-conf-2026"
            value={formik.values.slug}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.slug && formik.errors.slug ? 'border-red-500' : ''}
          />
          {formik.touched.slug && formik.errors.slug && (
            <p className="text-red-400 text-xs">{formik.errors.slug}</p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            placeholder="A short description of the event…"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </div>

        {/* Error/load-error banner */}
        {formik.status && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-3">
            {formik.status}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <Button type="submit" disabled={formik.isSubmitting} className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white">
            {formik.isSubmitting ? 'Saving…' : 'Save Changes'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} className="cursor-pointer">
            Cancel
          </Button>
        </div>
      </form>
    </section>
  );
}

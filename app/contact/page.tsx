'use client';

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
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import { useState } from 'react';

const SUBJECTS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'event', label: 'Event Submission / Issue' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other' },
];

const validationSchema = Yup.object({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: Yup.string().email('Must be a valid email').required('Email is required'),
  subject: Yup.string().required('Please select a subject'),
  message: Yup.string().min(20, 'Message must be at least 20 characters').required('Message is required'),
});

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'mzeeshan02959@gmail.com',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Remote — Everywhere',
  },
  {
    icon: MessageSquare,
    label: 'Response time',
    value: 'Within 24 hours',
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validationSchema,
    onSubmit: async (_values, { resetForm }) => {
      await new Promise((r) => setTimeout(r, 800));
      setSubmitted(true);
      resetForm();
    },
  });

  return (
    <section className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto">
          Have a question, found a bug, or want to partner with us? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Contact info sidebar */}
        <aside className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Contact Info</h2>
            <p className="text-white/40 text-sm">Reach us through any of these channels.</p>
          </div>
          {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-4 items-start">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
                <p className="text-white font-medium">{value}</p>
              </div>
            </div>
          ))}
        </aside>

        {/* Form */}
        <div className="lg:col-span-3">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center rounded-2xl bg-white/5 border border-white/10 px-8">
              <div className="w-14 h-14 rounded-full bg-indigo-600/20 flex items-center justify-center">
                <Mail className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold">Message Sent!</h3>
              <p className="text-white/50">
                Thanks for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
              <Button
                variant="outline"
                className="mt-4 cursor-pointer"
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="space-y-5">
              {/* Name & Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">
                    Name <span className="text-indigo-400">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Jane Smith"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.name && formik.errors.name ? 'border-red-500' : ''}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-400 text-xs">{formik.errors.name}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">
                    Email <span className="text-indigo-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.email && formik.errors.email ? 'border-red-500' : ''}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-400 text-xs">{formik.errors.email}</p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="subject">
                  Subject <span className="text-indigo-400">*</span>
                </Label>
                <Select
                  value={formik.values.subject}
                  onValueChange={(val) => formik.setFieldValue('subject', val)}
                >
                  <SelectTrigger
                    id="subject"
                    className={formik.touched.subject && formik.errors.subject ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Select a subject…" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.subject && formik.errors.subject && (
                  <p className="text-red-400 text-xs">{formik.errors.subject}</p>
                )}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="message">
                  Message <span className="text-indigo-400">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us how we can help…"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.message && formik.errors.message ? 'border-red-500' : ''}
                />
                {formik.touched.message && formik.errors.message && (
                  <p className="text-red-400 text-xs">{formik.errors.message}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={formik.isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
              >
                {formik.isSubmitting ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

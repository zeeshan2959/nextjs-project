'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Suspense } from 'react';
import { API_URL } from '@/lib/api';

const validationSchema = Yup.object({
  email: Yup.string().email('Must be a valid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') ?? '/';

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values, { setStatus }) => {
      try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Login failed');
        }

        login(data.token, data.user);
        router.push(redirectTo);
      } catch (err: unknown) {
        setStatus(err instanceof Error ? err.message : 'Unexpected error');
      }
    },
  });

  return (
    <div className="w-full max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
        <p className="text-white/50">Sign in to your DevEvent account</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">
            Password <span className="text-indigo-400">*</span>
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.password && formik.errors.password ? 'border-red-500' : ''}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-400 text-xs">{formik.errors.password}</p>
          )}
        </div>

        {formik.status && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-3">
            {formik.status}
          </p>
        )}

        <Button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
        >
          {formik.isSubmitting ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      <p className="text-center text-white/40 text-sm mt-8">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

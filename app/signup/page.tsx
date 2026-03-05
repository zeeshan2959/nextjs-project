'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

const validationSchema = Yup.object({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: Yup.string().email('Must be a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function SignupPage() {
  const { login } = useAuth();
  const router = useRouter();

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validationSchema,
    onSubmit: async (values, { setStatus }) => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Registration failed');
        }

        login(data.token, data.user);
        router.push('/');
      } catch (err: unknown) {
        setStatus(err instanceof Error ? err.message : 'Unexpected error');
      }
    },
  });

  return (
    <div className="w-full max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Create an account</h1>
        <p className="text-white/50">Join DevEvent and never miss a dev event</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">
            Password <span className="text-indigo-400">*</span>
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Min. 6 characters"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.password && formik.errors.password ? 'border-red-500' : ''}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-400 text-xs">{formik.errors.password}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">
            Confirm Password <span className="text-indigo-400">*</span>
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : ''}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-400 text-xs">{formik.errors.confirmPassword}</p>
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
          {formik.isSubmitting ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      <p className="text-center text-white/40 text-sm mt-8">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}

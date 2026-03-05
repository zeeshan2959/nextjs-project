'use client';
import Link from "next/link";
import Image from "next/image";
import Logo from '@/public/icons/logo.png';
import posthog from 'posthog-js';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();

    function handleLogout() {
        logout();
        router.push('/');
    }

    return (
        <header>
            <nav>
                <Link href="/" className="logo">
                    <Image src={Logo} alt="logo" width={24} height={24} />
                    <p>DevEvent</p>
                </Link>
                <ul>
                    <Link href="/" onClick={() => posthog.capture('nav_link_clicked', { label: 'Home', href: '/' })}>Home</Link>
                    <Link href="/events" onClick={() => posthog.capture('nav_link_clicked', { label: 'Events', href: '/events' })}>Events</Link>
                    <Link href="/about" onClick={() => posthog.capture('nav_link_clicked', { label: 'About', href: '/about' })}>About</Link>
                    <Link href="/contact" onClick={() => posthog.capture('nav_link_clicked', { label: 'Contact', href: '/contact' })}>Contact</Link>

                    {isAuthenticated ? (
                        <>
                            <span className="text-white/40 text-sm hidden sm:inline">
                                Hi, {user?.name.split(' ')[0]}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-1.5 rounded-lg border border-white/20 hover:border-white/40 text-sm transition-colors cursor-pointer"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-white/70 hover:text-white text-sm transition-colors"
                                onClick={() => posthog.capture('nav_link_clicked', { label: 'Login', href: '/login' })}
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-colors"
                                onClick={() => posthog.capture('nav_link_clicked', { label: 'Sign Up', href: '/signup' })}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

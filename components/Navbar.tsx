'use client';
import Link from "next/link";
import Image from "next/image";
import Logo from '@/public/icons/logo.png';
import posthog from 'posthog-js';

export default function Navbar() {
    return (
        <header>
            <nav>
                <Link href="/" className="logo">
                    <Image src={Logo} alt="logo" width={24} height={24} />
                    <p>DevEvent</p>
                </Link>
                <ul>
                    <Link href="/" onClick={() => posthog.capture('nav_link_clicked', { label: 'Home', href: '/' })}>Home </Link>
                    <Link href="/events" onClick={() => posthog.capture('nav_link_clicked', { label: 'Events', href: '/events' })}>Events</Link>
                    <Link href="/about" onClick={() => posthog.capture('nav_link_clicked', { label: 'About', href: '/about' })}>About</Link>
                    <Link href="/contact" onClick={() => posthog.capture('nav_link_clicked', { label: 'Contact', href: '/contact' })}>Contact</Link>
                </ul>
            </nav>
        </header>
    );
}
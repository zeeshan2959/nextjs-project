import Link from "next/link";
import Image from "next/image";
import Logo from '@/public/icons/logo.png';

export default function Navbar() {
    return (
        <header>
            <nav>
                <Link href="/" className="logo">
                    <Image src={Logo} alt="logo" width={24} height={24} />
                    <p>DevEvent</p>
                </Link>
                <ul>
                    <Link href="/">Home </Link>
                    <Link href="/events">Events</Link>
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                </ul>
            </nav>
        </header>
    );
}
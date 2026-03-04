import Image from "next/image";
import Link from "next/link";
import Calendar from '@/public/icons/calendar.svg';
import Location from '@/public/icons/pin.svg';
import Time from '@/public/icons/clock.svg';

interface props {
    title: string;
    image: string;
    date: string;
    time: string;
    slug: string;
    location: string;
}

export default function EventCard({ title, image, date, time, slug, location }: props) {
    return (
        <Link href={`/events/${slug}`} id="event-card">
            <Image src={image} alt={title} width={410} height={300} className="poster" />
            <div className="flex gap-2">
                <Image src={Location} alt="location" width={12} height={12} />
                <span className="text-light-200 text-xs font-light">{location}</span>
            </div>
            <p className="title">{title}</p>
            <div className="flex gap-4">
                <div className="flex gap-2">
                    <Image src={Calendar} alt="calendar" width={12} height={12} />
                    <span className="text-light-200 text-xs font-light">{date}</span>
                </div>
                <div className="flex gap-2">
                    <Image src={Time} alt="time" width={12} height={12} />
                    <span className="text-light-200 text-xs font-light">{time}</span>
                </div>
            </div>
        </Link>
    );
}
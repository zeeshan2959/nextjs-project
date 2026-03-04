import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { time } from "console";

const events = [
  {
    title: "Event 1",
    image: "/images/event1.png",
    date: "2026-03-03",
    time: "10:00 AM",
    slug: "event-1",
    location: "New York, NY",

  },
  {
    title: "Event 2",
    image: "/images/event2.png",
    date: "2026-03-03",
    time: "10:00 AM",
    slug: "event-2",
    location: "New York, NY",
  },
  {
    title: "Event 3",
    image: "/images/event3.png",
    date: "2026-03-03",
    time: "10:00 AM",
    slug: "event-3",
    location: "New York, NY",
  },
  {
    title: "Event 4",
    image: "/images/event4.png",
    date: "2026-03-03",
    time: "10:00 AM",
    slug: "event-4",
    location: "New York, NY",
  }
]

export default function Page() {
  return <section>
    <h1 className="text-center">The Hub for Every Dev <br /> Event You Must't Miss</h1>
    <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>
    <ExploreBtn />
    <div className="mt-20 space-y-7">
      <h3 className="text-center">Featured Events</h3>
      <ul className="events list-none">
        {events.map((event: any) => (
          <li key={event.title}>
            <EventCard {...event} />
          </li>
        ))}
      </ul>
    </div>
  </section>;
}

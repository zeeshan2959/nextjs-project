'use client';
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { useEffect, useState } from "react";


// const events = [
//   {
//     title: "Event 1",
//     image: "/images/event1.png",
//     date: "2026-03-03",
//     time: "10:00 AM",
//     slug: "event-1",
//     location: "New York, NY",

//   },
//   {
//     title: "Event 2",
//     image: "/images/event2.png",
//     date: "2026-03-03",
//     time: "10:00 AM",
//     slug: "event-2",
//     location: "New York, NY",
//   },
//   {
//     title: "Event 3",
//     image: "/images/event3.png",
//     date: "2026-03-03",
//     time: "10:00 AM",
//     slug: "event-3",
//     location: "New York, NY",
//   },
//   {
//     title: "Event 4",
//     image: "/images/event4.png",
//     date: "2026-03-03",
//     time: "10:00 AM",
//     slug: "event-4",
//     location: "New York, NY",
//   }
// ]

export default function Page() {
  const [events, setEvents] = useState([]);
  const getEvents = async () => {
    const response = await fetch("http://localhost:5000/api/events");
    const data = await response.json();
    setEvents(data.data);
    console.log(data);
  }
  useEffect(() => {
    getEvents();
  }, []);   
  console.log(events);
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

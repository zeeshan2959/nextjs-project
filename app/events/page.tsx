'use client';
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { useEffect, useState } from "react";


export default function Page() {
  const [events, setEvents] = useState([]);
  const getEvents = async () => {
    const response = await fetch("http://localhost:5000/api/events");
    const data = await response.json();
    setEvents(data.data);
  }
  useEffect(() => {
    getEvents();
  }, []);   
  
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

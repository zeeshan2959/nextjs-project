require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("./db");
const Event = require("./models/Event");

const sampleEvents = [
  {
    title: "Event 1",
    image: "/images/event1.png",
    date: "2026-03-03",
    time: "10:00 AM",
    slug: "event-1",
    location: "New York, NY",
    description: "A flagship developer conference.",
  },
  {
    title: "Event 2",
    image: "/images/event2.png",
    date: "2026-03-03",
    time: "10:00 AM",
    slug: "event-2",
    location: "New York, NY",
    description: "An exciting hackathon for builders.",
  },
  {
    title: "Event 3",
    image: "/images/event3.png",
    date: "2026-03-03",
    time: "10:00 AM",
    slug: "event-3",
    location: "New York, NY",
    description: "A community meetup for developers.",
  },
  {
    title: "Event 4",
    image: "/images/event4.png",
    date: "2026-03-03",
    time: "10:00 AM",
    slug: "event-4",
    location: "New York, NY",
    description: "An open-source contributor summit.",
  },
  {
    title: "Event 5",
    image: "/images/event5.png",
    date: "2026-03-03",
    time: "10:00 AM",
    slug: "event-5",
    location: "New York, NY",
    description: "An exciting hackathon for builders.",
  },
  {
    title: "Event 6",
    image: "/images/event6.png",
    date: "2026-03-03",
    time: "10:00 AM",
    slug: "event-6",
    location: "New York, NY",
    description: "An exciting hackathon for builders.",
  },
];

async function seed() {
  await connectDB();
  await Event.deleteMany({});
  const inserted = await Event.insertMany(sampleEvents);
  console.log(`Seeded ${inserted.length} events.`);
  mongoose.connection.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

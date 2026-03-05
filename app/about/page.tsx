import { Code2, Globe, Users, Zap } from 'lucide-react';

const STATS = [
  { label: 'Events Listed', value: '500+' },
  { label: 'Developers Reached', value: '20k+' },
  { label: 'Cities Covered', value: '80+' },
  { label: 'Partners', value: '150+' },
];

const VALUES = [
  {
    icon: Code2,
    title: 'Built for Developers',
    description:
      'Every feature is designed with the developer experience in mind — clean, fast, and distraction-free.',
  },
  {
    icon: Globe,
    title: 'Global Community',
    description:
      'We surface events from every corner of the world so no developer misses an opportunity to connect.',
  },
  {
    icon: Users,
    title: 'Community-Driven',
    description:
      'Anyone can submit an event. We believe the best curation comes from the people who live and breathe tech.',
  },
  {
    icon: Zap,
    title: 'Always Up-to-Date',
    description:
      'Events are updated in real time so you always see the latest hackathons, meetups, and conferences.',
  },
];

export default function AboutPage() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-16 space-y-20">
      {/* Hero */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">About DevEvent</h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
          DevEvent is the central hub for developer events worldwide. Whether you&apos;re hunting
          for your next hackathon, a local meetup, or a major conference — we bring everything
          into one place so you never miss out.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/5 border border-white/10 text-center"
          >
            <span className="text-3xl font-bold text-indigo-400">{stat.value}</span>
            <span className="text-white/50 text-sm">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Our Mission</h2>
        <p className="text-white/60 text-lg leading-relaxed">
          The developer ecosystem thrives on shared knowledge and collaboration. Conferences
          spark ideas, hackathons accelerate them, and meetups turn strangers into co-founders.
          Our mission is to make every one of those moments discoverable — regardless of your
          background, location, or experience level.
        </p>
        <p className="text-white/60 text-lg leading-relaxed">
          We believe that access to the right event at the right time can change a career.
          DevEvent exists to make sure every developer gets that opportunity.
        </p>
      </div>

      {/* Values */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold">What We Stand For</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team blurb */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">Built with ❤️ by developers, for developers</h2>
        <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
          DevEvent is an open-source project maintained by a small team of engineers who were
          tired of finding out about cool events after they were already over. Join us — submit an
          event, report a bug, or contribute code.
        </p>
      </div>
    </section>
  );
}

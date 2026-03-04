<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your DevEvent Next.js App Router application. The integration uses `instrumentation-client.ts` for client-side initialization (the recommended approach for Next.js 15.3+), a reverse proxy via Next.js rewrites to route PostHog traffic through your own domain, and targeted event captures on key user interactions.

**Files created or modified:**

- `instrumentation-client.ts` — New file. Initializes PostHog client-side with your API key and host via environment variables, with exception capturing and debug mode enabled.
- `next.config.ts` — Added reverse proxy rewrites for PostHog ingestion and `skipTrailingSlashRedirect: true`.
- `components/ExploreBtn.tsx` — Added `'use client'` directive and `posthog.capture('explore_events_clicked')` in the existing `onClick` handler.
- `components/EventCard.tsx` — Added `'use client'` directive and `posthog.capture('event_card_clicked', {...})` with event metadata on the card link's `onClick`.
- `components/Navbar.tsx` — Added `'use client'` directive and `posthog.capture('nav_link_clicked', {...})` on each navigation link's `onClick`.
- `.env.local` — Created with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|-------|-------------|------|
| `explore_events_clicked` | User clicked the 'Explore Events' button on the homepage hero section | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicked on an event card to view event details (includes `event_title`, `event_slug`, `event_location`, `event_date` properties) | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicked a navigation link in the top navbar (includes `label` and `href` properties) | `components/Navbar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/331011/dashboard/1329428
- **Explore Events Button Clicks** (trend over time): https://us.posthog.com/project/331011/insights/PLq0TfJu
- **Most Clicked Events** (breakdown by event title): https://us.posthog.com/project/331011/insights/ZSR7E4Me
- **Navigation Link Clicks by Page** (breakdown by nav label): https://us.posthog.com/project/331011/insights/gOvybhx0
- **Event Discovery Funnel** (explore → click conversion): https://us.posthog.com/project/331011/insights/MxZuMGtS
- **Daily Active Event Explorers** (unique users per day): https://us.posthog.com/project/331011/insights/nCdTlZmY

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>

'use client';
import ArrowDown from '@/public/icons/arrow-down.svg';
import Image from 'next/image';
import posthog from 'posthog-js';

export default function ExploreBtn() {
  return <button className="mt-7 mx-auto flex flex-row items-center gap-2" onClick={() => {
    console.log('explore events');
    posthog.capture('explore_events_clicked');
  }} id="explore-btn">
    <a href="#">Explore Events</a>
    <Image src={ArrowDown} alt="arrow right" width={20} height={20} />
  </button>;
}
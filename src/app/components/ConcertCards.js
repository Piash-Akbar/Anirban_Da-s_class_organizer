'use client';

export default function ConcertCard({ venue, date, location }) {
  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 animate-pulse-card animate-fade-in">
      <h3 className="text-2xl font-semibold mb-2 text-amber-400">{venue}</h3>
      <p className="text-lg text-gray-200">{date} | {location}</p>
    </div>
  );
}
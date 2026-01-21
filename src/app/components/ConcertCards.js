'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Renders a serene, elegant card for an upcoming concert performance.
 */
export default function ConcertCard({
  venue,
  date,
  time,
  location,
  ticketURL,
  style,
  className = '',
}) {
  /**
   * SAFELY PARSE DATE (Mobile-safe)
   * Accepts:
   *  - "2025-10-17" (ISO, preferred)
   *  - "10/17/2025" (fallback)
   */
  const parseDateSafely = (dateStr) => {
    if (!dateStr) return null;

    // Try ISO first (recommended)
    let d = new Date(dateStr);
    if (!isNaN(d)) return d;

    // Fallback for MM/DD/YYYY
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [month, day, year] = parts.map(Number);
      d = new Date(year, month - 1, day);
      if (!isNaN(d)) return d;
    }

    return null;
  };

  const dateObj = parseDateSafely(date);

  // Graceful fallback values
  const fullDate = dateObj
    ? dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Date TBA';

  const day = dateObj
    ? String(dateObj.getDate()).padStart(2, '0')
    : '--';

  const month = dateObj
    ? dateObj.toLocaleDateString('en-US', { month: 'short' })
    : '---';

  const formattedTime = time || 'TBA';

  return (
    <div
      className={`
        relative overflow-hidden bg-gradient-to-br from-slate-900/80 via-slate-800/50 to-slate-900/80 
        backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/30 
        hover:border-amber-400/40 hover:shadow-amber-500/10 hover:shadow-2xl 
        transform transition-all duration-700 ease-out hover:scale-[1.02] hover:-translate-y-1
        ${className}
      `}
      style={style}
    >
      {/* Background accents */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-rose-500/5" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400/60 via-transparent to-rose-400/60" />

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-12">
        {/* Date Circle */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500/10 to-rose-500/10 
                          border-2 border-amber-400/30 rounded-full p-2">
            <div className="w-full h-full bg-slate-800/50 border border-slate-600/50 
                            rounded-full flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-amber-300 leading-none">
                {day}
              </div>
              <div className="text-xs uppercase tracking-widest text-amber-400/80">
                {month}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-3">
          <h3 className="text-xl lg:text-2xl font-serif font-bold bg-gradient-to-r 
                         from-amber-300 via-amber-100 to-rose-300 
                         bg-clip-text text-transparent">
            {venue}
          </h3>

          <p className="text-sm text-amber-200/70 italic">
            {fullDate} at {formattedTime}
          </p>

          <p className="text-base text-slate-300/80 flex items-center">
            <svg
              className="w-4 h-4 mr-2 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {location}
          </p>
        </div>

        {/* Button */}
        <Link
          href={ticketURL || '#'}
          target={ticketURL ? '_blank' : '_self'}
          rel={ticketURL ? 'noopener noreferrer' : undefined}
          className="inline-flex items-center px-6 py-3 text-sm font-semibold 
                     rounded-full border border-amber-400/30 
                     text-amber-200 hover:text-amber-100 
                     transition-all hover:scale-105"
        >
          Details →
        </Link>
      </div>
    </div>
  );
}

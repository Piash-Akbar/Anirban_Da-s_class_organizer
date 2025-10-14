// ./components/ConcertCard.js

'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Renders a serene, elegant card for an upcoming concert performance.
 * @param {object} props
 * @param {string} props.venue - The name of the performance venue.
 * @param {string} props.date - The formatted date of the concert (e.g., "10/17/2025").
 * @param {string} props.location - The city and country of the concert.
 * @param {object} props.style - Inline styles for animation delay.
 * @param {string} props.className - Additional class names for styling.
 */
export default function ConcertCard({ venue, date, location, style, className = '' }) {
  // Parse date for elegant display
  const dateObj = new Date(date);
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const fullDate = dateObj.toLocaleDateString('en-US', options);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' });

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
      {/* Subtle background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-rose-500/5"></div>
      
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400/60 via-transparent to-rose-400/60"></div>
      
      {/* Musical note accent */}
      <div className="absolute top-4 right-4 text-2xl text-amber-400/20 opacity-50 pointer-events-none">
        ♫
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
        
        {/* Date Circle - Elegant Design */}
        <div className="relative flex-shrink-0">
          <div className="relative">
            {/* Date background circle */}
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500/10 to-rose-500/10 
                           border-2 border-amber-400/30 rounded-full p-2 backdrop-blur-sm
                           hover:bg-amber-500/20 hover:border-amber-400/50 transition-all duration-500">
              
              {/* Inner date circle */}
              <div className="w-full h-full bg-slate-800/50 border border-slate-600/50 
                             rounded-full flex flex-col items-center justify-center text-center p-2
                             backdrop-blur-sm relative overflow-hidden">
                
                {/* Date numbers */}
                <div className="text-2xl lg:text-3xl font-bold text-amber-300 tracking-tight leading-none">
                  {day}
                </div>
                <div className="text-xs uppercase font-medium text-amber-400/80 tracking-widest">
                  {month}
                </div>
                
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent 
                               rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            </div>
            
            {/* Date ribbon */}
            <div className="absolute -top-2 -right-2 w-16 h-6 bg-gradient-to-r from-amber-500/90 to-rose-500/90 
                           rounded-full flex items-center justify-center text-xs font-semibold 
                           text-slate-900 tracking-wide shadow-lg transform rotate-[-15deg]">
              Live
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Venue Name */}
          <h3 className="text-xl lg:text-2xl font-serif font-bold text-slate-100 
                        bg-gradient-to-r from-amber-300 via-amber-100 to-rose-300 
                        bg-clip-text text-transparent tracking-tight leading-tight">
            {venue}
          </h3>
          
          {/* Date */}
          <p className="text-sm text-amber-200/70 font-light italic tracking-wide">
            {fullDate}
          </p>
          
          {/* Location */}
          <p className="text-base text-slate-300/80 font-medium flex items-center">
            <svg className="w-4 h-4 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </p>
        </div>

        {/* Action Button - Elegant Design */}
        <div className="flex-shrink-0">
          <Link
            href="#contact"
            className="group relative inline-flex items-center px-6 py-3 text-sm font-semibold 
                      rounded-full bg-gradient-to-r from-amber-500/10 via-transparent to-rose-500/10 
                      border border-amber-400/30 hover:border-amber-400/50 
                      text-amber-200 hover:text-amber-100 backdrop-blur-sm
                      transition-all duration-700 ease-out transform hover:scale-105
                      shadow-lg hover:shadow-amber-500/20 overflow-hidden"
          >
            {/* Button content */}
            <span className="relative z-10 tracking-wide uppercase flex items-center">
              View Details
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                           -skew-x-12 transform -translate-x-full group-hover:translate-x-full 
                           transition-transform duration-1000"></div>
            
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-rose-400/20 
                           rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </Link>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-amber-400/30 via-transparent to-rose-400/30"></div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-500/5 to-rose-500/5 
                     opacity-0 hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
    </div>
  );
}
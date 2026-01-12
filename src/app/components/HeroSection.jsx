// components/HeroSection.jsx
'use client'; 

import React, { useState, useEffect } from 'react';
// Import your font definition here if needed, or pass the class name as a prop
// Assuming greatVibes is defined globally or passed down if necessary.
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400", // ✅ only available weight
  variable: "--font-great-vibes",
});



/**
 * HeroSection Component
 * Displays a full-screen hero section with a dynamic background slideshow.
 * @param {object} props
 * @param {string[]} props.images - Array of image URLs for the background slideshow.
 * @param {string} [props.title] - Optional title for the hero section.
 * @param {string} [props.subtitle] - Optional subtitle.
 * @param {string} [props.ctaLink] - URL for the Call-to-Action button.
 * @param {string} [props.ctaText] - Text for the Call-to-Action button.
 */
export default function HeroSection({ 
    images, 
    title = "Anirban Bhattacharjee", 
    subtitle = "Pioneer of the Violin in the Senia-Shahjahanpur Gharana",
    ctaLink = "/#about",
    ctaText = "Discover My Journey"
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const slideDuration = 3000; // 3 seconds

  useEffect(() => {
    if (!images || images.length === 0) return;

    // Set up the interval to change the image every 3 seconds
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % images.length
      );
    }, slideDuration);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [images, slideDuration]); // Re-run effect if image list changes

  // Handle case where no images are provided
  if (!images || images.length === 0) {
      console.warn("HeroSection: No images provided for the slideshow.");
      // You can return a fallback design or null here
      return (
          <section className="h-screen flex items-center justify-center bg-gray-900">
              <h2 className="text-white text-3xl">Loading Hero Content...</h2>
          </section>
      );
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      
      {/* Background Slideshow Container */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`
              absolute inset-0 bg-cover bg-center transition-opacity duration-1000 
              ${index === currentImageIndex ? 'opacity-50' : 'opacity-0'}
            `}
            style={{ 
              backgroundImage: `url('${image}')`,
              // Optional: Ensure text is readable against various backgrounds
              backgroundColor: 'rgba(0, 0, 0, 0.5)', 
              backgroundBlendMode: 'multiply' 
            }}
          />
        ))}
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 text-center px-4 text-white"> 
        {/* Note: I'm omitting the specific font class (greatVibes.className) 
             as I don't have access to your local font import. 
             Replace 'font-serif' with your desired class. 
        */}
        <h1 className={`text-8xl font-bold mb-4 animate-fade-in font-serif antialiased ${greatVibes.className}`}>
             {title}
        </h1>
        <p className="text-6xl font-palisade font-bold mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {subtitle}
        </p>
        <a 
          href={ctaLink} 
          className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition animate-bounce"
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
}
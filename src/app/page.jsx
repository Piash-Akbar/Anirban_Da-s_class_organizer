'use client';
import { useEffect, useState } from "react";
import Navbar from "./navbar/navbar";
import ConcertCard from "./components/ConcertCards"; // Ensure this path is correct
import { db } from "./firebaseConfig"; // Ensure this import and config are correct
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import { Great_Vibes } from "next/font/google";
import HeroSection from "./components/HeroSection";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400", // ✅ only available weight
  variable: "--font-great-vibes",
});

//Images for Hero Section(Slideshow)
const heroImages = [
  '/background.jpg',
  '/anirban01.jpg',
  '/anirban02.jpg',
  '/anirban03.jpg',
  '/anirbanda.jpg',
  // '/background-7.jpg',
  // '/background-8.jpg',
];





// Utility function to format date
const formatDate = (date) => {
  try {
    if (date && typeof date.toDate === "function") {
      // Firestore Timestamp
      return date.toDate().toLocaleDateString();
    } else if (typeof date === "string") {
      // String date (e.g., "2025-10-17" or ISO 8601)
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? "Invalid date" : parsedDate.toLocaleDateString();
    } else if (typeof date === "number") {
      // Unix timestamp (milliseconds)
      return new Date(date).toLocaleDateString();
    }
    return "Unknown date";
  } catch (err) {
    console.error("Error formatting date:", err);
    return "Invalid date";
  }
};

export default function Portfolio() {
  const [concerts, setConcerts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  // Fetch upcoming concerts
  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const concertsQuery = query(
          collection(db, "upcomingConcerts"),
          orderBy("createdAt", "desc")
        );
        const concertsSnapshot = await getDocs(concertsQuery);
        const concertsData = concertsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: formatDate(doc.data().date), // Format date for display
        }));
        setConcerts(concertsData);
        console.log("Fetched concerts:", concertsData);
      } catch (err) {
        console.error("Error fetching concerts:", err);
        setError("Failed to load upcoming concerts.");
      } finally {
        setIsLoading(false); // Set loading to false once fetch is complete (or failed)
      }
    };
    fetchConcerts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white">
        <style jsx>{`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 2s ease-in-out forwards;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
          }
          .animate-pulse-card {
            animation: pulse 13s ease-in-out infinite;
          }
        `}</style>

        {/* Hero Section */}
        {/* <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-50"></div>
          <div className="relative z-10 text-center px-4">
          <h1 className={`text-8xl font-bold mb-4 animate-fade-in font-serif antialiased ${greatVibes.className}`}> Anirban Bhattacharjee </h1>
            <p className="text-6xl font-palisade font-bold mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>Pioneer of the Violin in the Senia-Shahjahanpur Gharana</p>
            <a href="/#about" className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition animate-bounce">Discover My Journey</a>
          </div>
        </section> */}
        <HeroSection 
          images={heroImages}
          title="Anirban Bhattacharjee"
          subtitle="Pioneer of the Violin in the Senia-Shahjahanpur Gharana"
          ctaText="Discover My Journey"
          ctaLink="/#about"
        />

        {/* About Section */}
        <section id="about" className="py-20 px-4 md:px-20 bg-gray-800">
          <div className="max-w-5xl mx-auto">
          <h2 className={`text-6xl md:text-8xl p-4 font-serif font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-500 animate-fade-in antialiased ${greatVibes.className}`}>
                Biography
              </h2>

            {/* First Paragraph */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center bg-gray-900 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 animate-pulse-card animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div>
                <p className="text-lg leading-relaxed text-gray-200 font-light">
                  Anirban Bhattacharjee is one of the most promising violinists of the young generation in the arena of Hindustani Classical Music, and is among the very few musicians who play Hindustani Classical Music on the viola. His training in music began at the age of three when he started learning the Tabla from his father Jitesh Bhattacharjee. His study of the violin started at age 15 under Shri Ashim Dutta of Guwahati, Assam. Anirban received guidance in advanced techniques of the instrument from Shri Manoj Baruah and the legendary Dr. Sisirkana Dhar Chowdhury of the Senia Maihar Gharana. He is currently a disciple of Shri Supratik Sengupta, a Sitar exponent of the Senia Shahjahanpur Gharana and a disciple of Pandit Buddhadev Dasgupta. Anirban was also under the tutelage of the late Dr. Swarna Khuntia, a senior disciple of Dr. N. Rajam. Anirban’s public performance debut was at the Sri Aurobindo International Centre for Education, Pondicherry.
                </p>
              </div>
              <div className="flex justify-center">
                <img 
                  src="/anirban01.jpg" 
                  alt="Anirban playing violin" 
                  className="rounded-lg shadow-md w-full max-w-md object-cover transform hover:scale-105 transition-all duration-300" 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found'; }}
                />
              </div>
            </div>

            {/* Second Paragraph */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center bg-gray-900 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 animate-pulse-card animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex justify-center order-2 md:order-1">
                <img 
                  src="/anirbanda.jpg" 
                  alt="Anirban playing violin" 
                  className="rounded-lg shadow-md w-full max-w-md object-cover transform hover:scale-105 transition-all duration-300" 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found'; }}
                />
              </div>
              <div className="order-1 md:order-2">
                <p className="text-lg leading-relaxed text-gray-200 font-light">
                  Anirban’s music is a blend of the Tantrakari and Gayaki approaches and bears a strong rhythmic component as a consequence of his initial inclinations to Tabla. Besides being a rapidly rising name in the Hindustani Classical Music scene all over India, Anirban also takes a keen interest in film music and has experience in playing for background scores of films and advertisements, as well as regional independent music in Hindi, Marathi, Punjabi, Bengali, and Assamese. The First Film, featuring Anirban’s violin in its background score, has recently won at the National Film Awards for music in the category of non-feature films.
                </p>
              </div>
            </div>

            {/* Third Paragraph */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center bg-gray-900 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 animate-pulse-card animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div>
                <p className="text-lg leading-relaxed text-gray-200 font-light">
                  Despite his young age, Anirban has already made an impression as a successful teacher, with students who are registered artists in respectable institutions like All India Radio and Bangladesh Betar, as well as students who have featured in popular platforms like Coke Studio Bangladesh and Zee Bangla Sa Re Ga Ma Pa. Additionally, with the purpose of creating a more educated audience for Indian Classical Music, he co-founded the Upaj group in 2021 with Guitarist Swarnabha Gupta and vocalist Chitrayudh Ghatak. Upaj has already marked its presence in several Indian cities and is looking to expand into newer territories.
                </p>
              </div>
              <div className="flex justify-center">
                <img 
                  src="/anirban02.jpg" 
                  alt="Anirban playing violin" 
                  className="rounded-lg shadow-md w-full max-w-md object-cover transform hover:scale-105 transition-all duration-300" 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found'; }}
                />
              </div>
            </div>

            {/* Fourth Paragraph */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center bg-gray-900 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 animate-pulse-card animate-fade-in" style={{ animationDelay: '800ms' }}>
              <div className="flex justify-center order-2 md:order-1">
                <img 
                  src="/anirban03.jpg" 
                  alt="Anirban playing violin" 
                  className="rounded-lg shadow-md w-full max-w-md object-cover transform hover:scale-105 transition-all duration-300" 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found'; }}
                />
              </div>
              <div className="order-1 md:order-2">
                <p className="text-lg leading-relaxed text-gray-200 font-light">
                  Beside his pursuit of music, Anirban also holds a remarkable record in academics, with a Bachelors degree in Mathematics from St. Xavier’s College, Kolkata and a Masters degree in Applied Mathematics from the Chennai Mathematical Institute. Anirban is currently pursuing his PhD from the Tata Institute of Fundamental Research, Mumbai, and is Research Associate and Teaching Fellow at Ashoka University, Sonipat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gurus and Lineage Section */}
        <section id="gurus" className="py-20 px-4 md:px-20 bg-gradient-to-b from-gray-900 to-gray-900 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 "></div>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-6xl md:text-8xl p-4 font-serif font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-500 animate-fade-in antialiased ${greatVibes.className}`}>
                Gurus and Lineage
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-pink-500 mx-auto rounded-full mb-8"></div>
            </div>

            {/* Enhanced Content Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 p-8 md:p-12 hover:shadow-amber-500/10 transition-all duration-500 animate-fade-in" style={{ animationDelay: '200ms' }}>
              
              {/* Text Content with Better Typography */}
              <div className="space-y-6">
                <div className="space-y-4">
                  {/* <p className="text-lg leading-relaxed text-gray-200 font-light">
                    Embark on a musical odyssey guided by the luminaries of{' '}
                    <span className="text-amber-400 font-semibold">Hindustani Classical Music</span>!
                  </p> */}
                  <p className="text-gray-300">
                    Anirban Bhattacharjee's artistry is a tapestry woven from the teachings of revered gurus. From the rhythmic foundations laid by his father,{' '}
                    <strong className="text-amber-400"> <a target="_blank" href="https://www.facebook.com/jitesh.bhattacharjee/">Jitesh Bhattacharjee</a></strong>, to the intricate violin techniques imparted by{' '}
                    <strong className="text-pink-400"><a target="_blank" href="https://www.facebook.com/profile.php?id=100052440127869&rdid=PIVCA0F4jOkKzEYl&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F17qCHBxaCx%2F#">Shri Ashim Dutta</a></strong> and{' '}
                    <strong className="text-purple-400"><a target="_blank" href="https://www.facebook.com/manoj.baruah.524?rdid=iItOiAlOY775fXA2&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1BwADahzom%2F#">Shri Manoj Baruah</a></strong>, each mentor has sculpted his unique sound.
                  </p>
                  <p className="text-gray-300">
                    The legendary <strong className="text-emerald-400"><a target="_blank" href="https://en.wikipedia.org/wiki/Sisir_Kana_Dhar_Chowdhury">Dr. Sisirkana Dhar Choudhury</a></strong> of the Senia Maihar Gharana infused his music with soulful depth, while{' '}
                    <strong className="text-orange-400"><a target="_blank" href="https://www.facebook.com/supratik.sengupta.79?rdid=z1NnDkePz80g8tmp&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1AEvNtDWRp%2F#">Shri Supratik Sengupta</a></strong> of the Senia Shahjahanpur Gharana added virtuosic finesse. Under the tutelage of the late{' '}
                    <strong className="text-rose-400"><a href="https://www.facebook.com/swarna.khuntia?rdid=bbatBp9Zq4cEqul3&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Ccp24UQUi%2F#">Dr. Swarna Khuntia</a></strong>, a disciple of Dr. N. Rajam, Anirban mastered the Gayaki style, blending melody with emotion.
                  </p>
                  <p className="text-gray-300 italic">
                    This illustrious lineage fuels his performances with a celestial spark, resonating across time and tradition.
                  </p>
                </div>
                
                {/* Read More Button */}
                <div className="pt-4">
                  <a 
                    href="/gurus-lineage-2"
                    className="inline-flex items-center bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-gray-900 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105 group"
                  >
                    <span>Read More...</span>
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Enhanced Image Section */}
              <div className="relative flex justify-center">
                <div className="relative group">
                  <img 
                    src="/Gurus.jpg" 
                    alt="Anirban's Gurus Lineage" 
                    className="rounded-xl shadow-xl w-full max-w-md lg:max-w-lg object-cover transform group-hover:scale-105 transition-all duration-500 border-4 border-white/10"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/500x400?text=Gurus+Lineage'; }}
                  />
                  {/* Decorative overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Lineage badge */}
                  <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Sacred Lineage
                  </div>
                  {/* Guru icons overlay */}
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guru Highlights - Small Cards */}
            {/* <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-12">
              {[
                { name: "Jitesh Bhattacharjee", color: "bg-amber-500" },
                { name: "Ashim Dutta", color: "bg-blue-500" },
                { name: "Manoj Baruah", color: "bg-purple-500" },
                { name: "Sisir Kana Dhar Choudhury", color: "bg-emerald-500" },
                { name: "Supratik Sen Gupta", color: "bg-orange-500" },
                { name: "Swarna Khuntia", color: "bg-rose-500" }
              ].map((guru, index) => (
                <div key={index} className={`${guru.color} p-3 rounded-lg text-center text-white text-xs font-medium hover:scale-110 transition-transform duration-300 animate-fade-in`} style={{ animationDelay: `${300 + index * 100}ms` }}>
                  {guru.name.split(' ').map(word => word.split('')[0]).join('')}
                </div>
              ))}
            </div> */}
          </div>
        </section>

        {/* Gallery Section */}
        <section id="playings" className="py-20 px-4 md:px-20 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-6xl font-serif font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-500 animate-fade-in p-4 antialiased ${greatVibes.className}`}>Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <iframe
                src="https://www.youtube.com/embed/E84fCd7DsNQ?si=_ZnB4moSiCjEcP8k" 
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full aspect-video rounded-lg shadow-lg hover:scale-105 transition transform"
              ></iframe>
              <iframe
                src="https://www.youtube.com/embed/gR7UQY9RdQA?si=FyE8KwgCIq35bls-"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full aspect-video rounded-lg shadow-lg hover:scale-105 transition transform"
              ></iframe>
              <iframe
                src="https://www.youtube.com/embed/QvvjFYP8ds0?si=fmBXNCAb81VtlEdB"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full aspect-video rounded-lg shadow-lg hover:scale-105 transition transform"
              ></iframe>
              <iframe
                src="https://www.youtube.com/embed/RnKsHJ4BQK8?si=wQkNH2EEBpL7opy_"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full aspect-video rounded-lg shadow-lg hover:scale-105 transition transform"
              ></iframe>
              <iframe
                src="https://www.youtube.com/embed/VQHT88wU7zg?si=rNEjNJHdEmm7RD8Y"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full aspect-video rounded-lg shadow-lg hover:scale-105 transition transform"
              ></iframe>
              <iframe
                src="https://www.youtube.com/embed/4C_W_D64hqE?si=ulNtVNscn22sJK8n"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full aspect-video rounded-lg shadow-lg hover:scale-105 transition transform"
              ></iframe>
              <iframe
                src="https://www.youtube.com/embed/tj1iqaApLfw?si=C_rzckoGuyKFzpH5"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full aspect-video rounded-lg shadow-lg hover:scale-105 transition transform"
              ></iframe>
              <iframe
                src="https://www.youtube.com/embed/pSXqfoYHB_0?si=fWcJF299pg4_7yr5" 
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full aspect-video rounded-lg shadow-lg hover:scale-105 transition transform"
              ></iframe>
              <iframe
                src="https://www.youtube.com/embed/S-KMcYPjs5A?si=jQ0ip_u7kTU2CXcf"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full aspect-video rounded-lg shadow-lg hover:scale-105 transition transform"
              ></iframe>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section id="events" className="py-20 px-4 md:px-20 bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-6xl font-serif font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-500 animate-fade-in p-4 antialiased ${greatVibes.className}`}>Upcoming Performances</h2>
            
            {/* Added Loading State */}
            {isLoading && (
              <p className="text-gray-300 text-lg italic text-center animate-pulse">
                Loading performances... 🎻
              </p>
            )}

            {error && (
              <div className="mb-8 p-4 bg-red-900 bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-lg animate-fade-in">
                {error}
              </div>
            )}

            {!isLoading && concerts.length === 0 ? (
              <p className="text-gray-300 text-lg italic text-center">No upcoming concerts found.</p>
            ) : (
              <div className="space-y-6">
                {concerts.map((concert, index) => (
                  <ConcertCard
                    key={concert.id}
                    venue={concert.venue}
                    date={concert.date}
                    time = {concert.time}
                    location={concert.location}
                    ticketURL={concert?.ticketURL}
                    style={{ animationDelay: `${index * 100}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
              {/* Contact Footer Section */}
      <section id="contact" className="py-20 px-4 md:px-20 bg-gray-900">
      <footer className="py-16 px-4 rounded-xl md:px-20 bg-black/70 border-t border-white/10 mt-24">
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-5xl md:text-6xl text-center font-serif font-bold mb-12 ${greatVibes.className} text-amber-300`}>
            Connect with Anirban
          </h2>

          <div className="flex flex-col items-center space-y-8 md:space-y-0 md:flex-row md:justify-center gap-12 mb-12">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/violin.anirban/" // Replace with actual handle
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 text-gray-300 hover:text-white transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.735 0 8.332.012 7.052.07 3.5.27 0.858 2.91.659 6.462.6 7.743.589 8.146.589 12c0 3.855.011 4.258.07 5.538.199 3.553 2.839 6.193 6.391 6.391 1.281.059 1.684.07 4.949.07 3.264 0 3.667-.011 4.948-.07 3.552-.198 6.192-2.838 6.391-6.391.059-1.28.07-1.683.07-4.949 0-3.265-.011-3.668-.07-4.948-.198-3.553-2.838-6.192-6.391-6.391C15.684.011 15.281 0 12 0z"/>
                  <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
                </svg>
              </div>
              <span className="text-lg font-medium">Instagram</span>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/violin.anirban" // Replace with actual link
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 text-gray-300 hover:text-white transition-all duration-300"
            >
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.333v21.334C0 23.403.597 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.728 0 1.325-.597 1.325-1.333V1.333C24 .597 23.403 0 22.675 0z"/>
                </svg>
              </div>
              <span className="text-lg font-medium">Facebook</span>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@AnirbanBhattacharjee" // Replace with actual channel
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-4 text-gray-300 hover:text-white transition-all duration-300"
            >
              <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <span className="text-lg font-medium">YouTube</span>
            </a>
          </div>

          <div className="text-center text-gray-400 text-sm">
            <p>© 2025 Anirban Bhattacharjee</p>
          </div>
        </div>
      </footer>
      </section>
      </div>
    </>
  );
}
'use client';
import { useEffect, useState } from "react";
import Navbar from "./navbar/navbar";
import ConcertCard from "./components/ConcertCards"; // Ensure this path is correct
import { db } from "./firebaseConfig"; // Ensure this import and config are correct
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400", // ✅ only available weight
  variable: "--font-great-vibes",
});

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
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-50"></div>
          <div className="relative z-10 text-center px-4">
          <h1 className={`text-8xl font-bold mb-4 animate-fade-in font-serif antialiased ${greatVibes.className}`}> Anirban Bhattacharjee </h1>
            <p className="text-6xl font-palisade font-bold mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>Pioneer of the Violin in the Senia-Shahjahanpur Gharana</p>
            <a href="/#about" className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition animate-bounce">Discover My Journey</a>
          </div>
        </section>

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
                    <strong className="text-amber-400">Jitesh Bhattacharjee</strong>, to the intricate violin techniques imparted by{' '}
                    <strong className="text-pink-400">Shri Ashim Dutta</strong> and{' '}
                    <strong className="text-purple-400">Shri Manoj Baruah</strong>, each mentor has sculpted his unique sound.
                  </p>
                  <p className="text-gray-300">
                    The legendary <strong className="text-emerald-400">Dr. Sisirkana Dhar Chowdhury</strong> of the Senia Maihar Gharana infused his music with soulful depth, while{' '}
                    <strong className="text-orange-400">Shri Supratik Sengupta</strong> of the Senia Shahjahanpur Gharana added virtuosic finesse. Under the tutelage of the late{' '}
                    <strong className="text-rose-400">Dr. Swarna Khuntia</strong>, a disciple of Dr. N. Rajam, Anirban mastered the Gayaki style, blending melody with emotion.
                  </p>
                  <p className="text-gray-300 italic">
                    This illustrious lineage fuels his performances with a celestial spark, resonating across time and tradition.
                  </p>
                </div>
                
                {/* Read More Button */}
                <div className="pt-4">
                  <a 
                    href="/gurus-lineage"
                    className="inline-flex items-center bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-gray-900 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-105 group"
                  >
                    <span>Read More About the Lineage</span>
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
                  <div className="absolute top-4 right-4 bg-amber-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 border border-white/20">
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
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-12">
              {[
                { name: "Jitesh Bhattacharjee", color: "bg-amber-500" },
                { name: "Shri Ashim Dutta", color: "bg-blue-500" },
                { name: "Shri Manoj Baruah", color: "bg-purple-500" },
                { name: "Dr. Sisirkana Dhar", color: "bg-emerald-500" },
                { name: "Shri Supratik Sengupta", color: "bg-orange-500" },
                { name: "Dr. Swarna Khuntia", color: "bg-rose-500" }
              ].map((guru, index) => (
                <div key={index} className={`${guru.color} p-3 rounded-lg text-center text-white text-xs font-medium hover:scale-110 transition-transform duration-300 animate-fade-in`} style={{ animationDelay: `${300 + index * 100}ms` }}>
                  {guru.name.split(' ').map(word => word.split('')[0]).join('')}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="playings" className="py-20 px-4 md:px-20 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className={`text-6xl font-serif font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-500 animate-fade-in p-4 antialiased ${greatVibes.className}`}>Discography</h2>
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
                    style={{ animationDelay: `${index * 100}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-4 md:px-20 bg-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-8 animate-fade-in">Get in Touch</h2>
            <p className="text-lg mb-6">For bookings, collaborations, or inquiries, feel free to reach out.</p>
            <div className="space-y-4 max-w-md mx-auto">
              <input type="text" placeholder="Your Name" className="w-full p-3 rounded bg-gray-700 text-white" />
              <input type="email" placeholder="Your Email" className="w-full p-3 rounded bg-gray-700 text-white" />
              <textarea placeholder="Your Message" className="w-full p-3 rounded bg-gray-700 text-white h-32"></textarea>
              <button type="button" className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition">Send Message</button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 bg-gray-800 text-center">
          <p>&copy; 2025 Class Organizer. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
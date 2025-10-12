'use client';
import { useEffect, useState } from "react";
import Navbar from "./navbar/navbar";
import ConcertCard from "./components/ConcertCards";
import { db } from "./firebaseConfig";
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
            <h2 className={`text-6xl font-serif font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-500 animate-fade-in p-4 antialiased ${greatVibes.className}`}>Biography</h2>

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
        <section id="gurus" className="py-20 px-4 md:px-20 bg-gray-800">
          <div className="max-w-5xl mx-auto">
            <h2 className={`text-8xl p-4 font-serif font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-500 animate-fade-in animate-fade-out ${greatVibes.className}`}>Gurus and Lineage</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="flex flex-col items-center">
                <img 
                  src="/ABBaba.jpg" 
                  alt="Guru Jitesh Bhattacharjee" 
                  className="rounded-lg shadow-md w-full max-w-xs object-cover transform hover:scale-105 transition-all duration-300" 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Guru+Image+Not+Found'; }}
                />
                <p className="mt-4 text-sm text-gray-300 text-center">Jitesh Bhattacharjee - Tabla Mentor</p>
              </div>
              <div className="flex flex-col items-center">
                <img 
                  src="/Gurus.jpg" 
                  alt="Guru Shri Supratik Sengupta" 
                  className="rounded-lg shadow-md w-full max-w-xs object-cover transform hover:scale-105 transition-all duration-300" 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Guru+Image+Not+Found'; }}
                />
                <p className="mt-4 text-sm text-gray-300 text-center">Collage</p>
              </div>
              <div className="flex flex-col items-center">
                <img 
                  src="/NBRS.jpg" 
                  alt="Guru Dr. Sisirkana Dhar Chowdhury" 
                  className="rounded-lg shadow-md w-full max-w-xs object-cover transform hover:scale-105 transition-all duration-300" 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Guru+Image+Not+Found'; }}
                />
                <p className="mt-4 text-sm text-gray-300 text-center">Pt. Nikhil Banerjee | Pt. Ravi Shankar</p>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 animate-pulse-card" style={{ animationDelay: '200ms' }}>
              <p className="text-lg leading-relaxed text-gray-200 font-light animate-fade-in animate-fade-out" style={{ animationDelay: '200ms' }}>
              The seeds of music were sown in Anirban even before he developed a conscious memory of his own. Anirban has famously said that he has no recollection of not knowing Teentaal, Ektaal, Jhaptaal, Rupak Taal, Keherwa or Dadra. The credit for this goes entirely to his father, Shri Jitesh Bhattacharjee, who, despite being an engineer by profession, is an accomplished Tabla artist who has had the great fortune of accompanying legends like Pandit Hariprasad Chaurasia and Vidushi Girija Devi. <br />

Besides rhythmic training, Anirban also learned the basics of melody from his father, who is as adept with Rabindrasangeet and harmonium as he is with the Tabla. <br />

Anirban's training in violin began at the age of 15 under Shri Ashim Dutta of Guwahati, Assam. In recognition of Anirban's prodigious talent, Mr. Dutta chose to not train Anirban within a mere ten months of starting to teach him, and handed him over to Shri Manoj Baruah, a virtuoso who had already compounded manifold the popularity of the violin in the North-East. A disciple of the legendary Dr. Sisirkana Dhar Choudhury of the Senia-Maihar Gharana, Shri Manoj Baruah did not fail to see the immense potential that lay dormant in his new student, and almost immediately began educating Anirban in advanced techniques of the violin. This is an association that lasted nearly a decade, where Anirban learned not only the nitty-gritties of Tantrakari violin-playing, but also a lot of Gayaki-ang as well as the difference between performing classical music on stage and playing in recording sessions for commercial projects. Anirban still emphasises that he is yet to see a smarter violin session artist than Manoj Ji. <br />

While under the tutelage of Manoj Ji, Anirban moved to Kolkata to pursue a bachelors degree in Mathematics from the renowned St. Xavier's College. During this period, Anirban had the privilege of being mentored by Manoj Ji's legendary Guru, Dr. Sisirkana Dhar Choudhury herself. Sisirkana Ji's Maargdarshan opened up horizons of raga music hitherto unknown to Anirban. Under the legend's tutelage, Anirban was exposed to several rare Ragas that are performed exclusively in the Senia-Maihar Gharana, in addition to being taught rather intricate paths of raga development even in common ragas. <br />

Pandit V.G. Jog was a pioneering figure in Tantrakari-ang violin playing, and Anirban received exposure to Pandit Jog's perspectives from Prof. Biswajit Roy Choudhury, one of Pandit Jog's several illustrious disciples. <br />

Even though almost the entirety of Anirban's training has been in the Tantrakari system, his formative training ensured that the Gayaki method was never too far from his periphery of vision. In particular, Dr. N. Rajam's music left a deep impression in Anirban's mind. So, he sought the guidance of Dr. Swarna Khuntia, a celebrated disciple of Amma Ji (as Dr. Rajam is called by everyone in her lineage), and Swarna Ji was more than happy to oblige. This turned out to be the final piece in cementing Anirban's very individual style of violin playing - the unprecedented hybrid of the Tantrakari and Gayaki systems that his audience is now witness to. <br />

Anirban has been a lifelong fan of the music of Pandit Nikhil Banerjee and Pandit Ravi Shankar. So, it is no surprise that Sitar repertoire would become a key component in his delivery of the Vidya imparted to him by his violin Gurus. To develop an in-depth understanding of the music of these legends, Anirban came under the tutelage of Shri Supratik Sengupta, who is himself an amalgamation of thorough Taalim received from various sources. Even though he is primarily known today as a torch-bearing disciple of the legendary Sarod maestro of Senia-Shahjahanpur, Pandit Buddhadev Dasgupta, his training in Sitar comes from Gurus like Pandit Debaprasad Chakraborty, Pandit Ajoy Sinha Roy and Shri Pradeep Kumar Chakraborty. It is under Supratik Ji's decade-long guidance that Anirban's classical repertoire took its current form, and continues to explore further avenues.              </p>
            </div>
          </div>
        </section>


        {/* Gallery Section */}
        <section id="gallery" className="py-20 px-4 md:px-20 bg-gray-900">
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
            {error && (
              <div className="mb-8 p-4 bg-red-900 bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-lg animate-fade-in">
                {error}
              </div>
            )}
            {concerts.length === 0 ? (
              <p className="text-gray-300 text-lg italic text-center">No upcoming concerts found.</p>
            ) : (
              <div className="space-y-6">
                {concerts.map((concert, index) => (
                  <ConcertCard
                    key={concert.id}
                    venue={concert.venue}
                    date={concert.date}
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
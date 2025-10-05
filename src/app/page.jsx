'use client';
import Navbar from "./navbar/navbar";

export default function Portfolio() {
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
          animation: fadeIn 1s ease-in-out forwards;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-pulse-card {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl font-serif font-bold mb-4 animate-fade-in">Anirban Bhattacharjee</h1>
          <p className="text-2xl font-light mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>Master Violinist | Classical Maestro</p>
          <a href="#about" className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition animate-bounce">Discover My Journey</a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 md:px-20 bg-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-serif font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-500 animate-fade-in">Biography</h2>

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

      {/* Gallery Section */}
      <section id="gallery" className="py-20 px-4 md:px-20 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif font-bold mb-8 text-center animate-fade-in">Discography</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <iframe
              src="https://www.youtube.com/embed/E84fCd7DsNQ?si=HQ2zhvbscAp2LTqS"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full aspect-video rounded-lg shadow-lg hover:scale-105 transition transform"
            ></iframe>
            <iframe
              src="https://www.youtube.com/embed/1k2-z_t2IHw?si=ZblUbzY3G7n4JfO0"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full aspect-video rounded-lg shadow-lg hover:scale-105 transition transform"
            ></iframe>
            <iframe
              src="https://www.youtube.com/embed/LV58Ihr3THg?si=QLsroXwmSA_D6pgX"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full aspect-video rounded-lg shadow-lg hover:scale-105 transition transform"
            ></iframe>
            <iframe
              src="https://www.youtube.com/embed/EM7ltqM9wE0?si=2T3aLEaTxkrhDPWc"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full aspect-video rounded-lg shadow-lg hover:scale-105 transition transform"
            ></iframe>
            <iframe
              src="https://www.youtube.com/embed/gR7UQY9RdQA?si=WZAMpauMEFpU59UD"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full aspect-video rounded-lg shadow-lg hover:scale-105 transition transform"
            ></iframe>
            <iframe
              src="https://www.youtube.com/embed/qhYY1ja81BI?si=41MvUx4WJQGeptM7"
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
          <h2 className="text-4xl font-serif font-bold mb-8 text-center animate-fade-in">Upcoming Performances</h2>
          <ul className="space-y-6">
            <li className="bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-2">Symphony Hall Recital</h3>
              <p className="text-lg">Date: October 15, 2025 | Location: New York, NY</p>
            </li>
            <li className="bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-2">Chamber Music Festival</h3>
              <p className="text-lg">Date: November 5, 2025 | Location: Paris, France</p>
            </li>
            <li className="bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-2">Solo Concert</h3>
              <p className="text-lg">Date: December 20, 2025 | Location: Vienna, Austria</p>
            </li>
          </ul>
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
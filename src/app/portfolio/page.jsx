'use client';
import Navbar from "../navbar/navbar";

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl font-serif font-bold mb-4 animate-fade-in">Anirban Bhattacharjee</h1>
          <p className="text-2xl font-light mb-8 animate-fade-in delay-200">Master Violinist | Classical Maestro</p>
          <a href="#about" className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition animate-bounce">Discover My Journey</a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 md:px-20 bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif font-bold mb-8 text-center">About Me</h2>
          <p className="text-lg leading-relaxed mb-6">
            With a passion for the violin that spans over two decades, I bring the soul-stirring melodies of classical masters to life. Trained at prestigious conservatories, my performances have graced stages worldwide, from intimate recitals to grand symphony halls.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            My repertoire includes works by Bach, Beethoven, and Vivaldi, infused with a modern twist that captivates audiences of all ages. Join me in the serene world of classical music.
          </p>
          <div className="flex justify-center">
            <img src="/anirbanda.jpg" alt="Elena playing violin" className="rounded-lg shadow-lg w-full md:w-1/2 animate-slide-up" />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 px-4 md:px-20 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif font-bold mb-8 text-center">Snippets</h2>
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
          <h2 className="text-4xl font-serif font-bold mb-8 text-center">Upcoming Performances</h2>
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
          <h2 className="text-4xl font-serif font-bold mb-8">Get in Touch</h2>
          <p className="text-lg mb-6">For bookings, collaborations, or inquiries, feel free to reach out.</p>
          <form className="space-y-4 max-w-md mx-auto">
            <input type="text" placeholder="Your Name" className="w-full p-3 rounded bg-gray-700 text-white" />
            <input type="email" placeholder="Your Email" className="w-full p-3 rounded bg-gray-700 text-white" />
            <textarea placeholder="Your Message" className="w-full p-3 rounded bg-gray-700 text-white h-32"></textarea>
            <button type="submit" className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition">Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-800 text-center">
        <p>&copy; 2025 Class Organizer. All rights reserved.</p>
      </footer>
    </div>
  );
}
// components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 lg:py-20">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-10 text-amber-400">
          Connect with Anirban
        </h2>

        {/* Social Icons – smaller, horizontal on desktop, centered */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16 mb-10 md:mb-12">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/violin.anirban/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 group transition-colors hover:text-white"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <svg className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163z"/>
                <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
              </svg>
            </div>
            <span className="text-sm md:text-base font-medium">Instagram</span>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/violin.anirban"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 group transition-colors hover:text-white"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <svg className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.333v21.334C0 23.403.597 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.728 0 1.325-.597 1.325-1.333V1.333C24 .597 23.403 0 22.675 0z"/>
              </svg>
            </div>
            <span className="text-sm md:text-base font-medium">Facebook</span>
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@AnirbanBhattacharjee"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 group transition-colors hover:text-white"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <svg className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <span className="text-sm md:text-base font-medium">YouTube</span>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm md:text-base">
          <p>© {new Date().getFullYear()} Anirban Bhattacharjee</p>
          <p className="mt-2">All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
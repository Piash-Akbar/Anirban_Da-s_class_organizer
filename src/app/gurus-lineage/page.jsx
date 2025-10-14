'use client';
import { Great_Vibes } from "next/font/google";
import Navbar from "../navbar/navbar";
import Link from "next/link";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});

export default function GurusLineage() {
  const gurus = [
    {
      name: "Shri Jitesh Bhattacharjee",
      title: "Foundation of Rhythm & Melody",
      image: "/jitesh-bhattacharjee.jpg",
      images: ["/jitesh-bhattacharjee.jpg"], // Single image
      text: "From his earliest memories, Anirban was immersed in the intricate world of Indian classical rhythms—Teentaal, Ektaal, Jhaptaal—under the masterful guidance of his father. Though an engineer by profession, Shri Jitesh Bhattacharjee is a distinguished Tabla maestro who has performed alongside luminaries like Pandit Hariprasad Chaurasia and Vidushi Girija Devi. Beyond percussion, he nurtured Anirban's melodic sensibilities through soulful Rabindrasangeet and harmonium, laying the bedrock of his musical consciousness.",
      specialties: ["Tabla Mastery", "Rhythmic Foundation", "Rabindrasangeet"],
      gharana: "Familial Tradition"
    },
    {
      name: "Shri Ashim Dutta & Shri Manoj Baruah",
      title: "Masters of Violin Artistry",
      images: ["/ashim-dutta.jpeg", "/manoj-baruah.jpg"], // Two separate images
      text: "Anirban's violin odyssey commenced at 15 under Shri Ashim Dutta's tutelage in Guwahati. Recognizing his prodigious talent, Dutta ji swiftly entrusted him to Shri Manoj Baruah—a virtuoso of the Senia-Maihar lineage and champion of violin culture in Northeast India. Over nearly a decade, Baruah ji sculpted Anirban's technique, mastering the Tantrakari instrumental style while absorbing Gayaki vocal nuances. This period also demystified the contrasts between live concert artistry and studio recording precision, with Anirban revering Baruah ji as an unparalleled session genius.",
      specialties: ["Tantrakari Technique", "Violin Virtuosity", "Senia-Maihar", "Performance Craft"],
      gharana: "Senia-Maihar Gharana"
    },
    {
      name: "Dr. Sisirkana Dhar Choudhury",
      title: "Architect of Raga Realms",
      image: "/sisirkana-choudhury.jpg",
      images: ["/sisirkana-choudhury.jpg"], // Single image
      text: "During his mathematical studies in Kolkata, Anirban received the rare blessing of direct mentorship from the legendary Dr. Sisirkana Dhar Choudhury—guru of his violin master. Her profound Maargdarshan expanded his raga horizons, unveiling esoteric melodies unique to Senia-Maihar traditions. Under her sagacious guidance, Anirban mastered sophisticated raga elaboration techniques, transforming even familiar scales into profound musical narratives that resonate with both tradition and personal expression.",
      specialties: ["Raga Elaboration", "Senia-Maihar Secrets", "Maargdarshan", "Rare Ragas"],
      gharana: "Senia-Maihar Gharana"
    },
    {
      name: "Prof. Biswajit Roy Choudhury & Dr. Swarna Khuntia",
      title: "Fusion of Vocal & Instrumental Worlds",
      images: ["/biswajit-roy-choudhury.jpeg", "/swarna-khuntia.jpeg"], // Two separate images
      text: "While rooted in Tantrakari brilliance, Anirban sought the soulful Gayaki approach exemplified by Dr. N. Rajam. Dr. Swarna Khuntia, her illustrious disciple, became his guide to vocal expression on violin. Complementing this, Prof. Biswajit Roy Choudhury illuminated Pandit V.G. Jog's instrumental perspectives. This synthesis of traditions birthed Anirban's signature style—a revolutionary amalgamation where vocal lyricism dances with instrumental precision, creating a sound uniquely his own.",
      specialties: ["Gayaki Ang", "Style Synthesis", "Dr. N. Rajam Legacy", "V.G. Jog Influence"],
      gharana: "Gayaki & Tantrakari Traditions"
    },
    {
      name: "Shri Supratik Sengupta",
      title: "Sitar Symphony on Violin Strings",
      image: "/supratik-sengupta.jpg",
      images: ["/supratik-sengupta.jpg"], // Single image
      text: "Inspired by the transcendent sitar legacies of Pandit Nikhil Banerjee and Pandit Ravi Shankar, Anirban embarked on a decade-long journey with Shri Supratik Sengupta. A torchbearer of Pandit Buddhadev Dasgupta's Senia-Shahjahanpur lineage, Supratik ji also carries profound sitar wisdom from masters like Pandit Debaprasad Chakraborty. Under his holistic mentorship, Anirban's repertoire blossomed into its mature form, seamlessly blending sitar aesthetics with violin expression while continuing its evolutionary journey.",
      specialties: ["Sitar Repertoire", "Senia-Shahjahanpur", "Buddhadev Legacy", "String Synthesis"],
      gharana: "Senia-Shahjahanpur Gharana"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        <style jsx>{`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .image-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
          .single-image { grid-column: 1 / -1; }
        `}</style>

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-50"></div>
          <div className="relative z-10 text-center px-4">
            <h1 className={`text-8xl font-bold mb-4 animate-fade-in font-serif antialiased ${greatVibes.className}`}>
              Gurus & Lineage
            </h1>
            <p className="text-4xl font-palisade font-bold mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
              The Masters Who Shaped Anirban's Musical Soul
            </p>
            <Link 
              href="/portfolio#gurus" 
              className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition animate-bounce"
            >
              ← Back to Portfolio
            </Link>
          </div>
        </section>


        {/* Gurus Content */}
        <section className="py-24 px-4 md:px-20 bg-gray-900/50">
          <div className="max-w-7xl mx-auto space-y-20">
            {gurus.map((guru, index) => (
              <div 
                key={index}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10 hover:border-amber-500/30 transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: `${300 + (index * 300)}ms` }}
              >
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-amber-500/10 to-rose-500/10 rounded-full blur-xl"></div>
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                  <div>
                    <h3 className={`text-3xl md:text-4xl font-serif font-bold mb-2 bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent antialiased ${greatVibes.className}`}>
                      {guru.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-rose-500/20 rounded-full text-amber-300 border border-amber-500/30">
                        {guru.gharana}
                      </span>
                      <span className="text-gray-400">Guru Parampara</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-pink-400 uppercase tracking-wide mt-2 md:mt-0">
                    {guru.title}
                  </h4>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  {/* Images Section */}
                  <div className="space-y-4">
                    <div className={`image-grid ${guru.images.length === 1 ? 'single-image' : ''}`}>
                      {guru.images.map((imgSrc, imgIndex) => (
                        <div key={imgIndex} className="relative group/image">
                          <img 
                            src={imgSrc}
                            alt={`${guru.name} - ${imgIndex === 0 ? 'Primary' : 'Secondary'}`}
                            className="w-full h-64 md:h-80 object-cover rounded-xl shadow-xl border-2 border-white/10 group-hover/image:border-amber-400/50 transition-all duration-500"
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/400x300?text=${guru.name.split(' ')[0]}`;
                            }}
                          />
                          {guru.images.length > 1 && (
                            <div className="absolute -top-2 -right-2 bg-amber-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                              {imgIndex + 1}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {guru.images.length > 1 && (
                      <p className="text-sm text-gray-400 italic text-center">
                        Dual masters of the tradition
                      </p>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="space-y-6">
                    <p className="text-lg leading-relaxed text-gray-200 font-light">
                      {guru.text}
                    </p>
                    
                    {/* Specialties */}
                    <div>
                      <h5 className="text-sm font-semibold text-amber-400 uppercase tracking-wide mb-3">Key Contributions</h5>
                      <div className="flex flex-wrap gap-2">
                        {guru.specialties.map((specialty, sIndex) => (
                          <span 
                            key={sIndex}
                            className="px-3 py-2 bg-white/5 backdrop-blur-sm rounded-lg text-sm font-medium text-amber-300 border border-white/10 hover:bg-white/10 transition-colors animate-float"
                            style={{ animationDelay: `${sIndex * 100}ms` }}
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Legacy Quote */}
                    <blockquote className="border-l-4 border-amber-500/30 pl-4 italic text-gray-400">
                      "A guru's wisdom echoes through generations, shaping not just technique, but the very soul of music."
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lineage Tree / Summary */}
        <section className="py-24 px-4 md:px-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className={`text-5xl md:text-7xl font-serif font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-rose-400 to-purple-500 antialiased ${greatVibes.className}`}>
              Sacred Parampara
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-12 max-w-4xl mx-auto">
              {gurus.map((guru, index) => (
                <div key={index} className="relative">
                  <div className="h-2 bg-gradient-to-r from-amber-400 to-rose-500 rounded-full"></div>
                  {index < gurus.length - 1 && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-12 bg-white/20"></div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              This sacred lineage weaves through multiple gharanas, each guru contributing unique facets to Anirban's extraordinary musical identity. From rhythmic foundations to raga mastery, vocal expression to sitar aesthetics, this parampara creates performances that transcend tradition while honoring its deepest roots.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['Senia-Maihar', 'Senia-Shahjahanpur', 'Gayaki Ang', 'Tantrakari', 'Sitar Influence'].map((tradition, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-rose-500/20 backdrop-blur-sm rounded-full text-sm font-semibold text-amber-300 border border-amber-500/30 hover:scale-105 transition-all"
                >
                  {tradition}
                </span>
              ))}
            </div>
            <Link 
              href="/#playings"
              className="inline-flex items-center bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-400 hover:via-orange-400 hover:to-rose-400 text-gray-900 px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Witness the Mastery
              <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-black/50 border-t border-white/10">
          <div className="text-center">
            <p className="text-gray-400 mb-2">© 2025 Anirban Bhattacharjee | Preserving the Sacred Tradition</p>
            <p className="text-sm text-gray-500">Naman to the Gurus | Parampara Parampara</p>
          </div>
        </footer>
      </div>
    </>
  );
}
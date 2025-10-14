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
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-rose-500/20 rounded-full text-amber-300 border border-amber-500/30 shadow-md">
                        {guru.gharana}
                      </span> 
                      <span className="text-lg text-gray-400 italic font-medium">{guru.title}</span>
                    </div>
                  </div>
                  {/* Image grid */}
                  <div className={`mt-6 md:mt-0 ${guru.images.length > 1 ? 'image-grid' : 'single-image'}`}>
                    {guru.images.map((imgSrc, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={imgSrc}
                        alt={`${guru.name} ${imgIndex + 1}`}
                        className="w-full h-40 object-cover rounded-lg shadow-xl border-2 border-white/10 transform group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/200x160?text=Guru+Image'; }}
                      />
                    ))}
                  </div>
                </div>

                {/* Body Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4 border-t border-white/10">
                  <div className="lg:col-span-2">
                    <p className="text-lg leading-relaxed text-gray-300 font-light">
                      {guru.text}
                    </p>
                  </div>
                  <div className="lg:col-span-1">
                    <h4 className="text-xl font-semibold mb-3 text-amber-400">Key Focus</h4>
                    <ul className="space-y-2">
                      {guru.specialties.map((specialty, i) => (
                        <li key={i} className="flex items-center text-gray-200">
                          <svg className="w-4 h-4 mr-2 text-rose-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          {specialty}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}

            {/* Final Call to Action */}
            <div className="text-center pt-12">
              <p className="text-2xl italic text-gray-400 mb-6 animate-fade-in-up" style={{ animationDelay: `${300 + (gurus.length * 300)}ms` }}>
                The journey continues—blessed by tradition, driven by innovation.
              </p>
              <Link 
                href="/portfolio#playings" 
                className="inline-flex items-center bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 group"
              >
                <span>Experience the Music</span>
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.878v4.244a1 1 0 001.555.832l3.197-2.132c.277-.184.277-.577 0-.76zm0 0l-3.197-2.132A1 1 0 0010 9.878v4.244a1 1 0 001.555.832l3.197-2.132c.277-.184.277-.577 0-.76zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 bg-gray-800 text-center">
          <p className="text-gray-400">&copy; 2025 Class Organizer. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
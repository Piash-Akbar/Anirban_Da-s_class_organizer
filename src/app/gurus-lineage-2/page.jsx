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
      images: ["/jitesh-bhattacharjee.jpg"],
      text: "The seeds of music were sown in Anirban even before he developed a conscious memory of his own. Anirban has famously said that he has no recollection of not knowing Teentaal, Ektaal, Jhaptaal, Rupak Taal, Keherwa or Dadra. The credit for this goes entirely to his father, Shri Jitesh Bhattacharjee, who, despite being an engineer by profession, is an accomplished Tabla artist who has had the great fortune of accompanying legends like Pandit Hariprasad Chaurasia and Vidushi Girija Devi.<br />Besides rhythmic training, Anirban also learned the basics of melody from his father, who is as adept with Rabindrasangeet and harmonium as he is with the Tabla."
    },
    {
      name: "Shri Ashim Dutta & Shri Manoj Baruah",
      title: "Masters of Violin Artistry",
      images: ["/ashim-dutta.jpg", "/manoj-baruah.jpg"],
      text: "Anirban's training in violin began at the age of 15 under Shri Ashim Dutta of Guwahati, Assam. In recognition of Anirban's prodigious talent, Mr. Dutta chose to not train Anirban within a mere ten months of starting to teach him, and handed him over to Shri Manoj Baruah, a virtuoso who had already compounded manifold the popularity of the violin in the North-East. A disciple of the legendary Dr. Sisirkana Dhar Choudhury of the Senia-Maihar Gharana, Shri Manoj Baruah did not fail to see the immense potential that lay dormant in his new student, and almost immediately began educating Anirban in advanced techniques of the violin. This is an association that lasted nearly a decade, where Anirban learned not only the nitty-gritties of Tantrakari violin-playing, but also a lot of Gayaki-ang as well as the difference between performing classical music on stage and playing in recording sessions for commercial projects. Anirban still emphasises that he is yet to see a smarter violin session artist than Manoj Ji."
    },
    {
      name: "Dr. Sisirkana Dhar Choudhury",
      title: "Architect of Raga Realms",
      images: ["/sisirkana-choudhury.jpg"],
      text: "While under the tutelage of Manoj Ji, Anirban moved to Kolkata to pursue a bachelors degree in Mathematics from the renowned St. Xavier's College. During this period, Anirban had the privilege of being mentored by Manoj Ji's legendary Guru, Dr. Sisirkana Dhar Choudhury herself. Sisirkana Ji's Maargdarshan opened up horizons of raga music hitherto unknown to Anirban. Under the legend's tutelage, Anirban was exposed to several rare Ragas that are performed exclusively in the Senia-Maihar Gharana, in addition to being taught rather intricate paths of raga development even in common ragas."
    },
    {
      name: "Dr. Swarna Khuntia",
      title: "Gayaki Ang",
      images: ["/swarna-khuntia.jpeg"],
      text: "Even though almost the entirety of Anirban's training has been in the Tantrakari system, his formative training ensured that the Gayaki method was never too far from his periphery of vision. In particular, Dr. N. Rajam's music left a deep impression in Anirban's mind. So, he sought the guidance of Dr. Swarna Khuntia, a celebrated disciple of Amma Ji (as Dr. Rajam is called by everyone in her lineage), and Swarna Ji was more than happy to oblige. This turned out to be the final piece in cementing Anirban's very individual style of violin playing - the unprecedented hybrid of the Tantrakari and Gayaki systems that his audience is now witness to."
    },
    {
      name: "Prof. Biswajit Roy Choudhury",
      title: "Roots of Tantrakari Tradition",
      images: ["/biswajit-roy-choudhury.jpeg"],
      text: "Pandit V.G. Jog was a pioneering figure in Tantrakari-ang violin playing, and Anirban received exposure to Pandit Jog's perspectives from Prof. Biswajit Roy Choudhury, one of Pandit Jog's several illustrious disciples."
    },
    {
      name: "Shri Supratik Sengupta",
      title: "Sitar Symphony on Violin Strings",
      images: ["/supratik-sengupta.jpg"],
      text: "Inspired by the transcendent sitar legacies of Pandit Nikhil Banerjee and Pandit Ravi Shankar, Anirban embarked on a decade-long journey with Shri Supratik Sengupta. A torchbearer of Pandit Buddhadev Dasgupta's Senia-Shahjahanpur lineage, Supratik ji also carries profound sitar wisdom from masters like Pandit Debaprasad Chakraborty. Under his holistic mentorship, Anirban's repertoire blossomed into its mature form, seamlessly blending sitar aesthetics with violin expression while continuing its evolutionary journey."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        <style jsx>{`
          @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
          .animate-fade-in-up { animation: fadeInUp 1s ease-out forwards; }
          .image-float { transition: transform 0.3s; }
          .image-float:hover { transform: scale(1.05); }
        `}</style>

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-50"></div>
          <div className="relative z-10 text-center px-4">
            <h1 className={`text-8xl font-bold mb-4 animate-fade-in font-serif antialiased ${greatVibes.className}`}>
              Gurus & Lineage
            </h1>
            <p className="text-4xl font-bold mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
              The Masters Who Shaped Anirban's Music
            </p>
            <Link href="/portfolio#gurus" className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition">
              ← Back to Portfolio
            </Link>
          </div>
        </section>

        {/* Essay Content */}
        <section className="py-24 px-4 md:px-20">
          <div className="max-w-5xl mx-auto prose prose-invert prose-lg">
            <h2 className={`text-5xl text-center mb-16 font-serif ${greatVibes.className} bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent`}>
              The Sacred Lineage: Gurus Who Shaped Anirban's Musical Journey
            </h2>

            {gurus.map((guru, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-start mb-24 animate-fade-in-up`} style={{ animationDelay: `${index * 200}ms` }}>
                {/* Images */}
                <div className="flex-shrink-0 w-full md:w-1/3">
                  <div className={`grid ${guru.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                    {guru.images.map((imgSrc, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={imgSrc}
                        alt={guru.name}
                        className="w-full h-72 object-cover rounded-xl shadow-2xl border border-white/10 image-float"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=' + encodeURIComponent(guru.name); }}
                      />
                    ))}
                  </div>
                  {guru.images.length >= 1 && <p className="text-sm text-gray-400 text-center mt-2 italic">{guru.name}</p>}
                </div>

                {/* Text Paragraph */}
                <div className="w-full md:w-2/3 space-y-6">
                  {/* <h3 className={`text-4xl font-serif font-bold bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent ${greatVibes.className}`}>
                    {guru.name}
                  </h3> */}
                  {/* <p className="text-xl uppercase tracking-wide text-pink-400">{guru.title}</p> */}
                  <p className="text-lg leading-relaxed text-gray-200" dangerouslySetInnerHTML={{ __html: guru.text.replace(/<br \/>/g, '<br/><br/>') }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Closing Summary */}
        <section className="py-24 px-4 md:px-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className={`text-6xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-rose-400 to-purple-500 ${greatVibes.className}`}>
              Sacred Parampara
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              This sacred lineage weaves through multiple gharanas, each guru contributing unique facets to Anirban's extraordinary musical identity. From rhythmic foundations to raga mastery, vocal expression to sitar aesthetics, this parampara creates performances that transcend tradition while honoring its deepest roots.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Senia-Maihar', 'Senia-Shahjahanpur', 'Gayaki Ang', 'Tantrakari', 'Sitar Influence'].map((tradition) => (
                <span key={tradition} className="px-6 py-3 bg-gradient-to-r from-amber-500/20 to-rose-500/20 rounded-full text-amber-300 border border-amber-500/30">
                  {tradition}
                </span>
              ))}
            </div>
            <Link href="/#playings" className="inline-block bg-gradient-to-r from-amber-500 to-rose-500 text-gray-900 px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition">
              Witness the Mastery →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-black/50 border-t border-white/10 text-center text-gray-400">
          © 2025 Anirban Bhattacharjee | Preserving the Sacred Tradition<br/>
          Naman to the Gurus | Parampara Parampara
        </footer>
      </div>
    </>
  );
}
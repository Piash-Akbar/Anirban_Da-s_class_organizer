import Navbar from "../navbar/navbar";

export default function TakeALesson() {
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center bg-gray-900">
        <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 flex flex-col">
          <h1 className="text-4xl font-bold text-white mb-6">
            Take a Lesson
          </h1>
          <p className="text-white mb-4">
            Welcome to your violin lessons with Anirban Bhattacharjee!
          </p>
        </div>
      </div>
    </>
  );
}
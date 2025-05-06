'use client';

import Image from 'next/image';
import Link from 'next/link';

type StatItem = {
  number: string;
  text: string;
};

const stats: StatItem[] = [
  { number: "500+", text: "Celebrity Partners" },
  { number: "1000+", text: "Events Completed" },
  { number: "98%", text: "Satisfaction Rate" }
];

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-black/50" />
        <Image
          src="/hero-bg.jpg"
          alt="Celebrity Events Background"
          fill
          className="object-cover opacity-40"
          priority
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 container mx-auto px-4 h-screen flex flex-col justify-center items-center text-center">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 opacity-0 animate-fade-in">
            <span className="text-white">Book Your Favorite</span>
            <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Celebrity Today
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto opacity-0 animate-fade-in-delay-2">
            Connect with world-class talent for your events, brand collaborations, and special occasions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-delay-4">
            <Link 
              href="/celebrities" 
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 opacity-0 animate-fade-in-delay-2 inline-block"
            >
              Book Now
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-0 animate-fade-in-delay-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">
                  {stat.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent opacity-0 animate-fade-in-delay-8" />
      </div>
    </div>
  );
};

export default Hero;
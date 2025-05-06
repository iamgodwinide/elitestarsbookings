'use client';

import { FaSearch, FaCalendarAlt, FaCreditCard, FaStar } from 'react-icons/fa';
import Link from 'next/link';
import { IconType } from 'react-icons';

type ProcessStep = {
  title: string;
  description: string;
  icon: IconType;
  gradient: string;
};

const steps: ProcessStep[] = [
  {
    title: "Choose Your Celebrity",
    description: "Browse through our extensive list of verified celebrities and find your perfect match.",
    icon: FaSearch,
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    title: "Select Service & Date",
    description: "Pick your desired service and schedule a date that works for both parties.",
    icon: FaCalendarAlt,
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    title: "Secure Payment",
    description: "Complete your booking with our secure payment system and receive instant confirmation.",
    icon: FaCreditCard,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Enjoy the Experience",
    description: "Meet your favorite celebrity and create unforgettable memories.",
    icon: FaStar,
    gradient: "from-pink-500 to-rose-500",
  },
];

const Process = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Book your celebrity experience in four simple steps
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-y-1/2 opacity-20" />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative group"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm border border-gray-700">
                    {index + 1}
                  </div>

                  {/* Card */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 h-full transform transition-all duration-300 hover:-translate-y-1">
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-4 rounded-lg bg-gradient-to-r ${step.gradient} text-white mb-6 transform transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300">
                        {step.title}
                      </h3>
                      <p className="text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-16">
            <Link 
              href="/celebrities" 
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Start Booking
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;

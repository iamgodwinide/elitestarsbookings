'use client';

import { FaHandshake, FaTicketAlt, FaIdCard, FaCalendarCheck, FaHandHoldingHeart, FaBell } from "react-icons/fa";
import Link from 'next/link';
import { IconType } from 'react-icons';

type ServiceItem = {
  title: string;
  description: string;
  icon: IconType;
  gradient: string;
  id: string;
};

const services: ServiceItem[] = [
  {
    title: "Meet and Greet",
    description: "Personal one-on-one meetings with your favorite celebrities",
    icon: FaHandshake,
    gradient: "from-blue-400 to-indigo-500",
    id: "meet-and-greet",
  },
  {
    title: "VIP Fan Cards",
    description: "Exclusive membership cards with special celebrity access",
    icon: FaIdCard,
    gradient: "from-purple-400 to-pink-500",
    id: "vip-fan-cards",
  },
  {
    title: "Subscription",
    description: "Regular updates and exclusive content from your favorite celebrities",
    icon: FaBell,
    gradient: "from-amber-400 to-orange-500",
    id: "subscription",
  },
  {
    title: "Donation",
    description: "Support your favorite celebrity's charitable causes",
    icon: FaHandHoldingHeart,
    gradient: "from-rose-400 to-red-500",
    id: "donation",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We make celebrity bookings simple, secure, and unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 transform transition-all duration-300 hover:-translate-y-1 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${service.gradient} text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:via-purple-400 group-hover:to-pink-400 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-400 pl-[52px]">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
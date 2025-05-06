'use client';

import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import Image from 'next/image';

type Testimonial = {
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
  service: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Event Planner",
    image: "/testimonials/sarah.jpg",
    quote: "The meet and greet service was incredible! The celebrity was so friendly and professional. My client was absolutely thrilled with the experience.",
    rating: 5,
    service: "Meet and Greet"
  },
  {
    name: "Michael Chen",
    role: "Music Fan",
    image: "/testimonials/michael.jpg",
    quote: "Got VIP concert tickets and backstage passes. The whole process was smooth, and the experience was unforgettable!",
    rating: 5,
    service: "Concert Tickets"
  },
  {
    name: "Emily Rodriguez",
    role: "Charity Organizer",
    image: "/testimonials/emily.jpg",
    quote: "The donation feature made it easy to connect with celebrities who support our cause. We raised more than expected!",
    rating: 5,
    service: "Donation"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Real experiences from people who have used our services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center transform -rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <FaQuoteLeft className="text-white w-4 h-4" />
              </div>

              {/* Card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 h-full transform transition-all duration-300 hover:-translate-y-1">
                {/* Service Tag */}
                <div className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-400 mb-6">
                  {testimonial.service}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-300 mb-6">
                  "{testimonial.quote}"
                </blockquote>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500 w-5 h-5" />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-300 mb-6 text-lg">
            Join thousands of satisfied clients who have experienced our celebrity booking services
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-lg text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1">
            Start Your Experience
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

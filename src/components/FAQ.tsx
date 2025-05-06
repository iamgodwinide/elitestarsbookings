'use client';

import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

type FAQItem = {
  question: string;
  answer: string;
  category: string;
};

const faqs: FAQItem[] = [
  {
    question: "How do I book a meet and greet?",
    answer: "To book a meet and greet, simply browse our celebrity listings, select your preferred celebrity, choose the meet and greet option, and select your preferred date and time. Once you complete the payment, you'll receive a confirmation email with all the details.",
    category: "Booking Process"
  },
  {
    question: "What are VIP fan cards?",
    answer: "VIP fan cards are exclusive membership cards that provide special access to celebrity events, priority booking for meet and greets, and exclusive content. They're available in different tiers with varying benefits.",
    category: "VIP Services"
  },
  {
    question: "How do concert ticket bookings work?",
    answer: "We offer priority access to concert tickets and exclusive backstage passes. Once you select a concert, you can choose your preferred seating and any VIP packages available. We handle the entire booking process for you.",
    category: "Concerts"
  },
  {
    question: "What's your cancellation policy?",
    answer: "Our standard cancellation policy allows full refunds up to 72 hours before the event. For last-minute cancellations (within 72 hours), a 50% fee applies. Some special events may have different policies, which will be clearly stated during booking.",
    category: "Policies"
  },
  {
    question: "How do I make a donation through a celebrity?",
    answer: "You can make donations through our platform by selecting a celebrity's chosen charity or cause. 100% of your donation goes directly to the charity, and you'll receive a confirmation receipt for tax purposes.",
    category: "Donations"
  },
  {
    question: "Are the celebrities verified?",
    answer: "Yes, all celebrities on our platform are verified. We work directly with their official management teams to ensure authenticity and provide the best possible experience for our users.",
    category: "Security"
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about our celebrity booking services
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-indigo-400 mb-2 block">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-semibold text-white group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:via-purple-400 group-hover:to-pink-400 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300">
                      {faq.question}
                    </h3>
                  </div>
                  <FaChevronDown 
                    className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                
                {/* Answer */}
                <div className={`mt-4 text-gray-400 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <p>{faq.answer}</p>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-300 mb-6">
            Can't find what you're looking for?
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg font-semibold text-lg text-white hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

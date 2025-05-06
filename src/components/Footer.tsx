'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaHeart } from 'react-icons/fa';

const navigation = {
  services: [
    { name: 'Meet and Greet', href: '#' },
    { name: 'VIP Fan Cards', href: '#' },
    { name: 'Concert Tickets', href: '#' },
    { name: 'Reservations', href: '#' },
    { name: 'Donations', href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Contact Us', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Partners', href: '#' },
  ],
  social: [
    { name: 'Facebook', icon: FaFacebookF, href: '#' },
    { name: 'Twitter', icon: FaTwitter, href: '#' },
    { name: 'Instagram', icon: FaInstagram, href: '#' },
    { name: 'LinkedIn', icon: FaLinkedinIn, href: '#' },
  ],
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-400">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 py-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <div className="text-2xl font-bold text-white mb-4">
                Booking Stars
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Connect with your favorite celebrities through meet and greets, VIP experiences, 
              and exclusive events. Making dreams come true, one booking at a time.
            </p>
            <div className="flex space-x-4">
              {navigation.social.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {navigation.services.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="hover:text-white transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="hover:text-white transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="hover:text-white transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm">
              © {currentYear} Booking Stars. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <Link href="#" className="hover:text-white transition-colors duration-300">
                Terms
              </Link>
              <Link href="#" className="hover:text-white transition-colors duration-300">
                Privacy
              </Link>
              <Link href="#" className="hover:text-white transition-colors duration-300">
                Cookies
              </Link>
            </div>
            <div className="text-sm flex items-center space-x-1">
              <span>Made with</span>
              <FaHeart className="w-4 h-4 text-pink-500" />
              <span>by Booking Stars Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHandshake, FaIdCard, FaHandHoldingHeart, FaBell } from 'react-icons/fa';

type Celebrity = {
  _id: string;
  name: string;
  profession: string;
  imageUrl: string;
  bio: string;
};

type Service = {
  id: string;
  name: string;
  description: string;
  icon: any;
  gradient: string;
};

const services: Service[] = [
  {
    id: 'meet-greet',
    name: 'Meet & Greet',
    description: 'Personal one-on-one meeting with photo opportunities and autograph session.',
    icon: FaHandshake,
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'vip-card',
    name: 'VIP Fan Card',
    description: 'Exclusive membership card with priority access to events and special content.',
    icon: FaIdCard,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'subscription',
    name: 'Subscription',
    description: 'Regular updates and exclusive content from your favorite celebrity.',
    icon: FaBell,
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    id: 'donate',
    name: 'Donate',
    description: 'Support charitable causes through your favorite celebrity.',
    icon: FaHandHoldingHeart,
    gradient: 'from-pink-500 to-rose-500'
  }
];

interface ServiceComponentProps {
  params: {
    id: string;
  };
}

const ServiceComponent = ({ params }: ServiceComponentProps) => {
  console.log('Received params.id:', params.id);
  const [celebrity, setCelebrity] = useState<Celebrity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCelebrity = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/celebrities/id/${params.id}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch celebrity');
        }

        const data = await res.json();
        setCelebrity(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCelebrity();
  }, [params.id]);



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-[40vh] bg-gray-800 rounded-lg mb-12" />
            <div className="bg-white/5 p-8 rounded-xl">
              <div className="space-y-4">
                <div className="h-8 bg-gray-800 rounded w-1/3" />
                <div className="h-4 bg-gray-800 rounded w-1/4" />
                <div className="h-32 bg-gray-800 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !celebrity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-500/10 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-gray-400 mb-6">{error || 'Celebrity not found'}</p>
            <Link
              href="/celebrities"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Celebrities
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 z-10" />
        <Image
          src={celebrity.imageUrl || '/placeholder-celebrity.jpg'}
          alt={celebrity.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Celebrity Info */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 mb-12">

              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{celebrity.name}</h1>
                  <p className="text-purple-400 mb-4">{celebrity.profession}</p>
                </div>

              </div>

              <p className="text-gray-300 mb-12">{celebrity.bio}</p>

              {/* Available Services */}
              <h2 className="text-2xl font-bold text-white mb-8">Choose Your Option</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <Link
                      key={service.id}
                      href={`/booking/${celebrity._id}/apply/${service.id}`}
                      className="group p-8 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${service.gradient} mb-6 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:text-transparent group-hover:bg-clip-text">
                        {service.name}
                      </h3>
                      <p className="text-gray-400">{service.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
        </div>
      </div>
  );
}

export default ServiceComponent
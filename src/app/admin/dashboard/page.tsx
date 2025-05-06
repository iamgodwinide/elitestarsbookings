'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed';

interface Celebrity {
  _id: string;
  name: string;
  imageUrl: string;
  profession: string;
  createdAt: Date | string;
}

interface Booking {
  _id: string;
  celebrityId: {
    _id: string;
    name: string;
    imageUrl: string;
  };
  customerName: string;
  customerEmail: string;
  service: string;
  status: BookingStatus;
  amount: number;
  date: string;
  createdAt: string;
}

interface DashboardStats {
  totalCelebs: number;
  totalBookings: number;
  recentBookings: Booking[];
  recentCelebs: Celebrity[];
  bookingStats: {
    _id: BookingStatus;
    count: number;
    totalAmount: number;
  }[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard/stats');
        const data = await response.json();
        if (response.ok) {
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-gray-400 text-sm font-medium">Total Celebrities</h3>
          <p className="text-3xl font-bold text-white mt-2">{stats?.totalCelebs || 0}</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
          <h3 className="text-gray-400 text-sm font-medium">Total Bookings</h3>
          <p className="text-3xl font-bold text-white mt-2">{stats?.totalBookings || 0}</p>
        </div>
        {stats?.bookingStats.map((stat) => (
          <div key={stat._id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-gray-400 text-sm font-medium capitalize">{stat._id} Bookings</h3>
            <p className="text-3xl font-bold text-white mt-2">{stat.count}</p>
            <p className="text-sm text-gray-400 mt-1">${stat.totalAmount.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm">
                <th className="pb-4">Celebrity</th>
                <th className="pb-4">Customer</th>
                <th className="pb-4">Service</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {stats?.recentBookings.map((booking) => (
                <tr key={booking._id} className="border-t border-gray-800">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={booking.celebrityId.imageUrl}
                        alt={booking.celebrityId.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <span>{booking.celebrityId.name}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <p>{booking.customerName}</p>
                      <p className="text-sm text-gray-500">{booking.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 capitalize">{booking.service.replace(/-/g, ' ')}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${{
                      pending: 'bg-yellow-500/10 text-yellow-500',
                      approved: 'bg-green-500/10 text-green-500',
                      rejected: 'bg-red-500/10 text-red-500',
                      completed: 'bg-blue-500/10 text-blue-500'
                    }[booking.status]}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4">${booking.amount}</td>
                  <td className="py-4">{new Date(booking.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Celebrities Table */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Celebrities</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm">
                <th className="pb-4">Celebrity</th>
                <th className="pb-4">Profession</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {stats?.recentCelebs.map((celeb) => (
                <tr key={celeb._id} className="border-t border-gray-800">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={celeb.imageUrl}
                        alt={celeb.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <span>{celeb.name}</span>
                    </div>
                  </td>
                  <td className="py-4">{celeb.profession}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

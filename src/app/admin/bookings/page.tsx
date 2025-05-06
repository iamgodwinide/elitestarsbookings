'use client';

import { useState, useEffect } from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import BookingFilters from '@/components/admin/BookingFilters';
import BookingTable from '@/components/admin/BookingTable';

interface Celebrity {
    _id: string;
    name: string;
    imageUrl: string;
    profession: string;
}

interface Booking {
    _id: string;
    celebrityId: Celebrity;
    service: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    status: 'pending' | 'approved' | 'completed' | 'rejected';
    date: string;
    amount: number;
    createdAt: string;
}



interface PaginationData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);

    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        service: '',
        startDate: '',
        endDate: ''
    });
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...(filters.search && { search: filters.search }),
                ...(filters.status && { status: filters.status }),
                ...(filters.service && { service: filters.service }),
                ...(filters.startDate && { startDate: filters.startDate }),
                ...(filters.endDate && { endDate: filters.endDate })
            });

            const res = await fetch(`/api/admin/bookings?${params}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setBookings(data.bookings);

            setPagination(prev => ({
                ...prev,
                ...data.pagination
            }));
        } catch (error) {
            console.error('Error fetching bookings:', error);
            // TODO: Show error toast
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [pagination.page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchBookings();
    };

    const handleFilterChange = (newFilters: typeof filters) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchBookings();
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            let res;
            if (newStatus === 'approved') {
                res = await fetch(`/api/admin/bookings/${id}/accept`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' }
                });
            } else if (newStatus === 'rejected') {
                res = await fetch(`/api/admin/bookings/${id}/reject`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                res = await fetch(`/api/admin/bookings/${id}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });
            }
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // Refresh the list
            fetchBookings();
            // Show success toast
            alert(data.message || `Booking ${newStatus} successfully`);
        } catch (error: any) {
            console.error('Error updating booking status:', error);
            // Show error toast
            alert(error.message || 'Failed to update booking status');
        }
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <BookingFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
            />

            {/* Table */}
            <BookingTable 
                bookings={bookings}
                loading={loading}
                onStatusChange={handleStatusChange}
            />

            {/* Pagination */}
            {!loading && bookings.length > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                        {pagination.total} bookings
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 1}
                            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RiArrowLeftSLine size={20} />
                        </button>
                        <span className="text-sm text-gray-400">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page === pagination.totalPages}
                            className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RiArrowRightSLine size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

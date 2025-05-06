'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    RiAddLine, 
    RiSearchLine, 
    RiEdit2Line, 
    RiDeleteBinLine,
    RiArrowLeftSLine,
    RiArrowRightSLine
} from 'react-icons/ri';
import Image from 'next/image';

interface Celebrity {
    _id: string;
    name: string;
    imageUrl: string;
    profession: string;
    bio: string;
    createdAt: Date | string;
}

interface PaginationData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function CelebritiesPage() {
    const router = useRouter();
    const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });

    const fetchCelebrities = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...(search && { search })
            });

            const res = await fetch(`/api/admin/celebrities?${params}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setCelebrities(data.celebrities);
            setPagination(prev => ({
                ...prev,
                ...data.pagination
            }));
        } catch (error) {
            console.error('Error fetching celebrities:', error);
            // TODO: Show error toast
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCelebrities();
    }, [pagination.page, search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchCelebrities();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this celebrity?')) return;

        try {
            const res = await fetch(`/api/admin/celebrities/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // Refresh the list
            fetchCelebrities();
            // TODO: Show success toast
        } catch (error) {
            console.error('Error deleting celebrity:', error);
            // TODO: Show error toast
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <button
                    onClick={() => router.push('/admin/celebrities/add')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <RiAddLine size={20} />
                    <span>Add Celebrity</span>
                </button>

                {/* Search */}
                <form onSubmit={handleSearch} className="w-full sm:w-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search celebrities..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <RiSearchLine 
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                            size={20} 
                        />
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="text-white overflow-x-auto rounded-lg border border-gray-800">
                <table className="w-full text-left">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="p-4">Celebrity</th>
                            <th className="p-4">Profession</th>
                            <th className="p-4">Added On</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="p-4 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : celebrities.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-4 text-center">
                                    No celebrities found
                                </td>
                            </tr>
                        ) : (
                            celebrities.map((celebrity) => (
                                <tr key={celebrity._id} className="hover:bg-gray-800/50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                                                {celebrity.imageUrl && (
                                                    <Image
                                                        src={celebrity.imageUrl}
                                                        alt={celebrity.name}
                                                        width={40}
                                                        height={40}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <span className="font-medium">{celebrity.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">{celebrity.profession}</td>
                                    <td className="p-4">
                                        {celebrity.createdAt ? new Date(celebrity.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        }) : 'N/A'}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => router.push(`/admin/celebrities/${celebrity._id}/edit`)}
                                                className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <RiEdit2Line size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(celebrity._id)}
                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <RiDeleteBinLine size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!loading && celebrities.length > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                        {pagination.total} celebrities
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

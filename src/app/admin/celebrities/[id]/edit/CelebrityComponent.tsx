'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CelebrityForm from '@/components/admin/CelebrityForm';
import { RiLoader4Line } from 'react-icons/ri';

interface Celebrity {
    _id: string;
    name: string;
    profession: string;
    bio: string;
    imageUrl: string;
    coverImageUrl?: string;
    socialMedia: {
        instagram?: string;
        twitter?: string;
        tiktok?: string;
        youtube?: string;
    };
    featured: boolean;
    slug: string;
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
    event: number;
}

const CelebrityComponent = ({params}:any) => {
    const router = useRouter();
    const [celebrity, setCelebrity] = useState<Celebrity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCelebrity = async () => {
            try {
                const res = await fetch(`/api/admin/celebrities/${params.id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch celebrity');
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

    const handleSubmit = async (formData: any) => {
        try {
            const res = await fetch(`/api/admin/celebrities/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error('Failed to update celebrity');
            }

            router.push('/admin/celebrities');
            router.refresh();
        } catch (err) {
            console.error('Error updating celebrity:', err);
            // TODO: Show error toast
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <RiLoader4Line className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    if (!celebrity) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-400 mb-2">Not Found</h1>
                    <p className="text-gray-500">Celebrity not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 text-white">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-200 mb-8">
                    Edit Celebrity: {celebrity.name}
                </h1>
                <CelebrityForm
                    initialData={celebrity}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}

export default CelebrityComponent
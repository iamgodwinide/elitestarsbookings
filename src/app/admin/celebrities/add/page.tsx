'use client';

import { useRouter } from 'next/navigation';
import CelebrityForm from '@/components/admin/CelebrityForm';
import { RiArrowLeftLine } from 'react-icons/ri';

export default function AddCelebrityPage() {
    const router = useRouter();

    const handleSubmit = async (data: any) => {
        try {
            const res = await fetch('/api/admin/celebrities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Failed to create celebrity');
            }

            // Navigate back to celebrities list
            router.push('/admin/celebrities');
            // TODO: Show success toast
        } catch (error) {
            console.error('Error creating celebrity:', error);
            // TODO: Show error toast
        }
    };

    return (
        <div className="space-y-6 text-white">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                >
                    <RiArrowLeftLine size={20} />
                </button>
                <h1 className="text-2xl font-bold">Add New Celebrity</h1>
            </div>

            {/* Form Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
                <CelebrityForm 
                    onSubmit={handleSubmit}
                    onCancel={() => router.back()}
                />
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        // Validate password requirements
        if (formData.newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        try {
            setLoading(true);
            const res = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to change password');
            }

            setSuccess('Password changed successfully');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (field: keyof typeof showPassword) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
                
                {/* Change Password Section */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Current Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <RiLockLine className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type={showPassword.current ? "text" : "password"}
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        currentPassword: e.target.value
                                    }))}
                                    required
                                    className="w-full pl-10 pr-12 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword.current ? (
                                        <RiEyeOffLine className="text-gray-400 hover:text-white" size={20} />
                                    ) : (
                                        <RiEyeLine className="text-gray-400 hover:text-white" size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <RiLockLine className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type={showPassword.new ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        newPassword: e.target.value
                                    }))}
                                    required
                                    minLength={8}
                                    className="w-full pl-10 pr-12 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword.new ? (
                                        <RiEyeOffLine className="text-gray-400 hover:text-white" size={20} />
                                    ) : (
                                        <RiEyeLine className="text-gray-400 hover:text-white" size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <RiLockLine className="text-gray-400" size={20} />
                                </div>
                                <input
                                    type={showPassword.confirm ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        confirmPassword: e.target.value
                                    }))}
                                    required
                                    className="w-full pl-10 pr-12 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword.confirm ? (
                                        <RiEyeOffLine className="text-gray-400 hover:text-white" size={20} />
                                    ) : (
                                        <RiEyeLine className="text-gray-400 hover:text-white" size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        {/* Success Message */}
                        {success && (
                            <p className="text-green-500 text-sm">{success}</p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Changing Password...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

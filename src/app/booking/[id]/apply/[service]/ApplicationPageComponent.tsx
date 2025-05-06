'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaArrowLeft, FaCalendarAlt, FaEnvelope, FaPhone, FaUser, FaBitcoin, FaUniversity } from 'react-icons/fa';

const ApplicationPageComponent = ({
    params,
  }: {
    params: { id: string; service: string };
  }) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const cardTypes = [
      {
        id: 'bronze',
        name: 'Standard / Bronze Card',
        price: 99,
        features: ['Basic access to events', 'Digital autograph', 'Monthly newsletter']
      },
      {
        id: 'silver',
        name: 'Silver Fan Card',
        price: 199,
        features: ['Priority event access', 'Physical card', 'Quarterly meet & greet', 'Exclusive content']
      },
      {
        id: 'gold',
        name: 'Gold Fan Card',
        price: 499,
        features: ['VIP event access', 'Premium card', 'Monthly meet & greet', 'Exclusive merchandise']
      },
      {
        id: 'platinum',
        name: 'Platinum / Elite Fan Card',
        price: 999,
        features: ['All-access pass', 'Limited edition card', 'Weekly meet & greet', 'Personal concierge']
      },
      {
        id: 'event',
        name: 'Event-Based Fan Card',
        price: 299,
        features: ['Single event VIP access', 'Collectible card', 'Event photo opportunity', 'Backstage tour']
      }
    ];
  
    const donationAmounts = [
      { value: '50', label: '$50' },
      { value: '100', label: '$100' },
      { value: '250', label: '$250' },
      { value: '500', label: '$500' },
      { value: 'custom', label: 'Custom Amount' }
    ];
  
    const paymentMethods = [
      {
        id: 'crypto',
        name: 'Cryptocurrency',
        icon: FaBitcoin,
        description: 'Pay with Bitcoin, Ethereum, or other major cryptocurrencies'
      },
      {
        id: 'bank',
        name: 'Bank Transfer',
        icon: FaUniversity,
        description: 'Direct bank transfer to our secure account'
      }
    ];
  
    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      phone: '',
      date: '',
      cardType: '',
      budget: '',
      donationAmount: '',
      customAmount: '',
      subscriptionPlan: '',
      subscriptionDuration: '',
      paymentMethod: '',
      message: ''
    });
  
    const handleDonationChange = (value: string) => {
      setFormData(prev => ({
        ...prev,
        donationAmount: value,
        customAmount: value === 'custom' ? prev.customAmount : ''
      }));
    };
  
    const [celebrity, setCelebrity] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchCelebrity = async () => {
        try {
          const res = await fetch(`/api/celebrities/id/${params.id}`);
          if (!res.ok) {
            throw new Error('Failed to fetch celebrity');
          }
          const data = await res.json();
          setCelebrity(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load celebrity');
        } finally {
          setLoading(false);
        }
      };

      fetchCelebrity();
    }, [params.id]);
  
    const serviceInfo = {
      'meet-greet': {
        title: 'Meet & Greet Application',
        description: 'Apply for a personal one-on-one meeting with photo opportunities and autograph session.',
        applicationUrl: '#'
      },
      'vip-card': {
        title: 'VIP Fan Card Application',
        description: 'Apply for an exclusive membership card with priority access to events and special content.',
        applicationUrl: '#'
      },
      'subscription': {
        title: 'Subscription Application',
        description: 'Subscribe to receive regular updates and exclusive content from your favorite celebrity.',
        applicationUrl: '#'
      },
      'donate': {
        title: 'Donation Application',
        description: 'Support charitable causes through your favorite celebrity.',
        applicationUrl: '#'
      }
    }[params.service];
  
    if (!serviceInfo) {
      router.push(`/booking/${params.id}`);
      return null;
    }
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        // Create booking
        const bookingPayload = {
          celebrityId: params.id,
          service: params.service === 'meet-greet' ? 'meet-and-greet' : 
                  params.service === 'vip-card' ? 'vip-fan-cards' : 
                  params.service === 'subscription' ? 'subscription' : 'donation',
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          date: formData.date || new Date(),
          amount: params.service === 'donate' ? 
                 parseFloat(formData.donationAmount === 'custom' ? formData.customAmount : formData.donationAmount) :
                 params.service === 'vip-card' ? 
                 cardTypes.find(card => card.id === formData.cardType)?.price || 0 :
                 params.service === 'subscription' ? 
                 formData.subscriptionPlan === 'monthly' ? (celebrity?.monthly || 9.99) :
                 formData.subscriptionPlan === 'quarterly' ? (celebrity?.quarterly || 24.99) :
                 formData.subscriptionPlan === 'annual' ? (celebrity?.annual || 89.99) : (celebrity?.monthly || 9.99) :
                 params.service === 'meet-greet' ? 
                 formData.budget || 0 : 0,
          notes: formData.message,
          paymentMethod: formData.paymentMethod === 'crypto' ? 'credit_card' : 'bank',
          metadata: {
            serviceType: params.service,
            ...(params.service === 'vip-card' ? { cardType: formData.cardType } : {}),
            ...(params.service === 'subscription' ? { 
              subscriptionPlan: formData.subscriptionPlan,
              subscriptionDuration: formData.subscriptionPlan === 'monthly' ? '1 month' :
                                   formData.subscriptionPlan === 'quarterly' ? '3 months' : '12 months',
              renewalDate: new Date(new Date().setMonth(
                new Date().getMonth() + (formData.subscriptionPlan === 'monthly' ? 1 : 
                                         formData.subscriptionPlan === 'quarterly' ? 3 : 12)
              )).toISOString()
            } : {}),
            ...(params.service === 'donate' ? { 
              donationAmount: formData.donationAmount === 'custom' ? 
                parseFloat(formData.customAmount) : 
                parseFloat(formData.donationAmount)
            } : {})
          }
        };

        console.log('Sending booking:', bookingPayload);

        const bookingRes = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingPayload)
        });

        if (!bookingRes.ok) {
          throw new Error('Failed to create booking');
        }

        setIsSubmitted(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to submit application');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Hero Section */}
        <div className="relative h-[30vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 z-10" />
          <Image
            src={celebrity?.imageUrl}
            alt={celebrity?.name}
            fill
            className="object-cover"
            priority
          />
        </div>
  
        <div className="container mx-auto px-4 py-12">
          {/* Back Button */}
          <Link
            href={`/booking/${params.id}`}
            className="inline-flex items-center text-gray-400 hover:text-white mb-8 group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Options
          </Link>
  
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">{serviceInfo.title}</h1>
                <p className="text-xl text-gray-300">{serviceInfo.description}</p>
              </div>
  
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-white mb-2">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
  
                  {/* Email */}
                  <div>
                    <label className="block text-white mb-2">Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
  
                  {/* Phone */}
                  <div>
                    <label className="block text-white mb-2">Phone Number</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
  
                  {params.service === 'donate' && (
                    <div className="space-y-8">
                      <label className="block text-white mb-4">Select Donation Amount</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        {donationAmounts.map((amount) => (
                          <button
                            key={amount.value}
                            type="button"
                            onClick={() => handleDonationChange(amount.value)}
                            className={`px-4 py-3 rounded-lg text-center transition-all duration-300 ${formData.donationAmount === amount.value
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : 'bg-white/5 text-gray-300 hover:bg-white/10'
                              }`}
                          >
                            {amount.label}
                          </button>
                        ))}
                      </div>
  
                      {formData.donationAmount === 'custom' && (
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</div>
                          <input
                            type="number"
                            required
                            min="1"
                            value={formData.customAmount}
                            onChange={(e) => setFormData({ ...formData, customAmount: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-white/5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter custom amount"
                          />
                        </div>
                      )}
                      
                      <p className="text-gray-400 text-sm">
                        100% of your donation will go to the celebrity's chosen charity
                      </p>
                    </div>
                  )}
  
                  {params.service === 'meet-greet' && (
                    <div>
                      <label className="block text-white mb-2">Your Budget (USD)</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</div>
                        <input
                          type="number"
                          required
                          min="100"
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-white/5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter your budget"
                        />
                      </div>
                      <p className="text-gray-400 text-sm mt-2">Minimum budget: $100</p>
                    </div>
                  )}
  
                  {params.service === 'subscription' && (
                    <div>
                      <label className="block text-white mb-4">Select Subscription Plan</label>
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          {
                            id: 'monthly',
                            name: 'Monthly Plan',
                            price: celebrity?.monthly || 9.99,
                            period: 'month',
                            features: ['Exclusive content updates', 'Monthly newsletter', 'Digital photos']
                          },
                          {
                            id: 'quarterly',
                            name: 'Quarterly Plan',
                            price: celebrity?.quarterly || 24.99,
                            period: '3 months',
                            features: ['All monthly benefits', 'Quarterly video messages', 'Early access to events']
                          },
                          {
                            id: 'annual',
                            name: 'Annual Plan',
                            price: celebrity?.annual || 89.99,
                            period: 'year',
                            features: ['All quarterly benefits', 'Birthday message', 'Exclusive merchandise', '10% off other services']
                          }
                        ].map((plan) => (
                          <label
                            key={plan.id}
                            className={`relative block p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                              formData.subscriptionPlan === plan.id
                                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500'
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            <input
                              type="radio"
                              name="subscriptionPlan"
                              value={plan.id}
                              checked={formData.subscriptionPlan === plan.id}
                              onChange={(e) => setFormData({ ...formData, subscriptionPlan: e.target.value })}
                              className="sr-only"
                              required
                            />
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-semibold text-white">{plan.name}</h4>
                              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-transparent bg-clip-text">
                                ${plan.price}/{plan.period}
                              </span>
                            </div>
                            <ul className="text-sm text-gray-400 list-disc pl-5 space-y-1">
                              {plan.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                            {formData.subscriptionPlan === plan.id && (
                              <div className="mt-4 p-3 bg-amber-500/10 rounded-lg">
                                <p className="text-amber-300 text-sm">
                                  Your subscription will automatically renew every {plan.period} unless canceled.
                                  First payment today, next payment on {new Date(new Date().setMonth(
                                    new Date().getMonth() + (plan.id === 'monthly' ? 1 : plan.id === 'quarterly' ? 3 : 12)
                                  )).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </label>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-white/5 rounded-lg">
                        <h4 className="text-white font-medium mb-2">Subscription Benefits</h4>
                        <ul className="text-gray-300 space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span>Exclusive content directly from {celebrity?.name}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span>Early access to new events and appearances</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-400 mt-1">•</span>
                            <span>Special subscriber-only discounts on merchandise and other services</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {params.service === 'vip-card' && (
                    <div>
                      <label className="block text-white mb-4">Select Card Type</label>
                      <div className="grid grid-cols-1 gap-4">
                        {cardTypes.map((card) => (
                          <label
                            key={card.id}
                            className={`relative block p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                              formData.cardType === card.id
                                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500'
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            <input
                              type="radio"
                              name="cardType"
                              value={card.id}
                              checked={formData.cardType === card.id}
                              onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
                              className="sr-only"
                              required
                            />
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-semibold text-white">{card.name}</h4>
                              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                                ${celebrity[card.id]}
                              </span>
                            </div>
                            <ul className="text-sm text-gray-400 list-disc pl-5 space-y-1">
                              {card.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
  
                  {/* Preferred Date */}
                  <div>
                    <label className="block text-white mb-2">Preferred Date</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
  
                  {/* Payment Method */}
                  <div>
                    <label className="block text-white mb-4">Select Payment Method</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                          <label
                            key={method.id}
                            className={`relative block p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                              formData.paymentMethod === method.id
                                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500'
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={formData.paymentMethod === method.id}
                              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                              className="sr-only"
                              required
                            />
                            <div className="flex items-center gap-3 mb-2">
                              <Icon className="w-6 h-6 text-gray-400" />
                              <span className="text-lg font-semibold text-white">{method.name}</span>
                            </div>
                            <p className="text-sm text-gray-400 pl-9">{method.description}</p>
                          </label>
                        );
                      })}
                    </div>
                  </div>
  
                  {/* Additional Message */}
                  <div>
                    <label className="block text-white mb-2">Additional Message (Optional)</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-4 bg-white/5 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={4}
                      placeholder="Any specific requests or questions?"
                    />
                  </div>
  
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 mb-6">
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-semibold text-lg text-white transition-all duration-300 transform ${!isSubmitting && 'hover:from-purple-600 hover:to-pink-600 hover:-translate-y-1'} ${isSubmitting && 'opacity-50 cursor-not-allowed'}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Application Submitted Successfully!</h3>
                  <p className="text-gray-300 mb-6">
                    Thank you for your interest! Our support team will contact you within the next 4 hours to confirm your booking and provide additional details.
                  </p>
                  <Link
                    href="/"
                    className="inline-block px-8 py-4 bg-white/10 rounded-lg font-semibold text-white hover:bg-white/20 transition-all duration-300"
                  >
                    Return to Home
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}


export default ApplicationPageComponent
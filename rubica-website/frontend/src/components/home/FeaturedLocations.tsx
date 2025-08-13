'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { locationsApi } from '@/lib/api';
import { Location } from '@/types';
import { FiMapPin } from 'react-icons/fi';

export default function FeaturedLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await locationsApi.getLocations({ 
          type: 'city', 
          featured: true 
        });
        setLocations(response.locations.slice(0, 8));
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Fallback locations if API fails
  const fallbackLocations = [
    { _id: '1', name: 'Mumbai', slug: 'mumbai', adCount: 3200 },
    { _id: '2', name: 'Delhi', slug: 'delhi', adCount: 2800 },
    { _id: '3', name: 'Bangalore', slug: 'bangalore', adCount: 2100 },
    { _id: '4', name: 'Hyderabad', slug: 'hyderabad', adCount: 1600 },
    { _id: '5', name: 'Pune', slug: 'pune', adCount: 1400 },
    { _id: '6', name: 'Chennai', slug: 'chennai', adCount: 1200 },
    { _id: '7', name: 'Kolkata', slug: 'kolkata', adCount: 980 },
    { _id: '8', name: 'Ahmedabad', slug: 'ahmedabad', adCount: 750 },
  ];

  const displayLocations = locations.length > 0 ? locations : fallbackLocations;

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Popular Cities
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover services and people in major cities across the country
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayLocations.map((location) => (
            <Link
              key={location._id}
              href={`/ads?location=${location.slug}`}
              className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:from-primary-50 hover:to-primary-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center mb-3">
                <FiMapPin className="w-5 h-5 text-primary-600 mr-2" />
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                  {location.name}
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                {location.adCount || 0} ads available
              </p>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/locations"
            className="inline-flex items-center bg-secondary-100 text-secondary-900 px-8 py-3 rounded-xl font-semibold hover:bg-secondary-200 transition-colors"
          >
            <FiMapPin className="w-4 h-4 mr-2" />
            View All Cities
          </Link>
        </div>
      </div>
    </section>
  );
}
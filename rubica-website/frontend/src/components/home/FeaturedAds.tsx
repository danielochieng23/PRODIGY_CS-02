'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { adsApi } from '@/lib/api';
import { Ad } from '@/types';
import { FiStar, FiMapPin, FiEye, FiClock } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

export default function FeaturedAds() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedAds = async () => {
      try {
        const response = await adsApi.getAds({ 
          isFeatured: true, 
          limit: 8,
          sortBy: 'lastBumped'
        });
        setAds(response.ads);
      } catch (error) {
        console.error('Error fetching featured ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedAds();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-card animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FiStar className="w-6 h-6 text-accent-500 mr-2" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Featured Listings
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our premium verified listings from trusted service providers
          </p>
        </div>

        {/* Featured Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ads.map((ad) => (
            <Link
              key={ad._id}
              href={`/ads/${ad.slug}`}
              className="group bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Ad Image */}
              <div className="relative h-48 overflow-hidden">
                {ad.images && ad.images.length > 0 ? (
                  <Image
                    src={ad.images[0].url}
                    alt={ad.images[0].alt || ad.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
                
                {/* Featured Badge */}
                <div className="absolute top-3 right-3 bg-accent-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <FiStar className="w-3 h-3 mr-1" />
                  Featured
                </div>

                {/* Premium Badge */}
                {ad.isPremium && (
                  <div className="absolute top-3 left-3 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Premium
                  </div>
                )}
              </div>

              {/* Ad Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {ad.title}
                </h3>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  {ad.location?.name || 'Location not specified'}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <FiEye className="w-4 h-4 mr-1" />
                    {ad.views} views
                  </div>
                  <div className="flex items-center">
                    <FiClock className="w-4 h-4 mr-1" />
                    {formatDistanceToNow(new Date(ad.createdAt), { addSuffix: true })}
                  </div>
                </div>

                {/* Pricing */}
                {ad.pricing?.hourly && (
                  <div className="text-primary-600 font-semibold">
                    {ad.pricing.currency} {ad.pricing.hourly}/hour
                  </div>
                )}

                {/* Contact Name */}
                <div className="text-sm text-gray-600 mt-2">
                  Contact: {ad.contact.name}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/ads?isFeatured=true"
            className="inline-flex items-center bg-accent-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-accent-600 transition-colors"
          >
            <FiStar className="w-4 h-4 mr-2" />
            View All Featured Ads
          </Link>
        </div>
      </div>
    </section>
  );
}
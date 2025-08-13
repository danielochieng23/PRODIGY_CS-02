'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categoriesApi } from '@/lib/api';
import { Category } from '@/types';
import { 
  FiUsers, 
  FiHeart, 
  FiUser, 
  FiCamera, 
  FiMusic, 
  FiHome,
  FiBriefcase,
  FiStar
} from 'react-icons/fi';

// Icon mapping for categories
const categoryIcons: { [key: string]: React.ElementType } = {
  'escort-services': FiHeart,
  'massages': FiUsers,
  'male-escorts': FiUser,
  'entertainment': FiMusic,
  'photography': FiCamera,
  'accommodation': FiHome,
  'business': FiBriefcase,
  'default': FiStar
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getCategories();
        setCategories(response.categories.slice(0, 8)); // Show first 8 categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fallback categories if API fails
  const fallbackCategories = [
    { _id: '1', name: 'Escort Services', slug: 'escort-services', adCount: 2500 },
    { _id: '2', name: 'Massages', slug: 'massages', adCount: 1800 },
    { _id: '3', name: 'Male Escorts', slug: 'male-escorts', adCount: 950 },
    { _id: '4', name: 'Entertainment', slug: 'entertainment', adCount: 650 },
    { _id: '5', name: 'Photography', slug: 'photography', adCount: 450 },
    { _id: '6', name: 'Accommodation', slug: 'accommodation', adCount: 320 },
    { _id: '7', name: 'Business Services', slug: 'business', adCount: 280 },
    { _id: '8', name: 'Others', slug: 'others', adCount: 150 },
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;

  const getIcon = (slug: string) => {
    const IconComponent = categoryIcons[slug] || categoryIcons.default;
    return <IconComponent className="w-8 h-8" />;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-card animate-pulse">
                <div className="w-8 h-8 bg-gray-300 rounded mb-4"></div>
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Popular Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our most popular categories and find exactly what you're looking for
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {displayCategories.map((category) => (
            <Link
              key={category._id}
              href={`/ads?category=${category.slug}`}
              className="group bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {getIcon(category.slug)}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.adCount || 0} ads
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/categories"
            className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
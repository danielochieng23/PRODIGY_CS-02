import { Suspense } from 'react';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedLocations from '@/components/home/FeaturedLocations';
import FeaturedAds from '@/components/home/FeaturedAds';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section with Search */}
        <HeroSection />
        
        {/* Categories Section */}
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
          <CategoriesSection />
        </Suspense>
        
        {/* Featured Locations */}
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
          <FeaturedLocations />
        </Suspense>
        
        {/* Featured Ads */}
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <FeaturedAds />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}
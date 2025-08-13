import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, Star, Heart, Eye } from 'lucide-react';
import { useGetCategoryTreeQuery, useGetFeaturedCitiesQuery, useGetFeaturedListingsQuery } from '../store/api/apiSlice';

const HomePage = () => {
  const { data: categories, isLoading: categoriesLoading } = useGetCategoryTreeQuery();
  const { data: featuredCities, isLoading: citiesLoading } = useGetFeaturedCitiesQuery(8);
  const { data: featuredListings, isLoading: listingsLoading } = useGetFeaturedListingsQuery({ limit: 6 });

  const heroCategories = [
    {
      name: 'Call Girls',
      slug: 'call-girls',
      icon: '💋',
      color: 'from-pink-500 to-rose-500',
      description: 'Premium escort services'
    },
    {
      name: 'Massage',
      slug: 'massage',
      icon: '💆‍♀️',
      color: 'from-purple-500 to-violet-500',
      description: 'Relaxing massage therapy'
    },
    {
      name: 'Male Escorts',
      slug: 'male-escorts',
      icon: '🕺',
      color: 'from-blue-500 to-cyan-500',
      description: 'Gentleman companions'
    },
    {
      name: 'Transgender',
      slug: 'transgender',
      icon: '🌈',
      color: 'from-emerald-500 to-teal-500',
      description: 'Transgender companions'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"></div>
        <div className="relative container py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Find Your Perfect
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {' '}Companion
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Discover premium classified ads for escort services, massage therapy, and adult entertainment across India
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="search-bar flex-col sm:flex-row">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search for services, location, or category..."
                    className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-xl focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select className="pl-12 pr-8 py-4 text-lg border-0 rounded-xl focus:ring-2 focus:ring-yellow-400 bg-white">
                    <option>Select City</option>
                    <option>Mumbai</option>
                    <option>Delhi</option>
                    <option>Bangalore</option>
                    <option>Chennai</option>
                    <option>Kolkata</option>
                    <option>Hyderabad</option>
                  </select>
                </div>
                <button className="btn btn-primary btn-lg whitespace-nowrap">
                  <Search className="h-5 w-5" />
                  Search Now
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-blue-200">Active Ads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-blue-200">Cities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">5K+</div>
                <div className="text-blue-200">Verified Profiles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-blue-200">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Popular Categories</h2>
            <p className="text-xl text-gray-600">Browse through our most popular service categories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {heroCategories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="category-card group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600">{category.description}</p>
                <div className="mt-4 text-blue-600 font-medium group-hover:text-blue-700">
                  Browse Now →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20">
        <div className="container">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-4">Featured Listings</h2>
              <p className="text-xl text-gray-600">Premium ads from verified members</p>
            </div>
            <Link to="/listings" className="btn btn-outline">
              View All Listings
            </Link>
          </div>

          {listingsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="card-body">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredListings?.data?.slice(0, 6).map((listing) => (
                <Link
                  key={listing._id}
                  to={`/listing/${listing.slug}`}
                  className="card group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={listing.primaryImage?.url || '/api/placeholder/400/300'}
                      alt={listing.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                      <Eye className="inline h-3 w-3 mr-1" />
                      {listing.engagement?.views || 0}
                    </div>
                  </div>
                  <div className="card-body">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {listing.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {listing.shortDescription}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {listing.city?.name}
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        4.8
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-lg font-bold text-blue-600">
                        {listing.formattedPrice}
                      </div>
                      <button className="btn btn-sm btn-outline">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Popular Cities</h2>
            <p className="text-xl text-gray-600">Explore services in India's major cities</p>
          </div>

          {citiesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {featuredCities?.data?.map((city) => (
                <Link
                  key={city._id}
                  to={`/city/${city.slug}`}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                    {city.name.charAt(0)}
                  </div>
                  <div className="font-medium group-hover:text-blue-600 transition-colors">
                    {city.name}
                  </div>
                  <div className="text-sm text-gray-500">{city.state}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users. Post your ad today and connect with your ideal clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn btn-lg bg-white text-blue-600 hover:bg-gray-100">
              <Users className="h-5 w-5" />
              Create Account
            </Link>
            <Link to="/dashboard/create-listing" className="btn btn-lg btn-outline bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
              <Heart className="h-5 w-5" />
              Post Your Ad
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
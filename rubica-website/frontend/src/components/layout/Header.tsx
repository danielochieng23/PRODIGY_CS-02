'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { FiMenu, FiX, FiUser, FiPlus, FiSearch, FiMapPin } from 'react-icons/fi';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto">
        {/* Top Bar */}
        <div className="border-b border-gray-200 py-2">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <FiMapPin className="w-4 h-4 mr-1" />
                Select Location
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/help" className="hover:text-primary-600">
                Help
              </Link>
              <Link href="/safety" className="hover:text-primary-600">
                Safety Tips
              </Link>
              <Link href="/blog" className="hover:text-primary-600">
                Blog
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold text-xl">
              Rubica
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/ads"
              className="flex items-center text-gray-700 hover:text-primary-600 font-medium"
            >
              <FiSearch className="w-4 h-4 mr-2" />
              Browse Ads
            </Link>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center text-gray-700 hover:text-primary-600 font-medium"
                >
                  <FiUser className="w-4 h-4 mr-2" />
                  {user.firstName} {user.lastName}
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      href="/ads/my-ads"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Ads
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile Settings
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-secondary-100 text-secondary-900 px-4 py-2 rounded-md hover:bg-secondary-200 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <Link
              href="/ads/post"
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 font-medium flex items-center"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Post Ad
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/ads"
                className="flex items-center text-gray-700 hover:text-primary-600 font-medium"
                onClick={toggleMenu}
              >
                <FiSearch className="w-4 h-4 mr-2" />
                Browse Ads
              </Link>
              
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-primary-600 font-medium"
                    onClick={toggleMenu}
                  >
                    My Dashboard
                  </Link>
                  <Link
                    href="/ads/my-ads"
                    className="text-gray-700 hover:text-primary-600 font-medium"
                    onClick={toggleMenu}
                  >
                    My Ads
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-700 hover:text-primary-600 font-medium"
                    onClick={toggleMenu}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="text-left text-red-600 hover:text-red-700 font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-primary-600 font-medium"
                    onClick={toggleMenu}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="text-gray-700 hover:text-primary-600 font-medium"
                    onClick={toggleMenu}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              
              <Link
                href="/ads/post"
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 font-medium flex items-center justify-center"
                onClick={toggleMenu}
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Post Ad
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
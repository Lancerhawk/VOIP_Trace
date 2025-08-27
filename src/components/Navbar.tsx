'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';

interface User {
  id: number;
  email: string;
  username: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for storage events (when user signs in/out in another tab)
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check auth status when the page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuthStatus();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Remove dependencies to prevent infinite loop

  const checkAuthStatus = async () => {
    try {
      // First check if user is in guest mode
      const guestMode = document.cookie.includes('guest_mode=true');
      const guestUsername = document.cookie.split('guest_username=')[1]?.split(';')[0];
      
      if (guestMode && guestUsername) {
        setUser({
          id: 0, // Guest ID
          email: 'guest@voiptrace.guest',
          username: guestUsername
        });
        setIsLoading(false);
        return;
      }

      // If not guest mode, check regular authentication
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      startLoading(); // Start global loading
      
      // Check if user is in guest mode
      const guestMode = document.cookie.includes('guest_mode=true');
      
      if (guestMode) {
        // Clear guest cookies
        document.cookie = 'guest_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'guest_password=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'guest_username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'guest_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setUser(null);
        window.location.href = '/home';
        return;
      }
      
      // Regular logout for authenticated users
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });
      
      if (response.ok) {
        setUser(null);
        
        window.location.href = '/home';
      }
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      stopLoading(); 
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/home" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">VoIP Trace</span>
            </Link>
          </div>

          <div className="hidden md:flex ml-35 items-center">
            <div className="flex items-center space-x-8">
              <Link href="/home" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg">
                Home
              </Link>
              <Link href="/services" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg">
                Services
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg">
                Contact
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-4">
              {!isLoading && (
                <>
                  {user ? (
                    <div className="flex items-center space-x-4">
                      <Link href="/dashboard" className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                          <span className="text-white text-sm font-semibold">
                            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">Welcome, {user?.username || 'User'}</p>
                        </div>
                      </Link>
                      
                      <button
                        onClick={handleSignOut}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link href="/authpage/sign_in" className="text-gray-700 hover:text-blue-600 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-blue-50 rounded-lg">
                        Sign In
                      </Link>
                      <Link href="/authpage/sign_up" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5">
                        Get Started
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <Link href="/home" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium hover:bg-blue-50 rounded-lg transition-colors">
              Home
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium hover:bg-blue-50 rounded-lg transition-colors">
              Services
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium hover:bg-blue-50 rounded-lg transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium hover:bg-blue-50 rounded-lg transition-colors">
              Contact
            </Link>
            
            {/* Mobile Auth Section */}
            {!isLoading && (
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-3">
                    <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                        <span className="text-white text-sm font-semibold">
                          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">Welcome, {user?.username || 'User'}</p>
                      </div>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/authpage/sign_in" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium hover:bg-blue-50 rounded-lg transition-colors">
                      Sign In
                    </Link>
                    <Link href="/authpage/sign_up" className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

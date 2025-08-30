'use client';

import { useState, useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Database, 
  Monitor, 
  Settings, 
  BarChart3, 
  LogOut,
  User,
  Home,
  Shield,
  Activity
} from 'lucide-react';

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<{id: number; email: string; username: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        startLoading(); 
        
        const guestMode = document.cookie.includes('guest_mode=true');
        const guestUsername = document.cookie.split('guest_username=')[1]?.split(';')[0];
        
        if (guestMode && guestUsername) {
          setUser({
            id: 0, 
            email: 'guest@voiptrace.guest',
            username: guestUsername
          });
          setIsGuestMode(true);
          setShowGuestModal(true);
          
          if (pathname === '/dashboard') {
            window.location.href = '/dashboard/dataset_creator';
            return;
          }
          
          setIsLoading(false);
          stopLoading();
          return;
        }
        
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            window.location.href = '/home';
          }
        } else {
          window.location.href = '/home';
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        window.location.href = '/home';
      } finally {
        setIsLoading(false);
        stopLoading(); 
      }
    };

    checkAuthStatus();
  }, []);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Overview and quick actions',
      guestAccess: false
    },
    {
      name: 'Dataset Creator',
      href: '/dashboard/dataset_creator',
      icon: Database,
      description: 'Create and download datasets for analysis',
      guestAccess: true
    },
    {
      name: 'VOIP Monitor',
      href: '/dashboard/voip_monitor',
      icon: Monitor,
      description: 'Upload and analyze call data for suspicious activity',
      guestAccess: true
    },
    {
      name: 'Real-Time Tracking',
      href: '/dashboard/real_time_tracking',
      icon: Activity,
      description: 'Live packet analysis and network monitoring',
      guestAccess: false
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      description: 'View detailed analytics and reports',
      guestAccess: false
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      description: 'Manage account and system preferences',
      guestAccess: false
    }
  ];

  // Filter navigation based on guest mode
  const filteredNavigation = isGuestMode ? navigation.filter(item => item.guestAccess) : navigation;

  const handleSignOut = async () => {
    try {
      if (isGuestMode) {
        // Clear guest cookies for guest users
        document.cookie = 'guest_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'guest_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'guest_password=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'guest_username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/home';
      } else {
        // Regular sign out for verified users
        await fetch('/api/auth/signout', { method: 'POST' });
        window.location.href = '/home';
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">VOIP Trace</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

                     {/* User Info */}
           <div className="p-6 border-b border-slate-700">
             <div className="flex items-center space-x-3">
               <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                 <User className="w-6 h-6 text-white" />
               </div>
               <div>
                 <p className="text-sm font-semibold text-white">{user.username}</p>
                 <p className="text-xs text-slate-400">{user.email}</p>
                 {isGuestMode && (
                   <div className="flex items-center mt-1">
                     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                       <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                       </svg>
                       Guest Mode
                     </span>
                   </div>
                 )}
               </div>
             </div>
           </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:transform hover:scale-105'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className={`text-xs mt-1 transition-colors duration-200 ${
                      isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-300'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-700">
            <button
              onClick={handleSignOut}
              className="w-full cursor-pointer flex items-center px-4 py-3 text-sm font-medium text-slate-300 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-200 group"
            >
              <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-white transition-colors duration-200" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden backdrop-blur-sm " style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`lg:pl-72 transition-all duration-300 ease-in-out`}>
        <div className="lg:hidden bg-white shadow-lg border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">VOIP Trace</h1>
            <div className="w-8"></div>
          </div>
        </div>

                          <main className="min-h-screen">
           {children}
         </main>
       </div>

       {/* Guest Mode Modal */}
       {showGuestModal && isGuestMode && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" >
           <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}></div>
           <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
             <div className="text-center" >
               <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Shield className="w-8 h-8 text-white" />
               </div>
               
               <h2 className="text-2xl font-bold text-gray-900 mb-4">
                 Welcome to VOIP Trace!
               </h2>
               
               <p className="text-gray-600 mb-6">
                 You're currently using a guest account. To access all features and save your data permanently, please sign up for a verified account.
               </p>
               
               <div className="space-y-3">
                 <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                   <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                     <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                   </div>
                   <span className="text-sm text-green-800">Dataset Creator - Available</span>
                 </div>
                 
                 <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                   <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                     <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                     </svg>
                   </div>
                   <span className="text-sm text-green-800">VOIP Analysis - Available</span>
                 </div>
                 
                 <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                   <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                     <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   </div>
                   <span className="text-sm text-gray-600">Dashboard, Analytics & Settings</span>
                 </div>
               </div>
               
                               <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <button
                    onClick={() => {
                      // First sign out guest user, then navigate to sign up
                      if (isGuestMode) {
                        // Clear guest cookies
                        document.cookie = 'guest_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                        document.cookie = 'guest_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                        document.cookie = 'guest_password=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                        document.cookie = 'guest_username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                        // Navigate to sign up page
                        window.location.href = '/authpage/sign_up';
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Sign Up Now
                  </button>
                  
                  <button
                    onClick={() => setShowGuestModal(false)}
                    className="flex-1 cursor-pointer px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  >
                    Continue
                  </button>
                </div>
               
               <p className="text-xs text-gray-500 mt-4">
                 Guest data is temporary and will be lost when you close your browser
               </p>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 }
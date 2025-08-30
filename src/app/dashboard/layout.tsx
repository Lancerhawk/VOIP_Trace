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
  const [trialDaysLeft, setTrialDaysLeft] = useState(0);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        startLoading(); 
        
        const guestMode = document.cookie.includes('guest_mode=true');
        const guestUsername = document.cookie.split('guest_username=')[1]?.split(';')[0];
        
        if (guestMode && guestUsername) {
          // Check trial expiry
          const trialExpiryCookie = document.cookie.split('guest_trial_expiry=')[1]?.split(';')[0];
          if (trialExpiryCookie) {
            const trialExpiry = new Date(trialExpiryCookie);
            const now = new Date();
            const daysLeft = Math.ceil((trialExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysLeft <= 0) {
              // Trial expired, clear cookies and redirect
              document.cookie = 'guest_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              document.cookie = 'guest_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              document.cookie = 'guest_password=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              document.cookie = 'guest_username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              document.cookie = 'guest_trial_expiry=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
              window.location.href = '/home';
              return;
            }
            
            setTrialDaysLeft(daysLeft);
            setIsTrialExpired(false);
          } else {
            // No trial expiry found, set default 7 days
            setTrialDaysLeft(7);
            setIsTrialExpired(false);
          }
          
          setUser({
            id: 0, 
            email: 'guest@voiptrace.guest',
            username: guestUsername
          });
          setIsGuestMode(true);
          setShowGuestModal(true);
          
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
      description: 'Overview and quick actions'
    },
    {
      name: 'Dataset Creator',
      href: '/dashboard/dataset_creator',
      icon: Database,
      description: 'Create and download datasets for analysis'
    },
    {
      name: 'VOIP Monitor',
      href: '/dashboard/voip_monitor',
      icon: Monitor,
      description: 'Upload and analyze call data for suspicious activity'
    },
    {
      name: 'Real-Time Tracking',
      href: '/dashboard/real_time_tracking',
      icon: Activity,
      description: 'Live packet analysis and network monitoring'
    },
    {
      name: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      description: 'View detailed analytics and reports'
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      description: 'Manage account and system preferences'
    }
  ];

  // Show all navigation items for guest users during trial period
  const filteredNavigation = navigation;

  const handleSignOut = async () => {
    try {
      if (isGuestMode) {
        // Clear guest cookies for guest users
        document.cookie = 'guest_mode=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'guest_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'guest_password=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'guest_username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'guest_trial_expiry=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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
                     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                       <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                       </svg>
                       Guest User
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

       {/* Trial Modal */}
       {showGuestModal && isGuestMode && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto" >
           <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}></div>
           <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
             <div className="text-center" >
               <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                 <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               
               <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                 👤 Welcome, Guest User!
               </h2>
               
               <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-green-200">
                 <div className="text-4xl font-bold text-green-600 mb-2">
                   🎯
                 </div>
                 <div className="text-lg text-gray-700 mb-1">
                   Full Access
                 </div>
                 <div className="text-sm text-gray-600">
                   All features available to explore
                 </div>
               </div>
               
               <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                 You have full access to all VOIP Trace features! However, as a guest user, some limitations apply.
               </p>
               
               <div className="space-y-3 mb-4 sm:mb-6">
                 <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg border border-green-200">
                   <svg className="w-4 h-4 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                   <span className="text-sm text-green-800 font-medium">All Features Accessible</span>
                 </div>
                 
                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                   <div className="flex items-start space-x-2">
                     <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                     </svg>
                     <div className="flex-1 min-w-0">
                       <p className="text-xs sm:text-sm text-yellow-800 font-medium mb-1">Guest Mode Limitations:</p>
                       <ul className="text-xs text-yellow-700 space-y-0.5 sm:space-y-1">
                         <li>• Dashboard shows "Coming Soon" (no live data)</li>
                         <li>• Analysis reports cannot be saved permanently</li>
                         <li>• Settings changes are not saved</li>
                         <li>• All data lost when browser closes</li>
                       </ul>
                     </div>
                   </div>
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
                        document.cookie = 'guest_trial_expiry=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                        // Navigate to sign up page
                        window.location.href = '/authpage/sign_up';
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Sign Up to Continue
                  </button>
                  
                  <button
                    onClick={() => setShowGuestModal(false)}
                    className="flex-1 cursor-pointer px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  >
                    Start Exploring
                  </button>
                </div>
               
               <p className="text-xs text-gray-500 mt-4">
                 Trial data is temporary. Sign up to save your work permanently.
               </p>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 }
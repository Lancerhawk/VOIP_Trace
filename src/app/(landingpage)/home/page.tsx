'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 bg-opacity-20 text-black text-sm font-medium mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-blue-300 rounded-full mr-2 animate-pulse"></span>
              Secure VoIP Communications
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Monitor & Secure
              <span className="block bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Your VoIP Calls
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Advanced call logging, real-time monitoring, and comprehensive security for your business communications. 
              Protect your VoIP infrastructure with enterprise-grade solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/authpage/sign_up" 
                className="group relative px-8 py-4 bg-white text-blue-900 font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="relative z-10">Start Free Trial</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link 
                href="/services" 
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                View Features
              </Link>

              <button 
                onClick={() => {
                  const guestEmail = `guest_${Date.now()}@voiptrace.guest`;
                  const guestPassword = `guest_${Math.random().toString(36).substring(2, 15)}`;
                  
                  const trialExpiry = new Date();
                  trialExpiry.setDate(trialExpiry.getDate() + 7);
                  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
                  
                  document.cookie = `guest_email=${guestEmail}; path=/; max-age=${maxAge}`; 
                  document.cookie = `guest_password=${guestPassword}; path=/; max-age=${maxAge}`;
                  document.cookie = `guest_username=User; path=/; max-age=${maxAge}`; 
                  document.cookie = `guest_mode=true; path=/; max-age=${maxAge}`;
                  document.cookie = `guest_trial_expiry=${trialExpiry.toISOString()}; path=/; max-age=${maxAge}`; 
                  
                  window.location.href = '/dashboard';
                }}
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm cursor-pointer"
              >
                Try out the system with guest account
              </button>
            </div>
          </div>
        </div>
        
        {/* Cybersecurity Floating Elements */}
        {/* Floating Shield */}
        <div className="absolute top-32 left-16 w-16 h-16 text-blue-300/40 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
        </div>
        
        {/* Floating Lock */}
        <div className="absolute top-48 right-20 w-12 h-12 text-indigo-300/40 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z"/>
          </svg>
        </div>
        
        {/* Floating Eye (Monitoring) */}
        <div className="absolute bottom-32 left-24 w-14 h-14 text-cyan-300/40 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        </div>
        
        {/* Floating Network */}
        <div className="absolute bottom-40 right-32 w-16 h-16 text-purple-300/40 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}>
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        
        {/* Floating Key */}
        <div className="absolute top-64 left-32 w-12 h-12 text-green-300/40 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }}>
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
          </svg>
        </div>
        
        {/* Floating Alert Triangle */}
        <div className="absolute bottom-24 left-40 w-14 h-14 text-yellow-300/40 animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '3.8s' }}>
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 21h22L12 2 1 21zM13 18h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
        </div>
        
        {/* Floating Data Shield */}
        <div className="absolute top-20 right-40 w-16 h-16 text-blue-200/30 animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '4.2s' }}>
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zM12 11.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
          </svg>
        </div>
        
        {/* Floating Phone */}
        <div className="absolute bottom-16 right-16 w-12 h-12 text-indigo-200/30 animate-bounce" style={{ animationDelay: '1.8s', animationDuration: '3.6s' }}>
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </div>
        
        {/* Background Glow Effects */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-40 right-10 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 left-10 w-28 h-28 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-1500"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Enterprise-Grade VoIP Security
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive monitoring and security features designed for modern businesses
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Real-Time Analytics",
                description: "Monitor call quality, duration, and patterns with live dashboards and detailed reporting."
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Advanced Security",
                description: "Protect against fraud, DDoS attacks, and unauthorized access with enterprise security protocols."
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Instant Alerts",
                description: "Get notified immediately of suspicious activity, system issues, or performance degradation."
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "99.9%", label: "Uptime Guarantee" },
              { number: "24/7", label: "Support Available" },
              { number: "50K+", label: "Calls Monitored" },
              { number: "100+", label: "Enterprise Clients" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Secure Your VoIP Infrastructure?
          </h2>
          <p className="text-xl text-blue-100 mb-12">
            Join thousands of businesses that trust VoIP Trace for their communication security needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/authpage/sign_up" 
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-300 shadow-lg"
            >
              Get Started Free
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors duration-300"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
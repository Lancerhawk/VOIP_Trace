'use client';

import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      title: "Real-Time Packet Analysis",
      description: "Live network traffic monitoring with TShark integration for comprehensive VoIP analysis and threat detection.",
      features: [
        "Real-time packet capture and analysis",
        "TShark integration for deep packet inspection",
        "Live network traffic monitoring",
        "Automated packet forwarding"
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Threat Detection & Analysis",
      description: "Advanced detection rules for suspicious patterns, fraud detection, and anomalous communication behavior analysis.",
      features: [
        "6+ comprehensive detection rules",
        "Suspicious pattern recognition",
        "Fraud and bot network detection",
        "Real-time threat alerts"
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      color: "from-red-500 to-red-600"
    },
    {
      title: "Synthetic Data Generation",
      description: "Create realistic VoIP call datasets for testing and validation with configurable parameters and patterns.",
      features: [
        "Configurable dataset parameters",
        "Realistic user profiles and metadata",
        "Smart connection distribution",
        "VPN detection patterns"
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "from-green-500 to-green-600"
    },
    {
      title: "Comprehensive Reporting",
      description: "Generate detailed HTML reports for evidence documentation and case analysis for law enforcement use.",
      features: [
        "Detailed HTML analysis reports",
        "Evidence documentation",
        "Case analysis support",
        "Downloadable reports"
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Real-Time Monitoring Dashboard",
      description: "Live dashboard with real-time statistics, system monitoring, and activity tracking capabilities.",
      features: [
        "Real-time statistics display",
        "System status monitoring",
        "Activity tracking and logs",
        "Guest mode support"
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Secure Authentication",
      description: "Complete user management system with email verification, guest mode, and secure session handling.",
      features: [
        "Email-based registration and verification",
        "OTP verification system",
        "Guest mode for testing",
        "Secure session management"
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const pricingPlans = [
    {
      name: "Guest Access",
      price: "Free",
      period: "",
      description: "Try the system with guest mode for testing and evaluation",
      features: [
        "Full system access",
        "Real-time packet analysis",
        "Threat detection",
        "Synthetic data generation",
        "Comprehensive reporting",
        "7-day trial period"
      ],
      popular: true,
      cta: "Try Guest Mode"
    },
    {
      name: "Professional",
      price: "Contact Us",
      period: "",
      description: "Full access for law enforcement and security professionals",
      features: [
        "Complete system access",
        "Real-time monitoring",
        "Advanced threat detection",
        "Evidence reporting",
        "Technical support",
        "Custom configurations"
      ],
      popular: false,
      cta: "Contact Sales"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large organizations with specific requirements",
      features: [
        "Unlimited access",
        "Custom integrations",
        "Dedicated support",
        "Advanced compliance",
        "Custom SLAs",
        "Training and onboarding"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced VoIP analysis and security solutions for law enforcement, security professionals, and telecom administrators
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive VoIP analysis and security tools for law enforcement, security professionals, and telecom administrators
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Access Options
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the access level that fits your needs. All options include our core analysis and security features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-white p-8 rounded-2xl shadow-lg ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="text-center">
                  {plan.name === "Guest Access" ? (
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
                      className="w-full inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
                    >
                      {plan.cta}
                    </button>
                  ) : (
                    <Link 
                      href="/contact" 
                      className={`w-full inline-block px-6 py-3 font-semibold rounded-xl transition-colors duration-300 ${
                        plan.popular 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-12">
            Start analyzing VoIP communications with our comprehensive security platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/authpage/sign_up" 
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-300 shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors duration-300"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
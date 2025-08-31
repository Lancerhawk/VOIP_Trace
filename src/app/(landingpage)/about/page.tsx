'use client';

import Link from 'next/link';

export default function AboutPage() {
  const values = [
    {
      title: "Security First",
      description: "We prioritize security and privacy in everything we build. Our platform focuses on metadata-only analysis to ensure compliance while delivering powerful investigative tools.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Real-Time Analysis",
      description: "We provide real-time packet capture and analysis capabilities using TShark integration, enabling immediate threat detection and response.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Professional Focus",
      description: "We're dedicated to serving law enforcement, security professionals, and telecom administrators with tools designed for their specific investigative needs.",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    }
  ];

  const team = [
    {
      name: "Arin Jain",
      role: "Team Leader & Product Manager",
      bio: "Team leader with passion for innovative solutions. Hackathon winner and SIH finalist.",
      image: "./pics/arin.jpg"
    },
    {
      name: "Kartik Jain",
      role: "Research & Development",
      bio: "Research specialist and AI/ML enthusiast with focus on innovative solutions.",
      image: "./pics/kartik.jpg"
    },
    {
      name: "Shachi Shukla",
      role: "AI/ML Expert",
      bio: "AI/ML expert creating intelligent logic and algorithms for the system.",
      image: "./pics/shachi.jpg"
    },
    {
      name: "Arpit Shukla",
      role: "Frontend Developer",
      bio: "Frontend developer passionate about creating beautiful and responsive user interfaces.",
      image: ""
    },
    {
      name: "Aastha Singh",
      role: "Data Handler",
      bio: "Data specialist handling system data and creating comprehensive datasets for analysis.",
      image: ""
    }
  ];

  const milestones = [
    {
      year: "2025",
      title: "Platform Development",
      description: "Developed comprehensive VoIP analysis platform with real-time packet capture capabilities"
    },
    {
      year: "2025",
      title: "Core Features Implementation",
      description: "Implemented threat detection rules, synthetic data generation, and comprehensive reporting"
    },
    {
      year: "2025",
      title: "Real-Time Analysis",
      description: "Integrated TShark for live packet capture and analysis with MongoDB backend"
    },
    {
      year: "2025",
      title: "Security & Authentication",
      description: "Built secure authentication system with email verification and guest mode access"
    },
    {
      year: "2025",
      title: "Production Ready",
      description: "Deployed production-ready system with cloud deployment configuration and monitoring"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About VoIP Trace
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A prototype by <strong>Team Coding Era</strong> for the <strong>CIIS Hackathon</strong> - providing advanced VoIP analysis and security tools for law enforcement, security professionals, and telecom administrators
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-12 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">
                Our Story
              </h2>
              <div className="space-y-4 md:space-y-6 text-base md:text-lg text-gray-600 leading-relaxed">
                <p>
                  VoIP Trace is a prototype developed by <strong>Team Coding Era</strong> for the <strong>CIIS Hackathon</strong>. 
                  This comprehensive solution for VoIP call tracing and analysis is designed to help law enforcement and security 
                  professionals monitor and analyze suspicious communication patterns. Our platform combines real-time packet capture 
                  with advanced threat detection algorithms to provide actionable intelligence for investigations.
                </p>
                <p>
                  Built with modern technologies including Next.js, PostgreSQL, and TShark integration, our system provides real-time 
                  monitoring capabilities, comprehensive reporting, and advanced detection rules for identifying suspicious VoIP activities. 
                  We focus on metadata-only analysis to ensure privacy compliance while delivering powerful investigative tools.
                </p>
                <p>
                  As a hackathon prototype, this platform demonstrates the potential for serving security professionals, law enforcement 
                  agencies, and telecom administrators who need reliable tools for communication security analysis and threat detection 
                  in VoIP environments.
                </p>
              </div>
            </div>
            <div className="relative order-1 lg:order-2 mb-8 lg:mb-0 hidden md:block">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white">
                <div className="text-center">
                  <div className="text-4xl md:text-6xl font-bold mb-3 md:mb-4">6+</div>
                  <div className="text-lg md:text-xl mb-2">Detection Rules</div>
                  <div className="text-blue-100 text-sm md:text-base">Based on Database</div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Real-Time</div>
                  <div className="text-xs md:text-sm text-gray-600">Packet Analysis</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do and every decision we make
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              CIIS Hackathon 2025
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Meet Team Coding Era!
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The brilliant minds behind VoIP Trace's innovative security solutions for the CIIS Hackathon
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group relative h-full">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full flex flex-col">
                  <div className="relative mb-6 flex-shrink-0">
                    <div className="w-24 h-24 mx-auto relative">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-100 group-hover:border-blue-300 transition-colors duration-300"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {member.name}
                    </h3>
                    <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-medium rounded-full mb-3 flex-shrink-0">
                      {member.role}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                      {member.bio}
                    </p>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
          
          {/* Team Stats */}
          <div className="mt-20 bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  5
                </div>
                <div className="text-gray-600 font-medium">Team Members</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-indigo-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  3+
                </div>
                <div className="text-gray-600 font-medium">Technologies Used</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <div className="text-gray-600 font-medium">Databases</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  100%
                </div>
                <div className="text-gray-600 font-medium">Dedication</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
              Our Journey
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in our company's growth and development
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line - Hidden on mobile, visible on desktop */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-200 h-full"></div>
            
            <div className="space-y-8 md:space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row flex-col' : 'md:flex-row-reverse flex-col'}`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 md:w-6 md:h-6 bg-blue-600 rounded-full border-2 md:border-4 border-white shadow-lg"></div>
                  
                  {/* Content */}
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8 md:text-right text-left' : 'md:pl-8 text-left'} ml-8 md:ml-0`}>
                    <div className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg">
                      <div className="text-lg md:text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Team Coding Era - CIIS Hackathon
          </h2>
          <p className="text-xl text-blue-100 mb-12">
            A prototype solution for advanced VoIP analysis and security tools. Demonstrating innovation in cybersecurity for the CIIS Hackathon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-300 shadow-lg"
            >
              Get in Touch
            </Link>
            <Link 
              href="/authpage/sign_up" 
              className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors duration-300"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
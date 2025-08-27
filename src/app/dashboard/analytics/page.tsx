'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, Phone, Clock, MapPin, AlertTriangle, Activity, Zap } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="p-8 max-w-8xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive insights into VOIP call patterns and suspicious activity</p>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Zap className="w-12 h-12 text-purple-600" />
        </div>
        
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Analytics Coming Soon</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          We're building powerful analytics features to give you deep insights into your VOIP call patterns, 
          suspicious activity detection, and comprehensive reporting capabilities.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Real-time Analytics</h3>
            <p className="text-blue-700">Live dashboards with dynamic data from your database</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">Advanced Charts</h3>
            <p className="text-green-700">Interactive visualizations and trend analysis</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
            <AlertTriangle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Smart Insights</h3>
            <p className="text-purple-700">AI-powered pattern recognition and alerts</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Coming</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">Dynamic call volume charts</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">Suspicious activity heatmaps</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">User behavior analysis</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Geographic call patterns</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Time-based trend analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Custom report generation</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>In the meantime, use the Dataset Creator to generate test data and the VOIP Monitor to analyze it.</p>
        </div>
      </div>
    </div>
  );
}

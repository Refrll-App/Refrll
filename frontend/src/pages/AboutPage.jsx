

import React from 'react';
import { Users, Target, Zap, Heart, Shield, Rocket, CheckCircle, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      title: "Job Seekers",
      description: "Get referred faster and land interviews through trusted employee connections"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />,
      title: "Employee Referrers", 
      description: "Help your network while earning rewards for successful referrals"
    },
    {
      icon: <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
      title: "Companies",
      description: "Access pre-vetted talent through your employees' trusted networks"
    }
  ];

  const values = [
    { icon: <Shield className="w-6 h-6" />, title: "Trust & Transparency", color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30" },
    { icon: <Zap className="w-6 h-6" />, title: "Simplicity & Speed", color: "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/30" },
    { icon: <Heart className="w-6 h-6" />, title: "Empowerment for All", color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30" },
    { icon: <Users className="w-6 h-6" />, title: "Real Connections", color: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-full px-6 py-3 shadow-lg mb-8">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Revolutionizing Job Referrals</span>
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Refrll
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The referral-based job platform that connects job seekers, employee referrers, and companies in one powerful ecosystem. Making hiring faster, better, and more trustworthy.
            </p>
          </div>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Rocket className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To revolutionize job referrals by making it effortless for seekers to get referred and land jobs faster, 
              empowering employees to refer and earn while helping their networks, and enabling companies to tap into 
              high-quality referrals with unprecedented ease.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To simplify the referral hiring process, bridge the gap between job seekers and hidden opportunities 
              inside companies, and make hiring more authentic, trustworthy, and efficient for everyone involved.
            </p>
          </div>
        </div>

        {/* What We Do */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-3xl p-12 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What We Do</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We've built a comprehensive platform that transforms how referrals work in the hiring process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Allow job seekers to apply via employee referrals, not just company portals",
              "Let employees share or claim jobs from their companies to refer qualified candidates",
              "Enable companies to post jobs directly and receive referrals from employees within the platform",
              "Track application status transparently for all parties involved"
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-600">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Who We Serve */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Who We Serve</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our platform is designed for three key groups, each with unique needs and goals
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why We Exist */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-3xl p-12 text-white mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why We Exist</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
              We identified critical gaps in the traditional hiring process that needed solving
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Many jobs are never posted publicly and filled through internal referrals",
              "Job seekers struggle to find referrers within target companies",
              "Employees want an easy way to refer and earn recognition or rewards",
              "Companies want better hires faster, with lower attrition rates"
            ].map((reason, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm dark:bg-white/20 rounded-xl p-6 border border-white/20">
                <p className="text-white text-sm leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do at Refrll
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${value.color} mb-4`}>
                  {value.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{value.title}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-lg border border-gray-100 dark:border-gray-700 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Refrll was founded to solve the fundamental problem of hidden job opportunities and limited referral access. 
              We recognized that the best jobs often never make it to public job boards, instead being filled through 
              internal networks and employee referrals. Our passionate team set out to democratize these opportunities, 
              creating a platform where talent meets opportunity through the power of professional connections.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Built by professionals who understand the hiring landscape, we're committed to creating a more 
              transparent, efficient, and inclusive job market for everyone.
            </p>
          </div>
        </div>

        {/* Closing CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Shaping the Future of Hiring</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join us in revolutionizing how talent connects with opportunity. Through the power of referrals, 
              we're building a world where the right job finds you faster, and great talent never goes unnoticed.
            </p>
            <div className="flex items-center justify-center gap-2 text-lg font-semibold">
              <span>Ready to transform hiring?</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
        
      </div>
      <footer className="text-center py-2 text-sm text-gray-600 dark:text-gray-400">
        © 2025 Refrll. All rights reserved.
      </footer>
    </div>
  );
}
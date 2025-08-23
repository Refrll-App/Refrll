

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Zap, 
  Shield, 
  TrendingUp, 
  ArrowRight, 

  Star, 
 
  Sparkles,
  Target,
  Award,
  Clock,
  Building2,
  UserCheck,
  Briefcase,

} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import alok from '../assets/alok.jpeg'
import Pratik from '../assets/Pratik.jpg'
import kk from '../assets/kk.jpeg'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('seekers');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();

  const stats = [
    { number: '10,000+', label: 'Active Job Seekers', icon: <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" /> },
    { number: '500+', label: 'Partner Companies', icon: <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" /> },
    { number: '95%', label: 'Faster Hiring', icon: <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" /> },
    { number: '2.5x', label: 'Higher Success Rate', icon: <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" /> }
  ];

  const features = {
    seekers: [
      { icon: <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />, title: 'Get Referred Instantly', desc: 'Connect with employees who can refer you directly' },
      { icon: <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />, title: 'Skip the Queue', desc: 'Fast-track your application with employee endorsements' },
      { icon: <Target className="w-6 h-6 text-green-600 dark:text-green-400" />, title: 'Access Hidden Jobs', desc: 'Discover opportunities never posted publicly' }
    ],
    referrers: [
      { icon: <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />, title: 'Earn Rewards', desc: 'Every referral gets you closer to exclusive perks and rewards.' },
      { icon: <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />, title: 'Help Your Network', desc: 'Connect talented friends with great opportunities' },
      { icon: <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />, title: 'Simple Process', desc: 'Share jobs and refer candidates in just a few clicks' }
    ],
    companies: [
      { icon: <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />, title: 'Pre-vetted Talent', desc: 'Hire candidates endorsed by your trusted employees' },
      { icon: <TrendingUp className="w-6 h-6 text-teal-600 dark:text-teal-400" />, title: 'Faster Hiring', desc: 'Reduce time-to-hire by up to 75% with referrals' },
      { icon: <Building2 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />, title: 'Lower Attrition', desc: 'Referred employees stay 70% longer' }
    ]
  };

  const testimonials = [
    {
      name: 'Alok Kumar',
      role: 'Senior Executive',
      company: 'Pragma Edge Inc',
      image: `${alok}`,
      quote: 'Refrll turned my professional network into a source of opportunity. I\'ve helped friends get placed in roles they love, and in return, I\'ve received rewards and recognition. It\'s rare to find a platform where giving and gaining go hand in hand'
    },
    {
      name: 'Keerthana kurakula',
      role: 'Senior Associate',
      company: 'PwC',
      image: `${kk}`,
      quote: '“I love how easy it is to get started with Refrll. The referral process feels reliable and user-friendly. Can’t wait to see the job opportunities!”'
    },
    {
      name: 'Pratik singh',
      role: 'Specialist',
      company: 'PwC',
      image: `${Pratik}`,
      quote: 'Refrll made it so easy to get my resume in front of the right people. Instead of applying into a black hole, I know my application actually gets seen.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Job Seekers',
      price: 'Free',
      features: ['Unlimited job applications', 'Direct referral connections', 'Application tracking', 'Profile visibility'],
      cta: 'Start Job Hunting',
      popular: false,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Companies',
      price: '$99',
      period: '/month',
      features: ['Unlimited job postings', 'Employee referral management', 'Advanced analytics', 'Priority support'],
      cta: 'Start Hiring',
      popular: true,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Contact us',
      features: ['Custom integrations', 'Dedicated support', 'Advanced reporting', 'White-label options'],
      cta: 'Contact Sales',
      popular: false,
      gradient: 'from-green-500 to-green-600'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="pt-12 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMWY1ZjkiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 dark:opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-8 border border-white/50 dark:border-gray-700">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">The Future of Job Referrals</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight dark:text-white">
              Land Your Dream Job
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Through Referrals
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Connect with employees who can refer you directly. Skip the application black hole and get your resume 
              in front of hiring managers 10x faster with trusted referrals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer" onClick={()=>navigate('/login')} >
                Start Job Hunting <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Hero Image/Video Placeholder */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-2xl border border-white/50 dark:border-gray-700">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900/50 dark:to-purple-900/50 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg">
                <Briefcase className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Built for Everyone in the Hiring Ecosystem
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Whether you're looking for a job, helping others find opportunities, or hiring top talent - 
              we've got you covered.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-2 shadow-lg border border-gray-100 dark:border-gray-600">
              {[
                { key: 'seekers', label: 'Job Seekers', icon: <Users className="w-5 h-5" /> },
                { key: 'referrers', label: 'Referrers', icon: <UserCheck className="w-5 h-5" /> },
                { key: 'companies', label: 'Companies', icon: <Building2 className="w-5 h-5" /> }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-600'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {features[activeTab].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl mb-6 text-blue-600 dark:text-blue-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">How Refrll Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get started in minutes and transform your hiring process forever
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                desc: 'Sign up and build your professional profile with skills, experience, and preferences',
                icon: <UserCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              },
              {
                step: '02', 
                title: 'Get Connected',
                desc: 'Browse jobs and connect with employees who can refer you to their companies',
                icon: <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              },
              {
                step: '03',
                title: 'Land the Job',
                desc: 'Get referred, fast-track your application, and land interviews 10x faster',
                icon: <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6">
                    {step.icon}
                  </div>
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2">STEP {step.step}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">What Our Users Say</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Be among the first to discover referral-powered careers with Refrll
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-1 mb-6 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-xl text-gray-700 dark:text-gray-300 text-center mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              
              <div className="flex items-center justify-center gap-4">
                <img 
                  src={testimonials[currentTestimonial].image} 
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-600 dark:text-gray-400">{testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}</div>
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Join the founding wave of professionals transforming careers with Refrll.
            Your next opportunity is just one connection away.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300" 
              onClick={()=>navigate('/login')}
            >
              Start Free Today
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-2xl font-bold">Refrll</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Revolutionizing job referrals to connect talent with opportunity through the power of professional networks.
              </p>
              {/* <div className="flex gap-4">
                {[MessageCircle, Globe, Users].map((Icon, index) => (
                  <div key={index} className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div> */}
                <div className="flex space-x-4">
                <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-indigo-100 transition-colors">
                  <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
              
                <button onClick={()=>window.open('  https://www.instagram.com/refrll_/?igsh=MjF2cG83cTBwN2po#')}  className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-indigo-100 transition-colors cursor-pointer">
                  <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </button>
                <button onClick={()=>window.open('https://www.linkedin.com/company/refrll/about/?viewAsMember=true')} className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-indigo-100 transition-colors cursor-pointer">
                  <svg className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-6">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-6">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="/contact" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 Refrll. All rights reserved.</p>
            <p className="text-gray-400">Made with ❤️ for job seekers everywhere</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Lock,User,Database,Shield,Mail,Globe,Settings } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const [activeSection, setActiveSection] = useState('all');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setDarkMode(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header with theme toggle */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex items-center mb-6 md:mb-0">
            <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mr-4`}>
              <Lock className="h-10 w-10 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Refrll Privacy Policy</h1>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Effective Date: September 10, 2023
              </p>
            </div>
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className={`flex items-center px-4 py-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'} shadow transition-colors`}
          >
            {darkMode ? (
              <>
                <Globe className="mr-2 text-yellow-400" />
                Switch to Light Mode
              </>
            ) : (
              <>
                <Globe className="mr-2 text-gray-700" />
                Switch to Dark Mode
              </>
            )}
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:w-1/4">
            <div className={`rounded-2xl shadow-lg p-6 sticky top-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Policy Sections</h2>
              <nav>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveSection('all')}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center ${
                        activeSection === 'all'
                          ? `${darkMode ? 'bg-indigo-900 text-indigo-100' : 'bg-indigo-50 text-indigo-700'}`
                          : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                      }`}
                    >
                      <Database className="mr-3" />
                      All Sections
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveSection('collection')}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center ${
                        activeSection === 'collection'
                          ? `${darkMode ? 'bg-indigo-900 text-indigo-100' : 'bg-indigo-50 text-indigo-700'}`
                          : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                      }`}
                    >
                      <User className="mr-3" />
                      Information Collection
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveSection('usage')}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center ${
                        activeSection === 'usage'
                          ? `${darkMode ? 'bg-indigo-900 text-indigo-100' : 'bg-indigo-50 text-indigo-700'}`
                          : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                      }`}
                    >
                      <Settings className="mr-3" />
                      Data Usage
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveSection('sharing')}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center ${
                        activeSection === 'sharing'
                          ? `${darkMode ? 'bg-indigo-900 text-indigo-100' : 'bg-indigo-50 text-indigo-700'}`
                          : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                      }`}
                    >
                      <Shield className="mr-3" />
                      Data Sharing
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveSection('rights')}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center ${
                        activeSection === 'rights'
                          ? `${darkMode ? 'bg-indigo-900 text-indigo-100' : 'bg-indigo-50 text-indigo-700'}`
                          : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                      }`}
                    >
                      <Mail className="mr-3" />
                      Your Rights
                    </button>
                  </li>
                </ul>
              </nav>
              
              <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Need Assistance?</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Contact our privacy team at privacy@refrll.com for any questions about your data.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className={`rounded-2xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Introduction */}
              <div className={`p-8 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-start">
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-indigo-50'} mr-5`}>
                    <Lock className="h-8 w-8 text-indigo-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-3">Our Commitment to Your Privacy</h2>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Refrll respects your privacy and is committed to protecting your personal data. 
                      This policy explains how we collect, use, and protect your information when you use 
                      our referral-based job platform.
                    </p>
                  </div>
                </div>
              </div>

              {/* Policy Sections */}
              <div className="divide-y divide-gray-100">
                {/* Section 1 */}
                <div 
                  id="collection"
                  className={`p-8 transition-all ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-indigo-50'} ${activeSection === 'all' || activeSection === 'collection' ? 'opacity-100' : 'opacity-60'}`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-5 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                      <span className={`text-lg font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">Information We Collect</h3>
                      <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <p className="mb-3">
                          To provide our services, we collect the following types of information:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            <span className="font-medium">Personal Identification:</span> Name, email, phone number, 
                            location, and profile photo
                          </li>
                          <li>
                            <span className="font-medium">Professional Details:</span> Skills, work experience, 
                            education history, resume/CV
                          </li>
                          <li>
                            <span className="font-medium">Social Profiles:</span> LinkedIn and GitHub profiles when provided
                          </li>
                          <li>
                            <span className="font-medium">Platform Activity:</span> Job applications, referral activities, 
                            and account preferences
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div 
                  id="usage"
                  className={`p-8 transition-all ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-indigo-50'} ${activeSection === 'all' || activeSection === 'usage' ? 'opacity-100' : 'opacity-60'}`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-5 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                      <span className={`text-lg font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">How We Use Your Data</h3>
                      <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <p className="mb-3">
                          Your information helps us create a seamless job referral experience:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            <span className="font-medium">Matching Opportunities:</span> Connect job seekers with relevant 
                            referrers and companies
                          </li>
                          <li>
                            <span className="font-medium">Platform Operations:</span> Facilitate job applications and 
                            referral processes
                          </li>
                          <li>
                            <span className="font-medium">Communication:</span> Send important notifications about applications, 
                            referrals, and platform updates
                          </li>
                          <li>
                            <span className="font-medium">Service Improvement:</span> Analyze usage patterns to enhance platform 
                            features and user experience
                          </li>
                          <li>
                            <span className="font-medium">Security:</span> Monitor for fraudulent activity and protect against 
                            unauthorized access
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3 */}
                <div 
                  id="sharing"
                  className={`p-8 transition-all ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-indigo-50'} ${activeSection === 'all' || activeSection === 'sharing' ? 'opacity-100' : 'opacity-60'}`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-5 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                      <span className={`text-lg font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">Data Sharing</h3>
                      <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <p className="mb-3">
                          We respect your privacy and limit data sharing to what's necessary for our services:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            <span className="font-medium">Job Applications:</span> When you apply for a position, we share 
                            your application materials with the relevant company and referrer
                          </li>
                          <li>
                            <span className="font-medium">Service Providers:</span> We work with trusted partners for hosting, 
                            analytics, and customer support (under strict confidentiality agreements)
                          </li>
                          <li>
                            <span className="font-medium">Legal Requirements:</span> We may disclose information if required by law 
                            or to protect our rights and safety
                          </li>
                          <li>
                            <span className="font-medium">Business Transfers:</span> In case of merger or acquisition, user data 
                            may be transferred as a business asset
                          </li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                          <p className="font-medium flex items-start">
                            <Shield className={`mr-2 mt-1 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            <span>We do not sell your personal data to third parties for marketing purposes.</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4 */}
                <div 
                  id="security"
                  className={`p-8 transition-all ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-indigo-50'}`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-5 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                      <span className={`text-lg font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>4</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">Data Security</h3>
                      <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <p className="mb-3">
                          Protecting your information is our top priority:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            <span className="font-medium">Encryption:</span> All data transmissions use SSL/TLS encryption
                          </li>
                          <li>
                            <span className="font-medium">Access Controls:</span> Strict role-based access to personal information
                          </li>
                          <li>
                            <span className="font-medium">Security Audits:</span> Regular vulnerability testing and security assessments
                          </li>
                          <li>
                            <span className="font-medium">Data Storage:</span> Secure cloud storage with industry-leading providers
                          </li>
                          <li>
                            <span className="font-medium">Incident Response:</span> Established procedures for addressing potential breaches
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 5 */}
                <div 
                  id="rights"
                  className={`p-8 transition-all ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-indigo-50'} ${activeSection === 'all' || activeSection === 'rights' ? 'opacity-100' : 'opacity-60'}`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-5 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                      <span className={`text-lg font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>5</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">Your Rights</h3>
                      <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <p className="mb-3">
                          You have control over your personal information:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            <span className="font-medium">Access:</span> Request a copy of the personal data we hold about you
                          </li>
                          <li>
                            <span className="font-medium">Correction:</span> Update or correct inaccurate information
                          </li>
                          <li>
                            <span className="font-medium">Deletion:</span> Request deletion of your personal data in certain circumstances
                          </li>
                          <li>
                            <span className="font-medium">Data Portability:</span> Receive your data in a structured, machine-readable format
                          </li>
                          <li>
                            <span className="font-medium">Consent Withdrawal:</span> Withdraw consent for data processing where applicable
                          </li>
                        </ul>
                        <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                          <p className="font-medium flex items-start">
                            <Mail className={`mr-2 mt-1 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                            <span>To exercise these rights, contact us at privacy@refrll.com</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 6 */}
                <div 
                  id="cookies"
                  className={`p-8 transition-all ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-indigo-50'}`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-5 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                      <span className={`text-lg font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>6</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">Cookies & Tracking</h3>
                      <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <p className="mb-3">
                          We use cookies and similar technologies to enhance your experience:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            <span className="font-medium">Essential Cookies:</span> Required for core platform functionality
                          </li>
                          <li>
                            <span className="font-medium">Analytics:</span> Understand how users interact with our platform
                          </li>
                          <li>
                            <span className="font-medium">Preferences:</span> Remember your settings and preferences
                          </li>
                          <li>
                            <span className="font-medium">Performance:</span> Monitor and improve platform performance
                          </li>
                        </ul>
                        <p className="mt-4">
                          You can manage cookie preferences through your browser settings. Disabling some cookies 
                          may affect platform functionality.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 7 */}
                <div 
                  id="changes"
                  className={`p-8 transition-all ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-indigo-50'}`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-5 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                      <span className={`text-lg font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>7</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">Changes to This Policy</h3>
                      <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <p className="mb-3">
                          We may update this privacy policy to reflect changes in our practices:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            <span className="font-medium">Notification:</span> Significant changes will be communicated through 
                            platform notifications or email
                          </li>
                          <li>
                            <span className="font-medium">Review:</span> The "Effective Date" at the top indicates when the policy 
                            was last revised
                          </li>
                          <li>
                            <span className="font-medium">Continued Use:</span> Your continued use of Refrll after changes 
                            constitutes acceptance of the updated policy
                          </li>
                        </ul>
                        <p className="mt-4">
                          We encourage you to periodically review this page for the latest information on our privacy practices.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acceptance Section */}
              <div className={`p-8 ${darkMode ? 'bg-gray-900' : 'bg-indigo-50'}`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Your Privacy Matters</h3>
                    <p className={`max-w-md ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      By using Refrll, you acknowledge you've read and understood how we protect and use your information.
                    </p>
                  </div>
                  <button className={`px-8 py-3 rounded-xl font-medium shadow-lg transition-all flex items-center ${
                    darkMode 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700' 
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                  }`}>
                    <Lock className="mr-2" />
                    I Understand the Privacy Policy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
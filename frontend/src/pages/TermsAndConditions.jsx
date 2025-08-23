import { useState } from 'react';

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('all');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg inline-block">
              <div className="bg-white p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Refrll Terms & Conditions</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Last updated: September 10, 2023. By using Refrll, you agree to these terms governing your use of our referral-based job platform.
          </p>
        </header>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Navigation */}
          <div className="md:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Sections</h2>
              <nav>
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => setActiveSection('all')}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeSection === 'all' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      All Terms
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveSection('platform')}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeSection === 'platform' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Platform Use
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveSection('account')}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeSection === 'account' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Account Responsibility
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveSection('referrals')}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeSection === 'referrals' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Referrals & Applications
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveSection('conduct')}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeSection === 'conduct' ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Prohibited Conduct
                    </button>
                  </li>
                </ul>
              </nav>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Need help understanding these terms? Contact us at support@refrll.com
                </p>
              </div>
            </div>
          </div>

          {/* Terms Content */}
          <div className="md:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Introduction */}
              <div className="p-8 border-b border-gray-200">
                <p className="text-gray-700 mb-4">
                  Welcome to Refrll! These Terms and Conditions govern your use of our referral-based job platform. 
                  By accessing or using Refrll, you agree to be bound by these terms.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Last updated: September 10, 2023
                </div>
              </div>

              {/* Terms List */}
              <div className="divide-y divide-gray-100">
                {/* Term 1 */}
                <div className={`p-8 transition-all ${activeSection === 'all' || activeSection === 'platform' ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                      <span className="text-indigo-800 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Use of Platform</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Refrll is a referral-based job platform connecting job seekers, referrers, and companies.</li>
                        <li>Users must provide accurate information and act responsibly when using the platform.</li>
                        <li>All users must comply with applicable laws and regulations.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Term 2 */}
                <div className={`p-8 transition-all ${activeSection === 'all' || activeSection === 'account' ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                      <span className="text-indigo-800 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Account Responsibility</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Each user is responsible for maintaining the confidentiality of their account credentials.</li>
                        <li>Any activity under your account is your responsibility.</li>
                        <li>You must notify us immediately of any unauthorized use of your account.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Term 3 */}
                <div className={`p-8 transition-all ${activeSection === 'all' || activeSection === 'referrals' ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                      <span className="text-indigo-800 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Referrals & Applications</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Referrers can claim jobs from their company and share them as referral postings.</li>
                        <li>Job seekers apply directly via referral or company postings.</li>
                        <li>Refrll is not responsible for employment outcomes, hiring decisions, or job offers.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Term 4 */}
                <div className={`p-8 transition-all ${activeSection === 'all' || activeSection === 'conduct' ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                      <span className="text-indigo-800 font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Prohibited Conduct</h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>No spamming, misuse, or fraudulent activity on the platform.</li>
                        <li>Do not share false information or impersonate others.</li>
                        <li>Do not engage in discriminatory practices or harassment.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Term 5 */}
                <div className="p-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                      <span className="text-indigo-800 font-bold">5</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Termination</h3>
                      <p className="text-gray-700">
                        Refrll reserves the right to suspend or terminate accounts violating these terms without prior notice. 
                        We may also remove content that violates our policies.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Term 6 */}
                <div className="p-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                      <span className="text-indigo-800 font-bold">6</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Limitation of Liability</h3>
                      <p className="text-gray-700">
                        Refrll is not responsible for any losses, damages, or disputes arising from use of the platform. 
                        We provide the platform "as is" without warranties of any kind.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Term 7 */}
                <div className="p-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                      <span className="text-indigo-800 font-bold">7</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Changes to Terms</h3>
                      <p className="text-gray-700">
                        We may update these terms periodically. Continued use of Refrll after changes implies acceptance. 
                        We will notify users of significant changes through platform notifications or email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acceptance Section */}
              <div className="bg-gray-50 p-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900">Acceptance of Terms</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      By using Refrll, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
                    </p>
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-md">
                    I Understand
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

export default TermsAndConditions;
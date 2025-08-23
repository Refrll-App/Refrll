

// src/pages/ReferralLeaderboard.jsx
import {
  Trophy,
  Star,
  Zap,
  Gem,
  User,
  BadgeCheck,
  Award,
  Gift,
  BarChart2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTopReferrers } from "../hooks/useReferral";

const ReferralLeaderboard = () => {
  const { data: topReferrers = [], isLoading, isError } = useTopReferrers();

  // Function to determine level based on referral count
  const getLevel = (count) => {
    if (count >= 20) return "platinum";
    if (count >= 15) return "gold";
    if (count >= 10) return "silver";
    if (count >= 1) return "bronze";
    return "none";
  };

  const getLevelDetails = (level) => {
    switch (level) {
      case "platinum":
        return {
          color: "from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40",
          border: "border-blue-200 dark:border-blue-700",
          icon: <Gem size={20} className="text-blue-600 dark:text-blue-400" />,
          name: "Platinum Referrer",
          reward: "$2,500 bonus",
        };
      case "gold":
        return {
          color: "from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30",
          border: "border-amber-200 dark:border-amber-700",
          icon: <Star size={20} className="text-amber-500 dark:text-amber-400" />,
          name: "Gold Referrer",
          reward: "$1,500 bonus",
        };
      case "silver":
        return {
          color: "from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800",
          border: "border-gray-200 dark:border-gray-700",
          icon: <Trophy size={20} className="text-gray-600 dark:text-gray-400" />,
          name: "Silver Referrer",
          reward: "$750 bonus",
        };
      case "bronze":
        return {
          color: "from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30",
          border: "border-orange-200 dark:border-orange-700",
          icon: <Zap size={20} className="text-orange-500 dark:text-orange-400" />,
          name: "Bronze Referrer",
          reward: "$250 bonus",
        };
      default:
        return {
          color: "from-gray-50 to-slate-100 dark:from-gray-800 dark:to-slate-800",
          border: "border-gray-200 dark:border-gray-700",
          icon: <User size={20} className="text-gray-500 dark:text-gray-400" />,
          name: "Referrer",
          reward: "Start referring!",
        };
    }
  };

  const programBenefits = [
    {
      icon: <Gift size={16} className="text-indigo-600 dark:text-indigo-400" />,
      title: "Generous Bonuses",
      description: "Earn rewards for successful referrals based on tier",
    },
    {
      icon: <Award size={16} className="text-indigo-600 dark:text-indigo-400" />,
      title: "Exclusive Badges",
      description: "Showcase your achievements with special recognition badges",
    },
    {
      icon: <BarChart2 size={16} className="text-indigo-600 dark:text-indigo-400" />,
      title: "Career Advancement",
      description: "Top referrers get priority consideration for promotions",
    },
    {
      icon: <BadgeCheck size={16} className="text-indigo-600 dark:text-indigo-400" />,
      title: "Recognition Events",
      description: "Invitations to exclusive company recognition ceremonies",
    },
  ];

  if (isLoading)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center dark:text-gray-300">
        Loading leaderboard...
      </div>
    );
  if (isError)
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-red-500 dark:text-red-400">
        Error loading data
      </div>
    );


   

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 rounded-3xl p-6 md:p-8 text-center mb-8">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4">
            <BadgeCheck size={16} className="text-white" />
            <span className="text-white text-sm font-medium">
              Employee Referral Program
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Top Referrers Leaderboard
          </h1>
          <p className="text-indigo-200 dark:text-indigo-300 text-sm max-w-2xl mx-auto mb-6">
            Celebrating our most valuable team members who help build our
            exceptional workforce
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/employee/claimJob"
              className="px-5 py-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Refer a Candidate
            </Link>
            {/* <button className="px-5 py-2 bg-indigo-800 dark:bg-indigo-900 text-white font-medium rounded-lg hover:bg-indigo-900 dark:hover:bg-indigo-950 transition-colors text-sm">
              How It Works
            </button> */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-gray-900/50 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-indigo-600 dark:text-indigo-400" />
              <span>Current Leaderboard</span>
            </h2>

            <div className="space-y-4">
              {topReferrers.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No referrers found. Be the first to refer someone!
                </div>
              ) : (
                topReferrers.map((referrer, index) => {
                  const level = getLevel(referrer?.referralCount || 0);
                  const levelDetails = getLevelDetails(level);

                  return (
                    <div
                      key={referrer._id}
                      className={`p-4 rounded-lg border ${levelDetails.border} bg-gradient-to-r ${levelDetails.color} flex items-center gap-4`}
                    >
                      <div className="flex-shrink-0">
                        {referrer.avatarUrl ? (
                          <img
                            src={referrer.avatarUrl}
                            alt={referrer.name}
                            className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-gray-600"
                          />
                        ) : (
                          <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed rounded-xl w-14 h-14 flex items-center justify-center">
                            <User className="text-gray-500 dark:text-gray-400 w-8 h-8" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                          <div className="flex items-center gap-2">
                            {levelDetails.icon}
                            <div className="truncate">
                              <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                                {referrer.name}
                              </h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {referrer.designation || "Employee"}
                              </p>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-700 px-3 py-1 rounded-full text-xs font-semibold border border-gray-200 dark:border-gray-600 shadow-sm whitespace-nowrap text-gray-900 dark:text-gray-200">
                            {/* {referrer?.referralCount || 0}  successful referrals */}
                             {referrer?.referralCount || 0} {referrer?.referralCount >1? 'successful referrals' : 'successful referral'}
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                              Level
                            </span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">
                              {referrer?.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm dark:shadow-gray-900/50">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart2 size={20} className="text-indigo-600 dark:text-indigo-400" />
              <span>Program Performance</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/30 dark:to-gray-800 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                  Referral Impact
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400 text-xs">
                        Hire retention rate
                      </span>
                      <span className="font-bold text-indigo-700 dark:text-indigo-400 text-xs">
                        94%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-green-500 dark:bg-green-600 h-1.5 rounded-full"
                        style={{ width: "94%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400 text-xs">
                        Avg. time to hire
                      </span>
                      <span className="font-bold text-indigo-700 dark:text-indigo-400 text-xs">
                        12 days
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 dark:bg-blue-600 h-1.5 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/30 dark:to-gray-800 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                  Program Growth
                </h3>
                <div className="flex items-end justify-between">
                  <div className="text-center">
                    <div className="text-xl font-bold text-indigo-700 dark:text-indigo-400">42%</div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">More referrals</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-indigo-700 dark:text-indigo-400">28%</div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">Higher quality</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-indigo-700 dark:text-indigo-400">63</div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">Total hires</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Program Benefits Sidebar */}
        <div>
          <div className="bg-gradient-to-b from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 border border-indigo-100 dark:border-gray-700 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award size={20} className="text-indigo-600 dark:text-indigo-400" />
              <span>Program Benefits</span>
            </h2>

            <div className="space-y-4">
              {programBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">{benefit.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-indigo-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                Achievement Tiers
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-lg border border-blue-200 dark:border-blue-700">
                  <Gem size={16} className="text-blue-600 dark:text-blue-400" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-xs">
                      Platinum
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-2xs">
                      20+ successful referrals
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
                  <Star size={16} className="text-amber-500 dark:text-amber-400" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-xs">Gold</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-2xs">
                      15-19 successful referrals
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Trophy size={16} className="text-gray-600 dark:text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-xs">
                      Silver
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-2xs">
                      10-14 successful referrals
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg border border-orange-200 dark:border-orange-700">
                  <Zap size={16} className="text-orange-500 dark:text-orange-400" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-xs">
                      Bronze
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-2xs">
                      1-9 successful referrals
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 rounded-lg p-4 text-center">
              <h3 className="font-bold text-white mb-1 text-sm">
                Ready to earn rewards?
              </h3>
              <p className="text-indigo-200 dark:text-indigo-300 mb-3 text-xs">
                Start referring candidates today
              </p>
              <Link
                to="/employee/claimJob"
                className="inline-block px-4 py-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Browse Open Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralLeaderboard;
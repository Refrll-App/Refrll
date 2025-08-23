



import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { 
  MapPin, Briefcase, ExternalLink, IndianRupee, ArrowLeft, FileText,
  CheckCircle, Calendar, User, Building, BarChart2, Send, Users
} from "lucide-react";
import { useState } from "react";
import { useProfile } from "../../hooks/useAuth";
import { useApplyJob, useJobById, useApplicationStatus } from "../../hooks/useJobs";

export default function JobDetailPage() {

    const { id } = useParams();
  const navigate = useNavigate();
  const { data: user } = useProfile();
  const { mutate: apply, isPending } = useApplyJob();
  const {
    data: status,
    isLoading: statusLoading,
    refetch: refetchStatus,
  } = useApplicationStatus(id);

  const { data: job, isLoading, error } = useJobById(id);
  const [activeTab, setActiveTab] = useState("description");
  const alreadyApplied = user?.type === "employee" && status?.applied;

  const handleApply = () => {
    if (!user?.resumeUrl) {
      toast.error("Please upload your resume first");
      navigate("/employee/profile");
      return;
    }

    apply(id, {
      onSuccess: () => {
        toast.success("Application submitted successfully!");
        refetchStatus();
      },
      onError: (err) => toast.error(err?.response?.data?.message || "Failed to apply"),
    });
  };

  if (isLoading) return <JobSkeleton />;
  if (error) return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
      <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 border border-red-100 shadow-sm text-center max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Job Not Found</h2>
        <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed</p>
        <button 
          onClick={() => navigate("/jobs")}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} /> Browse Jobs
        </button>
      </div>
    </div>
  );

  const companyInitial = job.companyId?.name?.charAt(0)?.toUpperCase() || "C";
  const logoFallback = (
    <div className="h-16 w-16 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-teal-100 text-indigo-600 text-xl font-bold shadow-inner">
      {companyInitial}
    </div>
  );

  // Calculate days since posted
  const postedDate = new Date(job.createdAt);
  const currentDate = new Date();
  const daysSincePosted = Math.floor((currentDate - postedDate) / (1000 * 60 * 60 * 24));

const isOwnJob = user?._id === job?.postedBy?._id;



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <button 
          onClick={() => navigate('/jobs')}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors text-xs"
        >
          <ArrowLeft size={14} /> Back to jobs
        </button>
        
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
          {/* Job Header */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                {job.companyId?.logoUrl ? (
                  <img
                    src={job.companyId.logoUrl}
                    alt={`${job.companyId.name} logo`}
                    className="h-14 w-14 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                ) : (
                  <div className="h-14 w-14 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-teal-100 text-indigo-600 text-lg font-bold shadow-inner">
                    {companyInitial}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-row md:flex-row justify-between md:items-start gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-3 mb-3">
                      <a
                        href={job.companyId?.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 text-xs font-medium"
                      >
                        <Building size={14} className="text-slate-500 dark:text-slate-400" /> 
                        {job.companyId?.name} <ExternalLink size={12} />
                      </a>
                      <span className="text-slate-300 dark:text-slate-600 text-xs">•</span>
                      <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs">
                        <Calendar size={12} className="text-slate-500 dark:text-slate-400" /> 
                        Posted {daysSincePosted === 0 ? "today" : `${daysSincePosted} day${daysSincePosted === 1 ? "" : "s"} ago`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    {job.salaryRange?.min && (
                      <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1 text-xs lg:text-sm">
                        <IndianRupee size={16} className="text-slate-700 dark:text-slate-300" />
                        {job.salaryRange.min}
                        {job.salaryRange.max && ` - ${job.salaryRange.max}`} LPA
                      </div>
                    )}
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {job.jobType || "Full-time"}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {job.location && (
                    <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-600">
                      <MapPin size={14} className="text-slate-500 dark:text-slate-400" /> {job.location}
                    </span>
                  )}
                  {job.remote && (
                    <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-600">
                      <Briefcase size={14} className="text-slate-500 dark:text-slate-400" /> Remote
                    </span>
                  )}
                  {job.experienceLevel && (
                    <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-600">
                      <BarChart2 size={14} className="text-slate-500 dark:text-slate-400" /> {job.experienceLevel}
                    </span>
                  )}
                  {job.department && (
                    <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-700 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-slate-600">
                      <User size={14} className="text-slate-500 dark:text-slate-400" /> {job.department}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row">
            {/* Job Details */}
            <div className="flex-1 p-6">
              <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                <div className="flex gap-6">
                  <button
                    className={`pb-3 px-1 font-medium text-xs ${
                      activeTab === "description"
                        ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                    onClick={() => setActiveTab("description")}
                  >
                    Job Description
                  </button>
                  <button
                    className={`pb-3 px-1 font-medium text-xs ${
                      activeTab === "requirements"
                        ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                    onClick={() => setActiveTab("requirements")}
                  >
                    Requirements
                  </button>
                  {/* <button
                    className={`pb-3 px-1 font-medium text-xs ${
                      activeTab === "company"
                        ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                    onClick={() => setActiveTab("company")}
                  >
                    About Company
                  </button> */}
                </div>
              </div>

              {activeTab === "description" && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">Overview</h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                    {job.description}
                  </p>
                  
                  {job.responsibilities?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Key Responsibilities</h3>
                      <ul className="space-y-2">
                        {job.responsibilities.map((responsibility, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <span className="text-indigo-600 dark:text-indigo-400 mr-2 mt-1">•</span>
                            <span className="text-slate-700 dark:text-slate-300">{responsibility}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "requirements" && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">Requirements</h2>
                  
                  {job.requirements?.length > 0 && (
                    <ul className="space-y-3">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <span className="text-indigo-600 dark:text-indigo-400 mr-2 mt-1">•</span>
                          <span className="text-slate-700 dark:text-slate-300">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {job.skillsRequired?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {job.skillsRequired.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-md border border-indigo-100 dark:border-indigo-800"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {job.benefits?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Benefits</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {job.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" size={16} />
                            <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "company" && job.companyId && (
                <div className="space-y-4">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">About {job.companyId.name}</h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                    {job.companyId.description || "We're a forward-thinking company focused on innovation and excellence in our industry."}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                      <h3 className="font-medium text-slate-900 dark:text-white mb-2 text-sm">Company Details</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Building size={14} className="text-slate-500 dark:text-slate-400" />
                          <span>Industry: {job.companyId.industry || "Technology"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Users size={14} className="text-slate-500 dark:text-slate-400" />
                          <span>Company Size: {job.companyId.size || "100-500 employees"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <MapPin size={14} className="text-slate-500 dark:text-slate-400" />
                          <span>HQ: {job.companyId.headquarters || "Bangalore, India"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                      <h3 className="font-medium text-slate-900 dark:text-white mb-2 text-sm">Contact</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <ExternalLink size={14} className="text-slate-500 dark:text-slate-400" />
                          <a 
                            href={job.companyId.website} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                          >
                            Visit website
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 border-l border-slate-200 dark:border-slate-700 p-6">
              <div className="sticky top-6">
                {user?.type === "employee" && (
                  <div className="bg-indigo-50 dark:bg-slate-700 rounded-xl p-5 border border-indigo-100 dark:border-slate-600 shadow-sm mb-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white text-center">
                        {alreadyApplied ? "Application Submitted" : "Ready to Apply?"}
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs">
                          <FileText className="text-indigo-600 dark:text-indigo-400" size={16} />
                          <span className="text-slate-700 dark:text-slate-300">
                            {user?.resumeUrl ? "Resume attached" : "No resume uploaded"}
                          </span>
                        </div>
                        
                        {alreadyApplied && status?.appliedAt && (
                          <div className="flex items-center gap-3 text-xs">
                            <Calendar className="text-indigo-600 dark:text-indigo-400" size={16} />
                            <span className="text-slate-700 dark:text-slate-300">
                              Applied on {new Date(status.appliedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {job.type === "referral" && job.applicationCount >= 10 ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center bg-slate-400 cursor-not-allowed"
                        >
                          Maximum Applications Received
                        </button>
                      ) : isOwnJob ? (
  <button
    disabled
    className="w-full py-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center bg-slate-400 cursor-not-allowed"
  >
    You cannot apply to your own job
  </button>
) :  (
                        <button
                          onClick={handleApply}
                          disabled={alreadyApplied || isPending}
                          className={`w-full py-2.5 rounded-lg text-xs font-semibold text-white flex items-center justify-center transition-all duration-200 shadow-sm ${
                            alreadyApplied
                              ? "bg-green-500 cursor-not-allowed"
                              : isPending
                              ? "bg-indigo-400 cursor-wait"
                              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                          }`}
                        >
                          {alreadyApplied
                            ? "✓ Application Submitted"
                            : isPending
                            ? "Applying..."
                            : (
                              <>
                                <Send size={14} className="mr-1.5" /> Apply Now
                              </>
                            )}
                        </button>
                      )}
                      
                      {!alreadyApplied && !isPending && (
                        <p className="text-[0.65rem] text-slate-500 dark:text-slate-400 mt-3 text-center">
                          By applying, you agree to share your profile with {job.companyId?.name}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-white dark:bg-slate-700 rounded-xl p-5 border border-slate-200 dark:border-slate-600 shadow-sm">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Job Summary</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Job Type:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{job.jobType || "Full-time"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Location:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{job.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Experience:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{job?.experienceLevel || 'Not Provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Department:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{job?.department || 'Not Provided' }</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Vacancies:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{job?.openings || 'Not Provided'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <button className="mb-6 flex items-center gap-2 text-slate-400 text-xs">
          <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </button>
        
        <div className="animate-pulse bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
          {/* Header Skeleton */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="h-14 w-14 rounded-lg bg-slate-200 dark:bg-slate-700"></div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                  <div className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                  <div className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 p-6">
              <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                <div className="flex gap-6">
                  <div className="h-7 w-28 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-7 w-28 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-7 w-28 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="h-5 w-1/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-3 w-4/5 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-3 w-4/5 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-3 w-3/5 bg-slate-200 dark:bg-slate-700 rounded"></div>
                
                <div className="mt-6">
                  <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-3 w-4/5 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-80 border-l border-slate-200 dark:border-slate-700 p-6">
              <div className="space-y-6">
                <div className="h-56 bg-slate-100 dark:bg-slate-700 rounded-xl"></div>
                <div className="h-44 bg-slate-100 dark:bg-slate-700 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
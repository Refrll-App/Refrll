


import { Briefcase, CalendarDays, Building2, FileText, User, Star } from "lucide-react";

export default function ProfileSummary({ user }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 rounded-xl border border-indigo-100/70 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-lg object-cover border-2 border-white dark:border-slate-800 shadow-sm"
            />
          ) : (
            <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-lg p-2 w-20 h-20 flex items-center justify-center">
              <User size={28} strokeWidth={1.5} />
            </div>
          )}
          
          {user?.referralBadge && (
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold flex items-center shadow-md">
              <Star size={10} className="mr-0.5" />
              {user.referralBadge.type}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {user?.name || "Your Profile"}
              </h2>
              <p className="text-xs text-gray-600 dark:text-slate-400 mb-1">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center text-gray-600 dark:text-slate-400 text-xs mb-1">
            <span className="truncate">{user?.location || "Location not specified"}</span>
          </div>

          <div className="flex gap-2 mt-2">
            {user?.linkedinUrl && (
              <a 
                href={user.linkedinUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="inline mr-1">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </a>
            )}
            {user?.githubUrl && (
              <a 
                href={user.githubUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-gray-800 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="inline mr-1">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-lg p-3 mb-4 grid grid-cols-2 md:grid-cols-4 gap-3 shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex flex-col">
          <div className="flex items-center text-gray-500 dark:text-slate-400 text-xs mb-0.5">
            <Briefcase size={14} className="mr-1" />
            Position
          </div>
          <p className="font-medium text-sm truncate text-gray-900 dark:text-white">
            {user?.designation || "Not specified"}
          </p>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center text-gray-500 dark:text-slate-400 text-xs mb-0.5">
            <CalendarDays size={14} className="mr-1" />
            Experience
          </div>
          <p className="font-medium text-sm truncate text-gray-900 dark:text-white">
            {user?.yearsOfExp || "0"}{" "}
            <span className="font-normal text-xs text-gray-600 dark:text-slate-400">
              {user?.yearsOfExp === 1 ? "year" : "years"}
            </span>
          </p>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center text-gray-500 dark:text-slate-400 text-xs mb-0.5">
            <Building2 size={14} className="mr-1" />
            Company
          </div>
          <p className="font-medium text-sm truncate text-gray-900 dark:text-white">
            {user?.companyId?.name || "Not specified"}
          </p>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center text-gray-500 dark:text-slate-400 text-xs mb-0.5">
            <FileText size={14} className="mr-1" />
            Resume
          </div>
          <p className={`font-medium text-sm truncate ${user?.resumeUrl ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
            {user?.resumeUrl ? "Uploaded" : "Not uploaded"}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-gray-700 dark:text-slate-300 text-sm font-semibold mb-2 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1 text-indigo-600 dark:text-indigo-400">
            <path d="m12 14 4-4"></path>
            <path d="M3.34 19a10 10 0 1 1 17.32 0"></path>
          </svg>
          Skills & Expertise
        </p>
        <div className="flex flex-wrap gap-1.5">
          {user?.skills?.slice(0, 7).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 text-xs font-medium rounded-lg border border-indigo-100 dark:border-slate-700 shadow-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1 text-indigo-600 dark:text-indigo-400">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
              {skill}
            </span>
          ))}
          {user?.skills?.length > 7 && (
            <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-lg">
              +{user.skills.length - 7} more
            </span>
          )}
          {!user?.skills?.length && (
            <span className="text-gray-500 dark:text-slate-500 text-xs">
              No skills added yet
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

import { Link, useNavigate, useLocation } from "react-router-dom";
import { Briefcase, Menu, X, LogOut, Bell, Home, User, FilePlus, FileText, UserPlus, Trophy } from "lucide-react";
import { useProfile, useLogout, useToggleRole } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { useRef, useState, useEffect } from "react";
import Refrll from "../../assets/Refrll.png";
import NotificationBell from "./NotificationBell";
import { useNotifications } from "../../hooks/useNotification";
import ReferralBanner from "./ReferralBanner";

export default function Navbar() {
  const { data: user, refetch: refetchProfile } = useProfile();
  const { mutate: logout } = useLogout();
  const { mutate: toggleRole, isPending } = useToggleRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastToggleTimeRef = useRef(0);
  const { data: notifications = [], isLoading } = useNotifications();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleRoleToggle = () => {
    const now = Date.now();
    if (loading || now - lastToggleTimeRef.current < 2000) {
      toast.error("Please wait before switching again");
      return;
    }

    setLoading(true);
    lastToggleTimeRef.current = now;

    toggleRole(undefined, {
      onSuccess: (data) => {
        toast.success(
          `Switched to ${data.currentRole === "seeker" ? "Seeker" : "Referrer"}`
        );
        refetchProfile(); // Force profile refetch
        navigate(
          data.currentRole === "seeker"
            ? "/employee/dashboard"
            : "/employee/referrer"
        );
        setLoading(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to toggle role");
        setLoading(false);
      },
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to log out");
    }
  };

  // Navigation links configuration
  const navLinks = [
    ...(user?.currentRole === "referrer"
      ? [
          { to: "/employee/referrer", label: "Dashboard", icon: <Briefcase size={20} /> },
          { to: "/employee/claimJob", label: "Claim Job", icon: <FileText size={20} /> },
          { to: "/employee/referrals/create", label: "Create Job", icon: <FilePlus size={20} /> },
          { to: "/referrals/leaderboard", label: "leaderboard", icon: <Trophy size={20} /> },
        ]
      : []),
    ...(user?.currentRole === "seeker"
      ? [
          { to: "/employee/dashboard", label: "Dashboard", icon: <Briefcase size={20} /> },
          { to: "/employee/profile", label: "Profile", icon: <User size={20} /> },
          { to: "/jobs", label: "Jobs", icon: <FileText size={20} /> },
        ]
      : []),
    ...(user?.currentRole === "hr"
      ? [
          { to: "/hr/dashboard", label: "Dashboard", icon: <Briefcase size={20} /> },
          { to: "/hr/create-job", label: "Post Job", icon: <FilePlus size={20} /> },
        ]
      : []),
       ...(user?.currentRole === "admin"
      ? []
      : []),
    ...(!user
      ? [
          { to: "/", label: "Home", icon: <Home size={20} /> },
          { to: "/about", label: "About", icon: <User size={20} /> },
        ]
      : []),
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link
              to={
                user?.currentRole === "seeker"
                  ? "/employee/dashboard"
                  : user?.currentRole === "referrer"
                  ? "/employee/referrer"
                  : user?.currentRole === "hr"
                  ? "/hr/dashboard"
                  : user?.currentRole=== "admin"
                  ? "/admin"
                  : "/"
              }
              className="flex items-center gap-2"
            >
              <img
                src={Refrll}
                alt="Refrll Logo"
                className="h-10 w-auto object-contain dark:filter dark:invert dark:brightness-0 dark:contrast-200"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex md:items-center md:space-x-4">
              {user ? (
                <>
                  <NotificationBell notifications={notifications} />

                  {user.type === "employee" && (
                    <button
                      onClick={handleRoleToggle}
                      disabled={isPending || loading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                    >
                      Switch to{" "}
                      {user.currentRole === "seeker" ? "Referrer" : "Seeker"}
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            {/* Mobile Icons */}
            <div className="md:hidden flex items-center gap-4">
              {user ? (
                <>
                  <NotificationBell notifications={notifications} />
                  
                  <Link
                    to={
                      user?.currentRole === "seeker"
                        ? "/employee/dashboard"
                        : user?.currentRole === "referrer"
                        ? "/employee/referrer"
                        : user?.currentRole === "hr"
                        ? "/hr/dashboard"
                        : "/"
                    }
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    <Briefcase size={20} />
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    <User size={20} />
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    <UserPlus size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden text-gray-600 dark:text-gray-300"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden bg-black/50" 
          onClick={() => setMobileMenuOpen(false)}
          style={{ pointerEvents: 'auto' }}
        >
          <div 
            className="fixed top-16 right-0 w-64 h-full bg-white dark:bg-slate-800 shadow-lg z-50 transform transition-transform" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white py-2"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              {user ? (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
                  {user.type === "employee" && (
                    <button
                      onClick={() => {
                        handleRoleToggle();
                        setMobileMenuOpen(false);
                      }}
                      disabled={isPending || loading}
                      className={`flex items-center gap-3 w-full py-2 ${
                        isPending || loading
                          ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500"
                          : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                      }`}
                    >
                      <Briefcase size={18} className="mr-1" />
                      Switch to{" "}
                      {user.currentRole === "seeker" ? "Referrer" : "Seeker"}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    <LogOut size={18} className="mr-1" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    <User size={18} className="mr-1" />
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  >
                    <UserPlus size={18} className="mr-1" />
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
     <ReferralBanner />
    </nav>
  );
}
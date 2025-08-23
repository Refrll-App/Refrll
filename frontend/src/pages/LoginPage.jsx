




import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { LogIn, Eye, EyeOff, Mail, Lock, Loader } from "lucide-react";
import { useLogin } from "../hooks/useAuth";
import useAuthStore from "../store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: login, isPending } = useLogin();
 
  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!form.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    login(form, {
      onSuccess: () => {
        toast.success("Logged in successfully");
        setIsLoading(false);
      
      
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Login failed");
        setIsLoading(false);
      }
    });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${ import.meta.env.VITE_SERVER_URL}/api/auth/google`; 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-xs">
      <div className="w-full max-w-sm px-4 py-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-5 text-center">
            <div className="bg-indigo-600 dark:bg-indigo-900 w-10 h-10 rounded-full flex items-center justify-center mx-auto shadow-md">
              <LogIn className="text-white dark:text-indigo-300" size={16} />
            </div>
            <h1 className="text-base font-semibold text-black dark:text-white mt-2">
              Welcome Back
            </h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1">
              Sign in to your account
            </p>
          </div>

          <div className="px-5 pb-5">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className={`relative rounded-md border ${errors.email ? "border-red-500" : "border-slate-300 dark:border-slate-600"}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-slate-400" size={14} />
                  </div>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onBlur={() => validateForm()}
                    className={`w-full bg-slate-50 dark:bg-slate-700 pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-md text-xs ${errors.email ? "text-red-500" : "text-slate-900 dark:text-white"}`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className={`relative rounded-md border ${errors.password ? "border-red-500" : "border-slate-300 dark:border-slate-600"}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-slate-400" size={14} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    onBlur={() => validateForm()}
                    className={`w-full bg-slate-50 dark:bg-slate-700 pl-9 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-md text-xs ${errors.password ? "text-red-500" : "text-slate-900 dark:text-white"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs text-slate-700 dark:text-slate-300"
                >
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2 px-4 rounded-md font-medium transition-all duration-200 disabled:opacity-70 text-xs"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" size={14} />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={14} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4">
              <button 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 dark:border-slate-600 rounded-md py-2 px-4 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-3.5 h-3.5"
                />
                Sign in with Google
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-center text-slate-500 dark:text-slate-400 text-xs">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
          
          <div className="px-5 py-3 text-center border-t border-slate-100 dark:border-slate-700">
            <p className="text-[0.65rem] text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Refrll. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
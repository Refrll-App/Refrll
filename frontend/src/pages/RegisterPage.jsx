


import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { UserPlus, Lock, Mail, User, Eye, EyeOff, Loader } from 'lucide-react';

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
axios.defaults.withCredentials = true;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    // Email validation
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else {
      // Calculate password strength
      let strength = 0;
      if (form.password.length >= 8) strength += 1;
      if (/[A-Z]/.test(form.password)) strength += 1;
      if (/[a-z]/.test(form.password)) strength += 1;
      if (/[0-9]/.test(form.password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(form.password)) strength += 1;
      
      setPasswordStrength(strength);
      
      if (strength < 3) {
        newErrors.password = 'Password is too weak';
      }

     
    }
    
    // Confirm password validation
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
   
    
    setLoading(true);
    try {
      await axios.post('/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password
      });
      
      toast.success('Go to your email and very');
      // setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      
      // Handle specific backend errors
      if (errorMessage.includes('email')) {
        setErrors({...errors, email: errorMessage});
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
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
              <UserPlus className="text-white dark:text-indigo-300" size={16} />
            </div>
            <h1 className="text-base font-semibold text-black dark:text-white mt-2">
              Create Account
            </h1>
            <p className="text-gray-500 dark:text-slate-400 mt-1">
              Join our platform to access exclusive features
            </p>
          </div>

          <div className="px-5 pb-5">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className={`relative rounded-md border ${errors.name ? "border-red-500" : "border-slate-300 dark:border-slate-600"}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="text-slate-400" size={14} />
                  </div>
                  <input
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => {
                      setForm({...form, name: e.target.value});
                      if (errors.name) setErrors({...errors, name: ''});
                    }}
                    onBlur={() => validateForm()}
                    className={`w-full bg-slate-50 dark:bg-slate-700 pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-md text-xs ${errors.name ? "text-red-500" : "text-slate-900 dark:text-white"}`}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
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
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => {
                      setForm({...form, email: e.target.value});
                      if (errors.email) setErrors({...errors, email: ''});
                    }}
                    onBlur={() => validateForm()}
                    className={`w-full bg-slate-50 dark:bg-slate-700 pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-md text-xs ${errors.email ? "text-red-500" : "text-slate-900 dark:text-white"}`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className={`relative rounded-md border ${errors.password ? "border-red-500" : "border-slate-300 dark:border-slate-600"}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-slate-400" size={14} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => {
                      setForm({...form, password: e.target.value});
                      if (errors.password) setErrors({...errors, password: ''});
                    }}
                    onBlur={() => validateForm()}
                    className={`w-full bg-slate-50 dark:bg-slate-700 pl-9 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-md text-xs ${errors.password ? "text-red-500" : "text-slate-900 dark:text-white"}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                
                {/* Password Strength */}
                {form.password && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Strength:</span>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`}
                        style={{ width: `${passwordStrength * 20}%` }}
                      ></div>
                    </div>
                    <span className={`font-medium ${
                      passwordStrength <= 2 ? 'text-red-500' : 
                      passwordStrength === 3 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {passwordStrength <= 2 ? 'Weak' : passwordStrength === 3 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className={`relative rounded-md border ${errors.confirmPassword ? "border-red-500" : "border-slate-300 dark:border-slate-600"}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-slate-400" size={14} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(e) => {
                      setForm({...form, confirmPassword: e.target.value});
                      if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
                    }}
                    onBlur={() => validateForm()}
                    className={`w-full bg-slate-50 dark:bg-slate-700 pl-9 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-md text-xs ${errors.confirmPassword ? "text-red-500" : "text-slate-900 dark:text-white"}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400"
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2 px-4 rounded-md font-medium transition-all duration-200 disabled:opacity-70 text-xs"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={14} />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={14} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Google Auth Button */}
            <div className="mt-4">
              <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 dark:border-slate-600 rounded-md py-2 px-4 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-3.5 h-3.5"
                />
                Sign up with Google
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-center text-slate-500 dark:text-slate-400 text-xs">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  Sign in
                </Link>
              </p>
              <p className="text-center text-slate-500 dark:text-slate-400 text-xs mt-1">
                HR?{" "}
                <Link
                  to="/register-hr"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  HR Registration
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
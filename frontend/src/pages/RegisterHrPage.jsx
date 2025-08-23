


import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegisterHr } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Briefcase, Link as LinkIcon, Eye, EyeOff, Loader } from 'lucide-react';

export default function RegisterHrPage() {
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegisterHr();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    website: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Full name is required';
        else if (value.trim().length < 3) error = 'Name must be at least 3 characters';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        break;
      case 'companyName':
        if (!value.trim()) error = 'Company name is required';
        break;
    }
    
    return error;
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 6) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/[0-9]/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;
      setPasswordStrength(strength);
    }
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    let isValid = true;
    const newErrors = { ...errors };
    
    Object.keys(form).forEach(key => {
      if (key === 'website') return; // Website is optional
      
      const error = validateField(key, form[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    
    if (!isValid) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    register(form, {
      onSuccess: () => {
        toast.success('Check your email to verify your account');
        // navigate('/login');
      },
      onError: (err) =>
        toast.error(err?.response?.data?.message || 'Registration failed'),
    });
  };

  // Get password strength color
  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-slate-200';
    if (passwordStrength === 1) return 'bg-red-400';
    if (passwordStrength === 2) return 'bg-orange-400';
    if (passwordStrength === 3) return 'bg-yellow-400';
    return 'bg-green-500';
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 text-sm">
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className=" p-6 text-center">
          <div className="bg-white dark:bg-slate-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
            <div className="bg-indigo-100 dark:bg-indigo-900 w-10 h-10 rounded-full flex items-center justify-center">
              <Briefcase className="text-indigo-600 dark:text-indigo-300" size={20} />
            </div>
          </div>
          <h1 className="text-lg font-bold ">HR Registration</h1>
          <p className="text-gray-400 text-xs mt-1">Create your HR account and company profile</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className={`relative rounded-lg border ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} transition-colors`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-slate-400" size={16} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full rounded-lg bg-slate-50 dark:bg-slate-700 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${errors.name ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500 flex items-center"><span className="mr-1">•</span>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className={`relative rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} transition-colors`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-slate-400" size={16} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full rounded-lg bg-slate-50 dark:bg-slate-700 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${errors.email ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500 flex items-center"><span className="mr-1">•</span>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className={`relative rounded-lg border ${errors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} transition-colors`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-slate-400" size={16} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full rounded-lg bg-slate-50 dark:bg-slate-700 pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${errors.password ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Strength Bar */}
              <div className="mt-2 flex items-center space-x-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${i <= passwordStrength ? getStrengthColor() : 'bg-slate-200'}`}
                  />
                ))}
              </div>

              {/* Length Hint */}
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                <p className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${form.password.length >= 6 ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                  At least 6 characters
                </p>
              </div>

              {errors.password && <p className="mt-1 text-xs text-red-500 flex items-center"><span className="mr-1">•</span>{errors.password}</p>}
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Company Name
              </label>
              <div className={`relative rounded-lg border ${errors.companyName ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'} transition-colors`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="text-slate-400" size={16} />
                </div>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Your Company"
                  value={form.companyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full rounded-lg bg-slate-50 dark:bg-slate-700 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${errors.companyName ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}
                />
              </div>
              {errors.companyName && <p className="mt-1 text-xs text-red-500 flex items-center"><span className="mr-1">•</span>{errors.companyName}</p>}
            </div>

            {/* Website (Optional) */}
            <div>
              <label htmlFor="website" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Company Website <span className="text-slate-400">(optional)</span>
              </label>
              <div className="relative rounded-lg border border-slate-300 dark:border-slate-600 transition-colors">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="text-slate-400" size={16} />
                </div>
                <input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://company.com"
                  value={form.website}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-slate-50 dark:bg-slate-700 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2.5 px-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 mt-4"
            >
              {isPending ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <Briefcase size={16} />
                  <span>Create HR Account</span>
                </>
              )}
            </button>
          </form>

      

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} Refrll. All rights reserved.
        </p>
      </div>
    </div>
  </div>
);


}
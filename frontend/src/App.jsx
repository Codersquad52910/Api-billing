import { useState } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import Services from "./pages/Services";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { loginUser, registerUser, verifyOTP, resendOTP } from "./api/auth";

const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] relative overflow-hidden font-sans">
    {/* Ambient Background */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-500/[0.04] rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-500/[0.04] rounded-full blur-[100px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/[0.015] rounded-full blur-[80px]"></div>
    </div>

    <div className="max-w-[420px] w-full px-6 relative z-10 animate-in">
      <div className="bg-white rounded-3xl border border-slate-100/80 p-9 md:p-10 overflow-hidden relative" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 4px 6px rgba(0,0,0,0.02), 0 24px 48px rgba(0,0,0,0.06)' }}>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500/30 to-transparent"></div>

        <div className="text-center mb-9 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-5 shadow-xl shadow-slate-900/15 hover:shadow-2xl hover:shadow-slate-900/20 transition-all duration-500 hover:scale-105">
            A
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">{title}</h2>
          <p className="text-slate-400 mt-1.5 font-medium text-sm">{subtitle}</p>
        </div>

        {children}
      </div>

      <p className="mt-6 text-center text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
        &copy; 2026 ApiBill Cloud Ecosystem
      </p>
    </div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await loginUser(email, password);
      if (data.requiresOTP) {
        setShowOTP(true);
      } else {
        login(data.token, data.role, data);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Access denied. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await verifyOTP(email, otp);
      login(data.token, data.role, data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(email);
      alert("New OTP sent to your email!");
    } catch (err) {
      setError("Failed to resend OTP.");
    }
  };

  return (
    <AuthLayout title={showOTP ? "Verify Identity" : "Welcome Back"} subtitle={showOTP ? `We've sent a code to ${email}` : "Sign in to your API dashboard"}>
      {error && (
        <div className="mb-6 p-3.5 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl flex items-center gap-2.5 border border-rose-100/80 animate-shake">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 6.5a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>
          {error}
        </div>
      )}

      {!showOTP ? (
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-500 ml-1">Email Address</label>
            <input
              className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all placeholder:text-slate-300 font-medium text-sm"
              placeholder="you@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center px-0.5">
              <label className="text-[11px] font-semibold text-slate-500">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 transition-colors">Forgot?</Link>
            </div>
            <input
              className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all placeholder:text-slate-300 font-medium text-sm"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading}
            className="w-full py-3.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/15 active:scale-[0.98] text-sm disabled:opacity-50 mt-1"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-500 ml-1">6-Digit Verification Code</label>
            <input
              className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all text-center tracking-[0.5em] font-bold text-lg"
              placeholder="000000"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading}
            className="w-full py-3.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/15 active:scale-[0.98] text-sm disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Confirm Login"}
          </button>
          <div className="text-center pt-2">
            <button 
              type="button"
              onClick={handleResend}
              className="text-[11px] font-bold text-slate-400 hover:text-brand-600 uppercase tracking-wider transition-colors"
            >
              Didn't get the code? Resend
            </button>
          </div>
        </form>
      )}

      <p className="mt-7 text-center text-sm text-slate-400 font-medium">
        Don't have an account? <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">Create one</Link>
      </p>
    </AuthLayout>
  );
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { data } = await registerUser(name, email, password);
      if (data.requiresOTP) {
        setShowOTP(true);
      } else {
        login(data.token, data.role, data);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await verifyOTP(email, otp);
      login(data.token, data.role, data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP(email);
      alert("New OTP sent to your email!");
    } catch (err) {
      setError("Failed to resend OTP.");
    }
  };

  return (
    <AuthLayout title={showOTP ? "Verify Email" : "Create Account"} subtitle={showOTP ? `We've sent a code to ${email}` : "Start building with powerful APIs"}>
      {error && (
        <div className="mb-6 p-3.5 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl border border-rose-100/80 animate-shake flex items-center gap-2.5">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 6.5a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-3.5 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-xl border border-emerald-100/80">{success}</div>
      )}

      {!showOTP ? (
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-500 ml-1">Full Name</label>
            <input
              className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all placeholder:text-slate-300 font-medium text-sm"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-500 ml-1">Email Address</label>
            <input
              className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all placeholder:text-slate-300 font-medium text-sm"
              placeholder="you@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-500 ml-1">Password</label>
            <input
              className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all placeholder:text-slate-300 font-medium text-sm"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading}
            className="w-full py-3.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/15 active:scale-[0.98] text-sm disabled:opacity-50 mt-1"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-500 ml-1">6-Digit Verification Code</label>
            <input
              className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all text-center tracking-[0.5em] font-bold text-lg"
              placeholder="000000"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading}
            className="w-full py-3.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/15 active:scale-[0.98] text-sm disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Confirm Account"}
          </button>
          <div className="text-center pt-2">
            <button 
              type="button"
              onClick={handleResend}
              className="text-[11px] font-bold text-slate-400 hover:text-brand-600 uppercase tracking-wider transition-colors"
            >
              Didn't get the code? Resend
            </button>
          </div>
        </form>
      )}

      <p className="mt-7 text-center text-sm text-slate-400 font-medium">
        Already have an account? <Link to="/" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">Sign In</Link>
      </p>
    </AuthLayout>
  );
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["super_admin", "user"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <ProtectedRoute roles={["super_admin", "user"]}>
            <Services />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute roles={["super_admin", "user"]}>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute roles={["super_admin", "user"]}>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

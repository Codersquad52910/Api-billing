import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/auth";

const AuthLayout = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] relative overflow-hidden font-sans">
    {/* Ambient Background */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-500/[0.04] rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-500/[0.04] rounded-full blur-[100px]"></div>
    </div>

    <div className="max-w-[420px] w-full px-6 relative z-10 animate-in">
      <div className="bg-white rounded-3xl border border-slate-100/80 p-9 md:p-10 overflow-hidden relative" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 4px 6px rgba(0,0,0,0.02), 0 24px 48px rgba(0,0,0,0.06)' }}>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500/30 to-transparent"></div>

        <div className="text-center mb-9 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-5 shadow-xl shadow-slate-900/15">
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

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            await resetPassword(email, otp, newPassword);
            setMessage("Password reset successful. Redirecting to login...");
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password. Check your code.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Reset Password" subtitle="Create a new secure password for your account">
            {message && (
                <div className="mb-6 p-3.5 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-xl border border-emerald-100/80 animate-in">
                    {message}
                </div>
            )}
            {error && (
                <div className="mb-6 p-3.5 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl border border-rose-100/80 animate-shake flex items-center gap-2.5">
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 6.5a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10 text-left">
                <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-500 ml-1">Email Address</label>
                    <input
                        type="email"
                        className="w-full px-4 py-3.5 bg-slate-100/50 border border-slate-200/60 rounded-xl text-slate-400 font-medium cursor-not-allowed text-sm"
                        value={email}
                        readOnly
                    />
                </div>
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
                <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-500 ml-1">New Password</label>
                    <input
                        className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all placeholder:text-slate-300 font-medium text-sm"
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    disabled={loading}
                    className="w-full py-3.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/15 active:scale-[0.98] text-sm disabled:opacity-50 mt-1"
                >
                    {loading ? "Updating Password..." : "Update Password"}
                </button>
            </form>

            <div className="mt-7 text-center">
                <Link to="/" className="text-sm text-slate-400 font-medium hover:text-brand-600 transition-colors">Cancel and return to Sign In</Link>
            </div>
        </AuthLayout>
    );
};

export default ResetPassword;

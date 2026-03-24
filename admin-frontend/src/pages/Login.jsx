import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/auth";
import { ShieldCheck, Lock, Mail, Terminal, Activity } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
            if (data.role !== 'admin' && data.role !== 'super_admin') {
                setError("Access Denied: Admin authorization required.");
                setLoading(false);
                return;
            }
            login(data.token, data.role, { name: data.name || "Administrator" });
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
            {/* Animated Dark Background */}
            <div className="absolute inset-0 bg-[#020617] overflow-hidden">
                <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-brand-600/8 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] bg-violet-600/8 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.08] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at center, #334155 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
            </div>

            <div className="max-w-[400px] w-full px-6 relative z-10 animate-in">
                <div className="bg-slate-900/50 backdrop-blur-2xl rounded-3xl border border-white/[0.06] p-9 md:p-10 overflow-hidden relative" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 20px 50px rgba(0,0,0,0.4)' }}>
                    {/* Top gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500/40 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -mr-16 -mt-16"></div>

                    <div className="mb-9 relative z-10 text-center">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-950 font-bold text-2xl mx-auto mb-5 shadow-2xl shadow-white/10 hover:scale-105 transition-transform duration-500">
                            A
                        </div>
                        <h2 className="text-2xl font-extrabold text-white font-display tracking-tight">Admin Console</h2>
                        <p className="text-slate-400 mt-1.5 font-medium text-sm flex items-center justify-center gap-1.5">
                            <ShieldCheck size={14} className="text-brand-400" /> Secure Access
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3.5 bg-rose-500/10 text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/15 text-center animate-shake flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a7 7 0 100 14A7 7 0 008 1zm-.75 4a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0V5zm.75 6.5a.75.75 0 110-1.5.75.75 0 010 1.5z" /></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10 text-left">
                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold text-slate-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-400 transition-colors">
                                    <Mail size={16} />
                                </div>
                                <input
                                    type="email"
                                    className="w-full pl-11 pr-5 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/30 focus:bg-white/[0.06] transition-all placeholder:text-slate-600 font-medium text-white text-sm"
                                    placeholder="admin@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold text-slate-400 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-400 transition-colors">
                                    <Lock size={16} />
                                </div>
                                <input
                                    type="password"
                                    className="w-full pl-11 pr-5 py-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/30 focus:bg-white/[0.06] transition-all placeholder:text-slate-600 font-medium text-white text-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg shadow-white/5 active:scale-[0.98] text-sm disabled:opacity-50 mt-1"
                        >
                            {loading ? "Authenticating..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-center gap-5 opacity-20">
                        <Terminal size={14} className="text-white" />
                        <Activity size={14} className="text-white" />
                        <ShieldCheck size={14} className="text-white" />
                    </div>
                </div>

                <p className="mt-6 text-center text-[9px] font-bold text-slate-700 uppercase tracking-[0.2em]">
                    &copy; 2026 ApiBill Admin Console
                </p>
            </div>
        </div>
    );
};

export default Login;

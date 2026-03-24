import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Users, LogOut, Settings, BarChart3, Menu, X, ShieldCheck } from "lucide-react";

const Layout = ({ children }) => {
    const { role, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
        { name: "Services", path: "/services", icon: <BarChart3 size={18} /> },
    ];

    return (
        <div className="flex h-screen bg-[#f8f9fc] font-sans overflow-hidden selection:bg-brand-100 selection:text-brand-900">
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 w-[270px] bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-400 flex flex-col z-50 transition-all duration-500
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                md:relative md:translate-x-0 md:flex
            `}>
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>

                <div className="p-7 flex items-center justify-between">
                    <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-600/25">
                            A
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-tight font-display">Archon</h1>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">Admin Console</p>
                        </div>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    <p className="px-4 text-[9px] font-bold text-slate-600 uppercase tracking-[0.25em] mb-3">Navigation</p>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${isActive
                                    ? "bg-brand-500/10 font-semibold text-brand-400"
                                    : "hover:bg-white/[0.04] hover:text-slate-200"
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-500 rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.6)]"></div>
                                )}
                                <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-brand-400' : 'text-slate-500'}`}>{item.icon}</span>
                                <span className="text-[13px]">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-5 space-y-3">
                    <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.06] relative overflow-hidden">
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-brand-400 font-bold text-xs border border-brand-500/15">
                                {role?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold text-white truncate font-display">Administrator</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot"></span>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider truncate">{role}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.03] text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all border border-white/[0.06] hover:border-rose-500/15 active:scale-95">
                        <LogOut size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto scroll-smooth w-full relative">
                {/* Mobile Header */}
                <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100/80 sticky top-0 z-40 px-6 py-4 flex justify-between items-center md:hidden">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-400 hover:text-brand-600 transition-colors">
                            <Menu size={22} />
                        </button>
                        <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
                        <h1 className="text-base font-bold text-slate-900 font-display">Archon Admin</h1>
                    </div>
                </header>

                <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-full flex flex-col animate-in">
                    <div className="flex-1">
                        {children}
                    </div>

                    <footer className="mt-12 pt-6 border-t border-slate-100/80 flex flex-col md:flex-row justify-between items-center gap-3 pb-6">
                        <div className="flex items-center gap-2 text-slate-400 font-medium text-xs">
                            <ShieldCheck size={13} className="text-brand-500" /> Admin Console v4.0
                        </div>
                        <div className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.15em]">
                            Status: <span className="text-emerald-500">Online</span>
                        </div>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default Layout;

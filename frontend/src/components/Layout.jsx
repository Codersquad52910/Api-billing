import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

const Layout = ({ children }) => {
    const { user, logout, role } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("/notifications");
            setNotifications(res.data);
        } catch (error) {
            console.error("Failed to fetch notifications");
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const markAllRead = async () => {
        try {
            await axios.put("/notifications/read-all");
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const navItems = [
        { name: "Overview", path: "/dashboard", icon: "📊" },
        { name: "API Services", path: "/services", icon: "🔌" },
        { name: "My Profile", path: "/profile", icon: "👤" },
        { name: "Settings", path: "/settings", icon: "⚙️" },
    ];

    const isAdmin = role === "admin" || role === "super_admin";

    return (
        <div className="flex h-screen bg-[#f8f9fc] font-sans overflow-hidden">
            {/* Mobile Menu Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 w-[270px] bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-400 flex flex-col z-50 transition-all duration-500 ease-in-out
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                md:relative md:translate-x-0 md:flex
            `}>
                {/* Top gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>

                <div className="p-7 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-600/25">
                            A
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight font-display">ApiBill</h1>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em]">Cloud Platform</p>
                        </div>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-500 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>

                <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
                    <div className="px-4 mb-4 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-600">Navigation</div>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all duration-300 group relative ${isActive
                                    ? "bg-brand-500/10 text-brand-400"
                                    : "hover:bg-white/[0.04] hover:text-slate-200"
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand-500 rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.6)]"></div>
                                )}
                                <span className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}

                    {isAdmin && (
                        <div className="pt-6 px-0">
                            <div className="px-4 mb-3 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-600">Admin Zone</div>
                            <a
                                href="http://localhost:5174"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all duration-300 hover:bg-white/[0.04] hover:text-slate-200 group"
                            >
                                <span className="text-lg group-hover:scale-110 transition-transform">🛡️</span>
                                Admin Panel
                                <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity" viewBox="0 0 12 12" fill="none"><path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </a>
                        </div>
                    )}
                </nav>

                <div className="p-5 mt-auto">
                    <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.06] mb-3">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center text-sm font-bold text-brand-400 uppercase border border-brand-500/15">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate font-display">{user?.name || "User"}</p>
                                <p className="text-[9px] text-slate-500 truncate uppercase tracking-[0.15em] font-bold">{role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] font-bold text-slate-500 hover:text-rose-400 bg-white/[0.03] border border-white/[0.06] rounded-xl transition-all hover:border-rose-500/20 hover:bg-rose-500/5 uppercase tracking-widest"
                        >
                            <span>🚪</span> Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden h-screen w-full relative">
                <header className="h-[72px] bg-white/80 backdrop-blur-xl border-b border-slate-100/80 flex items-center justify-between px-6 md:px-8 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2.5 -ml-2 text-slate-400 md:hidden hover:bg-slate-50 rounded-xl transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 font-display">
                                {navItems.find(i => location.pathname === i.path)?.name || "Dashboard"}
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center gap-2.5 text-[10px] font-bold text-slate-500 bg-slate-50/80 px-4 py-2 rounded-full border border-slate-100/60 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] pulse-dot"></span>
                            System Online
                        </div>
                        <div className="h-7 w-[1px] bg-slate-100 hidden sm:block"></div>
                        <div className="relative">
                            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50/50 rounded-xl transition-all relative group">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white pulse-dot"></span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4">
                                    <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                                        <h3 className="font-bold text-slate-900 font-display">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button onClick={markAllRead} className="text-[10px] font-bold text-brand-600 hover:text-brand-700 uppercase tracking-wider">
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-80 overflow-y-auto scrollbar-thin">
                                        {notifications.length === 0 ? (
                                            <div className="p-6 text-center text-slate-400 text-sm font-medium">
                                                No new notifications
                                            </div>
                                        ) : (
                                            notifications.map(notif => (
                                                <div 
                                                    key={notif._id} 
                                                    onClick={() => !notif.isRead && markAsRead(notif._id)}
                                                    className={`p-4 border-b border-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 ${notif.isRead ? 'opacity-60' : 'bg-brand-50/30'}`}
                                                >
                                                    <div className={`mt-0.5 text-lg ${notif.type === 'success' ? 'text-emerald-500' : notif.type === 'warning' ? 'text-amber-500' : 'text-brand-500'}`}>
                                                        {notif.type === 'success' ? '✓' : notif.type === 'warning' ? '⚠️' : 'ℹ️'}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                                                        <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{notif.message}</p>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 block">
                                                            {new Date(notif.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto px-6 py-8 md:px-8 md:py-10 scrollbar-thin">
                    <div className="max-w-[1400px] mx-auto animate-in">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;

import { useEffect, useState, useCallback } from "react";
import StatCard from "../components/StatCard";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Plus, Search, Filter, MoreVertical, ShieldAlert, Cpu, Activity, DollarSign, Users as UsersIcon, Terminal } from "lucide-react";

const Dashboard = () => {
    const { role } = useAuth();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Super Admin Specific State
    const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
    const [adminMsg, setAdminMsg] = useState("");

    const fetchData = useCallback(async () => {
        try {
            if (role === "super_admin") {
                const overviewRes = await axios.get("/admin/overview");
                setStats(overviewRes.data);
            }
            const usersRes = await axios.get("/admin/users");
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Error fetching admin data:", error);
            setError(error.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    }, [role]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/super-admin/create-admin", newAdmin);
            setAdminMsg("Identity created: Admin credentials active.");
            setNewAdmin({ name: "", email: "", password: "" });
        } catch (error) {
            console.error("Error creating admin:", error);
            setAdminMsg("Error: Signal lost during creation.");
        }
    };

    const manageKeys = (userId) => {
        alert(`Accessing protocols for user ${userId}... Component integration pending.`);
    }

    if (loading) return (
        <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Initializing Interface...</p>
        </div>
    );

    if (error) return (
        <div className="p-12 border-2 border-dashed border-rose-100 rounded-[3rem] text-center max-w-2xl mx-auto mt-20">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldAlert size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Protocol Failure</h2>
            <p className="text-slate-500 mb-8">{error}</p>
            <button onClick={fetchData} className="px-8 py-3 bg-slate-950 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all">Attempt Reconnection</button>
        </div>
    );

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-brand-600/10 text-brand-600 rounded-lg flex items-center justify-center">
                            <Terminal size={18} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-950 tracking-tight font-display uppercase">
                            {role === 'super_admin' ? 'Strategic Command' : 'Fiscal Operations'}
                        </h2>
                    </div>
                    <p className="text-slate-400 font-medium text-sm max-w-lg">
                        {role === 'super_admin'
                            ? 'Global ecosystem analysis and identity management protocols active.'
                            : 'Monitor user telemetry and optimize service pricing structures.'}
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl premium-shadow border border-slate-100">
                    <div className="px-5 py-2.5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Current Phase</p>
                        <p className="text-xs font-bold text-slate-900">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                        <Activity size={20} />
                    </div>
                </div>
            </div>

            {/* SUPER ADMIN VIEW: Global Analytics */}
            {role === "super_admin" && stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard title="Global Revenue" value={`$${stats.totalRevenue}`} icon={<DollarSign size={24} />} trend={12} color="bg-emerald-50 text-emerald-600 border-emerald-100/50" />
                    <StatCard title="System Throughput" value={stats.totalRequests} icon={<Cpu size={24} />} trend={8.4} color="bg-brand-50 text-brand-600 border-brand-100/50" />
                    <StatCard title="Active Identities" value={stats.totalUsers} icon={<UsersIcon size={24} />} trend={2.1} color="bg-indigo-50 text-indigo-600 border-indigo-100/50" />
                    <StatCard title="Protocol Keys" value={stats.activeKeys} icon={<Activity size={24} />} trend={-1.4} color="bg-slate-50 text-slate-600 border-slate-200/50" />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Table: User Billing & API Rates */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] premium-shadow border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center text-white">
                                    <Activity size={20} />
                                </div>
                                <h3 className="text-lg font-black text-slate-950 font-display uppercase tracking-tight">Identity Billing Matrix</h3>
                            </div>
                            <div className="flex gap-2">
                                <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"><Search size={18} /></button>
                                <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"><Filter size={18} /></button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    <tr>
                                        <th className="px-8 py-5">Identity/Email</th>
                                        <th className="px-8 py-5">Throughput</th>
                                        <th className="px-8 py-5">Accrued Cost</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <p className="font-bold text-slate-900 font-display">{user.name}</p>
                                                <p className="text-[10px] font-medium text-slate-400">{user.email}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg text-xs">
                                                    {user.totalRequests.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 font-mono font-black text-brand-600 text-base">${user.totalRevenue}</td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Active</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button onClick={() => manageKeys(user._id)} className="px-4 py-2 bg-slate-950 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                                                    Sync
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar Protocol: Create Admin */}
                <div className="space-y-8">
                    {role === "super_admin" && (
                        <div className="bg-white p-8 rounded-[2.5rem] premium-shadow border border-slate-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>

                            <div className="flex items-center gap-4 mb-8 relative z-10">
                                <div className="w-12 h-12 bg-slate-950 rounded-2xl text-white flex items-center justify-center shadow-2xl">
                                    <Plus size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-950 font-display uppercase tracking-tight">Deploy Admin</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expansion Protocol</p>
                                </div>
                            </div>

                            {adminMsg && (
                                <div className={`mb-8 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all animate-in ${adminMsg.includes('credentials') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                    {adminMsg}
                                </div>
                            )}

                            <form onSubmit={handleCreateAdmin} className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Identity Name</label>
                                    <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 font-medium text-sm"
                                        placeholder="Archon Alpha" value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Universal ID</label>
                                    <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 font-medium text-sm"
                                        placeholder="archon@core.com" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Access Key</label>
                                    <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 font-medium text-sm"
                                        type="password" placeholder="••••••••" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} required />
                                </div>
                                <button className="w-full py-4 bg-slate-950 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-950/10 active:scale-[0.98]">
                                    Initialize Deployment
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="p-8 bg-brand-600 rounded-[2.5rem] shadow-2xl shadow-brand-600/20 text-white relative overflow-hidden group">
                        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-white/10 rounded-full blur-[80px]"></div>
                        <div className="relative z-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">System Status</h4>
                            <p className="text-2xl font-black font-display tracking-tight mb-6">Security Node 04 <br />Active & Stable</p>
                            <div className="flex items-center gap-4">
                                <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-bold uppercase tracking-widest">Latency: 4ms</div>
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

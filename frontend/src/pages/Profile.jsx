import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

const Profile = () => {
    const { role } = useAuth();
    const [userData, setUserData] = useState({
        name: "Loading...",
        email: "Loading...",
        role: role,
        joined: "Loading..."
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get("/auth/me");
                setUserData({
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    joined: new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchProfile();
    }, []);

    return (
        <Layout>
            <div className="mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">My Profile</h2>
                <p className="text-slate-400 mt-1.5 font-medium text-sm">Manage your identity and account details.</p>
            </div>

            <div className="bg-white rounded-3xl premium-shadow border border-slate-100/80 overflow-hidden max-w-4xl relative">
                {/* Cover */}
                <div className="h-44 bg-gradient-to-br from-brand-600 via-brand-500 to-violet-500 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                </div>

                <div className="px-8 md:px-10 pb-10 relative">
                    <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 mb-10 relative z-10">
                        <div className="w-32 h-32 rounded-2xl border-4 border-white bg-white flex items-center justify-center shadow-xl overflow-hidden group">
                            <div className="w-full h-full rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-4xl font-black text-brand-600 transition-transform duration-500 group-hover:scale-110">
                                {userData.name ? userData.name[0].toUpperCase() : 'U'}
                            </div>
                        </div>
                        <div className="flex-1 pb-1">
                            <h3 className="text-3xl font-extrabold text-slate-900 mb-2 font-display">{userData.name}</h3>
                            <div className="flex items-center gap-2">
                                <span className="bg-brand-50 text-brand-600 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase border border-brand-100/50 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span> {userData.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        <div className="lg:col-span-3 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Email</label>
                                    <p className="text-slate-900 font-bold text-base">{userData.email}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Member Since</label>
                                    <p className="text-slate-900 font-bold text-base">{userData.joined}</p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button className="py-3 px-8 bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200/60 hover:border-brand-200 hover:text-brand-600 hover:bg-brand-50/30 transition-all text-sm">
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-slate-50/50 p-7 rounded-2xl border border-slate-100/80 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 opacity-30 group-hover:scale-125 transition-transform duration-500"></div>
                                <h4 className="font-bold text-slate-900 mb-5 font-display flex items-center gap-2 relative z-10 text-sm">
                                    Account Health
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></span>
                                </h4>
                                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit mb-5 border border-emerald-100/50 relative z-10">
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Verified & Active</span>
                                </div>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed mb-5 relative z-10">
                                    Your account is fully operational. All API endpoints and billing modules are active.
                                </p>
                                <div className="h-1.5 bg-slate-200/60 rounded-full overflow-hidden relative z-10">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[94%] rounded-full"></div>
                                </div>
                                <div className="flex justify-between mt-2 relative z-10">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase">Trust Score</span>
                                    <span className="text-[9px] font-bold text-emerald-600 uppercase">94%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;

import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

const Profile = () => {
    const { role, updateUser } = useAuth();
    const [userData, setUserData] = useState({
        name: "Loading...",
        email: "Loading...",
        role: role,
        joined: "Loading..."
    });
    
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: "", email: "" });
    const [isSaving, setIsSaving] = useState(false);

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
                setEditData({ name: data.name, email: data.email });
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };
        fetchProfile();
    }, []);

    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);
            const { data } = await axios.put("/auth/profile", editData);
            setUserData(prev => ({
                ...prev,
                name: data.user.name,
                email: data.user.email
            }));
            updateUser({ name: data.user.name });
            setIsEditing(false);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

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
                    <div className="flex flex-col md:flex-row md:items-center gap-8 -mt-12 mb-12 relative z-10">
                        <div className="w-32 h-32 rounded-[2rem] border-[6px] border-white bg-white flex items-center justify-center shadow-xl overflow-hidden group">
                            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-5xl font-black text-brand-600 transition-transform duration-500 group-hover:scale-110">
                                {userData.name ? userData.name[0].toUpperCase() : 'U'}
                            </div>
                        </div>
                        <div className="flex-1 mt-4 md:mt-12">
                            {isEditing ? (
                                <input 
                                    className="text-4xl font-extrabold text-slate-900 mb-2 font-display bg-white border-2 border-brand-200 rounded-xl px-3 py-1 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 w-full max-w-sm transition-all shadow-sm"
                                    value={editData.name}
                                    onChange={e => setEditData({...editData, name: e.target.value})}
                                    placeholder="Your Name"
                                    autoFocus
                                />
                            ) : (
                                <h3 className="text-4xl font-extrabold text-slate-900 mb-2 font-display tracking-tight">{userData.name}</h3>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                <span className="bg-brand-50 text-brand-600 px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-brand-500 pulse-dot"></span> {userData.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        <div className="lg:col-span-3 flex flex-col justify-between">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Email Address
                                    </label>
                                    {isEditing ? (
                                        <input 
                                            className="text-lg font-bold text-slate-900 bg-white border-2 border-brand-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 w-full transition-all shadow-sm"
                                            value={editData.email}
                                            onChange={e => setEditData({...editData, email: e.target.value})}
                                            type="email"
                                        />
                                    ) : (
                                        <p className="text-slate-900 font-bold text-lg md:text-xl truncate">{userData.email}</p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Member Since
                                    </label>
                                    <p className="text-slate-600 font-bold text-lg md:text-xl">{userData.joined}</p>
                                </div>
                            </div>

                            <div className="pt-10 mt-auto flex gap-4 border-t border-slate-100/50">
                                {isEditing ? (
                                    <>
                                        <button 
                                            onClick={handleSaveProfile}
                                            disabled={isSaving}
                                            className="py-3.5 px-10 bg-brand-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-700 active:scale-95 transition-all text-sm flex items-center gap-2"
                                        >
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditData({ name: userData.name, email: userData.email });
                                            }}
                                            className="py-3.5 px-8 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 active:scale-95 transition-all text-sm shadow-sm"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="py-3.5 px-10 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:border-brand-300 hover:text-brand-600 shadow-sm active:scale-[0.98] transition-all text-sm flex items-center gap-2 group"
                                    >
                                        <svg className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Edit Profile
                                    </button>
                                )}
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

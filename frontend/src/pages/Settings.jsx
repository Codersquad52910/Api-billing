import Layout from "../components/Layout";

const Settings = () => {
    return (
        <Layout>
            <div className="mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Settings</h2>
                <p className="text-slate-400 mt-1.5 font-medium text-sm">Manage your account security and preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl">
                <div className="lg:col-span-2 order-2 lg:order-1">
                    <div className="bg-white rounded-3xl premium-shadow border border-slate-100/80 p-8 md:p-10 overflow-hidden relative">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500/20 to-transparent"></div>

                        <div className="flex items-center gap-4 mb-8 relative z-10">
                            <div className="w-11 h-11 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-slate-900/10">
                                🔐
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 font-display">Change Password</h3>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Update your credentials</p>
                            </div>
                        </div>

                        <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-2">
                                <label className="text-[11px] font-semibold text-slate-500 ml-1">Current Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all placeholder:text-slate-300 font-medium text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold text-slate-500 ml-1">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all placeholder:text-slate-300 font-medium text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold text-slate-500 ml-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 focus:bg-white transition-all placeholder:text-slate-300 font-medium text-sm"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button className="w-full md:w-fit px-10 py-3.5 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/15 active:scale-95 text-sm">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
                    <div className="bg-white rounded-3xl p-8 border border-slate-100/80 premium-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-violet-500/10 rounded-full blur-2xl"></div>
                        <h4 className="font-bold text-base text-slate-900 mb-6 font-display flex items-center gap-3 relative z-10">
                            <span className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-sm border border-brand-100/50">🔔</span>
                            Notifications
                        </h4>
                        <div className="space-y-3 relative z-10">
                            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-brand-200 transition-colors">
                                <div className="space-y-0.5">
                                    <span className="text-sm font-semibold text-slate-800 block">Email Alerts</span>
                                    <span className="text-[9px] text-slate-500 flex items-center gap-1.5 uppercase font-bold tracking-wider">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span> Active
                                    </span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-10 h-5 border border-slate-200 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500 peer-checked:border-brand-500 shadow-sm"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-100/80 premium-shadow group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-slate-50 rounded-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150 opacity-50"></div>
                        <h4 className="font-bold text-base text-slate-900 mb-3 font-display relative z-10">Need Help?</h4>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6 relative z-10">
                            Reach out to our support team for assistance with your account.
                        </p>
                        <button className="w-full py-3 bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200/60 hover:bg-slate-100 hover:border-slate-200 transition-all text-sm relative z-10">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;

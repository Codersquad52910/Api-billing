const StatCard = ({ title, value, icon, trend }) => {
    return (
        <div className="bg-white p-7 rounded-2xl border border-slate-100/80 premium-shadow stat-card-glow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-brand-50 to-transparent rounded-full -mr-10 -mt-10 transition-all duration-700 group-hover:scale-125 group-hover:from-brand-100"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-xl text-2xl border border-brand-100/40 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:shadow-brand-200/30 group-hover:scale-105 transition-all duration-500">
                        {icon}
                    </div>
                    {trend && (
                        <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${trend > 0
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/60'
                                : 'bg-rose-50 text-rose-600 border border-rose-100/60'
                            }`}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={trend < 0 ? 'rotate-180' : ''}>
                                <path d="M5 2L8 6H2L5 2Z" fill="currentColor" />
                            </svg>
                            {Math.abs(trend)}%
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{title}</h3>
                    <div className="flex items-baseline gap-1">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">{value}</h2>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-400/0 to-transparent group-hover:via-brand-400/40 transition-all duration-700"></div>
        </div>
    );
};

export default StatCard;

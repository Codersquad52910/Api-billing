const StatCard = ({ title, value, icon, trend, color }) => {
    return (
        <div className="bg-white p-7 rounded-2xl premium-shadow border border-slate-100/80 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-brand-50/50 to-transparent rounded-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300 ${color || 'bg-brand-50 text-brand-600 border border-brand-100/50'}`}>
                    {icon}
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${trend > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/60' : 'bg-rose-50 text-rose-600 border border-rose-100/60'}`}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={trend < 0 ? 'rotate-180' : ''}>
                            <path d="M5 2L8 6H2L5 2Z" fill="currentColor" />
                        </svg>
                        {trend > 0 ? '+' : ''}{trend}%
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1.5">{title}</h3>
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">{value}</p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-400/0 to-transparent group-hover:via-brand-400/30 transition-all duration-700"></div>
        </div>
    );
};

export default StatCard;

import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SalesChart = ({ data, title = "Usage Analytics", activeRange = "Monthly", onTimeRangeChange, keysList = [], selectedKey = "all", onKeyChange }) => {

    // Generate zero-state mock data if there is no usage
    const defaultData = [
        { date: 'Mon', cost: 0, tokens: 0 },
        { date: 'Tue', cost: 0, tokens: 0 },
        { date: 'Wed', cost: 0, tokens: 0 },
        { date: 'Thu', cost: 0, tokens: 0 },
        { date: 'Fri', cost: 0, tokens: 0 },
        { date: 'Sat', cost: 0, tokens: 0 },
        { date: 'Sun', cost: 0, tokens: 0 },
    ];

    const displayData = data && data.length > 0 ? data : defaultData;

    // Filter X-axis labels to prevent crowding in 24H view
    const xAxisInterval = activeRange === '24H' ? 3 : 0;

    return (
        <div className="bg-white p-8 rounded-2xl border border-slate-100/80 premium-shadow h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">{title}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Real-time performance metrics</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {onKeyChange && (
                        <select 
                            value={selectedKey} 
                            onChange={(e) => onKeyChange(e.target.value)}
                            className="bg-slate-50/80 border border-slate-200 text-slate-700 text-[10px] uppercase font-bold tracking-wider rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 block px-3 py-2 outline-none cursor-pointer"
                        >
                            <option value="all">Global (All Keys)</option>
                            {keysList.map(k => (
                                <option key={k._id} value={k._id}>...{k.key.slice(-8)}</option>
                            ))}
                        </select>
                    )}
                    <div className="flex bg-slate-50/80 p-1 rounded-xl border border-slate-100/60 shadow-inner overflow-hidden">
                        {['Monthly', 'Weekly', '24H'].map(range => (
                            <button 
                                key={range}
                                onClick={() => onTimeRangeChange && onTimeRangeChange(range)}
                                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all rounded-lg ${activeRange === range ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100/80 scale-100' : 'text-slate-400 hover:text-slate-700 border border-transparent scale-95 hover:scale-100'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-1 h-80 min-h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 600 }}
                            dy={15}
                            interval={xAxisInterval}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                            tickFormatter={(val) => val.toLocaleString()}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#10b981', fontSize: 10, fontWeight: 600 }}
                            tickFormatter={(val) => `$${val}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.3)',
                                padding: '14px 18px'
                            }}
                            itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}
                            labelStyle={{ color: '#64748b', fontSize: '10px', marginBottom: '6px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', paddingTop: '10px' }} />
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="tokens"
                            name="Tokens Used"
                            stroke="#4f46e5"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorTokens)"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="cost"
                            name="Cost"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#fff', stroke: '#10b981', strokeWidth: 2 }}
                            activeDot={{ r: 6 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SalesChart;

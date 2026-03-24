import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const SalesChart = ({ data, title = "Analytics Overview", color = "#4f46e5", dataKey = "sales", formatter = (val) => val }) => {
    return (
        <div className="bg-white p-8 rounded-2xl border border-slate-100/80 premium-shadow h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 font-display">{title}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Real-time performance metrics</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-slate-50/80 p-1 rounded-xl border border-slate-100/60">
                        <button className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-white text-slate-900 shadow-sm border border-slate-100 rounded-lg">30D</button>
                        <button className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors">7D</button>
                        <button className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors">24H</button>
                    </div>
                </div>
            </div>
            <div className="flex-1 h-80 min-h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorChart" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                                <stop offset="50%" stopColor={color} stopOpacity={0.05} />
                                <stop offset="100%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                            tickFormatter={formatter}
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
                            formatter={(value) => [formatter(value), 'Revenue']}
                            cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '5 5' }}
                        />
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorChart)"
                            activeDot={{ r: 5, fill: '#fff', stroke: color, strokeWidth: 2.5, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SalesChart;

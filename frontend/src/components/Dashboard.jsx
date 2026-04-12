import { useEffect, useState } from "react";
import axios from "../api/axios";
import Layout from "./Layout";
import StatCard from "./StatCard";
import SalesChart from "./SalesChart";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsage: 0,
        currentBill: 0,
        activeKeys: 0,
        chartData: []
    });
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copiedKey, setCopiedKey] = useState(null);

    const [isAddingKey, setIsAddingKey] = useState(false);
    const [newKeyValue, setNewKeyValue] = useState("");

    const [timeRange, setTimeRange] = useState("Monthly");
    const [selectedKey, setSelectedKey] = useState("all");
    const [testCount, setTestCount] = useState({}); // Stores count per key ID

    useEffect(() => {
        fetchDashboardData();
    }, [timeRange, selectedKey]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, keysRes] = await Promise.all([
                axios.get(`/usage/stats?period=${timeRange}&apiKeyId=${selectedKey}`),
                axios.get("/keys")
            ]);
            setStats(statsRes.data || {
                totalUsage: 0,
                currentBill: 0,
                activeKeys: 0,
                chartData: []
            });
            setKeys(Array.isArray(keysRes.data) ? keysRes.data : []);
            setError(null);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Unable to connect to the analytics server. Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveKey = async () => {
        if (!newKeyValue.trim()) {
            alert("Please enter a valid API key");
            return;
        }
        try {
            await axios.post("/keys/add", { key: newKeyValue.trim() });
            setNewKeyValue("");
            setIsAddingKey(false);
            fetchDashboardData();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to add API key. It might already exist.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) return;
        try {
            await axios.delete(`/keys/${id}`);
            fetchDashboardData();
        } catch {
            alert("Failed to delete key");
        }
    };

    const handleCopyKey = (key) => {
        navigator.clipboard.writeText(key);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleTestKey = async (apiKey, keyId) => {
        const count = parseInt(testCount[keyId]) || 1;
        try {
            // Send requests in a batch based on chosen count
            const requests = Array(count).fill().map(() => 
                axios.get(`/gateway/call?key=${apiKey}`)
            );
            
            await Promise.all(requests);
            
            // Re-fetch data to see the update
            fetchDashboardData();
            
            alert(`Success! Simulated ${count} API request${count > 1 ? 's' : ''}. Your analytics have been updated!`);
        } catch (err) {
            console.error("Test failed:", err);
            const errorMsg = err.response?.data?.error || "Connection error. Check if the server is running.";
            alert(`Failed to test API: ${errorMsg}`);
        }
    };

    // Greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 text-center">
                    <div className="relative w-14 h-14">
                        <div className="absolute inset-0 border-[3px] border-brand-100 rounded-full"></div>
                        <div className="absolute inset-0 border-[3px] border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] animate-pulse">Loading Dashboard</p>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center h-[60vh] space-y-8 text-center px-4 max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 text-4xl border border-rose-100 shadow-lg shadow-rose-100/50">⚠️</div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 font-display">Connection Error</h2>
                        <p className="text-slate-500 mt-2 font-medium text-sm leading-relaxed">{error}</p>
                    </div>
                    <button
                        onClick={fetchDashboardData}
                        className="px-8 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all font-bold shadow-lg shadow-brand-500/20 active:scale-95 text-sm"
                    >
                        Try Again
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-brand-600 font-semibold text-sm mb-1">{getGreeting()}, {user?.name || "User"} 👋</p>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">Performance Overview</h2>
                    <p className="text-slate-400 mt-1.5 font-medium text-sm">Monitor your API usage and billing at a glance.</p>
                </div>
                <div className="flex gap-3 items-center">
                    {isAddingKey ? (
                        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm relative z-10 transition-all duration-300">
                            <input 
                                type="text" 
                                placeholder="sk-your-api-key-here..." 
                                value={newKeyValue}
                                onChange={(e) => setNewKeyValue(e.target.value)}
                                className="px-3 py-2 text-sm text-slate-700 rounded-lg outline-none w-64 bg-transparent font-medium"
                                autoFocus
                            />
                            <button 
                                onClick={handleSaveKey} 
                                className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 font-bold transition-all text-xs"
                            >
                                Save
                            </button>
                            <button 
                                onClick={() => { setIsAddingKey(false); setNewKeyValue(""); }} 
                                className="text-slate-400 hover:text-slate-600 px-2 py-2 transition-colors font-bold text-xs"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => setIsAddingKey(true)} className="bg-brand-600 text-white px-6 py-3 rounded-xl hover:bg-brand-700 transition-all font-bold shadow-lg shadow-brand-500/15 flex items-center gap-2 active:scale-95 text-xs uppercase tracking-wider">
                            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            Add API Key
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard title="Current Bill" value={`$${stats.currentBill}`} icon="💰" />
                <StatCard title="Total Usage" value={stats.totalUsage.toLocaleString()} icon="⚡" />
                <StatCard title="Active Keys" value={stats.activeKeys} icon="🔑" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <SalesChart 
                        data={stats.chartData} 
                        title="Usage Analytics" 
                        activeRange={timeRange} 
                        onTimeRangeChange={setTimeRange}
                        keysList={keys}
                        selectedKey={selectedKey}
                        onKeyChange={setSelectedKey}
                    />
                </div>

                <div className="bg-white p-7 rounded-2xl border border-slate-100/80 premium-shadow flex flex-col" style={{ maxHeight: '520px' }}>
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 font-display">API Keys</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{keys.length} credential{keys.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 border border-slate-100">
                            🔒
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                        {keys.map((key) => (
                            <div key={key._id} className="group p-4 bg-slate-50/50 rounded-xl border border-slate-100/80 hover:border-brand-200/60 hover:bg-brand-50/10 transition-all duration-300">
                                <div className="flex justify-between items-start mb-3">
                                    <button
                                        onClick={() => handleCopyKey(key.key)}
                                        className="font-mono text-[11px] text-slate-600 font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-sm transition-all group-hover:border-brand-100 hover:bg-brand-50 cursor-pointer"
                                        title="Click to copy"
                                    >
                                        {copiedKey === key.key ? '✓ Copied!' : `${key.key.substring(0, 16)}...`}
                                    </button>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <input 
                                            type="number" 
                                            min="1" 
                                            max="100"
                                            value={testCount[key._id] || 1}
                                            onChange={(e) => setTestCount({...testCount, [key._id]: e.target.value})}
                                            className="w-10 h-7 text-[10px] font-bold text-center bg-white border border-slate-200 rounded-lg outline-none focus:border-brand-300"
                                            onClick={(e) => e.stopPropagation()}
                                            title="Number of requests"
                                        />
                                        <button 
                                            onClick={() => handleTestKey(key.key, key._id)}
                                            className="text-emerald-500 hover:text-emerald-600 transition-all p-1.5 rounded-lg hover:bg-emerald-50"
                                            title={`Simulate ${testCount[key._id] || 1} requests`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handleDelete(key._id)} className="text-slate-300 hover:text-rose-500 transition-all p-1.5 rounded-lg hover:bg-rose-50">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1-1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider flex items-center gap-1.5 border border-emerald-100/50 uppercase">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Active
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400">${key.rate || 0.01}/req</span>
                                </div>
                            </div>
                        ))}
                        {keys.length === 0 && (
                            <div className="h-full py-16 flex flex-col items-center justify-center text-center">
                                <span className="text-4xl mb-3 opacity-10">🔑</span>
                                <p className="text-slate-400 text-sm font-medium font-display">No active keys</p>
                                <p className="text-slate-300 text-xs mt-1 font-medium">Generate your first key to begin</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;

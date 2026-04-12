
import { useEffect, useState } from "react";
import axios from "../api/axios";
import Layout from "../components/Layout";

const Services = () => {
    const [services, setServices] = useState([]);
    const [subscribedServices, setSubscribedServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesRes, userRes] = await Promise.all([
                    axios.get("/services"),
                    axios.get("/auth/me")
                ]);
                setServices(servicesRes.data);
                setSubscribedServices(userRes.data.subscribedServices || []);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubscribe = async (service) => {
        try {
            const { data } = await axios.post(`/services/${service._id}/subscribe`);
            try {
                await navigator.clipboard.writeText(data.generatedKey);
                window.prompt(
                    `${data.message}\n\nIMPORTANT: We have automatically copied your new key to your clipboard!\nIf that failed, you can manually copy it from the text box below:\n\nPlease paste this key into your Dashboard to activate analytics!`,
                    data.generatedKey
                );
            } catch (err) {
                window.prompt(
                    `${data.message}\n\nIMPORTANT: Please copy your exclusive Service API Key from the text box below and add it to your Dashboard to activate analytics!`,
                    data.generatedKey
                );
            }
            setSubscribedServices(data.subscribedServices);
        } catch (error) {
            alert(error.response?.data?.message || "Subscription failed");
        }
    };

    const handleUnsubscribe = async (serviceId) => {
        if (!window.confirm("Are you sure you want to unsubscribe? All connected API Keys will be instantly revoked.")) return;
        try {
            const { data } = await axios.post(`/services/${serviceId}/unsubscribe`);
            alert(data.message);
            setSubscribedServices(data.subscribedServices);
        } catch (error) {
            alert(error.response?.data?.message || "Unsubscription failed");
        }
    };

    const serviceIcons = ["🤖", "📊", "🔐", "🌐", "⚡", "🧠", "📡", "🔄"];

    return (
        <Layout>
            <div className="mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">API Services</h2>
                <p className="text-slate-400 mt-1.5 font-medium text-sm">Explore and subscribe to APIs for your projects.</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-[40vh] space-y-4">
                    <div className="w-12 h-12 border-[3px] border-brand-100 border-t-brand-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest animate-pulse">Loading Services</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {services.map((service, index) => {
                        const isSubscribed = subscribedServices.includes(service._id);
                        return (
                            <div key={service._id} className="bg-white p-7 rounded-2xl premium-shadow border border-slate-100/80 transition-all duration-300 group flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-brand-50/80 to-transparent rounded-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="flex justify-between items-start mb-5 relative z-10">
                                    <div className="w-12 h-12 bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-xl flex items-center justify-center text-2xl border border-brand-100/40 group-hover:shadow-md group-hover:shadow-brand-100/40 transition-all duration-300">
                                        {serviceIcons[index % serviceIcons.length]}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">per request</span>
                                        <span className="text-sm font-extrabold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100/80">
                                            ${service.baseRate.toFixed(3)}
                                        </span>
                                    </div>
                                </div>

                                <div className="relative z-10 flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 font-display group-hover:text-brand-600 transition-colors">{service.name}</h3>
                                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">{service.description}</p>
                                </div>

                                <div className="relative z-10 pt-4 border-t border-slate-50">
                                    {isSubscribed ? (
                                        <div className="flex gap-2">
                                            <div className="flex-1 py-3 bg-brand-50/60 text-brand-600 font-bold rounded-xl border border-brand-100/40 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-default">
                                                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                Subscribed
                                            </div>
                                            <button 
                                                onClick={() => handleUnsubscribe(service._id)}
                                                className="px-4 bg-rose-50/50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl border border-rose-100/50 transition-colors shadow-sm"
                                                title="Unsubscribe & Revoke Keys"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleSubscribe(service)}
                                            className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] text-xs uppercase tracking-wider"
                                        >
                                            Subscribe
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && services.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200/60 premium-shadow">
                    <span className="text-4xl mb-4 opacity-10">🔍</span>
                    <h3 className="text-lg font-bold text-slate-900 font-display">No services available</h3>
                    <p className="text-slate-400 mt-1 font-medium text-sm">New APIs are being added. Check back soon!</p>
                </div>
            )}
        </Layout>
    );
};

export default Services;

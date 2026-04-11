import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Plus, Edit3, Trash2, Activity, ShieldCheck, Info, DollarSign, XCircle, Search, Filter } from "lucide-react";

const ServiceManagement = () => {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({ name: "", description: "", baseRate: 0.01 });
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    const fetchServices = async () => {
        try {
            const { data } = await axios.get("/services/all");
            setServices(data);
        } catch (error) {
            console.error("ServiceManagement: Failed to fetch services", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleEdit = (service) => {
        setEditingId(service._id);
        setFormData({ name: service.name, description: service.description, baseRate: service.baseRate });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: "", description: "", baseRate: 0.01 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            baseRate: parseFloat(formData.baseRate)
        };

        try {
            if (editingId) {
                await axios.put(`/services/${editingId}`, payload);
                setEditingId(null);
            } else {
                await axios.post("/services", payload);
            }
            setFormData({ name: "", description: "", baseRate: 0.01 });
            fetchServices();
        } catch (error) {
            console.error("Failed to save service", error);
            alert("Protocol Error: Unable to commit changes to the service mesh.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Confirm deletion protocol: This action is irreversible.")) return;
        try {
            await axios.delete(`/services/${id}`);
            fetchServices();
        } catch (error) {
            console.error("Failed to delete service", error);
        }
    };

    if (loading) return (
        <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Synchronizing Ecosystem...</p>
        </div>
    );

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-brand-600/10 text-brand-600 rounded-lg flex items-center justify-center">
                            <Activity size={18} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-950 tracking-tight font-display uppercase">Service Mesh</h2>
                    </div>
                    <p className="text-slate-400 font-medium text-sm max-w-lg">
                        Configure advanced API endpoints and baseline fiscal protocols for the ecosystem.
                    </p>
                </div>
            </div>

            {/* Form: Add/Edit Service */}
            <div className="bg-white p-8 rounded-[2.5rem] premium-shadow border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex justify-between items-center mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-2xl ${editingId ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-slate-950 shadow-slate-950/20'}`}>
                            {editingId ? <Edit3 size={24} /> : <Plus size={24} />}
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-950 font-display uppercase tracking-tight">
                                {editingId ? "Modify Protocol" : "Initialize Service"}
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {editingId ? "Update existing parameters" : "Deploy new service node"}
                            </p>
                        </div>
                    </div>
                    {editingId && (
                        <button onClick={handleCancelEdit} className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">
                            Abort Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Service Designation</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                                <Info size={16} />
                            </div>
                            <input
                                required
                                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 font-medium text-sm"
                                placeholder="Core AI Interface"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Protocol Description</label>
                        <input
                            required
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 font-medium text-sm"
                            placeholder="Unified intelligence processing layer"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Fiscal Base Rate ($)</label>
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                                    <DollarSign size={16} />
                                </div>
                                <input
                                    type="number"
                                    step="0.001"
                                    required
                                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-all font-mono font-bold text-sm"
                                    value={formData.baseRate}
                                    onChange={(e) => setFormData({ ...formData, baseRate: e.target.value })}
                                />
                            </div>
                            <button type="submit" className={`px-8 py-4 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 ${editingId ? 'bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-500' : 'bg-slate-950 shadow-slate-950/20 hover:bg-slate-800'}`}>
                                {editingId ? "Commit" : "Deploy"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Table: Services List */}
            <div className="bg-white rounded-[2.5rem] premium-shadow border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center text-white">
                            <ShieldCheck size={20} />
                        </div>
                        <h3 className="text-lg font-black text-slate-950 font-display uppercase tracking-tight">Active Protocol Nodes</h3>
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
                                <th className="px-8 py-5">Designation</th>
                                <th className="px-8 py-5">Description</th>
                                <th className="px-8 py-5">Fiscal Rate</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {services.map((service) => (
                                <tr key={service._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6 font-bold text-slate-900 font-display text-base">{service.name}</td>
                                    <td className="px-8 py-6 text-slate-500 font-medium">{service.description}</td>
                                    <td className="px-8 py-6 font-mono font-black text-brand-600 text-base">${service.baseRate}</td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => handleEdit(service)}
                                                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 text-slate-400 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 rounded-xl transition-all active:scale-95 shadow-sm"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service._id)}
                                                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 rounded-xl transition-all active:scale-95 shadow-sm"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && services.length === 0 && (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-3xl flex items-center justify-center mx-auto">
                                <XCircle size={32} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No Active Nodes Found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceManagement;

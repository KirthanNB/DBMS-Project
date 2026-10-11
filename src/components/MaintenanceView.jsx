"use client";

import { useEffect, useState } from "react";
import { Wrench, Plus, Search, Edit, Trash2, X, RefreshCw, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function MaintenanceView() {
  const [records, setRecords] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    aircraft_id: "",
    maintenance_type: "",
    engineer_name: "",
    cost: "",
    status: "Pending"
  });

  async function loadMaintenance() {
    try {
      const res = await fetch("/api/maintenance");
      const data = await res.json();
      setRecords(data);

      const fRes = await fetch("/api/fleet");
      if (fRes.ok) {
        const fData = await fRes.json();
        const uniqueFleet = Array.from(new Map(fData.map(item => [item.Aircraft_ID, item])).values());
        setFleet(uniqueFleet);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadMaintenance();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function addRecord(e) {
    e.preventDefault();
    const res = await fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to add maintenance record");
      return;
    }
    alert("Maintenance record added successfully");
    clearForm();
    loadMaintenance();
  }

  function editRecord(rec) {
    setForm({
      aircraft_id: rec.Aircraft_ID,
      maintenance_type: rec.Maintenance_Type,
      engineer_name: rec.Engineer_Name,
      cost: rec.Cost,
      status: rec.Status || "Pending"
    });
    setEditing(true);
    setShowForm(true);
  }

  async function updateRecord(e) {
    e.preventDefault();
    const res = await fetch("/api/maintenance", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to update maintenance record");
      return;
    }
    alert("Maintenance record updated successfully");
    clearForm();
    loadMaintenance();
  }

  async function deleteRecord(aircraftId) {
    if (!confirm(`Are you sure you want to remove maintenance record for aircraft ${aircraftId}?`)) return;
    const res = await fetch("/api/maintenance", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aircraft_id: aircraftId })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to delete maintenance record");
      return;
    }
    alert("Maintenance record deleted successfully");
    loadMaintenance();
  }

  function clearForm() {
    setForm({
      aircraft_id: fleet[0]?.Aircraft_ID || "",
      maintenance_type: "",
      engineer_name: "",
      cost: "",
      status: "Pending"
    });
    setEditing(false);
    setShowForm(false);
  }

  const filtered = records.filter(r =>
    r.Aircraft_ID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.Model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.Maintenance_Type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.Engineer_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.Status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-xl shadow-2xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Wrench className="w-6 h-6 text-rose-400" />
            <span>Aircraft Maintenance & Engineering Logs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Airport hangar inspection logs, avionics overhauls, and budget costs recorded in <code className="text-rose-300">Maintenance</code> relation.
          </p>
        </div>

        <button
          onClick={() => {
            clearForm();
            setShowForm(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Log Maintenance Task</span>
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search maintenance by aircraft, model, type, or engineer..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-rose-400" />
                <span>{editing ? "Modify Maintenance Record" : "Log New Aircraft Maintenance"}</span>
              </h2>
              <button onClick={clearForm} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editing ? updateRecord : addRecord} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Aircraft</label>
                  <select
                    name="aircraft_id"
                    value={form.aircraft_id}
                    onChange={handleChange}
                    disabled={editing}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 disabled:opacity-50"
                  >
                    <option value="">Select Aircraft</option>
                    {fleet.map(ac => (
                      <option key={ac.Aircraft_ID} value={ac.Aircraft_ID}>
                        {ac.Model} ({ac.Aircraft_ID})
                      </option>
                    ))}
                    {fleet.length === 0 && (
                      <option value="AC-737">Boeing 737-800 (AC-737)</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Maintenance Scope / Type</label>
                <input
                  type="text"
                  name="maintenance_type"
                  value={form.maintenance_type}
                  onChange={handleChange}
                  disabled={editing}
                  required
                  placeholder="e.g. Engine Inspection & Service"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Lead Engineer</label>
                  <input
                    type="text"
                    name="engineer_name"
                    value={form.engineer_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Michael B. Jordan"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cost"
                    value={form.cost}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 15000.00"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30"
                >
                  {editing ? "Save Changes" : "Record Maintenance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="rounded-3xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <th className="p-4 font-semibold">Aircraft ID</th>
                <th className="p-4 font-semibold">Model</th>
                <th className="p-4 font-semibold">Maintenance Type</th>
                <th className="p-4 font-semibold">Engineer In-Charge</th>
                <th className="p-4 font-semibold">Cost</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((rec, idx) => (
                <tr key={`${rec.Aircraft_ID}-${idx}`} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white font-mono">{rec.Aircraft_ID}</td>
                  <td className="p-4 font-semibold text-slate-200">{rec.Model || "Commercial Airliner"}</td>
                  <td className="p-4 text-slate-300">{rec.Maintenance_Type}</td>
                  <td className="p-4 text-slate-300">{rec.Engineer_Name}</td>
                  <td className="p-4 font-bold text-rose-400">₹{rec.Cost?.toLocaleString()}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.Status === "Completed"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : rec.Status === "In-Progress"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {rec.Status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => editRecord(rec)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="Edit Maintenance"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteRecord(rec.Aircraft_ID)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-800/40 transition"
                        title="Delete Maintenance"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                    No maintenance records matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

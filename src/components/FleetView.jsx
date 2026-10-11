"use client";

import { useEffect, useState } from "react";
import { Layers, Plus, Search, Edit, Trash2, X, RefreshCw, CheckCircle, Wrench } from "lucide-react";

export default function FleetView() {
  const [fleet, setFleet] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    aircraft_id: "",
    model: "",
    manufacturer: "",
    year_of_mfg: "",
    capacity: "",
    type: "Commercial Jet"
  });

  async function loadFleet() {
    try {
      const res = await fetch("/api/fleet");
      const data = await res.json();
      setFleet(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadFleet();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function addAircraft(e) {
    e.preventDefault();
    const res = await fetch("/api/fleet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to add aircraft");
      return;
    }
    alert("Aircraft added successfully to airport fleet");
    clearForm();
    loadFleet();
  }

  function editAircraft(ac) {
    setForm({
      aircraft_id: ac.Aircraft_ID,
      model: ac.Model,
      manufacturer: ac.Manufacturer,
      year_of_mfg: ac.Year_of_MFG,
      capacity: ac.Capacity,
      type: ac.Type
    });
    setEditing(true);
    setShowForm(true);
  }

  async function updateAircraft(e) {
    e.preventDefault();
    const res = await fetch("/api/fleet", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to update aircraft");
      return;
    }
    alert("Aircraft record updated successfully");
    clearForm();
    loadFleet();
  }

  async function deleteAircraft(id) {
    if (!confirm(`Are you sure you want to decommission and delete aircraft ${id}?`)) return;
    const res = await fetch("/api/fleet", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aircraft_id: id })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to delete aircraft");
      return;
    }
    alert("Aircraft deleted successfully");
    loadFleet();
  }

  function clearForm() {
    setForm({
      aircraft_id: "",
      model: "",
      manufacturer: "",
      year_of_mfg: "",
      capacity: "",
      type: "Commercial Jet"
    });
    setEditing(false);
    setShowForm(false);
  }

  const filtered = fleet.filter(ac =>
    ac.Aircraft_ID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ac.Model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ac.Manufacturer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ac.Type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-xl shadow-2xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-indigo-400" />
            <span>Aircraft Fleet Registry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Airport airfield fleet specifications, passenger seating capacity, and engineering links.
          </p>
        </div>

        <button
          onClick={() => {
            clearForm();
            setShowForm(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register Aircraft</span>
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search aircraft by ID, model, manufacturer, or airframe type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>{editing ? "Modify Aircraft Details" : "Register New Aircraft"}</span>
              </h2>
              <button onClick={clearForm} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editing ? updateAircraft : addAircraft} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Aircraft ID</label>
                  <input
                    type="text"
                    name="aircraft_id"
                    value={form.aircraft_id}
                    onChange={handleChange}
                    disabled={editing}
                    required
                    placeholder="e.g. AC-A350"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Model Name</label>
                  <input
                    type="text"
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Airbus A350-900"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={form.manufacturer}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Airbus / Boeing"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Year of MFG</label>
                  <input
                    type="number"
                    name="year_of_mfg"
                    value={form.year_of_mfg}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 2022"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Passenger Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 320"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Airframe Type</label>
                  <input
                    type="text"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Wide-body Jet"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  {editing ? "Save Changes" : "Register Aircraft"}
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
                <th className="p-4 font-semibold">Manufacturer</th>
                <th className="p-4 font-semibold">Year of MFG</th>
                <th className="p-4 font-semibold">Capacity</th>
                <th className="p-4 font-semibold">Airframe Type</th>
                <th className="p-4 font-semibold">Maintenance Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((ac, idx) => (
                <tr key={`${ac.Aircraft_ID}-${idx}`} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white font-mono">{ac.Aircraft_ID}</td>
                  <td className="p-4 font-semibold text-slate-200">{ac.Model}</td>
                  <td className="p-4 text-slate-300">{ac.Manufacturer}</td>
                  <td className="p-4 text-slate-400">{ac.Year_of_MFG}</td>
                  <td className="p-4 font-semibold text-indigo-400">{ac.Capacity} seats</td>
                  <td className="p-4 text-slate-300">{ac.Type}</td>
                  <td className="p-4">
                    {ac.Status ? (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ac.Status === "Completed"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : ac.Status === "In-Progress"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {ac.Status}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Ready / Nominal</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => editAircraft(ac)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="Edit Aircraft"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteAircraft(ac.Aircraft_ID)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-800/40 transition"
                        title="Delete Aircraft"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                    No aircraft fleet matching query.
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

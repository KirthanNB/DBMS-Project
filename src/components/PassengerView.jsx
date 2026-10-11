"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Search, Edit, Trash2, X, Phone, Calendar, Globe, UserPlus } from "lucide-react";

export default function PassengerView() {
  const [passengers, setPassengers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    pass_id: "",
    name: "",
    nationality: "",
    gender: "Male",
    dob: "",
    phone: ""
  });

  async function loadPassengers() {
    try {
      const res = await fetch("/api/passengers");
      const data = await res.json();
      setPassengers(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadPassengers();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function addPassenger(e) {
    e.preventDefault();
    const res = await fetch("/api/passengers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to add passenger");
      return;
    }
    alert("Passenger registered successfully");
    clearForm();
    loadPassengers();
  }

  function editPassenger(p) {
    setForm({
      pass_id: p.Pass_ID,
      name: p.Name,
      nationality: p.Nationality || "",
      gender: p.Gender || "Male",
      dob: p.DOB || "",
      phone: p.Phone_Numbers || ""
    });
    setEditing(true);
    setShowForm(true);
  }

  async function updatePassenger(e) {
    e.preventDefault();
    const res = await fetch("/api/passengers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to update passenger");
      return;
    }
    alert("Passenger updated successfully");
    clearForm();
    loadPassengers();
  }

  async function deletePassenger(id) {
    if (!confirm(`Are you sure you want to delete passenger ${id}?`)) return;
    const res = await fetch("/api/passengers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pass_id: id })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to delete passenger");
      return;
    }
    alert("Passenger deleted successfully");
    loadPassengers();
  }

  function clearForm() {
    setForm({
      pass_id: "",
      name: "",
      nationality: "",
      gender: "Male",
      dob: "",
      phone: ""
    });
    setEditing(false);
    setShowForm(false);
  }

  const filtered = passengers.filter(p =>
    p.Pass_ID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.Nationality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.Phone_Numbers?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-xl shadow-2xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-emerald-400" />
            <span>Passenger Manifest & Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Airport passenger registry — Multivalued contact numbers mapped via <code className="text-emerald-300">Passenger_PhNo</code>.
          </p>
        </div>

        <button
          onClick={() => {
            clearForm();
            setShowForm(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Passenger</span>
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search passenger by ID, name, nationality, or phone number..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>{editing ? "Modify Passenger Information" : "Register New Passenger"}</span>
              </h2>
              <button onClick={clearForm} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editing ? updatePassenger : addPassenger} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Passenger ID</label>
                  <input
                    type="text"
                    name="pass_id"
                    value={form.pass_id}
                    onChange={handleChange}
                    disabled={editing}
                    required
                    placeholder="e.g. P-9004"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Alice Vance"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={form.nationality}
                    onChange={handleChange}
                    required
                    placeholder="e.g. American"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (Passenger_PhNo)</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1-555-0192"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30"
                >
                  {editing ? "Save Changes" : "Register Passenger"}
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
                <th className="p-4 font-semibold">Pass ID</th>
                <th className="p-4 font-semibold">Full Name</th>
                <th className="p-4 font-semibold">Nationality</th>
                <th className="p-4 font-semibold">Gender</th>
                <th className="p-4 font-semibold">Age</th>
                <th className="p-4 font-semibold">Phone Numbers</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(p => (
                <tr key={p.Pass_ID} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white font-mono">{p.Pass_ID}</td>
                  <td className="p-4 font-semibold text-slate-200">{p.Name}</td>
                  <td className="p-4 text-slate-300">{p.Nationality}</td>
                  <td className="p-4 text-slate-400">{p.Gender}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px]">
                      {p.Age !== null ? `${p.Age} yrs` : "N/A"}
                    </span>
                  </td>
                  <td className="p-4 text-emerald-400 font-mono text-[11px]">
                    {p.Phone_Numbers || <span className="text-slate-600">None</span>}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => editPassenger(p)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="Edit Passenger"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deletePassenger(p.Pass_ID)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-800/40 transition"
                        title="Delete Passenger"
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
                    No passenger records matching query.
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

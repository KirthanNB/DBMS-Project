"use client";

import { useEffect, useState } from "react";
import { Plane, Plus, Search, Edit, Trash2, X, RefreshCw, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function FlightsView() {
  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [form, setForm] = useState({
    flight_id: "",
    status: "Scheduled",
    depart_time: "",
    arrival_time: "",
    airline_id: "",
    aircraft_id: ""
  });

  async function loadFlights() {
    try {
      const res = await fetch("/api/flights");
      const data = await res.json();
      setFlights(data);

      const aRes = await fetch("/api/airlines");
      if (aRes.ok) {
        const aData = await aRes.json();
        setAirlines(aData);
      }

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
    loadFlights();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function addFlight(e) {
    e.preventDefault();
    const res = await fetch("/api/flights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to add flight");
      return;
    }
    alert("Flight scheduled successfully");
    clearForm();
    loadFlights();
  }

  function editFlight(flight) {
    setForm({
      flight_id: flight.Flight_ID,
      status: flight.Status || "Scheduled",
      depart_time: formatDateTime(flight.Dept_Time),
      arrival_time: formatDateTime(flight.Arrival_Time),
      airline_id: flight.Airline_ID || "",
      aircraft_id: flight.Aircraft_ID || ""
    });
    setEditing(true);
    setShowForm(true);
  }

  async function updateFlight(e) {
    e.preventDefault();
    const res = await fetch("/api/flights", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to update flight");
      return;
    }
    alert("Flight updated successfully");
    clearForm();
    loadFlights();
  }

  async function deleteFlight(id) {
    if (!confirm(`Are you sure you want to cancel and delete flight ${id}?`)) return;
    const res = await fetch("/api/flights", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flight_id: id })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to delete flight");
      return;
    }
    alert("Flight deleted successfully");
    loadFlights();
  }

  function clearForm() {
    setForm({
      flight_id: "",
      status: "Scheduled",
      depart_time: "",
      arrival_time: "",
      airline_id: airlines[0]?.Airline_ID || "",
      aircraft_id: fleet[0]?.Aircraft_ID || ""
    });
    setEditing(false);
    setShowForm(false);
  }

  function formatDateTime(str) {
    if (!str) return "";
    return str.replace(" ", "T");
  }

  const filtered = flights.filter(f => {
    const matchesSearch =
      f.Flight_ID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.Airline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.Model?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || f.Status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-xl shadow-2xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Plane className="w-6 h-6 text-blue-400" />
            <span>Flight Operations & Scheduling</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Airport airfield master schedule — Manage commercial carrier departures and arrivals.
          </p>
        </div>

        <button
          onClick={() => {
            clearForm();
            setShowForm(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Flight</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search flights, airlines, or aircraft model..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Flight Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="On-Time">On-Time</option>
            <option value="Delayed">Delayed</option>
            <option value="Departed">Departed</option>
            <option value="Arrived">Arrived</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            onClick={loadFlights}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Reload flights"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-400" />
                <span>{editing ? "Modify Flight Details" : "Schedule New Flight"}</span>
              </h2>
              <button onClick={clearForm} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editing ? updateFlight : addFlight} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Flight ID</label>
                  <input
                    type="text"
                    name="flight_id"
                    value={form.flight_id}
                    onChange={handleChange}
                    disabled={editing}
                    required
                    placeholder="e.g. FL-4004"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="On-Time">On-Time</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Departed">Departed</option>
                    <option value="Arrived">Arrived</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Airline Carrier</label>
                  <select
                    name="airline_id"
                    value={form.airline_id}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Airline</option>
                    {airlines.map(a => (
                      <option key={a.Airline_ID} value={a.Airline_ID}>
                        {a.Name} ({a.Airline_ID})
                      </option>
                    ))}
                    {airlines.length === 0 && (
                      <option value="AL-101">SkyWings Airways (AL-101)</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Aircraft</label>
                  <select
                    name="aircraft_id"
                    value={form.aircraft_id}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Departure Time</label>
                  <input
                    type="datetime-local"
                    name="depart_time"
                    value={form.depart_time}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Arrival Time</label>
                  <input
                    type="datetime-local"
                    name="arrival_time"
                    value={form.arrival_time}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
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
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30"
                >
                  {editing ? "Save Changes" : "Submit Flight"}
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
                <th className="p-4 font-semibold">Flight ID</th>
                <th className="p-4 font-semibold">Airline Carrier</th>
                <th className="p-4 font-semibold">Aircraft Model</th>
                <th className="p-4 font-semibold">Departure Time</th>
                <th className="p-4 font-semibold">Arrival Time</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(flight => (
                <tr key={flight.Flight_ID} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <div className="p-1 rounded bg-blue-500/20 text-blue-400">
                      <Plane className="w-3.5 h-3.5" />
                    </div>
                    <span>{flight.Flight_ID}</span>
                  </td>
                  <td className="p-4 text-slate-200">{flight.Airline}</td>
                  <td className="p-4 text-slate-300">
                    {flight.Model}
                    <span className="text-[10px] text-slate-500 ml-1.5 font-mono">({flight.Aircraft_ID})</span>
                  </td>
                  <td className="p-4 text-slate-300">{flight.Dept_Time}</td>
                  <td className="p-4 text-slate-300">{flight.Arrival_Time}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        flight.Status === "On-Time"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : flight.Status === "Delayed"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : flight.Status === "Departed"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : flight.Status === "Cancelled"
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {flight.Status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => editFlight(flight)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="Edit Flight"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteFlight(flight.Flight_ID)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-800/40 transition"
                        title="Delete Flight"
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
                    No flights matching criteria.
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

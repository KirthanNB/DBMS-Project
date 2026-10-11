"use client";

import { useEffect, useState } from "react";
import { Plane, Users, Wrench, Shield, CheckCircle, Clock, AlertTriangle, Activity, ArrowUpRight, ChevronRight, Layers } from "lucide-react";

export default function DashboardView({ onNavigate }) {
  const [stats, setStats] = useState({
    flights: { total_flights: 0, on_time_flights: 0, delayed_flights: 0, scheduled_flights: 0, departed_flights: 0 },
    seats: { total_seats: 0, booked_seats: 0 },
    fleet: { total_aircraft: 0, total_passenger_capacity: 0 },
    employees: { total_employees: 0, total_roles: 0 },
    passengers: { total_passengers: 0 },
    maintenance: { total_records: 0, total_cost: 0, in_progress: 0, pending: 0, completed: 0 }
  });

  const [recentFlights, setRecentFlights] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const statsRes = await fetch("/api/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        const flightsRes = await fetch("/api/flights");
        if (flightsRes.ok) {
          const flightsData = await flightsRes.json();
          setRecentFlights(flightsData.slice(0, 5));
        }

        const mRes = await fetch("/api/maintenance");
        if (mRes.ok) {
          const mData = await mRes.json();
          setMaintenanceList(mData.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadDashboard();
  }, []);

  const occupancyRate = stats.seats.total_seats > 0
    ? Math.round((stats.seats.booked_seats / stats.seats.total_seats) * 100)
    : 0;

  const kpiCards = [
    {
      title: "Commercial Flights",
      value: stats.flights.total_flights,
      subtitle: `${stats.flights.on_time_flights || 0} On-Time • ${stats.flights.delayed_flights || 0} Delayed`,
      icon: Plane,
      color: "from-blue-600 to-cyan-600",
      target: "flights"
    },
    {
      title: "Registered Passengers",
      value: stats.passengers.total_passengers,
      subtitle: `${stats.seats.booked_seats || 0} active cabin reservations`,
      icon: Users,
      color: "from-emerald-600 to-teal-600",
      target: "passengers"
    },
    {
      title: "Aircraft Fleet Active",
      value: stats.fleet.total_aircraft,
      subtitle: `${stats.fleet.total_passenger_capacity || 0} total fleet seat capacity`,
      icon: Layers,
      color: "from-indigo-600 to-purple-600",
      target: "fleet"
    },
    {
      title: "Cabin Occupancy Rate",
      value: `${occupancyRate}%`,
      subtitle: `${stats.seats.booked_seats} of ${stats.seats.total_seats} seats allocated`,
      icon: Activity,
      color: "from-amber-600 to-orange-600",
      target: "seats"
    },
    {
      title: "Airport Operations Crew",
      value: stats.employees.total_employees,
      subtitle: `${stats.employees.total_roles || 0} designated crew roles`,
      icon: Shield,
      color: "from-violet-600 to-fuchsia-600",
      target: "employees"
    },
    {
      title: "Maintenance Expenditures",
      value: `₹${(stats.maintenance.total_cost || 0).toLocaleString()}`,
      subtitle: `${stats.maintenance.in_progress || 0} ongoing • ${stats.maintenance.pending || 0} pending`,
      icon: Wrench,
      color: "from-rose-600 to-pink-600",
      target: "maintenance"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
              Airport Airfield Live Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Airport Operations Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Integrated Airport Database Management System monitoring flight scheduling, aircraft fleet readiness, passenger manifest, engineering maintenance, and crew dispatch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate && onNavigate("flights")}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition"
          >
            <span>Flight Schedule</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate && onNavigate("seats")}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition"
          >
            <span>Cabin Seat Map</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={() => onNavigate && onNavigate(card.target)}
              className="group cursor-pointer p-6 rounded-3xl bg-slate-900/85 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700 backdrop-blur-xl shadow-xl transition-all duration-200 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-3 rounded-2xl bg-gradient-to-tr ${card.color} text-white shadow-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="text-3xl font-black text-white tracking-tight">
                {card.value}
              </div>

              <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
                <span>{card.subtitle}</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl bg-slate-900/85 border border-slate-800 backdrop-blur-xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plane className="w-4 h-4 text-blue-400" />
                <span>Live Flight Radar & Departures</span>
              </h2>
              <p className="text-xs text-slate-400">
                Scheduled departures and arrivals fetched from relational <code className="text-blue-300">Flight</code> table.
              </p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate("flights")}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>View All Flights</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Flight ID</th>
                  <th className="pb-3 font-semibold">Airline Carrier</th>
                  <th className="pb-3 font-semibold">Aircraft Model</th>
                  <th className="pb-3 font-semibold">Departure</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentFlights.map(f => (
                  <tr key={f.Flight_ID} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 font-bold text-white">{f.Flight_ID}</td>
                    <td className="py-3.5 text-slate-200">{f.Airline}</td>
                    <td className="py-3.5 text-slate-300">{f.Model}</td>
                    <td className="py-3.5 text-slate-300">{f.Dept_Time}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          f.Status === "On-Time"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : f.Status === "Delayed"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : f.Status === "Departed"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {f.Status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/85 border border-slate-800 backdrop-blur-xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-rose-400" />
              <span>Avionics & Hangar Status</span>
            </h2>
            <button
              onClick={() => onNavigate && onNavigate("maintenance")}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
            >
              All Records
            </button>
          </div>

          <div className="space-y-3">
            {maintenanceList.map((m, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{m.Aircraft_ID}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      m.Status === "Completed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : m.Status === "In-Progress"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-rose-500/20 text-rose-400"
                    }`}
                  >
                    {m.Status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 font-medium">
                  {m.Maintenance_Type}
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>Engineer: {m.Engineer_Name}</span>
                  <span>₹{m.Cost?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-300">
            <div className="font-semibold text-blue-200 mb-1">DBMS Integrity Check</div>
            <div>Foreign Keys: <span className="font-mono text-emerald-400">ENABLED</span></div>
            <div>Relational Constraints: <span className="font-mono text-emerald-400">CASCADE / SET NULL</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { Plane, ShieldCheck, UserCheck, Users, RefreshCw, KeyRound } from "lucide-react";

export default function Navbar({ tab, setTab, currentRole, currentUser, onOpenLoginModal }) {
  async function resetDatabase() {
    if (!confirm("Reset database to initial schema and seed data?")) return;
    try {
      const res = await fetch("/api/init");
      if (res.ok) {
        alert("Airport Database reset completed successfully.");
        window.location.reload();
      }
    } catch (err) {
      alert("Error resetting database: " + err.message);
    }
  }

  const adminMenus = [
    ["dashboard", "Control Dashboard"],
    ["flights", "Flights"],
    ["passengers", "Passengers"],
    ["fleet", "Fleet & Aircraft"],
    ["employees", "Staff & Crew"],
    ["maintenance", "Maintenance"],
    ["seats", "Cabin Seat Map"]
  ];

  const passengerMenus = [
    ["passenger_portal", "My Portal & Passes"],
    ["seats", "Cabin Seat Booking"],
    ["flights", "Flight Departures"]
  ];

  const employeeMenus = [
    ["employee_portal", "Duty Portal & Crew"],
    ["flights", "Flight Dispatch"],
    ["maintenance", "Maintenance Logs"],
    ["employees", "Staff Directory"]
  ];

  const menus =
    currentRole === "passenger"
      ? passengerMenus
      : currentRole === "employee"
      ? employeeMenus
      : adminMenus;

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/90 px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="flex items-center justify-between w-full lg:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/20">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">
                  AEROCOMMAND
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Airport OS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
                Enterprise Airport Management & Flight Operations DBMS
              </p>
            </div>
          </div>

          <button
            onClick={onOpenLoginModal}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-white border border-slate-700"
          >
            <KeyRound className="w-3.5 h-3.5 text-blue-400" />
            <span>Switch Role</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 w-full lg:w-auto">
          {menus.map(item => (
            <button
              key={item[0]}
              onClick={() => setTab(item[0])}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                tab === item[0]
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-102"
                  : "bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {item[1]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <button
            onClick={onOpenLoginModal}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition shadow-sm group"
          >
            {currentRole === "admin" && (
              <span className="flex items-center gap-1.5 text-blue-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-semibold">Admin</span>
              </span>
            )}
            {currentRole === "employee" && (
              <span className="flex items-center gap-1.5 text-amber-400">
                <UserCheck className="w-3.5 h-3.5" />
                <span className="font-semibold">Staff: {currentUser?.name?.split(" ")[0]}</span>
              </span>
            )}
            {currentRole === "passenger" && (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Users className="w-3.5 h-3.5" />
                <span className="font-semibold">Passenger: {currentUser?.name?.split(" ")[0]}</span>
              </span>
            )}
            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 group-hover:text-white">
              Change
            </span>
          </button>

          <button
            onClick={resetDatabase}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 hover:text-rose-100 text-xs font-semibold transition"
            title="Reset SQLite database to default sample records"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset DB</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
"use client";

import { useState, useEffect } from "react";
import { UserCheck, Plane, Wrench, Users, Shield, RefreshCw, CheckCircle, AlertTriangle, Clock } from "lucide-react";

export default function EmployeePortalView({ employeeUser }) {
  const [activeTab, setActiveTab] = useState("duties");
  const [assignedFlights, setAssignedFlights] = useState([]);
  const [allFlights, setAllFlights] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadEmployeeData() {
    setIsLoading(true);
    try {
      if (employeeUser?.id) {
        const crewRes = await fetch(`/api/crew?emp_id=${employeeUser.id}`);
        if (crewRes.ok) {
          const crewData = await crewRes.json();
          setAssignedFlights(crewData);
        }
      }

      const fRes = await fetch("/api/flights");
      if (fRes.ok) {
        const fData = await fRes.json();
        setAllFlights(fData);
      }

      const mRes = await fetch("/api/maintenance");
      if (mRes.ok) {
        const mData = await mRes.json();
        setMaintenanceRecords(mData);
      }

      const eRes = await fetch("/api/employees");
      if (eRes.ok) {
        const eData = await eRes.json();
        setEmployees(eData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadEmployeeData();
  }, [employeeUser?.id]);

  async function updateFlightStatus(flight, newStatus) {
    try {
      const res = await fetch("/api/flights", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flight_id: flight.Flight_ID,
          status: newStatus,
          depart_time: flight.Dept_Time,
          arrival_time: flight.Arrival_Time,
          airline_id: flight.Airline_ID,
          aircraft_id: flight.Aircraft_ID
        })
      });
      if (res.ok) {
        alert(`Flight ${flight.Flight_ID} updated to '${newStatus}'.`);
        loadEmployeeData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update flight status");
      }
    } catch (err) {
      alert(err.message);
    }
  }

  async function updateMaintenanceStatus(rec, newStatus) {
    try {
      const res = await fetch("/api/maintenance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aircraft_id: rec.Aircraft_ID,
          maintenance_type: rec.Maintenance_Type,
          engineer_name: rec.Engineer_Name,
          cost: rec.Cost,
          status: newStatus
        })
      });
      if (res.ok) {
        alert(`Maintenance task for ${rec.Aircraft_ID} updated to '${newStatus}'.`);
        loadEmployeeData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update maintenance record");
      }
    } catch (err) {
      alert(err.message);
    }
  }

  const currentEmpInfo = employees.find(e => e.Emp_ID === employeeUser?.id);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Active Crew & Staff Credentials
            </span>
            <span className="text-xs text-slate-400">Employee ID: {employeeUser?.id}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {employeeUser?.name || "Employee"} — {employeeUser?.title || "Flight Crew"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Airport Operational Crew Portal — Real-time flight duty manifests, dispatch status control, and engineering logs.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab("duties")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "duties"
                ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>My Flight Duties ({assignedFlights.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("dispatch")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "dispatch"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Flight Dispatcher</span>
          </button>
          <button
            onClick={() => setActiveTab("maintenance")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === "maintenance"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Technical Logs</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <div className="text-xs text-slate-400">Designated Role</div>
          <div className="text-base font-bold text-amber-400 mt-1">{currentEmpInfo?.Role || employeeUser?.title}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <div className="text-xs text-slate-400">Assigned Airline</div>
          <div className="text-base font-bold text-white mt-1">{currentEmpInfo?.Airline || employeeUser?.airlineName || "Global Airways"}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <div className="text-xs text-slate-400">Reporting Supervisor</div>
          <div className="text-base font-bold text-blue-400 mt-1">
            {currentEmpInfo?.Manager_F_Name
              ? `${currentEmpInfo.Manager_F_Name} ${currentEmpInfo.Manager_L_Name}`
              : "Operations Executive (Head)"}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
          <div className="text-xs text-slate-400">Date of Joining</div>
          <div className="text-base font-bold text-slate-300 mt-1">{currentEmpInfo?.Date_of_Joining || "Active"}</div>
        </div>
      </div>

      {activeTab === "duties" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plane className="w-5 h-5 text-amber-400" />
                <span>My Assigned Flights Roster</span>
              </h2>
              <p className="text-xs text-slate-400">
                Direct query from relational junction table <code className="text-amber-300">Flight_Employee</code> joined with <code className="text-amber-300">Flight</code>.
              </p>
            </div>
            <button
              onClick={loadEmployeeData}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Roster</span>
            </button>
          </div>

          {assignedFlights.length === 0 ? (
            <div className="p-10 text-center rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto mb-3">
                <Plane className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">No Active Flight Assignments</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                You are currently on ground standby. You can review all flights and update status using the Flight Dispatcher tab.
              </p>
              <button
                onClick={() => setActiveTab("dispatch")}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/30 transition"
              >
                Go to Flight Dispatcher
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignedFlights.map((flight, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl p-6 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <div className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                        {flight.Airline_Name || flight.Airline_ID}
                      </div>
                      <div className="text-xl font-black text-white">
                        Flight {flight.Flight_ID}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        flight.Flight_Status === "On-Time"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : flight.Flight_Status === "Delayed"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : flight.Flight_Status === "Departed"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {flight.Flight_Status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Assigned Aircraft</span>
                      <span className="font-semibold text-white">{flight.Aircraft_Model || flight.Aircraft_ID}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Duty Assigned</span>
                      <span className="font-semibold text-amber-300">{flight.Role}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Departure Time</span>
                      <span className="font-semibold text-slate-200">{flight.Dept_Time}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Arrival Time</span>
                      <span className="font-semibold text-slate-200">{flight.Arrival_Time}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block mb-2 font-medium">Update Live Dispatch Status:</span>
                    <div className="flex flex-wrap gap-2">
                      {["On-Time", "Delayed", "Departed", "Arrived", "Cancelled"].map(st => (
                        <button
                          key={st}
                          disabled={flight.Flight_Status === st}
                          onClick={() => updateFlightStatus(flight, st)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                            flight.Flight_Status === st
                              ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                              : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "dispatch" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>Airfield Flight Dispatch Control</span>
            </h2>
            <p className="text-xs text-slate-400">
              Operations dispatchers and crew leads can transition flight states directly. Updates persist to SQLite <code className="text-blue-300">Flight</code> table.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                    <th className="p-4 font-semibold">Flight ID</th>
                    <th className="p-4 font-semibold">Airline</th>
                    <th className="p-4 font-semibold">Aircraft</th>
                    <th className="p-4 font-semibold">Departure</th>
                    <th className="p-4 font-semibold">Arrival</th>
                    <th className="p-4 font-semibold">Current Status</th>
                    <th className="p-4 font-semibold text-right">Dispatch Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {allFlights.map(flight => (
                    <tr key={flight.Flight_ID} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <div className="p-1 rounded bg-blue-500/20 text-blue-400">
                          <Plane className="w-3.5 h-3.5" />
                        </div>
                        <span>{flight.Flight_ID}</span>
                      </td>
                      <td className="p-4 text-slate-200">{flight.Airline}</td>
                      <td className="p-4 text-slate-300">{flight.Model} ({flight.Aircraft_ID})</td>
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
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            disabled={flight.Status === "On-Time"}
                            onClick={() => updateFlightStatus(flight, "On-Time")}
                            className="px-2 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-medium transition"
                          >
                            On-Time
                          </button>
                          <button
                            disabled={flight.Status === "Departed"}
                            onClick={() => updateFlightStatus(flight, "Departed")}
                            className="px-2 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-[11px] font-medium transition"
                          >
                            Departed
                          </button>
                          <button
                            disabled={flight.Status === "Delayed"}
                            onClick={() => updateFlightStatus(flight, "Delayed")}
                            className="px-2 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-white text-[11px] font-medium transition"
                          >
                            Delayed
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "maintenance" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-emerald-400" />
              <span>Avionics & Mechanical Maintenance Records</span>
            </h2>
            <p className="text-xs text-slate-400">
              Technical crew oversight for <code className="text-emerald-300">Maintenance</code> relation linked to <code className="text-emerald-300">Aircraft</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {maintenanceRecords.map((rec, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="text-xs font-bold text-blue-400">{rec.Aircraft_ID}</div>
                    <div className="text-sm font-semibold text-white">{rec.Model || "Airliner"}</div>
                  </div>
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
                </div>

                <div className="text-xs space-y-1">
                  <div className="text-slate-300 font-medium">{rec.Maintenance_Type}</div>
                  <div className="text-slate-400 text-[11px]">Engineer: {rec.Engineer_Name}</div>
                  <div className="text-slate-400 text-[11px]">Cost: ₹{rec.Cost?.toLocaleString()}</div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[10px] text-slate-500 mb-1.5">Change Maintenance Status:</div>
                  <div className="flex gap-2">
                    <button
                      disabled={rec.Status === "In-Progress"}
                      onClick={() => updateMaintenanceStatus(rec, "In-Progress")}
                      className="flex-1 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-white text-[11px] font-medium transition"
                    >
                      In-Progress
                    </button>
                    <button
                      disabled={rec.Status === "Completed"}
                      onClick={() => updateMaintenanceStatus(rec, "Completed")}
                      className="flex-1 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-medium transition"
                    >
                      Completed
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

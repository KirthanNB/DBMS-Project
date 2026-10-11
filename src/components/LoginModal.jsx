"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, UserCheck, Users, X, ArrowRight, UserPlus, Plane } from "lucide-react";

export default function LoginModal({ isOpen, onClose, onLogin, currentRole, currentUser }) {
  const [selectedRole, setSelectedRole] = useState(currentRole || "admin");
  const [employees, setEmployees] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("E-002");
  const [selectedPassId, setSelectedPassId] = useState("P-9001");
  const [adminPasscode, setAdminPasscode] = useState("admin");

  const [isRegisteringPassenger, setIsRegisteringPassenger] = useState(false);
  const [newPassenger, setNewPassenger] = useState({
    pass_id: "",
    name: "",
    nationality: "American",
    gender: "Female",
    dob: "1995-05-15",
    phone: "+1-555-0188"
  });

  useEffect(() => {
    async function loadData() {
      try {
        const empRes = await fetch("/api/employees");
        if (empRes.ok) {
          const empData = await empRes.json();
          setEmployees(empData);
          if (empData.length > 0 && !selectedEmpId) {
            setSelectedEmpId(empData[0].Emp_ID);
          }
        }

        const passRes = await fetch("/api/passengers");
        if (passRes.ok) {
          const passData = await passRes.json();
          setPassengers(passData);
          if (passData.length > 0 && !selectedPassId) {
            setSelectedPassId(passData[0].Pass_ID);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleAdminSubmit(e) {
    e.preventDefault();
    onLogin({
      role: "admin",
      id: "ADMIN-01",
      name: "Airport Operations Director",
      title: "Chief Airfield Administrator"
    });
    onClose();
  }

  function handleEmployeeSubmit(e) {
    e.preventDefault();
    const emp = employees.find(x => x.Emp_ID === selectedEmpId) || {
      Emp_ID: selectedEmpId,
      F_Name: "Staff",
      L_Name: "Member",
      Role: "Flight Crew"
    };
    onLogin({
      role: "employee",
      id: emp.Emp_ID,
      name: `${emp.F_Name} ${emp.L_Name}`,
      title: emp.Role,
      airlineId: emp.Airline_ID,
      airlineName: emp.Airline
    });
    onClose();
  }

  async function handlePassengerRegister(e) {
    e.preventDefault();
    if (!newPassenger.pass_id || !newPassenger.name) {
      alert("Please provide Passenger ID and Full Name");
      return;
    }
    const res = await fetch("/api/passengers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPassenger)
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Failed to register passenger");
      return;
    }
    onLogin({
      role: "passenger",
      id: newPassenger.pass_id,
      name: newPassenger.name,
      nationality: newPassenger.nationality
    });
    onClose();
  }

  function handlePassengerSubmit(e) {
    e.preventDefault();
    const pass = passengers.find(x => x.Pass_ID === selectedPassId) || {
      Pass_ID: selectedPassId,
      Name: "Alice Vance",
      Nationality: "American"
    };
    onLogin({
      role: "passenger",
      id: pass.Pass_ID,
      name: pass.Name,
      nationality: pass.Nationality
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Airport Portal Access</h2>
              <p className="text-xs text-slate-400">Select your authorization profile to enter the system</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-2.5 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole("admin")}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-semibold transition ${
                selectedRole === "admin"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <ShieldCheck className="w-5 h-5 mb-1.5" />
              <span>Admin View</span>
              <span className="text-[10px] opacity-75 font-normal">Command Center</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("employee")}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-semibold transition ${
                selectedRole === "employee"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <UserCheck className="w-5 h-5 mb-1.5" />
              <span>Employee View</span>
              <span className="text-[10px] opacity-75 font-normal">Crew & Staff</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("passenger")}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl text-xs font-semibold transition ${
                selectedRole === "passenger"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Users className="w-5 h-5 mb-1.5" />
              <span>Passenger View</span>
              <span className="text-[10px] opacity-75 font-normal">Self Service</span>
            </button>
          </div>

          {selectedRole === "admin" && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-800/30 text-xs text-blue-300">
                Authorized for Airfield Operations, Flight Scheduling, Aircraft Maintenance, Fleet Allocation, and DBMS oversight.
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Administrator ID</label>
                <input
                  type="text"
                  readOnly
                  value="ADMIN-01 (Airport Director)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Access Passcode</label>
                <input
                  type="password"
                  value={adminPasscode}
                  onChange={e => setAdminPasscode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition"
              >
                <span>Authorize & Enter Admin Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {selectedRole === "employee" && (
            <form onSubmit={handleEmployeeSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-300">
                Staff portal for Pilots, Co-Pilots, Flight Operations Managers, Flight Attendants, and Avionics Engineers.
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Select Active Employee Profile</label>
                <select
                  value={selectedEmpId}
                  onChange={e => setSelectedEmpId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  {employees.map(emp => (
                    <option key={emp.Emp_ID} value={emp.Emp_ID}>
                      {emp.Emp_ID} - {emp.F_Name} {emp.L_Name} ({emp.Role})
                    </option>
                  ))}
                  {employees.length === 0 && (
                    <option value="E-002">E-002 - Sarah Connor (Senior Captain Pilot)</option>
                  )}
                </select>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedEmpId("E-002")}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs transition"
                >
                  Pilot (E-002)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEmpId("E-001")}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs transition"
                >
                  Manager (E-001)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEmpId("E-005")}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs transition"
                >
                  Engineer (E-005)
                </button>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-600/25 transition"
              >
                <span>Authorize & Enter Employee Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {selectedRole === "passenger" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-400">
                  {isRegisteringPassenger ? "New Passenger Self-Registration" : "Existing Passenger Sign-In"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsRegisteringPassenger(!isRegisteringPassenger)}
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                >
                  {isRegisteringPassenger ? (
                    <span>Sign in with existing ID</span>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register new passenger</span>
                    </>
                  )}
                </button>
              </div>

              {!isRegisteringPassenger ? (
                <form onSubmit={handlePassengerSubmit} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-300">
                    Self-service airport kiosk: Search flights, book seats in real-time, view boarding passes, and manage travel info.
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Select Passenger Profile</label>
                    <select
                      value={selectedPassId}
                      onChange={e => setSelectedPassId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      {passengers.map(p => (
                        <option key={p.Pass_ID} value={p.Pass_ID}>
                          {p.Pass_ID} - {p.Name} ({p.Nationality})
                        </option>
                      ))}
                      {passengers.length === 0 && (
                        <option value="P-9001">P-9001 - Alice Vance (American)</option>
                      )}
                    </select>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedPassId("P-9001")}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs transition"
                    >
                      Alice (P-9001)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPassId("P-9002")}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs transition"
                    >
                      Marcus (P-9002)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPassId("P-9003")}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs transition"
                    >
                      Kenji (P-9003)
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition"
                  >
                    <span>Enter Passenger Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePassengerRegister} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Passport / Pass ID</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. P-9004"
                        value={newPassenger.pass_id}
                        onChange={e => setNewPassenger({ ...newPassenger, pass_id: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sarah Jenkins"
                        value={newPassenger.name}
                        onChange={e => setNewPassenger({ ...newPassenger, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Nationality</label>
                      <input
                        type="text"
                        value={newPassenger.nationality}
                        onChange={e => setNewPassenger({ ...newPassenger, nationality: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                      <select
                        value={newPassenger.gender}
                        onChange={e => setNewPassenger({ ...newPassenger, gender: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={newPassenger.dob}
                        onChange={e => setNewPassenger({ ...newPassenger, dob: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Contact Phone Number</label>
                    <input
                      type="text"
                      placeholder="+1-555-0188"
                      value={newPassenger.phone}
                      onChange={e => setNewPassenger({ ...newPassenger, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition"
                  >
                    <span>Register in Airport DBMS & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

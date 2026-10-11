"use client";

import { useEffect, useState } from "react";
import { Shield, Plus, Search, Edit, Trash2, X, RefreshCw, UserCheck, Briefcase, Calendar } from "lucide-react";

export default function EmployeeView() {
  const [employees, setEmployees] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    emp_id: "",
    f_name: "",
    m_name: "",
    l_name: "",
    date_of_joining: "",
    role: "Senior Captain Pilot",
    airline_id: "",
    manager_id: ""
  });

  async function loadEmployees() {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data);

      const aRes = await fetch("/api/airlines");
      if (aRes.ok) {
        const aData = await aRes.json();
        setAirlines(aData);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function addEmployee(e) {
    e.preventDefault();
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to add employee");
      return;
    }
    alert("Employee record added successfully");
    clearForm();
    loadEmployees();
  }

  function editEmployee(emp) {
    setForm({
      emp_id: emp.Emp_ID,
      f_name: emp.F_Name,
      m_name: emp.M_Name || "",
      l_name: emp.L_Name,
      date_of_joining: emp.Date_of_Joining,
      role: emp.Role,
      airline_id: emp.Airline_ID || "",
      manager_id: emp.Manager_ID || ""
    });
    setEditing(true);
    setShowForm(true);
  }

  async function updateEmployee(e) {
    e.preventDefault();
    const res = await fetch("/api/employees", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to update employee");
      return;
    }
    alert("Employee record updated successfully");
    clearForm();
    loadEmployees();
  }

  async function deleteEmployee(id) {
    if (!confirm(`Are you sure you want to delete employee record ${id}?`)) return;
    const res = await fetch("/api/employees", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emp_id: id })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to delete employee");
      return;
    }
    alert("Employee record deleted successfully");
    loadEmployees();
  }

  function clearForm() {
    setForm({
      emp_id: "",
      f_name: "",
      m_name: "",
      l_name: "",
      date_of_joining: "",
      role: "Senior Captain Pilot",
      airline_id: airlines[0]?.Airline_ID || "",
      manager_id: ""
    });
    setEditing(false);
    setShowForm(false);
  }

  const filtered = employees.filter(emp =>
    emp.Emp_ID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${emp.F_Name} ${emp.L_Name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.Role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.Airline?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-xl shadow-2xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-violet-400" />
            <span>Staff Roster & Command Hierarchy</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Airport employee records and self-referencing supervisor relations mapped via <code className="text-violet-300">Manager_ID</code>.
          </p>
        </div>

        <button
          onClick={() => {
            clearForm();
            setShowForm(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee by ID, name, role, or airline..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-400" />
                <span>{editing ? "Modify Employee Record" : "Enroll New Employee"}</span>
              </h2>
              <button onClick={clearForm} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editing ? updateEmployee : addEmployee} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Employee ID</label>
                  <input
                    type="text"
                    name="emp_id"
                    value={form.emp_id}
                    onChange={handleChange}
                    disabled={editing}
                    required
                    placeholder="e.g. E-006"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Role</label>
                  <input
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Senior Captain Pilot"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    name="f_name"
                    value={form.f_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Middle Name</label>
                  <input
                    type="text"
                    name="m_name"
                    value={form.m_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="l_name"
                    value={form.l_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date of Joining</label>
                  <input
                    type="date"
                    name="date_of_joining"
                    value={form.date_of_joining}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Airline Carrier</label>
                  <select
                    name="airline_id"
                    value={form.airline_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="">None / Airport Authority</option>
                    {airlines.map(a => (
                      <option key={a.Airline_ID} value={a.Airline_ID}>
                        {a.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Reporting Supervisor</label>
                  <select
                    name="manager_id"
                    value={form.manager_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="">Top Executive (None)</option>
                    {employees.map(e => (
                      <option key={e.Emp_ID} value={e.Emp_ID}>
                        {e.F_Name} {e.L_Name} ({e.Role})
                      </option>
                    ))}
                  </select>
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
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30"
                >
                  {editing ? "Save Changes" : "Enroll Employee"}
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
                <th className="p-4 font-semibold">Emp ID</th>
                <th className="p-4 font-semibold">Staff Member</th>
                <th className="p-4 font-semibold">Designated Role</th>
                <th className="p-4 font-semibold">Airline</th>
                <th className="p-4 font-semibold">Supervisor (Manager_ID)</th>
                <th className="p-4 font-semibold">Date of Joining</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(emp => (
                <tr key={emp.Emp_ID} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white font-mono">{emp.Emp_ID}</td>
                  <td className="p-4 font-semibold text-slate-200">
                    {emp.F_Name} {emp.M_Name ? emp.M_Name + " " : ""}{emp.L_Name}
                  </td>
                  <td className="p-4 text-violet-300 font-medium">{emp.Role}</td>
                  <td className="p-4 text-slate-300">{emp.Airline || "Airfield Staff"}</td>
                  <td className="p-4 text-slate-300">
                    {emp.Manager_F_Name ? (
                      <span className="flex items-center gap-1.5 text-blue-400">
                        <span>{emp.Manager_F_Name} {emp.Manager_L_Name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({emp.Manager_ID})</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">None (Executive Head)</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-400">{emp.Date_of_Joining}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => editEmployee(emp)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="Edit Employee"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteEmployee(emp.Emp_ID)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-800/40 transition"
                        title="Delete Employee"
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
                    No employees matching search criteria.
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

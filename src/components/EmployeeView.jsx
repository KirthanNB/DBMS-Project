"use client";

import { useEffect, useState } from "react";

export default function EmployeeView() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    emp_id: "",
    f_name: "",
    m_name: "",
    l_name: "",
    date_of_joining: "",
    role: "",
    airline_id: "",
    manager_id: "",
  });

  // Load employees
  async function loadEmployees() {
    const res = await fetch("/api/employees");
    const data = await res.json();

    setEmployees(data);
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  // Handle input
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Add employee
  async function addEmployee(e) {
    e.preventDefault();

    const res = await fetch("/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to add employee");
      return;
    }

    alert("Employee added successfully");

    clearForm();
    loadEmployees();
  }

  // Edit employee
  function editEmployee(employee) {
    setForm({
      emp_id: employee.Emp_ID,
      f_name: employee.F_Name || "",
      m_name: employee.M_Name || "",
      l_name: employee.L_Name || "",
      date_of_joining: employee.Date_of_Joining || "",
      role: employee.Role || "",
      airline_id: employee.Airline_ID || "",
      manager_id: employee.Manager_ID || "",
    });

    setEditing(true);
    setShowForm(true);
  }

  // Update employee
  async function updateEmployee(e) {
    e.preventDefault();

    const res = await fetch("/api/employees", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to update employee");
      return;
    }

    alert("Employee updated successfully");

    clearForm();
    loadEmployees();
  }

  // Delete employee
  async function deleteEmployee(emp_id) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete employee ${emp_id}?`,
    );

    if (!confirmDelete) return;

    const res = await fetch("/api/employees", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emp_id: emp_id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to delete employee");
      return;
    }

    alert("Employee deleted successfully");

    loadEmployees();
  }

  // Clear form
  function clearForm() {
    setForm({
      emp_id: "",
      f_name: "",
      m_name: "",
      l_name: "",
      date_of_joining: "",
      role: "",
      airline_id: "",
      manager_id: "",
    });

    setEditing(false);
    setShowForm(false);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employee Records</h1>

        <button
          onClick={() => {
            if (showForm) {
              clearForm();
            } else {
              setShowForm(true);
            }
          }}
          className="
            bg-blue-600
            hover:bg-blue-700
            px-5
            py-3
            rounded
          "
        >
          {showForm ? "Cancel" : "Add Employee"}
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <form
          onSubmit={editing ? updateEmployee : addEmployee}
          className="
            bg-slate-900
            border border-slate-700
            rounded-xl
            p-6
            mb-6
            grid
            grid-cols-2
            gap-4
          "
        >
          {/* Employee ID */}
          <input
            type="text"
            name="emp_id"
            placeholder="Employee ID"
            value={form.emp_id}
            onChange={handleChange}
            required
            disabled={editing}
            className="
              bg-slate-800
              p-3
              rounded
              disabled:opacity-50
            "
          />

          {/* First Name */}
          <input
            type="text"
            name="f_name"
            placeholder="First Name"
            value={form.f_name}
            onChange={handleChange}
            required
            className="bg-slate-800 p-3 rounded"
          />

          {/* Middle Name */}
          <input
            type="text"
            name="m_name"
            placeholder="Middle Name"
            value={form.m_name}
            onChange={handleChange}
            className="bg-slate-800 p-3 rounded"
          />

          {/* Last Name */}
          <input
            type="text"
            name="l_name"
            placeholder="Last Name"
            value={form.l_name}
            onChange={handleChange}
            required
            className="bg-slate-800 p-3 rounded"
          />

          {/* Date of Joining */}
          <input
            type="date"
            name="date_of_joining"
            value={form.date_of_joining}
            onChange={handleChange}
            required
            className="bg-slate-800 p-3 rounded"
          />

          {/* Role */}
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
            required
            className="bg-slate-800 p-3 rounded"
          />

          {/* Airline */}
          <select
            name="airline_id"
            value={form.airline_id}
            onChange={handleChange}
            className="bg-slate-800 p-3 rounded"
          >
            <option value="">No Airline</option>

            <option value="AL-101">SkyWings Airways</option>

            <option value="AL-102">AeroGlobal Express</option>

            <option value="AL-103">Pacific Star Airlines</option>
          </select>

          {/* Manager */}
          <select
            name="manager_id"
            value={form.manager_id}
            onChange={handleChange}
            className="bg-slate-800 p-3 rounded"
          >
            <option value="">No Manager</option>

            {employees
              .filter((manager) => manager.Emp_ID !== form.emp_id)
              .map((manager) => (
                <option key={manager.Emp_ID} value={manager.Emp_ID}>
                  {manager.Emp_ID} - {manager.F_Name} {manager.L_Name}
                </option>
              ))}
          </select>

          {/* Submit */}
          <button
            type="submit"
            className="
              bg-green-600
              hover:bg-green-700
              px-5
              py-3
              rounded
            "
          >
            {editing ? "Update Employee" : "Add Employee"}
          </button>
        </form>
      )}

      {/* Employee cards */}
      <div className="grid grid-cols-3 gap-5">
        {employees.map((employee) => (
          <div
            key={employee.Emp_ID}
            className="
              bg-slate-900
              border border-slate-700
              rounded-xl
              p-5
            "
          >
            <h2 className="text-xl font-bold">
              {employee.F_Name} {employee.M_Name ? employee.M_Name + " " : ""}
              {employee.L_Name}
            </h2>

            <p>ID : {employee.Emp_ID}</p>

            <p>Role : {employee.Role}</p>

            <p>Date of Joining : {employee.Date_of_Joining}</p>

            <p>Airline : {employee.Airline || "-"}</p>

            <p>
              Manager :{" "}
              {employee.Manager_F_Name
                ? `${employee.Manager_F_Name} ${employee.Manager_L_Name || ""}`
                : "-"}
            </p>

            {/* Edit */}
            <button
              onClick={() => editEmployee(employee)}
              className="
                mt-4
                mr-2
                bg-yellow-600
                hover:bg-yellow-700
                px-4
                py-2
                rounded
              "
            >
              Edit
            </button>

            {/* Delete */}
            <button
              onClick={() => deleteEmployee(employee.Emp_ID)}
              className="
                mt-4
                bg-red-600
                hover:bg-red-700
                px-4
                py-2
                rounded
              "
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

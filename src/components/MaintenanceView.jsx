"use client";

import { useEffect, useState } from "react";

export default function MaintenanceView() {
  const [maintenance, setMaintenance] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    aircraft_id: "",
    maintenance_type: "",
    engineer_name: "",
    cost: "",
    status: "Pending",
  });

  // Load maintenance
  async function loadMaintenance() {
    const res = await fetch("/api/maintenance");
    const data = await res.json();

    setMaintenance(data);
  }

  useEffect(() => {
    loadMaintenance();
  }, []);

  // Handle input
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Add maintenance
  async function addMaintenance(e) {
    e.preventDefault();

    const res = await fetch("/api/maintenance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
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

  // Edit maintenance
  function editMaintenance(record) {
    setForm({
      aircraft_id: record.Aircraft_ID,
      maintenance_type: record.Maintenance_Type || "",
      engineer_name: record.Engineer_Name || "",
      cost: record.Cost || "",
      status: record.Status || "Pending",
    });

    setEditing(true);
    setShowForm(true);
  }

  // Update maintenance
  async function updateMaintenance(e) {
    e.preventDefault();

    const res = await fetch("/api/maintenance", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
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

  // Delete maintenance
  async function deleteMaintenance(aircraft_id) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the maintenance record for ${aircraft_id}?`,
    );

    if (!confirmDelete) return;

    const res = await fetch("/api/maintenance", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        aircraft_id: aircraft_id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to delete maintenance record");
      return;
    }

    alert("Maintenance record deleted successfully");

    loadMaintenance();
  }

  // Clear form
  function clearForm() {
    setForm({
      aircraft_id: "",
      maintenance_type: "",
      engineer_name: "",
      cost: "",
      status: "Pending",
    });

    setEditing(false);
    setShowForm(false);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Maintenance</h1>

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
          {showForm ? "Cancel" : "Add Maintenance"}
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <form
          onSubmit={editing ? updateMaintenance : addMaintenance}
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
          {/* Aircraft ID */}
          <select
            name="aircraft_id"
            value={form.aircraft_id}
            onChange={handleChange}
            required
            disabled={editing}
            className="
              bg-slate-800
              p-3
              rounded
              disabled:opacity-50
            "
          >
            <option value="">Select Aircraft</option>

            <option value="AC-737">AC-737 - Boeing 737-800</option>

            <option value="AC-A320">AC-A320 - Airbus A320neo</option>

            <option value="AC-777">AC-777 - Boeing 777-300ER</option>
          </select>

          {/* Maintenance Type */}
          <input
            type="text"
            name="maintenance_type"
            placeholder="Maintenance Type"
            value={form.maintenance_type}
            onChange={handleChange}
            required
            className="bg-slate-800 p-3 rounded"
          />

          {/* Engineer */}
          <input
            type="text"
            name="engineer_name"
            placeholder="Engineer Name"
            value={form.engineer_name}
            onChange={handleChange}
            className="bg-slate-800 p-3 rounded"
          />

          {/* Cost */}
          <input
            type="number"
            step="0.01"
            name="cost"
            placeholder="Cost"
            value={form.cost}
            onChange={handleChange}
            className="bg-slate-800 p-3 rounded"
          />

          {/* Status */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="bg-slate-800 p-3 rounded"
          >
            <option value="Pending">Pending</option>

            <option value="In-Progress">In-Progress</option>

            <option value="Completed">Completed</option>
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
            {editing ? "Update Maintenance" : "Add Maintenance"}
          </button>
        </form>
      )}

      {/* Maintenance cards */}
      <div className="grid grid-cols-3 gap-5">
        {maintenance.map((record) => (
          <div
            key={record.Aircraft_ID}
            className="
              bg-slate-900
              border border-slate-700
              rounded-xl
              p-5
            "
          >
            <h2 className="text-xl font-bold">
              {record.Model || record.Aircraft_ID}
            </h2>

            <p>Aircraft ID : {record.Aircraft_ID}</p>

            <hr className="my-4 border-slate-700" />

            <p>Maintenance : {record.Maintenance_Type}</p>

            <p>Engineer : {record.Engineer_Name || "-"}</p>

            <p>Cost : ₹{record.Cost || 0}</p>

            <p>Status : {record.Status || "-"}</p>

            {/* Edit */}
            <button
              onClick={() => editMaintenance(record)}
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
              onClick={() => deleteMaintenance(record.Aircraft_ID)}
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

"use client";

import { useEffect, useState } from "react";

export default function FleetView() {
  const [fleet, setFleet] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    aircraft_id: "",
    model: "",
    manufacturer: "",
    year_of_mfg: "",
    capacity: "",
    type: "",
  });

  // Load fleet
  async function loadFleet() {
    const res = await fetch("/api/fleet");
    const data = await res.json();

    setFleet(data);
  }

  useEffect(() => {
    loadFleet();
  }, []);

  // Handle input
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Add aircraft
  async function addAircraft(e) {
    e.preventDefault();

    const res = await fetch("/api/fleet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to add aircraft");
      return;
    }

    alert("Aircraft added successfully");

    clearForm();
    loadFleet();
  }

  // Edit aircraft
  function editAircraft(aircraft) {
    setForm({
      aircraft_id: aircraft.Aircraft_ID,
      model: aircraft.Model,
      manufacturer: aircraft.Manufacturer,
      year_of_mfg: aircraft.Year_of_MFG || "",
      capacity: aircraft.Capacity || "",
      type: aircraft.Type || "",
    });

    setEditing(true);
    setShowForm(true);
  }

  // Update aircraft
  async function updateAircraft(e) {
    e.preventDefault();

    const res = await fetch("/api/fleet", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to update aircraft");
      return;
    }

    alert("Aircraft updated successfully");

    clearForm();
    loadFleet();
  }

  // Delete aircraft
  async function deleteAircraft(aircraft_id) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete aircraft ${aircraft_id}?`,
    );

    if (!confirmDelete) return;

    const res = await fetch("/api/fleet", {
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
      alert(data.error || "Failed to delete aircraft");
      return;
    }

    alert("Aircraft deleted successfully");

    loadFleet();
  }

  // Clear form
  function clearForm() {
    setForm({
      aircraft_id: "",
      model: "",
      manufacturer: "",
      year_of_mfg: "",
      capacity: "",
      type: "",
    });

    setEditing(false);
    setShowForm(false);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Aircraft Fleet</h1>

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
          {showForm ? "Cancel" : "Add Aircraft"}
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <form
          onSubmit={editing ? updateAircraft : addAircraft}
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
          <input
            type="text"
            name="aircraft_id"
            placeholder="Aircraft ID"
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
          />

          {/* Model */}
          <input
            type="text"
            name="model"
            placeholder="Aircraft Model"
            value={form.model}
            onChange={handleChange}
            required
            className="bg-slate-800 p-3 rounded"
          />

          {/* Manufacturer */}
          <input
            type="text"
            name="manufacturer"
            placeholder="Manufacturer"
            value={form.manufacturer}
            onChange={handleChange}
            required
            className="bg-slate-800 p-3 rounded"
          />

          {/* Year */}
          <input
            type="number"
            name="year_of_mfg"
            placeholder="Year of Manufacture"
            value={form.year_of_mfg}
            onChange={handleChange}
            className="bg-slate-800 p-3 rounded"
          />

          {/* Capacity */}
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={form.capacity}
            onChange={handleChange}
            required
            className="bg-slate-800 p-3 rounded"
          />

          {/* Type */}
          <input
            type="text"
            name="type"
            placeholder="Aircraft Type"
            value={form.type}
            onChange={handleChange}
            className="bg-slate-800 p-3 rounded"
          />

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
            {editing ? "Update Aircraft" : "Add Aircraft"}
          </button>
        </form>
      )}

      {/* Aircraft cards */}
      <div className="grid grid-cols-3 gap-6">
        {fleet.map((a) => (
          <div
            key={a.Aircraft_ID}
            className="
              bg-slate-900
              rounded-xl
              p-6
              border border-slate-700
            "
          >
            <h2 className="text-xl font-bold">{a.Model}</h2>

            <p>Aircraft ID : {a.Aircraft_ID}</p>

            <p>Manufacturer : {a.Manufacturer}</p>

            <p>Year : {a.Year_of_MFG || "-"}</p>

            <p>Capacity : {a.Capacity}</p>

            <p>Type : {a.Type || "-"}</p>

            <hr className="my-4 border-slate-700" />

            <h3 className="font-bold">Maintenance</h3>

            <p>{a.Maintenance_Type || "No records"}</p>

            <p>Engineer : {a.Engineer_Name || "-"}</p>

            <p>Status : {a.Status || "-"}</p>

            <p>Cost : ₹{a.Cost || 0}</p>

            {/* Edit */}
            <button
              onClick={() => editAircraft(a)}
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
              onClick={() => deleteAircraft(a.Aircraft_ID)}
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

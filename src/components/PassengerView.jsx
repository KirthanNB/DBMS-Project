"use client";

import { useEffect, useState } from "react";

export default function PassengerView() {
  const [passengers, setPassengers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    pass_id: "",
    name: "",
    nationality: "",
    gender: "",
    dob: "",
    phone: "",
  });

  // Load passengers
  async function loadPassengers() {
    const res = await fetch("/api/passengers");
    const data = await res.json();

    setPassengers(data);
  }

  useEffect(() => {
    loadPassengers();
  }, []);

  // Handle input
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Add passenger
  async function addPassenger(e) {
    e.preventDefault();

    const res = await fetch("/api/passengers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to add passenger");
      return;
    }

    alert("Passenger added successfully");

    clearForm();
    loadPassengers();
  }

  // Edit passenger
  function editPassenger(passenger) {
    setForm({
      pass_id: passenger.Pass_ID,
      name: passenger.Name,
      nationality: passenger.Nationality || "",
      gender: passenger.Gender || "",
      dob: passenger.DOB || "",
      phone: passenger.Phone_Numbers || "",
    });

    setEditing(true);
    setShowForm(true);
  }

  // Update passenger
  async function updatePassenger(e) {
    e.preventDefault();

    const res = await fetch("/api/passengers", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
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

  // Delete passenger
  async function deletePassenger(pass_id) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete passenger ${pass_id}?`,
    );

    if (!confirmDelete) return;

    const res = await fetch("/api/passengers", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pass_id: pass_id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to delete passenger");
      return;
    }

    alert("Passenger deleted successfully");

    loadPassengers();
  }

  // Clear form
  function clearForm() {
    setForm({
      pass_id: "",
      name: "",
      nationality: "",
      gender: "",
      dob: "",
      phone: "",
    });

    setEditing(false);
    setShowForm(false);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Passenger Records</h1>

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
          {showForm ? "Cancel" : "Add Passenger"}
        </button>
      </div>

      {/* Passenger form */}
      {showForm && (
        <form
          onSubmit={editing ? updatePassenger : addPassenger}
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
          {/* ID */}
          <input
            type="text"
            name="pass_id"
            placeholder="Passenger ID"
            value={form.pass_id}
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

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Passenger Name"
            value={form.name}
            onChange={handleChange}
            required
            className="bg-slate-800 p-3 rounded"
          />

          {/* Nationality */}
          <input
            type="text"
            name="nationality"
            placeholder="Nationality"
            value={form.nationality}
            onChange={handleChange}
            className="bg-slate-800 p-3 rounded"
          />

          {/* Gender */}
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="bg-slate-800 p-3 rounded"
          >
            <option value="">Select Gender</option>

            <option value="Male">Male</option>

            <option value="Female">Female</option>
          </select>

          {/* DOB */}
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="bg-slate-800 p-3 rounded"
          />

          {/* Phone */}
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
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
            {editing ? "Update Passenger" : "Add Passenger"}
          </button>
        </form>
      )}

      {/* Passenger cards */}
      <div className="grid grid-cols-3 gap-5">
        {passengers.map((p) => (
          <div
            key={p.Pass_ID}
            className="
              bg-slate-900
              border border-slate-700
              rounded-xl
              p-5
            "
          >
            <h2 className="text-xl font-bold">{p.Name}</h2>

            <p>ID : {p.Pass_ID}</p>

            <p>Nationality : {p.Nationality}</p>

            <p>Gender : {p.Gender}</p>

            <p>Age : {p.Age}</p>

            <div className="mt-3">
              <p className="text-gray-400">Phone Numbers</p>

              <p>{p.Phone_Numbers || "No phone"}</p>
            </div>

            {/* Edit */}
            <button
              onClick={() => editPassenger(p)}
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
              onClick={() => deletePassenger(p.Pass_ID)}
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

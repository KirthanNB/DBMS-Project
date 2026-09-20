"use client";

import { useEffect, useState } from "react";

export default function FlightsView() {
  const [flights, setFlights] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    flight_id: "",
    status: "",
    depart_time: "",
    arrival_time: "",
    airline_id: "",
    aircraft_id: "",
  });

  // Load flights
  async function loadFlights() {
    const res = await fetch("/api/flights");
    const data = await res.json();
    setFlights(data);
  }

  useEffect(() => {
    loadFlights();
  }, []);

  // Handle form changes
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Add flight
  async function addFlight(e) {
    e.preventDefault();

    const res = await fetch("/api/flights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to add flight");
      return;
    }

    alert("Flight added successfully");

    clearForm();
    loadFlights();
  }

  // Edit flight
  function editFlight(flight) {
    setForm({
      flight_id: flight.Flight_ID,
      status: flight.Status || "",
      depart_time: formatDateTime(flight.Dept_Time),
      arrival_time: formatDateTime(flight.Arrival_Time),
      airline_id: flight.Airline_ID || "",
      aircraft_id: flight.Aircraft_ID || "",
    });

    setEditing(true);
    setShowForm(true);
  }

  // Update flight
  async function updateFlight(e) {
    e.preventDefault();

    const res = await fetch("/api/flights", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
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

  // Delete flight
  async function deleteFlight(flight_id) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete flight ${flight_id}?`,
    );

    if (!confirmDelete) return;

    const res = await fetch("/api/flights", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        flight_id: flight_id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to delete flight");
      return;
    }

    alert("Flight deleted successfully");

    loadFlights();
  }

  // Clear form
  function clearForm() {
    setForm({
      flight_id: "",
      status: "",
      depart_time: "",
      arrival_time: "",
      airline_id: "",
      aircraft_id: "",
    });

    setEditing(false);
    setShowForm(false);
  }

  // Convert SQLite datetime to datetime-local format
  function formatDateTime(value) {
    if (!value) return "";

    return value.replace(" ", "T").slice(0, 16);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Flights</h1>

        <button
          onClick={() => {
            if (showForm) {
              clearForm();
            } else {
              setShowForm(true);
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded"
        >
          {showForm ? "Cancel" : "Add Flight"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={editing ? updateFlight : addFlight}
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
          {/* Flight ID */}
          <input
            type="text"
            name="flight_id"
            placeholder="Flight ID"
            value={form.flight_id}
            onChange={handleChange}
            required
            disabled={editing}
            className="bg-slate-800 p-3 rounded disabled:opacity-50"
          />

          {/* Status */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="bg-slate-800 p-3 rounded"
          >
            <option value="">Select Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="On-Time">On-Time</option>
            <option value="Delayed">Delayed</option>
            <option value="Departed">Departed</option>
            <option value="Arrived">Arrived</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Departure */}
          <input
            type="datetime-local"
            name="depart_time"
            value={form.depart_time}
            onChange={handleChange}
            required
            className="bg-slate-800 p-3 rounded"
          />

          {/* Arrival */}
          <input
            type="datetime-local"
            name="arrival_time"
            value={form.arrival_time}
            onChange={handleChange}
            required
            className="bg-slate-800 p-3 rounded"
          />

          {/* Airline */}
          <select
            name="airline_id"
            value={form.airline_id}
            onChange={handleChange}
            required
            className="bg-slate-800 p-3 rounded"
          >
            <option value="">Select Airline</option>
            <option value="AL-101">SkyWings Airways</option>
            <option value="AL-102">AeroGlobal Express</option>
            <option value="AL-103">Pacific Star Airlines</option>
          </select>

          {/* Aircraft */}
          <select
            name="aircraft_id"
            value={form.aircraft_id}
            onChange={handleChange}
            required
            className="bg-slate-800 p-3 rounded"
          >
            <option value="">Select Aircraft</option>
            <option value="AC-737">Boeing 737-800</option>
            <option value="AC-A320">Airbus A320neo</option>
            <option value="AC-777">Boeing 777-300ER</option>
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
            {editing ? "Update Flight" : "Add Flight"}
          </button>
        </form>
      )}

      {/* Flight table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-900">
              <th className="p-4 text-left">Flight ID</th>
              <th className="p-4 text-left">Airline</th>
              <th className="p-4 text-left">Aircraft</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Departure</th>
              <th className="p-4 text-left">Arrival</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {flights.map((flight) => (
              <tr key={flight.Flight_ID} className="border-b border-slate-800">
                <td className="p-4">{flight.Flight_ID}</td>

                <td className="p-4">{flight.Airline}</td>

                <td className="p-4">{flight.Model}</td>

                <td className="p-4">{flight.Status}</td>

                <td className="p-4">{flight.Dept_Time}</td>

                <td className="p-4">{flight.Arrival_Time}</td>

                <td className="p-4">
                  <button
                    onClick={() => editFlight(flight)}
                    className="
                      bg-yellow-600
                      hover:bg-yellow-700
                      px-4
                      py-2
                      rounded
                      mr-2
                    "
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteFlight(flight.Flight_ID)}
                    className="
                      bg-red-600
                      hover:bg-red-700
                      px-4
                      py-2
                      rounded
                    "
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

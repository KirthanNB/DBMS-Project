"use client";

import { useEffect, useState } from "react";

export default function SeatBookingView() {
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [passenger, setPassenger] = useState("");

  // Load seats
  async function loadSeats() {
    const res = await fetch("/api/seats");
    const data = await res.json();

    setSeats(data);
  }

  // Load seats when page opens
  useEffect(() => {
    loadSeats();
  }, []);

  // Book selected seat
  async function bookSeat() {
    if (!selected || !passenger) {
      alert("Select a seat and enter Passenger ID");
      return;
    }

    // Don't allow already booked seat
    if (selected.Pass_ID) {
      alert("This seat is already booked");
      return;
    }

    const res = await fetch("/api/seats", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        seat_no: selected.Seat_No,
        aircraft_id: selected.Aircraft_ID,
        passenger_id: passenger,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to book seat");
      return;
    }

    alert("Seat booked successfully");

    // Clear selection
    setSelected(null);
    setPassenger("");

    // Reload seats
    loadSeats();
  }

  // Group seats by row number
  const rows = {};

  seats.forEach((seat) => {
    const match = seat.Seat_No.match(/\d+/);

    if (!match) return;

    const rowNumber = match[0];

    if (!rows[rowNumber]) {
      rows[rowNumber] = [];
    }

    rows[rowNumber].push(seat);
  });

  return (
    <div>
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-8">Aircraft Cabin Booking</h1>

      <div className="flex gap-10">
        {/* ================= CABIN ================= */}
        <div
          className="
            bg-slate-900
            rounded-[80px]
            p-10
            w-[500px]
            border
            border-slate-700
          "
        >
          {/* Front */}
          <div
            className="
              text-center
              mb-8
              text-gray-400
            "
          >
            ✈ FRONT OF AIRCRAFT
          </div>

          {/* Seats */}
          {Object.entries(rows).map(([row, rowSeats]) => (
            <div
              key={row}
              className="
                  flex
                  justify-center
                  gap-3
                  mb-4
                "
            >
              {rowSeats.map((seat) => (
                <button
                  key={seat.Seat_No + seat.Aircraft_ID}
                  onClick={() => setSelected(seat)}
                  disabled={!!seat.Pass_ID}
                  className={`
                      w-10
                      h-10
                      rounded-lg
                      text-sm
                      font-bold

                      ${
                        seat.Pass_ID
                          ? "bg-red-600 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-500"
                      }

                      ${selected === seat ? "ring-4 ring-yellow-400" : ""}
                    `}
                >
                  {seat.Seat_No}
                </button>
              ))}
            </div>
          ))}

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-600 rounded"></span>
              Available
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-600 rounded"></span>
              Booked
            </div>
          </div>
        </div>

        {/* ================= BOOKING PANEL ================= */}
        <div
          className="
            bg-slate-900
            p-6
            rounded-xl
            w-80
            border
            border-slate-700
          "
        >
          <h2 className="text-xl font-bold">Booking</h2>

          {/* Selected seat */}
          <p className="mt-4">Selected Seat:</p>

          <div className="text-blue-400 text-xl mt-1">
            {selected ? selected.Seat_No : "None"}
          </div>

          {/* Aircraft */}
          {selected && (
            <div className="mt-3 text-gray-400">
              Aircraft: {selected.Aircraft_ID}
            </div>
          )}

          {/* Passenger ID */}
          <input
            type="text"
            placeholder="Passenger ID"
            value={passenger}
            onChange={(e) => setPassenger(e.target.value)}
            className="
              mt-5
              w-full
              bg-slate-800
              p-3
              rounded
            "
          />

          {/* Confirm */}
          <button
            onClick={bookSeat}
            className="
              mt-5
              bg-blue-600
              hover:bg-blue-700
              px-5
              py-3
              rounded
              w-full
            "
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}

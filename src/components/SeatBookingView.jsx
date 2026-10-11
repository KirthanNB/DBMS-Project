"use client";

import { useEffect, useState } from "react";
import { Plane, Users, CheckCircle, XCircle, RefreshCw, Ticket, Shield } from "lucide-react";

export default function SeatBookingView({ initialPassengerId }) {
  const [seats, setSeats] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [selectedAircraft, setSelectedAircraft] = useState("AC-737");
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [passengerId, setPassengerId] = useState(initialPassengerId || "P-9001");
  const [isLoading, setIsLoading] = useState(false);

  async function loadData() {
    setIsLoading(true);
    try {
      const fRes = await fetch("/api/fleet");
      if (fRes.ok) {
        const fData = await fRes.json();
        const uniqueFleet = Array.from(new Map(fData.map(item => [item.Aircraft_ID, item])).values());
        setFleet(uniqueFleet);
      }

      const pRes = await fetch("/api/passengers");
      if (pRes.ok) {
        const pData = await pRes.json();
        setPassengers(pData);
      }

      const sRes = await fetch(`/api/seats?aircraft_id=${selectedAircraft}`);
      if (sRes.ok) {
        const sData = await sRes.json();
        setSeats(sData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [selectedAircraft]);

  useEffect(() => {
    if (initialPassengerId) {
      setPassengerId(initialPassengerId);
    }
  }, [initialPassengerId]);

  async function bookSeat() {
    if (!selectedSeat || !passengerId) {
      alert("Please select an available seat and specify Passenger ID");
      return;
    }

    if (selectedSeat.Pass_ID) {
      alert("This seat is already booked");
      return;
    }

    try {
      const res = await fetch("/api/seats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seat_no: selectedSeat.Seat_No,
          aircraft_id: selectedAircraft,
          passenger_id: passengerId
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to book seat");
        return;
      }

      alert(`Seat ${selectedSeat.Seat_No} confirmed for Passenger ${passengerId}!`);
      setSelectedSeat(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  async function cancelSeatBooking() {
    if (!selectedSeat || !selectedSeat.Pass_ID) return;
    if (!confirm(`Cancel booking for seat ${selectedSeat.Seat_No}?`)) return;

    try {
      const res = await fetch("/api/seats", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seat_no: selectedSeat.Seat_No,
          aircraft_id: selectedAircraft
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to cancel seat");
        return;
      }

      alert(`Seat ${selectedSeat.Seat_No} is now available.`);
      setSelectedSeat(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  const bookedCount = seats.filter(s => s.Pass_ID).length;
  const availableCount = seats.filter(s => !s.Pass_ID).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-xl shadow-2xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Plane className="w-6 h-6 text-amber-400" />
            <span>Aircraft Cabin Layout & Seat Reservation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time cabin seat assignment linked to relational table <code className="text-amber-300">Seats</code> with Foreign Key to <code className="text-amber-300">Passenger</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedAircraft}
            onChange={e => {
              setSelectedAircraft(e.target.value);
              setSelectedSeat(null);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
          >
            {fleet.map(ac => (
              <option key={ac.Aircraft_ID} value={ac.Aircraft_ID}>
                {ac.Model} ({ac.Aircraft_ID})
              </option>
            ))}
            {fleet.length === 0 && (
              <option value="AC-737">Boeing 737-800 (AC-737)</option>
            )}
          </select>

          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Refresh Cabin Map"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-6 pb-4 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-slate-800 border border-slate-600 inline-block"></span>
                <span className="text-slate-300">Available ({availableCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-rose-600/60 border border-rose-500 inline-block"></span>
                <span className="text-slate-300">Occupied ({bookedCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-md bg-amber-500 border border-amber-400 inline-block"></span>
                <span className="text-slate-300">Selected</span>
              </div>
            </div>

            <div className="text-slate-400 font-mono text-[11px]">
              Aircraft: <span className="text-white font-bold">{selectedAircraft}</span>
            </div>
          </div>

          <div className="relative w-full max-w-md bg-slate-950/80 rounded-[48px] border-2 border-slate-800 p-6 sm:p-8 shadow-inner flex flex-col items-center space-y-6">
            <div className="w-full flex justify-center pb-2 border-b border-slate-800/80">
              <div className="px-4 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1.5">
                <Plane className="w-3 h-3 text-amber-400 rotate-180" />
                <span>Flight Deck / Cockpit</span>
              </div>
            </div>

            <div className="w-full space-y-4">
              {seats.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No seat records found for this aircraft in the DBMS.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {seats.map((seat, idx) => {
                    const isSelected = selectedSeat?.Seat_No === seat.Seat_No;
                    const isBooked = !!seat.Pass_ID;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSeat(seat)}
                        className={`p-3 rounded-2xl border text-left transition-all duration-150 relative ${
                          isSelected
                            ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30 scale-102"
                            : isBooked
                            ? "bg-rose-950/30 border-rose-900/60 text-slate-300 hover:border-rose-700"
                            : "bg-slate-900/90 border-slate-800 hover:border-slate-700 text-white hover:bg-slate-850"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-base font-black ${isSelected ? "text-slate-950" : "text-white"}`}>
                            {seat.Seat_No}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isSelected
                                ? "bg-slate-950 text-amber-400"
                                : seat.Seat_Type === "First"
                                ? "bg-purple-950/80 text-purple-300 border border-purple-800/50"
                                : seat.Seat_Type === "Business"
                                ? "bg-blue-950/80 text-blue-300 border border-blue-800/50"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {seat.Seat_Type}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[11px]">
                          {isBooked ? (
                            <span className={isSelected ? "text-slate-900 font-semibold" : "text-rose-400"}>
                              {seat.Passenger_Name || seat.Pass_ID}
                            </span>
                          ) : (
                            <span className={isSelected ? "text-slate-900 font-semibold" : "text-emerald-400"}>
                              Available
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="w-full flex justify-center pt-2 border-t border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                Rear Cabin Galley & Exit
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Ticket className="w-5 h-5 text-amber-400" />
              <span>Seat Booking Inspector</span>
            </h2>

            {selectedSeat ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Selected Seat</span>
                    <span className="text-xl font-black text-amber-400">{selectedSeat.Seat_No}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Cabin Class</span>
                    <span className="font-semibold text-white">{selectedSeat.Seat_Type}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Current Status</span>
                    <span className={selectedSeat.Pass_ID ? "font-bold text-rose-400" : "font-bold text-emerald-400"}>
                      {selectedSeat.Pass_ID ? `Booked (${selectedSeat.Passenger_Name || selectedSeat.Pass_ID})` : "Available for Booking"}
                    </span>
                  </div>
                </div>

                {!selectedSeat.Pass_ID ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Assign to Passenger
                      </label>
                      <select
                        value={passengerId}
                        onChange={e => setPassengerId(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        {passengers.map(p => (
                          <option key={p.Pass_ID} value={p.Pass_ID}>
                            {p.Pass_ID} - {p.Name} ({p.Nationality})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={bookSeat}
                      className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirm Seat Reservation</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs text-rose-300">
                      This seat is currently assigned to passenger {selectedSeat.Passenger_Name || selectedSeat.Pass_ID}.
                    </div>

                    <button
                      onClick={cancelSeatBooking}
                      className="w-full py-3 px-4 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/40 font-semibold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Release & Cancel Seat Booking</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs rounded-2xl bg-slate-950/50 border border-slate-800">
                Click any seat in the aircraft cabin map to inspect details or reserve.
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">DBMS Relation Details:</div>
            <div>Table: <span className="text-white font-mono">Seats</span> (Seat_No, Aircraft_ID, Seat_Type, Pass_ID)</div>
            <div>Foreign Keys: <span className="text-white font-mono">Aircraft_ID, Pass_ID</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

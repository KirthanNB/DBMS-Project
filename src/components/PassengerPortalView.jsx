"use client";

import { useState, useEffect } from "react";
import { Plane, Ticket, Search, CheckCircle, Clock, MapPin, Calendar, QrCode, Shield, RefreshCw } from "lucide-react";

export default function PassengerPortalView({ passengerUser, onSwitchToSeatBooking }) {
  const [activeTab, setActiveTab] = useState("passes");
  const [flights, setFlights] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadPassengerData() {
    setIsLoading(true);
    try {
      const fRes = await fetch("/api/flights");
      if (fRes.ok) {
        const fData = await fRes.json();
        setFlights(fData);
      }

      if (passengerUser?.id) {
        const sRes = await fetch(`/api/seats?passenger_id=${passengerUser.id}`);
        if (sRes.ok) {
          const sData = await sRes.json();
          setBookedSeats(sData);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPassengerData();
  }, [passengerUser?.id]);

  async function cancelBooking(seatNo, aircraftId) {
    if (!confirm(`Cancel booking for seat ${seatNo}?`)) return;
    try {
      const res = await fetch("/api/seats", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seat_no: seatNo, aircraft_id: aircraftId })
      });
      if (res.ok) {
        alert("Seat booking successfully released.");
        loadPassengerData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to cancel seat");
      }
    } catch (err) {
      alert(err.message);
    }
  }

  const filteredFlights = flights.filter(f =>
    f.Flight_ID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.Airline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.Model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.Status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Verified Passenger
            </span>
            <span className="text-xs text-slate-400">Passport / Pass ID: {passengerUser?.id}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Welcome aboard, {passengerUser?.name || "Passenger"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Airport Passenger Terminal — Check live flight departures, book cabin seats, and view your digital boarding passes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("passes")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === "passes"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>My Boarding Passes ({bookedSeats.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("flights")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === "flights"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Live Flight Board</span>
          </button>
        </div>
      </div>

      {activeTab === "passes" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-emerald-400" />
                <span>Active Boarding Passes & Confirmed Seats</span>
              </h2>
              <p className="text-xs text-slate-400">
                Connected to relational DBMS table <code className="text-emerald-300">Seats</code> joined with <code className="text-emerald-300">Aircraft</code> & <code className="text-emerald-300">Flight</code>.
              </p>
            </div>
            <button
              onClick={loadPassengerData}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {bookedSeats.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No Booked Seats Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
                You do not have any seat reservations linked to Passenger ID {passengerUser?.id}. Browse flights and reserve your cabin seat now.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setActiveTab("flights")}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition"
                >
                  Browse Scheduled Flights
                </button>
                {onSwitchToSeatBooking && (
                  <button
                    onClick={onSwitchToSeatBooking}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition"
                  >
                    Open Aircraft Cabin Seat Map
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookedSeats.map((ticket, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-slate-700/80 backdrop-blur-xl shadow-2xl overflow-hidden relative"
                >
                  <div className="p-6 bg-slate-800/50 border-b border-slate-700/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                        <Plane className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                          {ticket.Airline_Name || "Commercial Carrier"}
                        </div>
                        <div className="text-lg font-black text-white tracking-wide">
                          Flight {ticket.Flight_ID || "FL-1001"}
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Confirmed Seat
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Seat Number</div>
                        <div className="text-xl font-black text-white">{ticket.Seat_No}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Cabin Class</div>
                        <div className="text-sm font-bold text-amber-400">{ticket.Seat_Type}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Aircraft ID</div>
                        <div className="text-sm font-bold text-blue-400">{ticket.Aircraft_ID}</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Passenger Name</span>
                        <span className="font-semibold text-white">{passengerUser?.name}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Aircraft Model</span>
                        <span className="font-semibold text-slate-200">{ticket.Model} ({ticket.Manufacturer})</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Departure Time</span>
                        <span className="font-semibold text-slate-200">{ticket.Dept_Time || "Scheduled"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Arrival Time</span>
                        <span className="font-semibold text-slate-200">{ticket.Arrival_Time || "Scheduled"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Flight Status</span>
                        <span className="font-semibold text-emerald-400">{ticket.Status || "On-Time"}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <QrCode className="w-8 h-8 text-white p-0.5 bg-white/10 rounded-lg" />
                        <div>
                          <div className="text-slate-300 font-mono text-[10px]">BC-{passengerUser?.id}-{ticket.Seat_No}</div>
                          <div>Scan at Security Gate</div>
                        </div>
                      </div>

                      <button
                        onClick={() => cancelBooking(ticket.Seat_No, ticket.Aircraft_ID)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold transition"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "flights" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by flight number, airline, aircraft model, or status..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {onSwitchToSeatBooking && (
              <button
                onClick={onSwitchToSeatBooking}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition shrink-0"
              >
                <Ticket className="w-4 h-4" />
                <span>Reserve Seat in Cabin</span>
              </button>
            )}
          </div>

          <div className="rounded-3xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                    <th className="p-4 font-semibold">Flight ID</th>
                    <th className="p-4 font-semibold">Airline</th>
                    <th className="p-4 font-semibold">Aircraft Model</th>
                    <th className="p-4 font-semibold">Departure</th>
                    <th className="p-4 font-semibold">Arrival</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredFlights.map(flight => (
                    <tr key={flight.Flight_ID} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <div className="p-1 rounded bg-blue-500/20 text-blue-400">
                          <Plane className="w-3.5 h-3.5" />
                        </div>
                        <span>{flight.Flight_ID}</span>
                      </td>
                      <td className="p-4 text-slate-200">{flight.Airline}</td>
                      <td className="p-4 text-slate-300">
                        {flight.Model}
                        <span className="text-[10px] text-slate-500 ml-1.5">({flight.Aircraft_ID})</span>
                      </td>
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
                        {onSwitchToSeatBooking && (
                          <button
                            onClick={onSwitchToSeatBooking}
                            className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-xs font-medium transition"
                          >
                            Book Seat
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredFlights.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                        No flights matched your filter query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import db from "../../../../lib/db";

export async function GET() {
  const flightStats = db.prepare(`
    SELECT
      COUNT(*) AS total_flights,
      SUM(CASE WHEN Status = 'On-Time' THEN 1 ELSE 0 END) AS on_time_flights,
      SUM(CASE WHEN Status = 'Delayed' THEN 1 ELSE 0 END) AS delayed_flights,
      SUM(CASE WHEN Status = 'Scheduled' THEN 1 ELSE 0 END) AS scheduled_flights,
      SUM(CASE WHEN Status = 'Departed' THEN 1 ELSE 0 END) AS departed_flights,
      SUM(CASE WHEN Status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled_flights
    FROM Flight
  `).get();

  const seatStats = db.prepare(`
    SELECT
      COUNT(*) AS total_seats,
      SUM(CASE WHEN Pass_ID IS NOT NULL THEN 1 ELSE 0 END) AS booked_seats
    FROM Seats
  `).get();

  const fleetStats = db.prepare(`
    SELECT
      COUNT(DISTINCT Aircraft_ID) AS total_aircraft,
      SUM(Capacity) AS total_passenger_capacity
    FROM Aircraft
  `).get();

  const employeeStats = db.prepare(`
    SELECT
      COUNT(*) AS total_employees,
      COUNT(DISTINCT Role) AS total_roles
    FROM Employee
  `).get();

  const passengerStats = db.prepare(`
    SELECT COUNT(*) AS total_passengers FROM Passenger
  `).get();

  const maintenanceStats = db.prepare(`
    SELECT
      COUNT(*) AS total_records,
      COALESCE(SUM(Cost), 0) AS total_cost,
      SUM(CASE WHEN Status = 'In-Progress' THEN 1 ELSE 0 END) AS in_progress,
      SUM(CASE WHEN Status = 'Pending' THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) AS completed
    FROM Maintenance
  `).get();

  return Response.json({
    flights: flightStats,
    seats: seatStats,
    fleet: fleetStats,
    employees: employeeStats,
    passengers: passengerStats,
    maintenance: maintenanceStats
  });
}

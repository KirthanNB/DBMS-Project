import db, { queryRaw } from "../../../../lib/db";

export async function GET() {
  const flights = queryRaw(`
    SELECT
      Flight.Flight_ID,
      Flight.Status,
      Flight.Dept_Time,
      Flight.Arrival_Time,
      Flight.Airline_ID,
      Flight.Aircraft_ID,
      Airlines.Name AS Airline,
      Aircraft.Model
    FROM Flight
    JOIN Airlines
      ON Flight.Airline_ID = Airlines.Airline_ID
    JOIN Aircraft
      ON Flight.Aircraft_ID = Aircraft.Aircraft_ID
  `);
  return Response.json(flights);
}

export async function POST(request) {
  try {
    const data = await request.json();
    db.prepare(`
      INSERT INTO Flight
      (
        Flight_ID,
        Status,
        Dept_Time,
        Arrival_Time,
        Airline_ID,
        Aircraft_ID
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      data.flight_id,
      data.status,
      data.depart_time,
      data.arrival_time,
      data.airline_id,
      data.aircraft_id
    );

    return Response.json({ message: "Flight added successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    db.prepare(`
      UPDATE Flight
      SET
        Status = ?,
        Dept_Time = ?,
        Arrival_Time = ?,
        Airline_ID = ?,
        Aircraft_ID = ?
      WHERE Flight_ID = ?
    `).run(
      data.status,
      data.depart_time,
      data.arrival_time,
      data.airline_id,
      data.aircraft_id,
      data.flight_id
    );

    return Response.json({ message: "Flight updated successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const data = await request.json();
    db.prepare(`
      DELETE FROM Flight
      WHERE Flight_ID = ?
    `).run(data.flight_id);

    return Response.json({ message: "Flight deleted successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

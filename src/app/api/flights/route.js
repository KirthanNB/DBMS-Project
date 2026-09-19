import db, { queryRaw } from "../../../../lib/db";


export async function GET() {

  const flights = queryRaw(`
    SELECT
      Flight_ID,
      Status,
      Dept_Time,
      Arrival_Time,
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

  const data = await request.json();


  db.prepare(`
    INSERT INTO Flight
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    data.flight_id,
    data.status,
    data.depart_time,
    data.arrival_time,
    data.airline_id,
    data.aircraft_id
  );


  return Response.json({
    message: "Flight added successfully"
  });
}
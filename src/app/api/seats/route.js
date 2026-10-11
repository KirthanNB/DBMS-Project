import db, { queryRaw } from "../../../../lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const aircraftId = searchParams.get("aircraft_id");
  const passId = searchParams.get("passenger_id");

  if (aircraftId) {
    const seats = db.prepare(`
      SELECT
        Seats.Seat_No,
        Seats.Aircraft_ID,
        Seats.Seat_Type,
        Seats.Pass_ID,
        Passenger.Name AS Passenger_Name
      FROM Seats
      LEFT JOIN Passenger ON Seats.Pass_ID = Passenger.Pass_ID
      WHERE Seats.Aircraft_ID = ?
    `).all(aircraftId);
    return Response.json(seats);
  }

  if (passId) {
    const seats = db.prepare(`
      SELECT
        Seats.Seat_No,
        Seats.Aircraft_ID,
        Seats.Seat_Type,
        Seats.Pass_ID,
        Aircraft.Model,
        Aircraft.Manufacturer,
        Flight.Flight_ID,
        Flight.Status,
        Flight.Dept_Time,
        Flight.Arrival_Time,
        Airlines.Name AS Airline_Name
      FROM Seats
      JOIN Aircraft ON Seats.Aircraft_ID = Aircraft.Aircraft_ID
      LEFT JOIN Flight ON Aircraft.Aircraft_ID = Flight.Aircraft_ID
      LEFT JOIN Airlines ON Flight.Airline_ID = Airlines.Airline_ID
      WHERE Seats.Pass_ID = ?
    `).all(passId);
    return Response.json(seats);
  }

  const seats = queryRaw(`
    SELECT
      Seats.Seat_No,
      Seats.Aircraft_ID,
      Seats.Seat_Type,
      Seats.Pass_ID,
      Passenger.Name AS Passenger_Name
    FROM Seats
    LEFT JOIN Passenger ON Seats.Pass_ID = Passenger.Pass_ID
  `);
  return Response.json(seats);
}

export async function POST(request) {
  try {
    const data = await request.json();

    const passenger = db.prepare(`
      SELECT Pass_ID
      FROM Passenger
      WHERE Pass_ID = ?
    `).get(data.passenger_id);

    if (!passenger) {
      return Response.json({ error: "Passenger does not exist" }, { status: 400 });
    }

    const seat = db.prepare(`
      SELECT Seat_No, Aircraft_ID, Pass_ID
      FROM Seats
      WHERE Seat_No = ? AND Aircraft_ID = ?
    `).get(data.seat_no, data.aircraft_id);

    if (!seat) {
      return Response.json({ error: "Seat does not exist" }, { status: 400 });
    }

    if (seat.Pass_ID) {
      return Response.json({ error: "Seat is already booked" }, { status: 400 });
    }

    db.prepare(`
      UPDATE Seats
      SET Pass_ID = ?
      WHERE Seat_No = ? AND Aircraft_ID = ?
    `).run(data.passenger_id, data.seat_no, data.aircraft_id);

    return Response.json({ message: "Seat booked successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const data = await request.json();
    db.prepare(`
      UPDATE Seats
      SET Pass_ID = NULL
      WHERE Seat_No = ? AND Aircraft_ID = ?
    `).run(data.seat_no, data.aircraft_id);

    return Response.json({ message: "Seat booking cancelled successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

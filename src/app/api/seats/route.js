import db, { queryRaw } from "../../../../lib/db";

// GET - Display seats
export async function GET() {
  const seats = queryRaw(`
    SELECT
      Seat_No,
      Aircraft_ID,
      Seat_Type,
      Pass_ID
    FROM Seats
  `);

  return Response.json(seats);
}

// POST - Book seat
export async function POST(request) {
  try {
    const data = await request.json();

    // Check whether passenger exists
    const passenger = db
      .prepare(
        `
      SELECT Pass_ID
      FROM Passenger
      WHERE Pass_ID = ?
    `,
      )
      .get(data.passenger_id);

    if (!passenger) {
      return Response.json(
        {
          error: "Passenger does not exist",
        },
        {
          status: 400,
        },
      );
    }

    // Check whether seat exists
    const seat = db
      .prepare(
        `
      SELECT
        Seat_No,
        Aircraft_ID,
        Pass_ID
      FROM Seats
      WHERE Seat_No = ?
      AND Aircraft_ID = ?
    `,
      )
      .get(data.seat_no, data.aircraft_id);

    if (!seat) {
      return Response.json(
        {
          error: "Seat does not exist",
        },
        {
          status: 400,
        },
      );
    }

    // Check whether seat is already booked
    if (seat.Pass_ID) {
      return Response.json(
        {
          error: "Seat is already booked",
        },
        {
          status: 400,
        },
      );
    }

    // Book seat
    db.prepare(
      `
      UPDATE Seats
      SET Pass_ID = ?
      WHERE Seat_No = ?
      AND Aircraft_ID = ?
    `,
    ).run(data.passenger_id, data.seat_no, data.aircraft_id);

    return Response.json({
      message: "Seat booked successfully",
    });
  } catch (error) {
    return Response.json(
      {
        error: error.message,
      },
      {
        status: 400,
      },
    );
  }
}

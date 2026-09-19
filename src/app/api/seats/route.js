import db, { queryRaw } from "../../../../lib/db";


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



export async function POST(request) {

  const data = await request.json();


  db.prepare(`
    UPDATE Seats
    SET Pass_ID = ?
    WHERE Seat_No = ?
    AND Aircraft_ID = ?
  `).run(
    data.passenger_id,
    data.seat_no,
    data.aircraft_id
  );


  return Response.json({
    message:"Seat booked successfully"
  });
}
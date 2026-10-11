import db, { queryRaw } from "../../../../lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const empId = searchParams.get("emp_id");
  const flightId = searchParams.get("flight_id");

  let sql = `
    SELECT
      Flight_Employee.Flight_ID,
      Flight_Employee.Emp_ID,
      Employee.F_Name,
      Employee.L_Name,
      Employee.Role,
      Flight.Status AS Flight_Status,
      Flight.Dept_Time,
      Flight.Arrival_Time,
      Flight.Airline_ID,
      Flight.Aircraft_ID,
      Airlines.Name AS Airline_Name,
      Aircraft.Model AS Aircraft_Model
    FROM Flight_Employee
    JOIN Employee ON Flight_Employee.Emp_ID = Employee.Emp_ID
    JOIN Flight ON Flight_Employee.Flight_ID = Flight.Flight_ID
    LEFT JOIN Airlines ON Flight.Airline_ID = Airlines.Airline_ID
    LEFT JOIN Aircraft ON Flight.Aircraft_ID = Aircraft.Aircraft_ID
  `;

  if (empId) {
    const list = db.prepare(sql + ` WHERE Flight_Employee.Emp_ID = ?`).all(empId);
    return Response.json(list);
  }

  if (flightId) {
    const list = db.prepare(sql + ` WHERE Flight_Employee.Flight_ID = ?`).all(flightId);
    return Response.json(list);
  }

  const list = queryRaw(sql);
  return Response.json(list);
}

export async function POST(request) {
  try {
    const data = await request.json();
    db.prepare(`
      INSERT INTO Flight_Employee (Flight_ID, Emp_ID)
      VALUES (?, ?)
    `).run(data.flight_id, data.emp_id);
    return Response.json({ message: "Crew assigned successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const data = await request.json();
    db.prepare(`
      DELETE FROM Flight_Employee
      WHERE Flight_ID = ? AND Emp_ID = ?
    `).run(data.flight_id, data.emp_id);
    return Response.json({ message: "Crew assignment removed successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

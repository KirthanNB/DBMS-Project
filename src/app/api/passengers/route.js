import db, { queryRaw } from "../../../../lib/db";

export async function GET() {
  const passengers = queryRaw(`
    SELECT
      Passenger.Pass_ID,
      Passenger.Name,
      Passenger.Nationality,
      Passenger.Gender,
      Passenger.DOB,
      CAST(
        (julianday('now') - julianday(DOB))
        / 365.25
        AS INT
      ) AS Age,
      GROUP_CONCAT(
        Passenger_PhNo.PhNo,
        ', '
      ) AS Phone_Numbers
    FROM Passenger
    LEFT JOIN Passenger_PhNo
      ON Passenger.Pass_ID = Passenger_PhNo.Pass_ID
    GROUP BY Passenger.Pass_ID
  `);
  return Response.json(passengers);
}

export async function POST(request) {
  try {
    const data = await request.json();
    const addPassenger = db.transaction(() => {
      db.prepare(`
        INSERT INTO Passenger
        (
          Pass_ID,
          Name,
          Nationality,
          Gender,
          DOB
        )
        VALUES (?, ?, ?, ?, ?)
      `).run(data.pass_id, data.name, data.nationality, data.gender, data.dob);

      if (data.phone) {
        db.prepare(`
          INSERT INTO Passenger_PhNo
          (
            Pass_ID,
            PhNo
          )
          VALUES (?, ?)
        `).run(data.pass_id, data.phone);
      }
    });

    addPassenger();
    return Response.json({ message: "Passenger added successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const updatePassenger = db.transaction(() => {
      db.prepare(`
        UPDATE Passenger
        SET
          Name = ?,
          Nationality = ?,
          Gender = ?,
          DOB = ?
        WHERE Pass_ID = ?
      `).run(data.name, data.nationality, data.gender, data.dob, data.pass_id);

      if (data.phone) {
        db.prepare(`
          DELETE FROM Passenger_PhNo
          WHERE Pass_ID = ?
        `).run(data.pass_id);

        db.prepare(`
          INSERT INTO Passenger_PhNo
          (
            Pass_ID,
            PhNo
          )
          VALUES (?, ?)
        `).run(data.pass_id, data.phone);
      }
    });

    updatePassenger();
    return Response.json({ message: "Passenger updated successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const data = await request.json();
    db.prepare(`
      DELETE FROM Passenger
      WHERE Pass_ID = ?
    `).run(data.pass_id);

    return Response.json({ message: "Passenger deleted successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

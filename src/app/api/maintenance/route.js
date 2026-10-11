import db, { queryRaw } from "../../../../lib/db";

export async function GET() {
  const maintenance = queryRaw(`
    SELECT
      Maintenance.Aircraft_ID,
      Aircraft.Model,
      Maintenance.Maintenance_Type,
      Maintenance.Engineer_Name,
      Maintenance.Cost,
      Maintenance.Status
    FROM Maintenance
    LEFT JOIN Aircraft
      ON Maintenance.Aircraft_ID =
         Aircraft.Aircraft_ID
  `);
  return Response.json(maintenance);
}

export async function POST(request) {
  try {
    const data = await request.json();
    db.prepare(`
      INSERT INTO Maintenance
      (
        Aircraft_ID,
        Maintenance_Type,
        Engineer_Name,
        Cost,
        Status
      )
      VALUES (?, ?, ?, ?, ?)
    `).run(
      data.aircraft_id,
      data.maintenance_type,
      data.engineer_name,
      data.cost,
      data.status
    );

    return Response.json({ message: "Maintenance record added successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    db.prepare(`
      UPDATE Maintenance
      SET
        Maintenance_Type = ?,
        Engineer_Name = ?,
        Cost = ?,
        Status = ?
      WHERE Aircraft_ID = ?
    `).run(
      data.maintenance_type,
      data.engineer_name,
      data.cost,
      data.status,
      data.aircraft_id
    );

    return Response.json({ message: "Maintenance record updated successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const data = await request.json();
    db.prepare(`
      DELETE FROM Maintenance
      WHERE Aircraft_ID = ?
    `).run(data.aircraft_id);

    return Response.json({ message: "Maintenance record deleted successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

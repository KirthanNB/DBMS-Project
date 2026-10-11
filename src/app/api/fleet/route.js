import db, { queryRaw } from "../../../../lib/db";

export async function GET() {
  const fleet = queryRaw(`
    SELECT
      Aircraft.Aircraft_ID,
      Aircraft.Model,
      Aircraft.Manufacturer,
      Aircraft.Year_of_MFG,
      Aircraft.Capacity,
      Aircraft.Type,
      Maintenance.Maintenance_Type,
      Maintenance.Engineer_Name,
      Maintenance.Cost,
      Maintenance.Status
    FROM Aircraft
    LEFT JOIN Maintenance
      ON Aircraft.Aircraft_ID =
         Maintenance.Aircraft_ID
  `);
  return Response.json(fleet);
}

export async function POST(request) {
  try {
    const data = await request.json();
    db.prepare(`
      INSERT INTO Aircraft
      (
        Aircraft_ID,
        Model,
        Manufacturer,
        Year_of_MFG,
        Capacity,
        Type
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      data.aircraft_id,
      data.model,
      data.manufacturer,
      data.year_of_mfg,
      data.capacity,
      data.type
    );

    return Response.json({ message: "Aircraft added successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    db.prepare(`
      UPDATE Aircraft
      SET
        Model = ?,
        Manufacturer = ?,
        Year_of_MFG = ?,
        Capacity = ?,
        Type = ?
      WHERE Aircraft_ID = ?
    `).run(
      data.model,
      data.manufacturer,
      data.year_of_mfg,
      data.capacity,
      data.type,
      data.aircraft_id
    );

    return Response.json({ message: "Aircraft updated successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const data = await request.json();
    db.prepare(`
      DELETE FROM Aircraft
      WHERE Aircraft_ID = ?
    `).run(data.aircraft_id);

    return Response.json({ message: "Aircraft deleted successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

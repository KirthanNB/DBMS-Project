import db, { queryRaw } from "../../../../lib/db";

export async function GET() {
  const airlines = queryRaw(`
    SELECT
      Airline_ID,
      Name,
      Street,
      City,
      State,
      Country
    FROM Airlines
  `);
  return Response.json(airlines);
}

export async function POST(request) {
  try {
    const data = await request.json();
    db.prepare(`
      INSERT INTO Airlines (Airline_ID, Name, Street, City, State, Country)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      data.airline_id,
      data.name,
      data.street || null,
      data.city || null,
      data.state || null,
      data.country || null
    );
    return Response.json({ message: "Airline added successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

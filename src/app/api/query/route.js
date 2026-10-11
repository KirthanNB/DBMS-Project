import { executeSql } from "../../../../lib/db";

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.sql || !data.sql.trim()) {
      return Response.json({ error: "No SQL query provided" }, { status: 400 });
    }
    const result = executeSql(data.sql);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
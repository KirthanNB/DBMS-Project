import db from "../../../../lib/db";
import fs from "fs";
import path from "path";

export async function GET() {

  db.exec(`
    DROP TABLE IF EXISTS Maintenance;
    DROP TABLE IF EXISTS Seats;
    DROP TABLE IF EXISTS Passenger_PhNo;
    DROP TABLE IF EXISTS Passenger;
    DROP TABLE IF EXISTS Flight_Employee;
    DROP TABLE IF EXISTS Flight;
    DROP TABLE IF EXISTS Employee_Email;
    DROP TABLE IF EXISTS Employee;
    DROP TABLE IF EXISTS Aircraft;
    DROP TABLE IF EXISTS Airlines;
  `);


  const schema = fs.readFileSync(
    path.join(process.cwd(), "scripts/schema.sql"),
    "utf-8"
  );

  const seed = fs.readFileSync(
    path.join(process.cwd(), "scripts/values.sql"),
    "utf-8"
  );


  db.exec(schema);
  db.exec(seed);


  return Response.json({
    message: "Database reset successfully"
  });
}
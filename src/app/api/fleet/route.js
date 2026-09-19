import { queryRaw } from "../../../../lib/db";


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
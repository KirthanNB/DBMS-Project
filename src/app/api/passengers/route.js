import { queryRaw } from "../../../../lib/db";


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
      /365.25
      AS INT
    ) AS Age,


    GROUP_CONCAT(
      Passenger_PhNo.PhNo,
      ', '
    ) AS Phone_Numbers


    FROM Passenger


    LEFT JOIN Passenger_PhNo

    ON Passenger.Pass_ID =
    Passenger_PhNo.Pass_ID


    GROUP BY Passenger.Pass_ID

  `);


  return Response.json(passengers);

}
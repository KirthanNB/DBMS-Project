import {queryRaw} from "../../../../lib/db";


export async function GET(){


const employees=queryRaw(`

SELECT

Employee.Emp_ID,
Employee.F_Name,
Employee.L_Name,
Employee.Role,

Airlines.Name AS Airline,


GROUP_CONCAT(Employee_Email.Email)
AS Emails


FROM Employee


LEFT JOIN Airlines

ON Employee.Airline_ID =
Airlines.Airline_ID


LEFT JOIN Employee_Email

ON Employee.Emp_ID =
Employee_Email.Emp_ID


GROUP BY Employee.Emp_ID;


`);


return Response.json(employees);

}
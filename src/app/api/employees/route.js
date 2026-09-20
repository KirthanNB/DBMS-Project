import db, { queryRaw } from "../../../../lib/db";

// GET - Display employees
export async function GET() {
  const employees = queryRaw(`
    SELECT
      Employee.Emp_ID,
      Employee.F_Name,
      Employee.M_Name,
      Employee.L_Name,
      Employee.Date_of_Joining,
      Employee.Role,
      Employee.Airline_ID,
      Employee.Manager_ID,

      Airlines.Name AS Airline,

      Manager.F_Name AS Manager_F_Name,
      Manager.M_Name AS Manager_M_Name,
      Manager.L_Name AS Manager_L_Name

    FROM Employee

    LEFT JOIN Airlines
      ON Employee.Airline_ID = Airlines.Airline_ID

    LEFT JOIN Employee AS Manager
      ON Employee.Manager_ID = Manager.Emp_ID
  `);

  return Response.json(employees);
}

// POST - Add employee
export async function POST(request) {
  try {
    const data = await request.json();

    db.prepare(
      `
      INSERT INTO Employee
      (
        Emp_ID,
        F_Name,
        M_Name,
        L_Name,
        Date_of_Joining,
        Role,
        Airline_ID,
        Manager_ID
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      data.emp_id,
      data.f_name,
      data.m_name || null,
      data.l_name,
      data.date_of_joining,
      data.role,
      data.airline_id || null,
      data.manager_id || null,
    );

    return Response.json({
      message: "Employee added successfully",
    });
  } catch (error) {
    return Response.json(
      {
        error: error.message,
      },
      {
        status: 400,
      },
    );
  }
}

// PUT - Edit employee
export async function PUT(request) {
  try {
    const data = await request.json();

    db.prepare(
      `
      UPDATE Employee
      SET
        F_Name = ?,
        M_Name = ?,
        L_Name = ?,
        Date_of_Joining = ?,
        Role = ?,
        Airline_ID = ?,
        Manager_ID = ?
      WHERE Emp_ID = ?
    `,
    ).run(
      data.f_name,
      data.m_name || null,
      data.l_name,
      data.date_of_joining,
      data.role,
      data.airline_id || null,
      data.manager_id || null,
      data.emp_id,
    );

    return Response.json({
      message: "Employee updated successfully",
    });
  } catch (error) {
    return Response.json(
      {
        error: error.message,
      },
      {
        status: 400,
      },
    );
  }
}

// DELETE - Delete employee
export async function DELETE(request) {
  try {
    const data = await request.json();

    db.prepare(
      `
      DELETE FROM Employee
      WHERE Emp_ID = ?
    `,
    ).run(data.emp_id);

    return Response.json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    return Response.json(
      {
        error: error.message,
      },
      {
        status: 400,
      },
    );
  }
}

PRAGMA foreign_keys = ON;

-- 1. Airlines Table
CREATE TABLE IF NOT EXISTS Airlines (
    Airline_ID VARCHAR(10) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Street VARCHAR(100),
    City VARCHAR(50),
    State VARCHAR(50),
    Country VARCHAR(50)
);

-- 2. Employee Table (Self-referencing Foreign Key for Manager)
CREATE TABLE IF NOT EXISTS Employee (
    Emp_ID VARCHAR(10) PRIMARY KEY,
    F_Name VARCHAR(50) NOT NULL,
    M_Name VARCHAR(50),
    L_Name VARCHAR(50) NOT NULL,
    Date_of_Joining DATE NOT NULL,
    Role VARCHAR(50) NOT NULL,
    Airline_ID VARCHAR(10),
    Manager_ID VARCHAR(10),
    FOREIGN KEY (Airline_ID) REFERENCES Airlines(Airline_ID) ON DELETE SET NULL,
    FOREIGN KEY (Manager_ID) REFERENCES Employee(Emp_ID) ON DELETE SET NULL
);

-- 3. Employee_Email Table (Multi-valued attribute handling)
CREATE TABLE IF NOT EXISTS Employee_Email (
    Emp_ID VARCHAR(10),
    Email VARCHAR(100),
    PRIMARY KEY (Emp_ID, Email),
    FOREIGN KEY (Emp_ID) REFERENCES Employee(Emp_ID) ON DELETE CASCADE
);

-- 4. Aircraft Table
CREATE TABLE IF NOT EXISTS Aircraft (
    Aircraft_ID VARCHAR(10) PRIMARY KEY,
    Model VARCHAR(50) NOT NULL,
    Manufacturer VARCHAR(50) NOT NULL,
    Year_of_MFG INTEGER NOT NULL,
    Capacity INTEGER NOT NULL,
    Type VARCHAR(50) NOT NULL
);

-- 5. Flight Table
CREATE TABLE IF NOT EXISTS Flight (
    Flight_ID VARCHAR(15) PRIMARY KEY,
    Status VARCHAR(20) DEFAULT 'Scheduled' CHECK(Status IN ('Scheduled', 'On-Time', 'Delayed', 'Departed', 'Arrived', 'Cancelled')),
    Dept_Time DATETIME NOT NULL,
    Arrival_Time DATETIME NOT NULL,
    Airline_ID VARCHAR(10) NOT NULL,
    Aircraft_ID VARCHAR(10) NOT NULL,
    FOREIGN KEY (Airline_ID) REFERENCES Airlines(Airline_ID) ON DELETE CASCADE,
    FOREIGN KEY (Aircraft_ID) REFERENCES Aircraft(Aircraft_ID) ON DELETE CASCADE
);

-- 6. Flight_Employee Table (Junction table for Flight Requires Employee M:N)
CREATE TABLE IF NOT EXISTS Flight_Employee (
    Flight_ID VARCHAR(15),
    Emp_ID VARCHAR(10),
    PRIMARY KEY (Flight_ID, Emp_ID),
    FOREIGN KEY (Flight_ID) REFERENCES Flight(Flight_ID) ON DELETE CASCADE,
    FOREIGN KEY (Emp_ID) REFERENCES Employee(Emp_ID) ON DELETE CASCADE
);

-- 7. Passenger Table
CREATE TABLE IF NOT EXISTS Passenger (
    Pass_ID VARCHAR(15) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Nationality VARCHAR(50),
    Gender VARCHAR(15),
    DOB DATE NOT NULL
);

-- 8. Passenger_PhNo Table (Multi-valued attribute handling)
CREATE TABLE IF NOT EXISTS Passenger_PhNo (
    Pass_ID VARCHAR(15),
    PhNo VARCHAR(20),
    PRIMARY KEY (Pass_ID, PhNo),
    FOREIGN KEY (Pass_ID) REFERENCES Passenger(Pass_ID) ON DELETE CASCADE
);

-- 9. Seats Table
CREATE TABLE IF NOT EXISTS Seats (
    Seat_No VARCHAR(10),
    Aircraft_ID VARCHAR(10),
    Seat_Type VARCHAR(20) NOT NULL CHECK(Seat_Type IN ('First', 'Business', 'Premium Economy', 'Economy')),
    Pass_ID VARCHAR(15) DEFAULT NULL,
    PRIMARY KEY (Seat_No, Aircraft_ID),
    FOREIGN KEY (Aircraft_ID) REFERENCES Aircraft(Aircraft_ID) ON DELETE CASCADE,
    FOREIGN KEY (Pass_ID) REFERENCES Passenger(Pass_ID) ON DELETE SET NULL
);

-- 10. Maintenance Table
CREATE TABLE IF NOT EXISTS Maintenance (
    Aircraft_ID VARCHAR(10),
    Maintenance_Type VARCHAR(50),
    Engineer_Name VARCHAR(100) NOT NULL,
    Cost DECIMAL(10, 2) DEFAULT 0.00,
    Status VARCHAR(20) DEFAULT 'Pending' CHECK(Status IN ('Pending', 'In-Progress', 'Completed')),
    PRIMARY KEY (Aircraft_ID, Maintenance_Type),
    FOREIGN KEY (Aircraft_ID) REFERENCES Aircraft(Aircraft_ID) ON DELETE CASCADE
);
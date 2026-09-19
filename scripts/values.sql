-- Sample Data Seed Script for Airline DBMS

-- 1. Insert Airlines
INSERT INTO Airlines (Airline_ID, Name, Street, City, State, Country) VALUES
('AL-101', 'SkyWings Airways', '100 Aviation Blvd', 'Atlanta', 'Georgia', 'USA'),
('AL-102', 'AeroGlobal Express', '45 Skyway Drive', 'London', 'Greater London', 'UK'),
('AL-103', 'Pacific Star Airlines', '88 Coast Hwy', 'Tokyo', 'Kanto', 'Japan');

-- 2. Insert Aircraft
INSERT INTO Aircraft (Aircraft_ID, Model, Manufacturer, Year_of_MFG, Capacity, Type) VALUES
('AC-737', 'Boeing 737-800', 'Boeing', 2018, 160, 'Commercial Jet'),
('AC-A320', 'Airbus A320neo', 'Airbus', 2021, 180, 'Narrow-body Jet'),
('AC-777', 'Boeing 777-300ER', 'Boeing', 2019, 300, 'Wide-body Jet');

-- 3. Insert Employees
INSERT INTO Employee (Emp_ID, F_Name, M_Name, L_Name, Date_of_Joining, Role, Airline_ID, Manager_ID) VALUES
('E-001', 'Robert', 'James', 'Miller', '2015-03-15', 'Flight Operations Manager', 'AL-101', NULL),
('E-002', 'Sarah', 'Jane', 'Connor', '2018-06-01', 'Senior Captain Pilot', 'AL-101', 'E-001'),
('E-003', 'David', 'K.', 'Smith', '2020-01-10', 'Co-Pilot', 'AL-101', 'E-002'),
('E-004', 'Elena', 'R.', 'Rostova', '2019-09-20', 'Chief Flight Attendant', 'AL-102', 'E-001'),
('E-005', 'Michael', 'B.', 'Jordan', '2021-11-05', 'Avionics Engineer', 'AL-103', NULL);

-- 4. Insert Employee Emails
INSERT INTO Employee_Email (Emp_ID, Email) VALUES
('E-001', 'r.miller@skywings.com'),
('E-001', 'robert.personal@gmail.com'),
('E-002', 's.connor@skywings.com'),
('E-003', 'd.smith@skywings.com'),
('E-004', 'elena.rostova@aeroglobal.co.uk'),
('E-005', 'm.jordan@pacificstar.jp');

-- 5. Insert Flights
INSERT INTO Flight (Flight_ID, Status, Dept_Time, Arrival_Time, Airline_ID, Aircraft_ID) VALUES
('FL-1001', 'Scheduled', '2026-09-20 08:30:00', '2026-09-20 11:45:00', 'AL-101', 'AC-737'),
('FL-2002', 'On-Time', '2026-09-20 14:00:00', '2026-09-20 22:15:00', 'AL-102', 'AC-A320'),
('FL-3003', 'Delayed', '2026-09-21 06:15:00', '2026-09-21 19:30:00', 'AL-103', 'AC-777');

-- 6. Insert Flight Employees (Crew assignments)
INSERT INTO Flight_Employee (Flight_ID, Emp_ID) VALUES
('FL-1001', 'E-002'),
('FL-1001', 'E-003'),
('FL-2002', 'E-004');

-- 7. Insert Passengers
INSERT INTO Passenger (Pass_ID, Name, Nationality, Gender, DOB) VALUES
('P-9001', 'Alice Vance', 'American', 'Female', '1992-04-12'),
('P-9002', 'Marcus Brody', 'British', 'Male', '1985-08-25'),
('P-9003', 'Kenji Sato', 'Japanese', 'Male', '1998-12-03');

-- 8. Insert Passenger Phone Numbers
INSERT INTO Passenger_PhNo (Pass_ID, PhNo) VALUES
('P-9001', '+1-555-0192'),
('P-9001', '+1-555-0199'),
('P-9002', '+44-20-7946-0912'),
('P-9003', '+81-3-5555-0143');

-- 9. Insert Seats (Sample seats for Aircrafts)
INSERT INTO Seats (Seat_No, Aircraft_ID, Seat_Type, Pass_ID) VALUES
('1A', 'AC-737', 'First', 'P-9001'),
('1B', 'AC-737', 'First', NULL),
('12A', 'AC-737', 'Business', 'P-9002'),
('12B', 'AC-737', 'Business', NULL),
('24A', 'AC-737', 'Economy', NULL),
('24B', 'AC-737', 'Economy', NULL),
('1A', 'AC-A320', 'First', 'P-9003'),
('1B', 'AC-A320', 'First', NULL),
('15C', 'AC-A320', 'Economy', NULL),
('1A', 'AC-777', 'First', NULL),
('10A', 'AC-777', 'Business', NULL);

-- 10. Insert Maintenance Records
INSERT INTO Maintenance (Aircraft_ID, Maintenance_Type, Engineer_Name, Cost, Status) VALUES
('AC-737', 'Engine Inspection & Service', 'Michael B. Jordan', 14500.00, 'Completed'),
('AC-A320', 'Avionics System Calibration', 'Alex Mercer', 8200.50, 'In-Progress'),
('AC-777', 'Hydraulic System Overhaul', 'Michael B. Jordan', 23000.00, 'Pending');

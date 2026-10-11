"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Terminal, ArrowLeft, Play, Trash2, Database, Sparkles, Copy, Check } from "lucide-react";

export default function SqlConsolePage() {
  const [history, setHistory] = useState([
    {
      query: "SELECT Flight.Flight_ID, Flight.Status, Airlines.Name AS Airline, Aircraft.Model, Flight.Dept_Time FROM Flight JOIN Airlines ON Flight.Airline_ID = Airlines.Airline_ID JOIN Aircraft ON Flight.Aircraft_ID = Aircraft.Aircraft_ID;",
      type: "select",
      columns: ["Flight_ID", "Status", "Airline", "Model", "Dept_Time"],
      rows: [
        { Flight_ID: "FL-1001", Status: "Scheduled", Airline: "SkyWings Airways", Model: "Boeing 737-800", Dept_Time: "2026-09-20 08:30:00" },
        { Flight_ID: "FL-2002", Status: "On-Time", Airline: "AeroGlobal Express", Model: "Airbus A320neo", Dept_Time: "2026-09-20 14:00:00" },
        { Flight_ID: "FL-3003", Status: "Delayed", Airline: "Pacific Star Airlines", Model: "Boeing 777-300ER", Dept_Time: "2026-09-21 06:15:00" }
      ],
      duration: "0.42",
      count: 3
    }
  ]);
  const [inputSql, setInputSql] = useState("");
  const [commandIndex, setCommandIndex] = useState(-1);
  const [pastCommands, setPastCommands] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    document.title = "Airlines Management System — SQL Terminal";
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const presetQueries = [
    {
      title: "Active Flights & Airlines (INNER JOIN)",
      sql: "SELECT Flight.Flight_ID, Flight.Status, Airlines.Name AS Airline, Aircraft.Model, Flight.Dept_Time, Flight.Arrival_Time FROM Flight JOIN Airlines ON Flight.Airline_ID = Airlines.Airline_ID JOIN Aircraft ON Flight.Aircraft_ID = Aircraft.Aircraft_ID;"
    },
    {
      title: "Flight Crew Assignment (M:N Junction)",
      sql: "SELECT Flight_Employee.Flight_ID, Employee.Emp_ID, Employee.F_Name || ' ' || Employee.L_Name AS Crew_Name, Employee.Role, Flight.Status FROM Flight_Employee JOIN Employee ON Flight_Employee.Emp_ID = Employee.Emp_ID JOIN Flight ON Flight_Employee.Flight_ID = Flight.Flight_ID;"
    },
    {
      title: "Maintenance Cost Summary (GROUP BY / AGGREGATE)",
      sql: "SELECT Status, COUNT(*) AS Total_Aircraft, SUM(Cost) AS Total_Cost, ROUND(AVG(Cost), 2) AS Avg_Cost FROM Maintenance GROUP BY Status;"
    },
    {
      title: "Passenger Booked Seats & Cabins (MULTI JOIN)",
      sql: "SELECT Passenger.Pass_ID, Passenger.Name, Seats.Seat_No, Seats.Seat_Type, Aircraft.Model, Aircraft.Manufacturer FROM Passenger JOIN Seats ON Passenger.Pass_ID = Seats.Pass_ID JOIN Aircraft ON Seats.Aircraft_ID = Aircraft.Aircraft_ID;"
    },
    {
      title: "Manager Hierarchy (SELF JOIN)",
      sql: "SELECT E.Emp_ID, E.F_Name || ' ' || E.L_Name AS Staff_Member, E.Role, COALESCE(M.F_Name || ' ' || M.L_Name, 'TOP LEVEL') AS Reports_To FROM Employee E LEFT JOIN Employee M ON E.Manager_ID = M.Emp_ID;"
    },
    {
      title: "Passenger Contact Numbers (GROUP_CONCAT)",
      sql: "SELECT Passenger.Pass_ID, Passenger.Name, Passenger.Nationality, GROUP_CONCAT(Passenger_PhNo.PhNo, ', ') AS Phone_Numbers FROM Passenger LEFT JOIN Passenger_PhNo ON Passenger.Pass_ID = Passenger_PhNo.Pass_ID GROUP BY Passenger.Pass_ID;"
    },
    {
      title: "Database Table Catalog",
      sql: "SELECT name, type FROM sqlite_master WHERE type IN ('table', 'view') AND name NOT LIKE 'sqlite_%';"
    }
  ];

  async function executeCommand(cmdToRun) {
    const raw = (cmdToRun !== undefined ? cmdToRun : inputSql).trim();
    if (!raw) return;

    setPastCommands(prev => [raw, ...prev]);
    setCommandIndex(-1);

    const lower = raw.toLowerCase();
    if (lower === "clear" || lower === "cls") {
      setHistory([]);
      setInputSql("");
      return;
    }

    if (lower === "help") {
      setHistory(prev => [
        ...prev,
        {
          query: raw,
          type: "system",
          text: `Airlines Management System - SQL Command Reference:
  .tables              List all database relations
  .schema              Show complete DDL definition of all tables
  .schema <table_name> Show CREATE TABLE statement for a specific table
  clear | cls          Clear terminal display buffer
  help                 Display this manual
  SELECT ...;          Execute standard SQL queries against airline.db`
        }
      ]);
      setInputSql("");
      return;
    }

    if (lower === ".tables") {
      executeCommand("SELECT name AS 'Table_Name' FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
      return;
    }

    if (lower.startsWith(".schema")) {
      const parts = raw.split(/\s+/);
      if (parts.length > 1) {
        executeCommand(`SELECT sql FROM sqlite_master WHERE type='table' AND name='${parts[1].trim()}';`);
      } else {
        executeCommand("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");
      }
      return;
    }

    setIsExecuting(true);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: raw })
      });
      const data = await res.json();

      if (!res.ok) {
        setHistory(prev => [
          ...prev,
          {
            query: raw,
            type: "error",
            error: data.error || "Query execution failed."
          }
        ]);
      } else if (data.type === "mutation") {
        setHistory(prev => [
          ...prev,
          {
            query: raw,
            type: "mutation",
            changes: data.changes,
            lastInsertRowid: data.lastInsertRowid,
            duration: data.duration
          }
        ]);
      } else {
        const rows = data.rows || [];
        const columns = data.columns || (rows.length > 0 ? Object.keys(rows[0]) : []);
        setHistory(prev => [
          ...prev,
          {
            query: raw,
            type: "select",
            columns,
            rows,
            count: data.count !== undefined ? data.count : rows.length,
            duration: data.duration || "0.00"
          }
        ]);
      }
    } catch (err) {
      setHistory(prev => [
        ...prev,
        {
          query: raw,
          type: "error",
          error: err.message
        }
      ]);
    } finally {
      setIsExecuting(false);
      setInputSql("");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeCommand();
    } else if (e.key === "ArrowUp") {
      if (pastCommands.length > 0) {
        const nextIdx = Math.min(commandIndex + 1, pastCommands.length - 1);
        setCommandIndex(nextIdx);
        setInputSql(pastCommands[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      if (commandIndex > 0) {
        const nextIdx = commandIndex - 1;
        setCommandIndex(nextIdx);
        setInputSql(pastCommands[nextIdx]);
      } else if (commandIndex === 0) {
        setCommandIndex(-1);
        setInputSql("");
      }
    }
  }

  function copyQuery(queryText, idx) {
    navigator.clipboard.writeText(queryText);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-mono selection:bg-emerald-500 selection:text-black">
      <header className="flex items-center justify-between px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Airport Portal</span>
          </Link>
          <div className="h-4 w-px bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white tracking-wide">
                Airlines Management System
              </h1>
              <p className="text-[11px] text-slate-400 font-sans">
                Interactive SQL Terminal & Relational Engine
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            airline.db (Connected)
          </span>
          <button
            onClick={() => setHistory([])}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition text-[11px]"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear Buffer</span>
          </button>
        </div>
      </header>

      <div className="border-b border-slate-800/80 bg-slate-900/50 p-4 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>DBMS Relational Query Presets (Click to Execute)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {presetQueries.map((pq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputSql(pq.sql);
                  executeCommand(pq.sql);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-900/40 border border-slate-700/70 hover:border-blue-500/50 text-slate-300 hover:text-blue-300 text-xs transition text-left flex items-center gap-1.5 shadow-sm"
              >
                <Database className="w-3 h-3 text-slate-400" />
                <span>{pq.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-4">
        <div className="rounded-2xl bg-black/90 border border-slate-800 shadow-2xl overflow-hidden flex flex-col flex-1 min-h-[500px]">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="ml-2 font-mono text-[11px] text-slate-400">
                airport-dbms@server:~/sqlite3$
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              PRAGMA foreign_keys = ON
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto font-mono text-xs sm:text-sm">
            <div className="text-slate-400 leading-relaxed border-b border-slate-800/80 pb-4">
              <div className="text-emerald-400 font-bold mb-1">
                Airlines Management System — Terminal Console v1.0
              </div>
              <div className="text-slate-400 text-xs">
                Connected to SQLite relational database: <span className="text-amber-300 font-semibold">airline.db</span>.
              </div>
              <div className="text-slate-500 text-[11px] mt-1">
                Type queries ending with semicolon (;) or helper commands: <span className="text-blue-300">.tables</span>, <span className="text-blue-300">.schema</span>, <span className="text-blue-300">help</span>, <span className="text-blue-300">clear</span>.
              </div>
            </div>

            {history.map((item, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-start justify-between gap-4 text-emerald-400 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-900/30">
                  <div className="flex items-start gap-2 overflow-x-auto">
                    <span className="text-slate-500 select-none">airport-dbms:sql&gt;</span>
                    <span className="text-slate-100 font-semibold">{item.query}</span>
                  </div>
                  <button
                    onClick={() => copyQuery(item.query, idx)}
                    className="text-slate-500 hover:text-slate-300 p-1 rounded"
                    title="Copy query"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {item.type === "system" && (
                  <pre className="p-3 rounded-lg bg-slate-900 text-slate-300 whitespace-pre-wrap text-xs border border-slate-800">
                    {item.text}
                  </pre>
                )}

                {item.type === "error" && (
                  <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs">
                    <div className="font-bold flex items-center gap-1.5 mb-1 text-rose-400">
                      <span>SQL Execution Error:</span>
                    </div>
                    <div>{item.error}</div>
                  </div>
                )}

                {item.type === "mutation" && (
                  <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-800/50 text-blue-300 text-xs flex items-center justify-between">
                    <span>
                      Query OK, {item.changes} row(s) affected (ID: {item.lastInsertRowid})
                    </span>
                    <span className="text-slate-400 text-[11px]">{item.duration} ms</span>
                  </div>
                )}

                {item.type === "select" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span>
                        {item.count} row{item.count !== 1 ? "s" : ""} in set
                      </span>
                      <span>Execution time: {item.duration} ms</span>
                    </div>

                    {item.rows.length === 0 ? (
                      <div className="p-3 rounded-lg bg-slate-900/50 text-slate-500 text-xs italic border border-slate-800">
                        Empty set (0 records matching query)
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-300">
                              {item.columns.map(col => (
                                <th key={col} className="p-2.5 font-bold tracking-wide border-r border-slate-800 last:border-r-0">
                                  {col}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {item.rows.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className="border-b border-slate-850 hover:bg-slate-900/40 transition-colors last:border-b-0"
                              >
                                {item.columns.map(col => (
                                  <td
                                    key={col}
                                    className="p-2.5 border-r border-slate-850 last:border-r-0 text-slate-200"
                                  >
                                    {row[col] === null || row[col] === undefined ? (
                                      <span className="text-slate-600 italic">NULL</span>
                                    ) : (
                                      String(row[col])
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div ref={bottomRef}></div>
          </div>

          <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-800">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  rows={2}
                  value={inputSql}
                  onChange={e => setInputSql(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter SQL statement (e.g. SELECT * FROM Flight;) or 'help'..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-slate-700 text-emerald-400 font-mono text-xs sm:text-sm focus:outline-none focus:border-emerald-500 placeholder-slate-600 resize-none"
                />
                <div className="absolute right-3 bottom-3 text-[10px] text-slate-500 pointer-events-none">
                  Press Enter to Run | Shift+Enter for newline
                </div>
              </div>

              <button
                disabled={isExecuting || !inputSql.trim()}
                onClick={() => executeCommand()}
                className="h-[62px] px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/25 transition"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Execute</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

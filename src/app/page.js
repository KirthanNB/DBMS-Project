"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import DashboardView from "@/components/DashboardView";
import FlightsView from "@/components/FlightsView";
import PassengerView from "@/components/PassengerView";
import FleetView from "@/components/FleetView";
import EmployeeView from "@/components/EmployeeView";
import MaintenanceView from "@/components/MaintenanceView";
import SeatBookingView from "@/components/SeatBookingView";
import SqlConsoleView from "@/components/SqlConsoleView";


export default function Home(){

  const [tab,setTab]=useState("dashboard");


  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <Navbar
        tab={tab}
        setTab={setTab}
      />


      <section className="p-6">

        {
          tab==="dashboard" &&
          <DashboardView/>
        }


        {
          tab==="flights" &&
          <FlightsView/>
        }


        {
          tab==="passengers" &&
          <PassengerView/>
        }


        {
          tab==="fleet" &&
          <FleetView/>
        }


        {
          tab==="employees" &&
          <EmployeeView/>
        }


        {
          tab==="maintenance" &&
          <MaintenanceView/>
        }


        {
          tab==="seats" &&
          <SeatBookingView/>
        }


        {
          tab==="sql" &&
          <SqlConsoleView/>
        }


      </section>

    </main>
  );
}
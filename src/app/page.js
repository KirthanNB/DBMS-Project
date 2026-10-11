"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import DashboardView from "@/components/DashboardView";
import FlightsView from "@/components/FlightsView";
import PassengerView from "@/components/PassengerView";
import FleetView from "@/components/FleetView";
import EmployeeView from "@/components/EmployeeView";
import MaintenanceView from "@/components/MaintenanceView";
import SeatBookingView from "@/components/SeatBookingView";
import PassengerPortalView from "@/components/PassengerPortalView";
import EmployeePortalView from "@/components/EmployeePortalView";
import LoginModal from "@/components/LoginModal";

export default function Home() {
  const [currentRole, setCurrentRole] = useState("admin");
  const [currentUser, setCurrentUser] = useState({
    role: "admin",
    id: "ADMIN-01",
    name: "Airport Operations Director",
    title: "Chief Airfield Administrator"
  });
  const [tab, setTab] = useState("dashboard");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem("airport_role");
      const savedUser = localStorage.getItem("airport_user");
      if (savedRole && savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentRole(savedRole);
        setCurrentUser(parsed);
        if (savedRole === "passenger") setTab("passenger_portal");
        else if (savedRole === "employee") setTab("employee_portal");
        else setTab("dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  function handleLogin(userObj) {
    setCurrentRole(userObj.role);
    setCurrentUser(userObj);
    localStorage.setItem("airport_role", userObj.role);
    localStorage.setItem("airport_user", JSON.stringify(userObj));

    if (userObj.role === "passenger") {
      setTab("passenger_portal");
    } else if (userObj.role === "employee") {
      setTab("employee_portal");
    } else {
      setTab("dashboard");
    }
  }

  const roleBackgrounds = {
    admin: "https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop",
    passenger: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=2070&auto=format&fit=crop",
    employee: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?q=80&w=2070&auto=format&fit=crop"
  };

  const bgUrl = roleBackgrounds[currentRole] || roleBackgrounds.admin;

  return (
    <div className="min-h-screen bg-slate-950 text-white relative selection:bg-blue-600 selection:text-white">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 filter brightness-35 scale-102 pointer-events-none"
        style={{ backgroundImage: `url('${bgUrl}')` }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/95 pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          tab={tab}
          setTab={setTab}
          currentRole={currentRole}
          currentUser={currentUser}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
          {tab === "dashboard" && <DashboardView onNavigate={setTab} />}
          {tab === "flights" && <FlightsView />}
          {tab === "passengers" && <PassengerView />}
          {tab === "fleet" && <FleetView />}
          {tab === "employees" && <EmployeeView />}
          {tab === "maintenance" && <MaintenanceView />}
          {tab === "seats" && (
            <SeatBookingView
              initialPassengerId={currentRole === "passenger" ? currentUser.id : undefined}
            />
          )}

          {tab === "passenger_portal" && (
            <PassengerPortalView
              passengerUser={currentUser}
              onSwitchToSeatBooking={() => setTab("seats")}
            />
          )}

          {tab === "employee_portal" && (
            <EmployeePortalView employeeUser={currentUser} />
          )}
        </main>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        currentRole={currentRole}
        currentUser={currentUser}
      />
    </div>
  );
}
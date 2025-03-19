import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/layout/Navbar";
import farm from "../assets/farm.jpg";
import LandingFooter from "../Components/layout/LandingFooter";

const LandingLayout = () => {
  return (
    <main className="flex flex-col min-h-screen relative">
      {/* Background Image and Overlay */}
      <div
        className="fixed inset-0 -z-10 before:absolute before:inset-0 before:bg-black before:opacity-50"
        style={{
          backgroundColor: "#2b4700",
          backgroundImage: `url(${farm})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Content */}
      <div className="flex-grow relative z-10 flex flex-col justify-between gap-6">
        <Navbar auth={false} />
        <Outlet />
      </div>

      <LandingFooter />
    </main>
  );
};

export default LandingLayout;

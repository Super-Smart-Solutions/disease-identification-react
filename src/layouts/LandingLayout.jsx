import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/layout/navbar/Navbar";
import Footer from "../Components/layout/Footer";

const LandingLayout = () => {
  return (
    <main
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
      className="flex flex-col min-h-screen relative"
    >
      {/* Content */}
      <div className="flex-grow relative  z-10 flex flex-col justify-between overflow-auto lg:overflow-hidden">
        <Navbar />
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default LandingLayout;

import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/layout/Navbar";
import Footer from "../Components/layout/Footer";
import SoilCalculator from "../Components/pages/soil-calculator/SoilCalculator";

const LandingLayout = ({ isAuthenticated }) => {
  return (
    <main
      style={{
        backgroundImage: "url('/background.jpeg')", // Assuming the image is in the public folder
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Optional: makes the background fixed while scrolling
        backgroundRepeat: "no-repeat",
      }}
      className="flex flex-col min-h-screen relative"
    >
      {/* Content */}
      <div className="flex-grow relative z-10 flex flex-col justify-between">
        <Navbar auth={isAuthenticated} />
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default LandingLayout;

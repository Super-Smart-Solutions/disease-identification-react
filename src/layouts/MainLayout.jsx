import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/layout/Navbar";
import Footer from "../Components/layout/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-4 container mx-auto mt-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

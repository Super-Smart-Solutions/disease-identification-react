import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LandingLayout from "../layouts/LandingLayout"; // Import LandingLayout
import routes from "./routes.json";
import Landing from "../pages/Landing";
import ButtonShowcase from "../pages/ButtonShowcase";
import InputsShowcase from "../pages/InputsShowcase";
import DataBase from "../pages/DataBase";
import Models from "../pages/Models";

// Map component names to actual components
const componentMap = {
  Landing,
  ButtonShowcase,
  InputsShowcase,
  DataBase,
  Models,
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing page uses LandingLayout */}
      <Route path="/" element={<LandingLayout />}>
        <Route index element={<Landing />} />
      </Route>

      {/* All other routes use MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={React.createElement(componentMap[route.element])}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default AppRoutes;

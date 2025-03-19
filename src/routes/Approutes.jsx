import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LandingLayout from "../layouts/LandingLayout";
import routes from "./routes.json";
import authRoutes from "./authRoutes.json";
import Landing from "../pages/Landing";
import ButtonShowcase from "../pages/ButtonShowcase";
import InputsShowcase from "../pages/InputsShowcase";
import DataBase from "../pages/DataBase";
import Models from "../pages/Models";
import Register from "../Components/pages/auth/Register";
import Login from "../Components/pages/auth/Login";
import { fetchCurrentUser } from "../api/userAPI";

const componentMap = {
  Landing,
  ButtonShowcase,
  InputsShowcase,
  DataBase,
  Models,
  Register,
  Login,
};

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on component mount
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await fetchCurrentUser(); // Call the endpoint
        setIsAuthenticated(true); // Set authenticated to true if request succeeds
      } catch (error) {
        setIsAuthenticated(false); // Set authenticated to false if request fails
      } finally {
        setIsLoading(false); // Set loading to false after request completes
      }
    };

    checkAuthentication();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingLayout />}>
        {authRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={React.createElement(componentMap[route.element])}
          />
        ))}
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

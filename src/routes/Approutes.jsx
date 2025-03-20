import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
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

const ProtectedRoute = ({ children, isAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
};

const AppRoutes = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
    

      try {
        await fetchCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [location.pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Unauthenticated routes use LandingLayout */}
      <Route path="/" element={<LandingLayout />}>
        {authRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={React.createElement(componentMap[route.element])}
          />
        ))}
      </Route>

      {/* Authenticated routes use MainLayout */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <MainLayout />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      >
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              route.protected ? (
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  {React.createElement(componentMap[route.element])}
                </ProtectedRoute>
              ) : (
                React.createElement(componentMap[route.element])
              )
            }
          />
        ))}
      </Route>
    </Routes>
  );
};

export default AppRoutes;

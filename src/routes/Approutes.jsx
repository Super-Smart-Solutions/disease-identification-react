import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LandingLayout from "../layouts/LandingLayout";
import routes from "./routes.json";
import authRoutes from "./authRoutes.json";
import Landing from "../pages/Landing";
import DataBase from "../pages/DataBase";
import Models from "../pages/Models";
import Register from "../Components/pages/auth/Register";
import Login from "../Components/pages/auth/Login";
import Cookies from "js-cookie"; // Import the Cookies library
import Dashboard from "../pages/Dashboard";

const componentMap = {
  Landing,
  DataBase,
  Models,
  Register,
  Login,
  Dashboard,
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

const ForbiddenRoute = ({ children, isAuthenticated }) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/models");
    }
  }, [isAuthenticated, navigate]);

  return !isAuthenticated ? children : null;
};

const AppRoutes = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      const token = Cookies.get("token");
      if (token) {
        setIsAuthenticated(true); // User is authenticated
      } else {
        setIsAuthenticated(false); // User is not authenticated
      }
      setIsLoading(false);
    };

    checkAuthentication();
    const params = new URLSearchParams(location.search);
    const inviteId = params.get("invite_id");

    if (inviteId) {
      localStorage.setItem("invite_id", inviteId);
    }
  }, [location.pathname]);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Unauthenticated routes use LandingLayout */}
      <Route
        path="/"
        element={<LandingLayout isAuthenticated={isAuthenticated} />}
      >
        {authRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              !route.protected ? (
                <ForbiddenRoute isAuthenticated={isAuthenticated}>
                  {React.createElement(componentMap[route.element])}
                </ForbiddenRoute>
              ) : (
                React.createElement(componentMap[route.element])
              )
            }
          />
        ))}
      </Route>

      {/* Authenticated routes use MainLayout */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <MainLayout isAuthenticated={isAuthenticated} />
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

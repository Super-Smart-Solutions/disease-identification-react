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
import DashboardLayout from "../layouts/DashboardLayout";
import routes from "./routes.json";
import authRoutes from "./authRoutes.json";
import adminRoutes from "./adminRoutes.json";
import Landing from "../pages/Landing";
import DataBase from "../pages/DataBase";
import Models from "../pages/Models";
import Register from "../Components/pages/auth/Register";
import Login from "../Components/pages/auth/Login";
import Cookies from "js-cookie";
import Dashboard from "../pages/Dashboard";
import { useAuthActions } from "../Components/helpers/authHelpers";
import AdminPlants from "../Components/pages/admin/plants/AdminPlants";
import AdminDiseases from "../Components/pages/admin/diseases/AdminDiseases";
import LogsSection from "../Components/pages/dashboard/LogsSection";
import AdminFarms from "../Components/pages/admin/farms/AdminFarms";
import AdminUsers from "../Components/pages/admin/users/AdminUsers";
import AdminOrganizations from "../Components/pages/admin/organizations/AdminOrganizations";
import AdminImages from "../Components/pages/admin/images/AdminImages";
import Profile from "../pages/Profile";
import { useUserData } from "../hooks/useUserData";

const componentMap = {
  Landing,
  DataBase,
  Models,
  Register,
  Login,
  Dashboard,
  Profile,
  AdminDiseases,
  AdminPlants,
  LogsSection,
  AdminFarms,
  AdminOrganizations,
  AdminImages,
  AdminUsers,
};

const ProtectedRoute = ({ children, isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    localStorage.setItem("redirectPath", location.pathname);
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return children;
};

const ForbiddenRoute = ({ children, isAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath =
        localStorage.getItem("redirectPath") ||
        (location.state && location.state.from && location.state.from.pathname);

      if (redirectPath) {
        localStorage.removeItem("redirectPath");
        navigate(redirectPath);
      } else {
        navigate("/models");
      }
    }
  }, [isAuthenticated, navigate, location.state]);

  return !isAuthenticated ? children : null;
};

const AdminRoute = ({ children, isAuthenticated, isAdmin }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    localStorage.setItem("redirectPath", location.pathname);
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  } else if (!isAdmin) {
    return <Navigate to="/models" replace state={{ from: location }} />;
  }

  return children;
};

const AppRoutes = () => {
  const location = useLocation();
  const { user } = useUserData();
  const { logout } = useAuthActions();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      logout();
    }
  }, [location.pathname]);

  const isAuthenticated = !!user;
  const isAdmin = user?.roles?.some((role) => role.name === "superuser");

  return (
    <Routes>
      {/* Unauthenticated routes */}
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

      {/* Authenticated routes */}
      <Route
        path="/"
        element={<MainLayout isAuthenticated={isAuthenticated} />}
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

      {/* Admin routes */}
      <Route path="/admin" element={<DashboardLayout />}>
        {adminRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <AdminRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
                {React.createElement(componentMap[route.element])}
              </AdminRoute>
            }
          />
        ))}
      </Route>
    </Routes>
  );
};

export default AppRoutes;

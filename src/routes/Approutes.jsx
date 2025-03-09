import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ButtonShowcase from "../pages/ButtonShowcase";
import InputsShowcase from "../pages/InputsShowcase";
import Home from "../pages/Home";
import Landing from "../pages/Landing";
import DataBase from "../pages/DataBase";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Landing />} />
        <Route path="buttons" element={<ButtonShowcase />} />
        <Route path="inputs" element={<InputsShowcase />} />
        <Route path="database" element={<DataBase />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

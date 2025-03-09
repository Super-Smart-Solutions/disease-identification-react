import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/layout/Navbar";
import Footer from "../Components/layout/Footer";
import Breadcrumbs from "../Components/layout/BreadCrumbs";
import routes from "../routes/routes";
import { useTranslation } from "react-i18next";

const MainLayout = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Generate breadcrumb items
  const breadcrumbItems = [
    {
      label: t("home_key"), // Translated "Home" label
      href: "/",
      isCurrentPage: false,
    },
    ...pathSegments.map((segment, index) => {
      const route = routes.find((r) => r.path === segment);
      return {
        label: t(`${route?.label}_key`) || segment, // Translated label
        href: `/${pathSegments.slice(0, index + 1).join("/")}`,
        isCurrentPage: index === pathSegments.length - 1,
      };
    }),
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-4 container mx-auto mt-4 space-y-4">
        {/* Render breadcrumbs if not on the home page */}
        {location.pathname !== "/" && <Breadcrumbs items={breadcrumbItems} />}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

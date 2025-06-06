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

  const breadcrumbItems = [
    {
      label: t("home_key"),
      href: "/",
      isCurrentPage: false,
    },
    ...pathSegments.map((segment, index) => {
      const route = routes.find((r) => r.path === segment);
      return {
        label: t(`${route?.label}_key`) || segment,
        href: `/${pathSegments.slice(0, index + 1).join("/")}`,
        isCurrentPage: index === pathSegments.length - 1,
      };
    }),
  ];

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />
      <main className="flex-grow p-8 border border-slate-200 rounded-2xl w-11/12 mx-auto mt-30 space-y-4 shadow-sm bg-slate-50 bg-opacity-90 ">
        {/* Add bg-opacity to make content more readable over the background */}
        {/* Render breadcrumbs if not on the home page */}
        <Breadcrumbs items={breadcrumbItems} />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

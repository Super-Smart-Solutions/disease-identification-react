import React, { useState } from "react";
import SideNavigation from "../Components/layout/SideNavigation";
import Navbar from "../Components/layout/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Breadcrumbs from "../Components/layout/BreadCrumbs";
import { useTranslation } from "react-i18next";
import routes from "../routes/adminRoutes.json";

export default function DashboardLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    // Always start with home
    breadcrumbs.push({
      label: t("home_key"),
      href: "/",
      isCurrentPage: false,
    });

    // Special handling for admin routes
    if (pathSegments[0] === "admin") {
      breadcrumbs.push({
        label: t("admin_key"),
        href: "/admin",
        isCurrentPage: pathSegments.length === 1,
      });

      // Find the matching admin route
      const currentPath = `/${pathSegments.slice(1).join("/")}`;
      const adminRoute = routes.find(
        (route) =>
          route.path === currentPath ||
          route.path === pathSegments[pathSegments.length - 1]
      );

      if (pathSegments.length > 1) {
        breadcrumbs.push({
          label: t(
            `${adminRoute?.label || pathSegments[pathSegments.length - 1]}_key`
          ),
          href: currentPath,
          isCurrentPage: true,
        });
      }
    } else {
      // Handle non-admin routes
      pathSegments.forEach((segment, index) => {
        breadcrumbs.push({
          label: t(`${segment}_key`),
          href: `/${pathSegments.slice(0, index + 1).join("/")}`,
          isCurrentPage: index === pathSegments.length - 1,
        });
      });
    }

    return breadcrumbs;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation */}
        <div className="h-full">
          <SideNavigation
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto relative">
          {/* Background with overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
              backgroundImage: "url('/background.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Content Container */}
          <div className="relative min-h-full p-4">
            <main className="flex-grow p-8 border border-slate-200 rounded-2xl  space-y-4 shadow-sm bg-slate-50 bg-opacity-90">
              {/* Enhanced Breadcrumbs */}
              <Breadcrumbs items={generateBreadcrumbs()} />

              {/* Page Content */}
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

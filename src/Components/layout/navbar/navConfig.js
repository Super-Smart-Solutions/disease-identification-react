import { FaHome, FaDatabase } from "react-icons/fa";
import { AiFillGolden } from "react-icons/ai";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { RiAdminFill } from "react-icons/ri";

export const navItems = (t) => [
    { path: "/", label: t("home_key"), icon: FaHome },
    {
        path: "/database",
        label: t("database_key"),
        icon: FaDatabase
    },
];

export const userToggleOptions = (t, logout, handleRoute) => (user) => [
    {
        label: t("profile_key"),
        icon: FaUser,
        onClick: () => {
            handleRoute("/profile");
        },
    },
    {
        label: t("dashboard_key"),
        icon: RxDashboard,
        onClick: () => {
            handleRoute("/dashboard");
        },
    },
    ...(Array.isArray(user?.roles) && user.roles[0]?.name === "superuser"
        ? [
            {
                label: t("admin_key"),
                icon: RiAdminFill,
                onClick: () => {
                    handleRoute("/admin/inferences");
                },
            },
        ]
        : []),
    {
        label: t("logout_key"),
        icon: FaSignOutAlt,
        onClick: () => {
            logout();
        },
    },
];
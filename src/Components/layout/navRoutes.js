const navRoutes = [
    {
        needAuth: true,
        path: "/",
        label: "home_key"
    },
    {
        needAuth: true,
        path: "/models",
        label: "models_key"
    },
    {
        needAuth: true,
        path: "/database",
        label: "database_key"
    },
    {
        needAuth: false,
        path: "/auth/login",
        label: "login_key"
    },
    {
        needAuth: false,
        path: "/auth/register",
        label: "create_account_key"
    },
];

export default navRoutes;

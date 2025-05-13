import { FaTachometerAlt, FaLeaf, FaClinicMedical } from 'react-icons/fa';

const dashboardRoutes = [
    {
        path: "/admin",
        label: "dashboard_key",
        icon: FaTachometerAlt,
    },
    {
        path: "/admin/plants",
        label: "plants_key",
        icon: FaLeaf,
    },
    {
        path: "/admin/diseases",
        label: "disease_key",
        icon: FaClinicMedical,
    },
];

export default dashboardRoutes;

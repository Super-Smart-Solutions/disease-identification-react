import { FaLeaf } from 'react-icons/fa';
import { GiCarnivorousPlant } from "react-icons/gi";

const dashboardRoutes = [

    {
        path: "/admin/plants",
        label: "plants_key",
        icon: FaLeaf,
    },
    {
        path: "/admin/diseases",
        label: "diseases_key",
        icon: GiCarnivorousPlant,
    },
];

export default dashboardRoutes;

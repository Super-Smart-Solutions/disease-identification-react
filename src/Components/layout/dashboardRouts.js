import { FaLeaf } from 'react-icons/fa';
import { GiCarnivorousPlant } from "react-icons/gi";
import { PiDetective } from "react-icons/pi";


const dashboardRoutes = [

    {
        path: "/admin/inferences",
        label: "inference_logs_key",
        icon: PiDetective,
    },
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

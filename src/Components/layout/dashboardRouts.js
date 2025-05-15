import { GiCarnivorousPlant } from "react-icons/gi";
import { PiDetective, PiFarm } from "react-icons/pi";
import { RiLeafLine, RiTeamLine } from "react-icons/ri";


const dashboardRoutes = [

    {
        path: "/admin/inferences",
        label: "inference_logs_key",
        icon: PiDetective,
    },
    {
        path: "/admin/plants",
        label: "plants_key",
        icon: RiLeafLine,
    },
    {
        path: "/admin/diseases",
        label: "diseases_key",
        icon: GiCarnivorousPlant,
    },
    {
        path: "/admin/farms",
        label: "farms_key",
        icon: PiFarm,
    },
    {
        path: "/admin/organizations",
        label: "organizations_key",
        icon: RiTeamLine,
    },
];

export default dashboardRoutes;

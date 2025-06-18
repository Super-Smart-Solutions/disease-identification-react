import { GiCarnivorousPlant } from "react-icons/gi";
import { PiDetective, PiFarm } from "react-icons/pi";
import { RiLeafLine, RiTeamLine } from "react-icons/ri";
import { IoImagesOutline } from "react-icons/io5";
import { FaUsersRectangle } from "react-icons/fa6";


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
    {
        path: "/admin/images",
        label: "images_key",
        icon: IoImagesOutline,
    },
    {
        path: "/admin/users",
        label: "users_key",
        icon: FaUsersRectangle,
    },
];

export default dashboardRoutes;

import { useNavigate } from "react-router-dom";

const useNavigation = () => {
    const navigate = useNavigate();

    const handleRoute = (path) => {
        navigate(path);
    };

    return { handleRoute };
};

export default useNavigation;
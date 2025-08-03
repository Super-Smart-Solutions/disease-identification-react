import { useCallback } from "react";
import { setOilTestModalOpen } from "../../../redux/features/oilTestModalSlice";

export const useOilTest = ({ user, navigate,
    dispatch
}) => {

    const handleOpenModal = useCallback(() => {
        if (user?.id) {
            dispatch(setOilTestModalOpen(true));
        }
        else {
            navigate("/auth/login");
        }
    }, [dispatch]);

    return { handleOpenModal };
};

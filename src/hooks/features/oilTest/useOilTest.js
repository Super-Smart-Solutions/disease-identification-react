import { useCallback } from "react";
import { setOilTestModalOpen } from "../../../redux/features/oilTestModalSlice";

export const useOilTest = ({ user, navigate,
    dispatch
}) => {

    const handleOpenModal = () => {
        if (!user?.id) {
            navigate("/auth/login");
        }
        else {
            dispatch(setOilTestModalOpen(true));
        }
    }

    return { handleOpenModal };
};

import { useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export const useSearchHandlers = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleDiseaseChange = useCallback(
        (diseaseId) => {
            const newParams = new URLSearchParams(searchParams);
            if (diseaseId) {
                newParams.set("disease_id", diseaseId);
                if (newParams.get("plant_id")) {
                    newParams.set("plant_id", newParams.get("plant_id"));
                }
            } else {
                newParams.delete("disease_id");
                newParams.delete("plant_id");
            }
            setSearchParams(newParams);
            // Navigate with the updated params
            if (window.location.pathname !== "/database") {
                navigate(`/database?${newParams.toString()}`);
            }
        },
        [searchParams, setSearchParams, navigate]
    );

    const handlePlantChange = useCallback(
        (plantId) => {
            const newParams = new URLSearchParams(searchParams);
            if (plantId && plantId !== null) {
                newParams.set("plant_id", plantId);
            } else {
                newParams.delete("plant_id");
            }
            if (newParams.get("disease_id")) {
                newParams.set("disease_id", newParams.get("disease_id"));
            }
            setSearchParams(newParams);
            // Navigate with the updated params
            if (window.location.pathname !== "/database") {
                navigate(`/database?${newParams.toString()}`);
            }
        },
        [searchParams, setSearchParams, navigate]
    );

    return { handleDiseaseChange, handlePlantChange };
};
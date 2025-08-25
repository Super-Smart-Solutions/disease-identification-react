import { useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export const useSearchHandlers = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const updateParamsAndNavigate = useCallback(
        (newParams) => {
            const currentPath = window?.location?.pathname;
            const newQueryString = newParams.toString();

            if (currentPath === "/database") {
                setSearchParams(newParams);
            } else {
                navigate(`/database?${newQueryString}`);
            }
        },
        [navigate, setSearchParams]
    );

    const handleCategoryChange = useCallback(
        (category) => {
            const newParams = new URLSearchParams(searchParams.toString());
            if (category) {
                newParams.set("category", category);
            } else {
                newParams.delete("category");
            }
            newParams.delete("plant_id");
            newParams.delete("disease_id");
            updateParamsAndNavigate(newParams);
        },
        [searchParams, updateParamsAndNavigate]
    );


    const handleDiseaseChange = useCallback(
        (diseaseId) => {
            const newParams = new URLSearchParams(searchParams.toString());
            if (diseaseId) {
                newParams.set("disease_id", diseaseId);
            } else {
                newParams.delete("disease_id");
                newParams.delete("plant_id");
            }
            updateParamsAndNavigate(newParams);
        },
        [searchParams, updateParamsAndNavigate]
    );

    const handlePlantChange = useCallback(
        (plantId) => {
            const newParams = new URLSearchParams(searchParams.toString());
            if (plantId) {
                newParams.set("plant_id", plantId);
            } else {
                newParams.delete("plant_id");
            }
            updateParamsAndNavigate(newParams);
        },
        [searchParams, updateParamsAndNavigate]
    );

    const handleReset = useCallback(() => {
        setSearchParams({});
    }, [navigate, setSearchParams]);

    return {
        handleCategoryChange,
        handleDiseaseChange,
        handlePlantChange,
        handleReset,
    };
};


import { useMemo } from "react";
import Fuse from "fuse.js";

export const useDiseaseSearch = (diseases, inputValue) => {
    const fuse = useMemo(() => {
        return new Fuse(diseases, {
            keys: [
                "arabic_name",
                "english_name",
                "scientific_name",
                "description",
                "symptoms",
            ],
            threshold: 0.4,
        });
    }, [diseases]);

    const filteredOptions = useMemo(() => {
        if (!inputValue) return diseases;
        return fuse.search(inputValue).map((result) => result.item);
    }, [inputValue, diseases, fuse]);

    return filteredOptions;
};
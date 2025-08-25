import React, { useMemo, useCallback } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import SelectInput from "../../Formik/SelectInput";
import Button from "../../Button";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchPlants, fetchDiseasesByPlant } from "../../../api/plantAPI";


const plantCategoryMapping = {
    "Roses": "roses",
    "Citrus": "fruits",
    "Grape": "fruits",
    "Honey Bees": "animals",
    "Pomegranate": "fruits",
    "Coffee": "fruits",
    "Animals": "animals",
    "Fish": "animals",
    "Stone fruits": "fruits",
};

const PlantDiseaseForm = ({
    selectedDisease,
    selectedPlant,
    selectedCategory,
    handleCategoryChange,
    handleDiseaseChange,
    handlePlantChange,
    handleReset,
}) => {
    const { t, i18n } = useTranslation();

    const categoryOptions = useMemo(
        () => [
            { value: "roses", label: t("categories.roses", "Roses") },
            { value: "fruits", label: t("categories.fruits", "Fruits") },
            { value: "animals", label: t("categories.animals", "Animals") },
        ],
        [t]
    );

    const { data: plantOptions = [], isLoading: plantsLoading } = useQuery({
        queryKey: ["plants"],
        queryFn: async () => {
            const plants = await fetchPlants();
            return plants.items || [];
        },
    });

    const { data: diseaseOptions = [], isLoading: diseasesLoading } = useQuery({
        queryKey: ["diseases", selectedPlant],
        queryFn: async () => {
            if (!selectedPlant) return [];
            const diseases = await fetchDiseasesByPlant(selectedPlant);
            return diseases?.items || [];
        },
        enabled: !!selectedPlant,
    });

    const translatedPlants = useMemo(
        () =>
            plantOptions.map((plant) => ({
                value: plant.id,
                label: t(`plants.${plant.english_name}`, {
                    defaultValue: plant.english_name,
                }),
                english_name: plant.english_name,
            })),
        [plantOptions, i18n.language, t]
    );

    const translatedDiseases = useMemo(
        () =>
            diseaseOptions.map((disease) => ({
                value: disease.id,
                label: t(`diseases.${disease.english_name}`, {
                    defaultValue: disease.english_name,
                }),
                english_name: disease.english_name,
            })),
        [diseaseOptions, i18n.language, t]
    );

    const validationSchema = Yup.object().shape({
        category: Yup.string().required(t("required_field_key")),
        plant: Yup.string().required(t("required_field_key")),
        disease: Yup.string().required(t("required_field_key")),
    });

    const onReset = (resetForm) => {
        handleReset();
        resetForm();
    };

    const onCategorySelect = useCallback(
        (selectedOption, setFieldValue) => {
            const category = selectedOption.value;
            setFieldValue("category", category);
            setFieldValue("plant", "");
            setFieldValue("disease", "");
            handleCategoryChange(category);
        },
        [handleCategoryChange]
    );

    const onPlantSelect = useCallback(
        (selectedOption, setFieldValue) => {
            const id = selectedOption.value;
            setFieldValue("plant", id);
            setFieldValue("disease", "");
            handlePlantChange(id);
        },
        [handlePlantChange]
    );

    const onDiseaseSelect = useCallback(
        (selectedOption, setFieldValue) => {
            const id = selectedOption.value;
            setFieldValue("disease", id);
            handleDiseaseChange(id);
        },
        [handleDiseaseChange]
    );

    return (
        <Formik
            enableReinitialize
            initialValues={{
                category: selectedCategory || "",
                plant: selectedPlant || "",
                disease: selectedDisease || "",
            }}
            validationSchema={validationSchema}
        >
            {({ values, errors, touched, isSubmitting, setFieldValue, resetForm }) => {
                const filteredTranslatedPlants = useMemo(() => {
                    if (!values.category) return [];
                    return translatedPlants.filter(
                        (plant) => plantCategoryMapping[plant.english_name] === values.category
                    );
                }, [values.category, translatedPlants]);

                return (
                    <Form className="w-full cardIt">
                        <div className="flex flex-col gap-4">
                            <div className="w-full md:w-1/4">
                                <SelectInput
                                    name="category"
                                    label={t("select_category_key")}
                                    options={categoryOptions}
                                    value={values.category || null}
                                    onChange={(opt) => onCategorySelect(opt, setFieldValue)}
                                    placeholder={t("select_category_key")}
                                />
                                {errors.category && touched.category && (
                                    <div className="text-red-500 text-sm mt-1">{errors.category}</div>
                                )}
                            </div>

                            <div className="flex items-end gap-4">
                                <div className="flex-grow">
                                    <SelectInput
                                        name="plant"
                                        label={t("select_plant_key")}
                                        options={filteredTranslatedPlants}
                                        value={Number(values.plant) || null}
                                        onChange={(opt) => onPlantSelect(opt, setFieldValue)}
                                        placeholder={t("select_plant_key")}
                                        isLoading={plantsLoading}
                                        isDisabled={!values.category}
                                    />
                                    {errors.plant && touched.plant && (
                                        <div className="text-red-500 text-sm mt-1">{errors.plant}</div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <SelectInput
                                        name="disease"
                                        label={t("select_pest_key")}
                                        options={translatedDiseases}
                                        value={Number(values.disease) || null}
                                        onChange={(opt) => onDiseaseSelect(opt, setFieldValue)}
                                        placeholder={
                                            diseasesLoading ? t("loading_key") : t("select_pest_key")
                                        }
                                        isLoading={diseasesLoading}
                                        isDisabled={!values.plant}
                                    />
                                    {errors.disease && touched.disease && (
                                        <div className="text-red-500 text-sm mt-1">{errors.disease}</div>
                                    )}
                                </div>
                                <div>
                                    <Button
                                        type="button"
                                        onClick={() => onReset(resetForm)}
                                        disabled={isSubmitting}
                                    >
                                        {t("reset_key")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default PlantDiseaseForm;

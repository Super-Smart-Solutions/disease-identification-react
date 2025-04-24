import React, { useState } from "react";
import { IoCalculator } from "react-icons/io5";
import { useUserData } from "../../../hooks/useUserData";
import RangeInputs from "../../RangeInputs";
import Modal from "../../Modal";
import { useTranslation } from "react-i18next";
import Button from "../../Button";
import SelectInput from "../../Formik/SelectInput";
import { useQuery } from "@tanstack/react-query";
import { fetchCrops } from "../../../api/soilApi"; // adjust path if needed

export default function SoilCalculator() {
  const { t } = useTranslation();
  const { user } = useUserData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phRange, setPhRange] = useState({ min: "", max: "" });
  const [salinityRange, setSalinityRange] = useState({ min: "", max: "" });
  const [selectedCrop, setSelectedCrop] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["crops"],
    queryFn: fetchCrops,
  });

  const cropOptions =
    data?.items?.map((crop) => ({
      label: crop.name,
      value: crop.id,
      crop,
    })) || [];

  const handleCropChange = (selected) => {
    const crop = selected?.crop;
    setSelectedCrop(selected);
    if (crop) {
      setPhRange({ min: crop.min_ph, max: crop.max_ph });
      setSalinityRange({ min: crop.min_salinity, max: crop.max_salinity });
    }
  };

  if (!user?.id) return null;

  return (
    <div>
      {/* Calculator button */}
      <div
        className="fixed bottom-10 right-10 bg-primary cursor-pointer p-2 rounded-full shadow-md z-50"
        onClick={() => setIsModalOpen(true)}
      >
        <IoCalculator size={24} color="white" />
      </div>

      {/* Modal */}
      <Modal
        title={t("soil_calculator_key")}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCrop(null);
          setPhRange({ min: "", max: "" });
          setSalinityRange({ min: "", max: "" });
        }}
      >
        <div className="flex flex-col md:flex-row justify-between w-full gap-4">
          <div className=" space-y-4  w-full md:w-6/12">
            <SelectInput
              label={t("crop_key")}
              options={cropOptions}
              value={selectedCrop?.value || null}
              onChange={handleCropChange}
              placeholder={t("select_crop_key")}
              isLoading={isLoading}
            />

            <RangeInputs
              label="ph_key"
              range={{ min: -7, max: 7 }}
              value={phRange}
              setValue={setPhRange}
            />
            <RangeInputs
              label="salinity_key"
              range={{ min: 5, max: 18 }}
              value={salinityRange}
              setValue={setSalinityRange}
            />
          </div>

          <div className="cardIt w-full md:w-6/12"></div>
        </div>

        <Button width="full" className="mt-4">
          {t("get_data_key")}
        </Button>
      </Modal>
    </div>
  );
}

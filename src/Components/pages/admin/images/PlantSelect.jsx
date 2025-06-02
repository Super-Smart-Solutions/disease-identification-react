import { Field, ErrorMessage } from "formik";
import SelectInput from "../../../Formik/SelectInput";

const PlantSelect = ({
  t,
  plantOptions,
  plantsLoading,
  setFieldValue,
  selectedPlant,
  setSelectedPlant,
}) => (
  <div className="w-full md:w-1/2">
    <Field name="plant_id">
      {({ field }) => (
        <SelectInput
          label={t("select_plant_key")}
          options={plantOptions.map((plant) => ({
            value: plant.id,
            label: t(`plants.${plant.english_name}`),
          }))}
          value={selectedPlant}
          onChange={(selectedOption) => {
            setFieldValue("plant_id", selectedOption.value);
            setSelectedPlant(selectedOption.value);
            setFieldValue("disease_id", "");
          }}
          placeholder={t("select_plant_key")}
          isLoading={plantsLoading}
        />
      )}
    </Field>
    <ErrorMessage
      name="plant_id"
      render={(error) => (
        <div className="text-red-500 text-sm mt-1">
          {typeof error === "string"
            ? error
            : t(error.msg || "commonErrors.somethingWentWrong")}
        </div>
      )}
    />
  </div>
);

export default PlantSelect;

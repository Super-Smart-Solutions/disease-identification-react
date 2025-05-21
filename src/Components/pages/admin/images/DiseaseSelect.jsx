import { Field, ErrorMessage } from "formik";
import SelectInput from "../../../Formik/SelectInput";

const DiseaseSelect = ({
  t,
  diseaseOptions,
  diseasesLoading,
  setFieldValue,
  selectedDisease,
  setSelectedDisease,
}) => (
  <div className="w-full md:w-1/2">
    <Field name="disease_id">
      {({ field }) => (
        <SelectInput
          label={t("select_disease_key")}
          options={diseaseOptions.map((disease) => ({
            value: disease.id,
            label: t(`diseases.${disease.english_name}`),
          }))}
          value={selectedDisease}
          onChange={(selectedOption) => {
            setFieldValue("disease_id", selectedOption.value);
            setSelectedDisease(selectedOption.value);
          }}
          placeholder={t("select_disease_key")}
          isLoading={diseasesLoading}
        />
      )}
    </Field>
    <ErrorMessage
      name="disease_id"
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

export default DiseaseSelect;

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PasswordInput from "../Components/Formik/PasswordInput";
import SelectInput from "../Components/Formik/SelectInput";
import RadioInput from "../Components/Formik/RadioInput";
import CheckboxInput from "../Components/Formik/CheckboxInput";
import Input from "../Components/Formik/Input";
import PhoneInput from "../Components/Formik/PhoneInput"; // Import the PhoneInput component

const InputsShowcase = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [agree, setAgree] = useState(false);
  const [phoneData, setPhoneData] = useState({
    country: null,
    phoneNumber: "",
  });

  const genderOptions = [
    { value: "male", label: t("gender_options.male") },
    { value: "female", label: t("gender_options.female") },
    { value: "other", label: t("gender_options.other") },
  ];

  const handlePhoneChange = ({ country, phoneNumber }) => {
    setPhoneData({ country, phoneNumber });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {t("inputs_showcase.title")}
      </h1>

      {/* Text Input */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{t("text_input.label")}</h2>
        <p className="text-gray-600 mb-4">{t("text_input.description")}</p>
        <Input
          label={t("text_input.label")}
          value={name}
          onChange={setName}
          placeholder={t("text_input.placeholder")}
        />
      </div>

      {/* Password Input */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          {t("password_input.label")}
        </h2>
        <p className="text-gray-600 mb-4">{t("password_input.description")}</p>
        <PasswordInput
          label={t("password_input.label")}
          value={password}
          onChange={setPassword}
          placeholder={t("password_input.placeholder")}
        />
      </div>

      {/* Select Input */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          {t("select_input.label")}
        </h2>
        <p className="text-gray-600 mb-4">{t("select_input.description")}</p>
        <SelectInput
          label={t("select_input.label")}
          options={genderOptions}
          value={gender}
          onChange={setGender}
          placeholder={t("select_input.placeholder")}
        />
      </div>
      {/* Phone Input */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{t("phone_input.label")}</h2>
        <p className="text-gray-600 mb-4">{t("phone_input.description")}</p>
        <PhoneInput
          onChange={handlePhoneChange}
          initialCountry="+1" // Default country code
          initialPhoneNumber="1234567890" // Default phone number
          placeholder={t("phone_input.placeholder")}
          searchPlaceholder={t("phone_input.search_placeholder")}
          className="mb-4"
          countryDropdownClassName="w-48"
          phoneInputClassName="w-full"
        />
      </div>
      {/* Radio Input */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{t("radio_input.label")}</h2>
        <p className="text-gray-600 mb-4">{t("radio_input.description")}</p>
        <RadioInput
          label={t("radio_input.label")}
          name="gender"
          options={genderOptions}
          value={gender}
          onChange={setGender}
        />
      </div>

      {/* Checkbox Input */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          {t("checkbox_input.label")}
        </h2>
        <p className="text-gray-600 mb-4">{t("checkbox_input.description")}</p>
        <CheckboxInput
          label={t("checkbox_input.label")}
          checked={agree}
          onChange={setAgree}
        />
      </div>
    </div>
  );
};

export default InputsShowcase;

import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "../Components/Button";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle navigation
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl text-center mb-8">{t("welcome_text_key")}</h2>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-5xl">
          مرشدك الزراعي - Murshiduk{" "}
        </h2>

        <p className="mx-auto mt-4 max-w-sm text-gray-500">
          {t("subtitle_key")}
        </p>
      </div>
      <div className="flex gap-4">
        {/* Button to navigate to /buttons */}
        <Button
          onClick={() => handleNavigate("/buttons")}
          variant="filled"
          size="medium"
        >
          {t("buttons_showcase_key")}
        </Button>

        {/* Button to navigate to /inputs */}
        <Button
          onClick={() => handleNavigate("/inputs")}
          variant="filled"
          size="medium"
        >
          {t("inputs_key")}
        </Button>
      </div>
    </div>
  );
};

export default Home;

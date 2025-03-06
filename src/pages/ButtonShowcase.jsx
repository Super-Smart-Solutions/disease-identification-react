import React from "react";
import Button from "../Components/Button";
import { useTranslation } from "react-i18next";

// Sample Icon (Download Icon from Heroicons)
const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const ButtonShowcase = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg space-y-5">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {t("buttons_showcase_key")}
      </h1>
      {/* Filled Buttons Section */}
      <div>
        <h2 className="text-xl font-bold mb-2">{t("filled_key")}</h2>
        <p className="text-gray-600 mb-4">{t("filled_description_key")}</p>
        <div className="space-x-4">
          <Button variant="filled" size="small">
            {t("save_key")}
          </Button>
          <Button variant="filled" size="medium">
            {t("save_key")}
          </Button>
          <Button variant="filled" size="large">
            {t("save_key")}
          </Button>
        </div>
      </div>

      {/* Outlined Buttons Section */}
      <div>
        <h2 className="text-xl font-bold mb-2">{t("outlined_key")}</h2>
        <p className="text-gray-600 mb-4">{t("outlined_description_key")}</p>
        <div className="space-x-4">
          <Button variant="outlined" size="small">
            {t("save_key")}
          </Button>
          <Button variant="outlined" size="medium">
            {t("save_key")}
          </Button>
          <Button variant="outlined" size="large">
            {t("save_key")}
          </Button>
        </div>
      </div>

      {/* Default Buttons Section */}
      <div>
        <h2 className="text-xl font-bold mb-2">{t("default_key")}</h2>
        <p className="text-gray-600 mb-4">{t("default_description_key")}</p>
        <div className="space-x-4">
          <Button variant="default" size="small">
            {t("save_key")}
          </Button>
          <Button variant="default" size="medium">
            {t("save_key")}
          </Button>
          <Button variant="default" size="large">
            {t("save_key")}
          </Button>
        </div>
      </div>

      {/* Loading Buttons Section */}
      <div>
        <h2 className="text-xl font-bold mb-2">{t("loading_btn_key")}</h2>
        <p className="text-gray-600 mb-4">{t("loading_description_key")}</p>
        <div className="space-x-4">
          <Button variant="filled" size="medium" loading>
            {t("save_key")}
          </Button>
          <Button variant="outlined" size="medium" loading>
            {t("save_key")}
          </Button>
          <Button variant="default" size="medium" loading>
            {t("save_key")}
          </Button>
        </div>
      </div>

      {/* Buttons with Icons Section */}
      <div>
        <h2 className="text-xl font-bold mb-2">{t("icon_btn_key")}</h2>
        <p className="text-gray-600 mb-4">{t("icon_description_key")}</p>
        <div className=" flex  gap-2  items-center">
          <Button
            className={` flex gap-1 items-center justify-center`}
            variant="filled"
            size="small"
          >
            {t("save_key")}
            <DownloadIcon />
          </Button>
          <Button
            className={` flex gap-1 items-center justify-center`}
            variant="outlined"
            size="medium"
          >
            {t("save_key")}
            <DownloadIcon />
          </Button>
          <Button
            className={` flex gap-1 items-center justify-center`}
            variant="default"
            size="large"
          >
            {t("save_key")}
            <DownloadIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ButtonShowcase;

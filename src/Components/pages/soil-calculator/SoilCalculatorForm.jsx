import React from "react";
import { Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";

export const SoilCalculatorForm = ({ t }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="space-y-4">
        {/* Crop Field - Full Width */}
        <div className="form-group">
          <label
            htmlFor="crop_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("crop_key")}
          </label>
          <Field
            placeholder={t("type_crop_key")}
            type="text"
            name="crop_name"
            id="crop_name"
            className="custom-input w-full p-2 border"
          />
          <ErrorMessage
            name="crop_name"
            component="div"
            className="text-red-500 text-xs mt-1"
          />
        </div>

        {/* Grid for remaining fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* pH Field */}
          <div className="form-group">
            <label
              htmlFor="ph"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("ph_key")}
            </label>
            <Field
              placeholder="(0-14)"
              type="text"
              name="ph"
              id="ph"
              className="custom-input w-full p-2 border rounded"
            />
            <ErrorMessage
              name="ph"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          {/* Salinity Field */}
          <div className="form-group">
            <label
              htmlFor="salinity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("salinity_key")}
            </label>
            <Field
              placeholder="(5-18)"
              type="text"
              name="salinity"
              id="salinity"
              className="custom-input w-full p-2 border rounded"
            />
            <ErrorMessage
              name="salinity"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          {/* Temperature Field */}
          <div className="form-group">
            <label
              htmlFor="temperature"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("temperature_key")}
            </label>
            <Field
              placeholder="°C"
              type="text"
              name="temperature"
              id="temperature"
              className="custom-input w-full p-2 border rounded"
            />
            <ErrorMessage
              name="temperature"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

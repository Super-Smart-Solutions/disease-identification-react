import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosHelpCircleOutline } from "react-icons/io";

import Button from "../../Button";
import good_1 from "../../../assets/good_1.png";
import good_2 from "../../../assets/good_2.png";
import good_3 from "../../../assets/good_3.png";
import bad_1 from "../../../assets/bad_1.png";
import bad_2 from "../../../assets/bad_2.png";
import bad_3 from "../../../assets/bad_3.png";
import inst_1 from "../../../assets/instruction_1.png";
import inst_2 from "../../../assets/instruction_2.png";

const InstructionModal = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [confirmed, setConfirmed] = useState({
    checked: false,
    error: null,
  });
  // Check if modal should be shown on initial render
  useEffect(() => {
    if (Cookies.get("instructions_shown") !== "true") {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (currentStep === 7 && confirmed.checked) {
      Cookies.set("instructions_shown", "true", { expires: 30, path: "/" });
    }
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    } else if (confirmed.checked) {
      handleClose();
    } else {
      setConfirmed((prev) => ({
        ...prev,
        error: "instruction_modal.confirmation_error",
      }));
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setCurrentStep(1);
    setConfirmed({ checked: false, error: null });
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: { y: 50, opacity: 0 },
  };

  const stepVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <>
      <div className="relative bottom-10 flex gap-2">
        <span>{t("need_help_key")}</span>
        <motion.button
          onClick={handleOpen}
          className=" bg-slate-50 text-slate-600  rounded-full hover:bg-slate-200 "
          aria-label={t("instruction_modal.help_button_label")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <IoIosHelpCircleOutline size={26} title={t("more_info_key")} />
        </motion.button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="overlay"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto  overflow-x-hidden"
              variants={modalVariants}
            >
              {/* Modal Header */}
              <div className=" p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {t(`instruction_modal.step_${currentStep}_title`)}
                </h3>
                <motion.button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={stepVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <div className=" h-72  overflow-hidden">
                      {currentStep === 1 && (
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-800">
                            {t("instruction_modal.step_1_content")}
                          </h4>
                          <ul className="list-disc ps-5 space-y-2 text-gray-700">
                            <li>{t("instruction_modal.rule_select_plant")}</li>
                            <li>{t("instruction_modal.rule_image_quality")}</li>
                            <li>
                              {t("instruction_modal.rule_select_affected_part")}
                            </li>
                            <li>{t("instruction_modal.rule_single_plant")}</li>
                            <li>
                              {t("instruction_modal.rule_position_near_camera")}
                            </li>
                          </ul>
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className=" flex gap-2 p-2">
                          <div>
                            <h4 className="font-medium text-green-600 mb-2">
                              {t("instruction_modal.good_example_title")}
                            </h4>
                            <motion.div
                              className="border border-green-300 rounded-lg p-2 bg-green-50"
                              whileHover={{ scale: 1.01 }}
                            >
                              <img
                                src={good_1}
                                alt={t("instruction_modal.good_example_alt")}
                                className="w-80 h-50 rounded"
                              />
                              <p className="mt-2 text-sm text-green-700">
                                {t("good_1_caption")}
                              </p>
                            </motion.div>
                          </div>

                          <div>
                            <h4 className="font-medium text-red-600 mb-2">
                              {t("instruction_modal.bad_example_title")}
                            </h4>
                            <motion.div
                              className="border border-red-300 rounded-lg p-2 bg-red-50"
                              whileHover={{ scale: 1.01 }}
                            >
                              <img
                                src={bad_1}
                                alt={t("instruction_modal.bad_example_alt")}
                                className="w-80 h-50 rounded"
                              />
                              <p className="mt-2 text-sm text-red-700">
                                {t("bad_1_caption")}
                              </p>
                            </motion.div>
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className=" flex gap-2 p-2">
                          <div>
                            <h4 className="font-medium text-green-600 mb-2">
                              {t("instruction_modal.good_example_title")}
                            </h4>
                            <motion.div
                              className="border border-green-300 rounded-lg p-2 bg-green-50"
                              whileHover={{ scale: 1.01 }}
                            >
                              <img
                                src={good_2}
                                alt={t("instruction_modal.good_example_alt")}
                                className="w-80 h-50 rounded"
                              />
                              <p className="mt-2 text-sm text-green-700">
                                {t("good_2_caption")}
                              </p>
                            </motion.div>
                          </div>

                          <div>
                            <h4 className="font-medium text-red-600 mb-2">
                              {t("instruction_modal.bad_example_title")}
                            </h4>
                            <motion.div
                              className="border border-red-300 rounded-lg p-2 bg-red-50"
                              whileHover={{ scale: 1.01 }}
                            >
                              <img
                                src={bad_2}
                                alt={t("instruction_modal.bad_example_alt")}
                                className="w-80 h-50 rounded"
                              />
                              <p className="mt-2 text-sm text-red-700">
                                {t("bad_2_caption")}
                              </p>
                            </motion.div>
                          </div>
                        </div>
                      )}

                      {currentStep === 4 && (
                        <div className=" flex gap-2 p-2">
                          <div>
                            <h4 className="font-medium text-green-600 mb-2">
                              {t("instruction_modal.good_example_title")}
                            </h4>
                            <motion.div
                              className="border border-green-300 rounded-lg p-2 bg-green-50"
                              whileHover={{ scale: 1.01 }}
                            >
                              <img
                                src={good_3}
                                alt={t("instruction_modal.good_example_alt")}
                                className="w-80 h-50 rounded"
                              />
                              <p className="mt-2 text-sm text-green-700">
                                {t("good_3_caption")}
                              </p>
                            </motion.div>
                          </div>

                          <div>
                            <h4 className="font-medium text-red-600 mb-2">
                              {t("instruction_modal.bad_example_title")}
                            </h4>
                            <motion.div
                              className="border border-red-300 rounded-lg p-2 bg-red-50"
                              whileHover={{ scale: 1.01 }}
                            >
                              <img
                                src={bad_3}
                                alt={t("instruction_modal.bad_example_alt")}
                                className="w-80 h-50 rounded"
                              />
                              <p className="mt-2 text-sm text-red-700">
                                {t("bad_3_caption")}
                              </p>
                            </motion.div>
                          </div>
                        </div>
                      )}

                      {currentStep === 5 && (
                        <div className=" flex gap-2 p-2">
                          <div>
                            <h4 className="font-medium text-green-600 mb-2">
                              {t("instruction_1_caption")}
                            </h4>
                            <motion.div
                              className="border border-green-300 rounded-lg p-2 bg-green-50"
                              whileHover={{ scale: 1.01 }}
                            >
                              <img
                                src={inst_1}
                                alt={t("instruction_modal.good_example_alt")}
                                className="w-80 h-50 rounded"
                              />
                            </motion.div>
                          </div>
                        </div>
                      )}

                      {currentStep === 6 && (
                        <div className=" flex gap-2 p-2">
                          <div>
                            <h4 className="font-medium text-green-600 mb-2">
                              {t("instruction_2_caption")}
                            </h4>
                            <motion.div
                              className="border border-green-300 rounded-lg p-2 bg-green-50"
                              whileHover={{ scale: 1.01 }}
                            >
                              <img
                                src={inst_2}
                                alt={t("instruction_modal.good_example_alt")}
                                className="w-80 h-45 rounded"
                              />
                            </motion.div>
                          </div>
                        </div>
                      )}

                      {currentStep === 7 && (
                        <div className="space-y-4 p-2">
                          <h4 className="font-medium text-green-600 mb-2">
                            {t("confirmation_caption")}
                          </h4>

                          <input
                            id="confirm-checkbox"
                            type="checkbox"
                            checked={confirmed.checked}
                            onChange={(e) =>
                              setConfirmed({
                                checked: e.target.checked,
                                error: null, // Clear error when checkbox is toggled
                              })
                            }
                            className="mt-1 me-2"
                          />

                          <label
                            htmlFor="confirm-checkbox"
                            className="text-gray-700"
                          >
                            {t("instruction_modal.confirmation_text")}
                          </label>

                          {confirmed.error && (
                            <span className="text-red-500 block">
                              {t(confirmed.error)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Modal Footer */}
              <div className="p-4 flex justify-between">
                <div>
                  {currentStep > 1 && (
                    <Button
                      variant="outlined"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      {t("instruction_modal.back_button")}
                    </Button>
                  )}
                </div>

                <Button onClick={handleNext}>
                  {currentStep === 7
                    ? t("instruction_modal.finish_button")
                    : t("instruction_modal.next_button")}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InstructionModal;

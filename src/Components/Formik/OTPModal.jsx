import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import Button from "../Button";

export default function OTPModal({ isOpen, onClose, length = 6, onSubmit }) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setOtp(new Array(length).fill("")); // Reset OTP when modal opens
      inputRefs.current[0]?.focus(); // Auto-focus first input
    }
  }, [isOpen, length]);

  // Auto-submit when all digits are filled
  useEffect(() => {
    const isComplete = otp.every((digit) => digit !== "");
    if (isComplete) {
      handleSubmit();
    }
  }, [otp]); // This effect runs whenever otp changes

  // Handle input change
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Allow only numbers
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pasteData)) return; // Validate numbers only
    setOtp(
      pasteData.split("").concat(new Array(length - pasteData.length).fill(""))
    );
  };

  // Submit OTP
  const handleSubmit = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== length) return;

    // Prevent multiple submissions
    if (loading) return;

    setLoading(true);
    try {
      await onSubmit(finalOtp);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="overlay">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">
          {t("verification_code")}
        </h2>
        <p className="text-gray-500 text-center mb-4">
          {t("verification_code_message")}
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="custom-input text-center"
            />
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={loading || otp.includes("")}
          >
            {t("save_key")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

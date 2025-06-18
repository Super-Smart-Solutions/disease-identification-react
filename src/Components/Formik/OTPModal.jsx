import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import Button from "../Button";
import Modal from "../Modal";

export default function OTPModal({ isOpen, onClose, length = 6, onSubmit }) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setOtp(new Array(length).fill(""));
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const isComplete = otp.every((digit) => digit !== "");
    if (isComplete) {
      handleSubmit();
    }
  }, [otp]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pasteData)) return;
    setOtp(
      pasteData.split("").concat(new Array(length - pasteData.length).fill(""))
    );
  };

  const handleSubmit = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== length) return;

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
    <Modal isOpen={isOpen} onClose={onClose} title={t("verification_code")}>
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative bg-white p-6 w-full "
      >
        <p className="text-gray-500 text-center mb-4">
          {t("verification_code_message")}
        </p>

        {/* OTP Inputs */}
        <div dir="ltr" className="flex justify-center gap-2">
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
    </Modal>
  );
}

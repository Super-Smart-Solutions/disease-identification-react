import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5"; // Import close icon

const Modal = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef();

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="overlay">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl"
      >
        {/* Modal header with title and close button */}
        <div className="flex items-center justify-between p-4 border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 truncate max-w-full ">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none cursor-pointer"
            aria-label="Close modal"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Modal content */}
        <div className="px-4 pb-2">{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;

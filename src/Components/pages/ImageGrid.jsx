import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

const images = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj-4n8NUlW2wytb0WhxCTkJ7wJdheraIZYzQ&s",
  "https://media.istockphoto.com/id/1358387551/fi/valokuva/varsi-ruoste-joka-tunnetaan-my%C3%B6s-nimell%C3%A4-viljan-ruoste-musta-ruoste-punainen-ruoste-tai.jpg?s=612x612&w=0&k=20&c=c_7ifkImBmh8SY1RmGaSSItCpGk1Zt_BfoNa_1SxvQw=",
  "https://media.istockphoto.com/id/1804099998/fi/valokuva/kuivatut-huonekasvien-lehtien-k%C3%A4rjet.jpg?s=612x612&w=0&k=20&c=gjRKTJ7fHpZjNja_yvSnS8CfpJ4yNc-MwlBX8BeusGc=",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj-4n8NUlW2wytb0WhxCTkJ7wJdheraIZYzQ&s",

  "https://media.istockphoto.com/id/2190710792/fi/valokuva/m%C3%A4d%C3%A4t-satunnaiset-omenat.jpg?s=612x612&w=0&k=20&c=cCRei6SHqn97Cmz7nIcOZogtzQvgjN72wRapTN5p1dg=",

  "https://media.istockphoto.com/id/1358387551/fi/valokuva/varsi-ruoste-joka-tunnetaan-my%C3%B6s-nimell%C3%A4-viljan-ruoste-musta-ruoste-punainen-ruoste-tai.jpg?s=612x612&w=0&k=20&c=c_7ifkImBmh8SY1RmGaSSItCpGk1Zt_BfoNa_1SxvQw=",

  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj-4n8NUlW2wytb0WhxCTkJ7wJdheraIZYzQ&s",

  "https://media.istockphoto.com/id/2190710792/fi/valokuva/m%C3%A4d%C3%A4t-satunnaiset-omenat.jpg?s=612x612&w=0&k=20&c=cCRei6SHqn97Cmz7nIcOZogtzQvgjN72wRapTN5p1dg=",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj-4n8NUlW2wytb0WhxCTkJ7wJdheraIZYzQ&s",

  "https://media.istockphoto.com/id/1358387551/fi/valokuva/varsi-ruoste-joka-tunnetaan-my%C3%B6s-nimell%C3%A4-viljan-ruoste-musta-ruoste-punainen-ruoste-tai.jpg?s=612x612&w=0&k=20&c=c_7ifkImBmh8SY1RmGaSSItCpGk1Zt_BfoNa_1SxvQw=",

  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj-4n8NUlW2wytb0WhxCTkJ7wJdheraIZYzQ&s",

  "https://media.istockphoto.com/id/2190710792/fi/valokuva/m%C3%A4d%C3%A4t-satunnaiset-omenat.jpg?s=612x612&w=0&k=20&c=cCRei6SHqn97Cmz7nIcOZogtzQvgjN72wRapTN5p1dg=",
  "https://media.istockphoto.com/id/1804099998/fi/valokuva/kuivatut-huonekasvien-lehtien-k%C3%A4rjet.jpg?s=612x612&w=0&k=20&c=gjRKTJ7fHpZjNja_yvSnS8CfpJ4yNc-MwlBX8BeusGc=",

  "https://media.istockphoto.com/id/1358387551/fi/valokuva/varsi-ruoste-joka-tunnetaan-my%C3%B6s-nimell%C3%A4-viljan-ruoste-musta-ruoste-punainen-ruoste-tai.jpg?s=612x612&w=0&k=20&c=c_7ifkImBmh8SY1RmGaSSItCpGk1Zt_BfoNa_1SxvQw=",
];

const ImageGrid = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const openModal = (index) => {
    setSelectedImage(index);
    setIsImageLoading(true);
  };

  const closeModal = () => setSelectedImage(null);

  const prevImage = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setIsImageLoading(true);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setIsImageLoading(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage !== null) {
        if (e.key === "ArrowLeft") prevImage();
        else if (e.key === "ArrowRight") nextImage();
        else if (e.key === "Escape") closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  return (
    <div className="flex flex-wrap justify-between gap-y-8">
      {images.map((img, index) => (
        <motion.div
          key={index}
          className=" cursor-pointer overflow-hidden rounded-lg"
          whileHover={{ scale: 1.02 }}
          onClick={() => openModal(index)}
        >
          <img
            src={img}
            alt="Grid item"
            className=" h-60 object-cover  rounded-lg"
            loading="lazy"
          />
        </motion.div>
      ))}

      {/* Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            className="overlay flex items-center justify-center p-4"
            onClick={() => closeModal()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-3xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse rounded-lg">
                  <p className="text-gray-500">Loading...</p>
                </div>
              )}
              <img
                src={images[selectedImage]}
                alt="Selected"
                className="w-full h-auto max-h-[80vh] object-contain"
                onLoad={() => setIsImageLoading(false)}
              />
              <button
                className="absolute top-4 right-4 text-white text-2xl"
                onClick={closeModal}
              >
                <FaTimes />
              </button>
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
                onClick={prevImage}
              >
                <FaArrowLeft />
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
                onClick={nextImage}
              >
                <FaArrowRight />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGrid;

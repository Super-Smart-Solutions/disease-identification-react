import React from "react";
import { FaSearch, FaCamera, FaSeedling } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Carousel from "../Carousel";
import PlantImage1 from "../../assets/feature1.png";
import PlantImage2 from "../../assets/feature2.png";
import PlantImage3 from "../../assets/feature3.png";
import NumberProgress from "../NumberProgress";

export default function Infographics() {
  const { t } = useTranslation();

  const cards = [
    {
      value: 33997,
      title: t("total_images_collected"),
    },
    {
      value: 6,
      title: t("number_classes"),
    },
    {
      value: 39,
      title: t("number_diseases"),
    },
    {
      image: PlantImage1,
      icon: <FaSearch className="text-white text-4xl" />,
      title: t("get_diagnosis_key"),
    },
    {
      image: PlantImage2,
      icon: <FaCamera className="text-white text-4xl" />,
      title: t("take_photo_key"),
    },
    {
      image: PlantImage3,
      icon: <FaSeedling className="text-white text-4xl" />,
      title: t("choose_plant_key"),
    },
  ];

  const cardComponents = cards.map((card, index) => ({
    title: "",
    onClick: () => console.log(`Card ${index + 1} clicked`),
    component: (
      <div className="w-full ">
        <div className="relative w-full h-48 rounded-2xl flex items-center justify-center bg-[#015C44] overflow-hidden">
          {card.value !== undefined ? (
            <NumberProgress value={card.value} />
          ) : (
            <>
              <img
                src={card.image}
                alt="card"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center hover:bg-black/50">
                {card.icon}
              </div>
            </>
          )}
        </div>
        <div className="p-4 text-center text-black text-sm font-medium flex items-center justify-center gap-2">
          {card.title}
        </div>
      </div>
    ),
  }));

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 space-y-4">
      <span className="text-3xl text-center block">
        {t("infographics_key")}
      </span>
      <Carousel cards={cardComponents} />
    </div>
  );
}

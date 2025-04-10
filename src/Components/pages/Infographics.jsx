import React from "react";
import { FaSearch, FaCamera, FaSeedling } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Carousel from "../Carousel";
import PlantImage1 from "../../assets/feature1.png";
import PlantImage2 from "../../assets/feature2.png";
import PlantImage3 from "../../assets/feature3.png";

export default function Infographics() {
  const { t } = useTranslation();

  const cards = [
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
      <div className="w-full">
        <div className="relative w-full h-48 rounded-2xl">
          <img
            src={card.image}
            alt="card"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            {card.icon}
          </div>
        </div>
        <div className="p-4 text-center text-black text-sm font-medium flex items-center justify-center gap-2">
          {card.icon}
          {card.title}
        </div>
      </div>
    ),
  }));

  return (
    <div className="">
      <Carousel
        cards={cardComponents}
        cardClasses="rounded-xl"
        cardPadding="p-4"
        minHeight="min-h-[300px]"
      />
    </div>
  );
}

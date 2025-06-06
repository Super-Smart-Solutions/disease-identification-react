import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Carousel({ cards }) {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 4000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2.5,
        },
      },
    ],
  };

  return (
    <div className="px-8">
      <Slider {...settings}>
        {cards.map((card, index) => (
          <div key={index} onClick={card.onClick} className="px-2">
            {card.component}
          </div>
        ))}
      </Slider>
    </div>
  );
}

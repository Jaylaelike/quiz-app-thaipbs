"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Autoplay } from "swiper/modules";

function Advertistment() {
  const images = [
    "https://res.cloudinary.com/satjay/image/upload/v1709269404/mkfx8m1dk5sqsjm3eawf.png",
    "https://res.cloudinary.com/satjay/image/upload/v1707908263/mrsreoafgnoinzf6ynd4.png",
    "https://res.cloudinary.com/satjay/image/upload/v1707463991/ostxspdeakcsbmuzusrl.png",
    "https://res.cloudinary.com/satjay/image/upload/v1707816899/iwh9tova6lkaosdgluai.png",
  ];

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        pagination={pagination}
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} className="w-full" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Advertistment;

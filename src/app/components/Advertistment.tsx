import React from "react";

function Advertistment() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full ">
        <div className="card w-full bg-base-96 shadow-xl">
          <div className="carousel w-full">
            <div id="item1" className="carousel-item w-full">
              <img
                src="https://res.cloudinary.com/satjay/image/upload/c_fill,g_auto,h_250,w_970/b_rgb:000000,e_gradient_fade,y_-0.50/c_scale,co_rgb:ffffff,fl_relative,l_text:montserrat_25_style_light_align_center:Shop%20Now,w_0.5,y_0.18/v1707388870/wpajf424bbjlqwh0yqfg.png"
                className="w-full"
              />
            </div>
            <div id="item2" className="carousel-item w-full">
              <img
                src="https://daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.jpg"
                className="w-full"
              />
            </div>
            <div id="item3" className="carousel-item w-full">
              <img
                src="https://daisyui.com/images/stock/photo-1414694762283-acccc27bca85.jpg"
                className="w-full"
              />
            </div>
            <div id="item4" className="carousel-item w-full">
              <img
                src="https://daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.jpg"
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-center w-full py-2 gap-2">
            <a href="#item1" className="btn btn-xs">
              1
            </a>
            <a href="#item2" className="btn btn-xs">
              2
            </a>
            <a href="#item3" className="btn btn-xs">
              3
            </a>
            <a href="#item4" className="btn btn-xs">
              4
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Advertistment;

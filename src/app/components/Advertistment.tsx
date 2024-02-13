"use client";
import React, { useEffect, useState } from "react";

import { Circle } from "lucide-react";

function Advertistment() {
  //create roll loop interval for the carousel items using use useEffect and usestate

  const [currentItem, setCurrentItem] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentItem((prevItem) => (prevItem % 4) + 1);
    }, 5000); // Change item every 3 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full ">
        <div className="carousel rounded-box w-full">
          {/* Show the carousel items based on the currentItem state */}
          <div
            id="item1"
            className={`carousel-item w-full slide-right ${
              currentItem === 1 ? "block" : "hidden"
            }`}
          >
            <img
              src="https://res.cloudinary.com/satjay/image/upload/v1707816899/iwh9tova6lkaosdgluai.png"
              className="w-full"
            />
          </div>
          <div
            id="item2"
            className={`carousel-item w-full slide-right ${
              currentItem === 2 ? "block" : "hidden"
            }`}
          >
            <img
              src="https://res.cloudinary.com/satjay/image/upload/v1707816897/ookwjyq7pd9e4mxti0np.png"
              className="w-full"
            />
          </div>
          <div
            id="item3"
            className={`carousel-item w-full slide-right ${
              currentItem === 3 ? "block" : "hidden"
            }`}
          >
            <img
              src="https://res.cloudinary.com/satjay/image/upload/v1707463991/ostxspdeakcsbmuzusrl.png"
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full py-2 gap-2">
        <div
          className={`btn btn-xs ${currentItem === 1 ? "active" : ""}`}
          onClick={() => setCurrentItem(1)}
        >
          <a className="btn btn-xs">
            <Circle size={10} />
          </a>
        </div>

        <div
          className={`btn btn-xs ${currentItem === 2 ? "active" : ""}`}
          onClick={() => setCurrentItem(2)}
        >
          {" "}
          <a className="btn btn-xs">
            <Circle size={10} />
          </a>
        </div>
        <div
          className={`btn btn-xs ${currentItem === 3 ? "active" : ""}`}
          onClick={() => setCurrentItem(3)}
        >
          {" "}
          <a className="btn btn-xs">
            <Circle size={10} />
          </a>
        </div>
      </div>
    </>
  );
}

export default Advertistment;

import React from "react";
import "./HamsterLoader.css"; // Don't forget to import the CSS

const HamsterLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Transparent dark background */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Loader stays on top */}
      <div
        aria-label="Orange and tan hamster running in a metal wheel"
        role="img"
        className="wheel-and-hamster relative z-10"
      >
        <div className="wheel"></div>
        <div className="hamster">
          <div className="hamster__body">
            <div className="hamster__head">
              <div className="hamster__ear"></div>
              <div className="hamster__eye"></div>
              <div className="hamster__nose"></div>
            </div>
            <div className="hamster__limb hamster__limb--fr"></div>
            <div className="hamster__limb hamster__limb--fl"></div>
            <div className="hamster__limb hamster__limb--br"></div>
            <div className="hamster__limb hamster__limb--bl"></div>
            <div className="hamster__tail"></div>
          </div>
        </div>
        <div className="spoke"></div>
      </div>
    </div>
  );
};


export default HamsterLoader;

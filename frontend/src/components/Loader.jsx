import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Transparent dark background */}
      <div className="absolute inset-0  backdrop-blur-sm"></div>
      <div
        className="dots"
        style={{
          "--size": "64px",
          "--dot-size": "6px",
          "--dot-count": "6",
          "--color": "#000000",
          "--speed": "1s",
          "--spread": "60deg",
        }}
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} className="dot" style={{ "--i": i }}></div>
        ))}
      </div>
    </div>
  );
};

export default Loader;

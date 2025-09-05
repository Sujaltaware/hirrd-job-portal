import React from "react";

const GridBackground = () => {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        backgroundColor: "#0a0a0a",
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), 
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
      }}
    ></div>
  );
};

export default GridBackground;

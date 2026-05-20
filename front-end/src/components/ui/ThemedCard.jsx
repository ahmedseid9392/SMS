import React from "react";

const ThemedCard = ({ children, className }) => {
  return (
    <div
      className={`surface-card rounded-[1.5rem] p-6 transition-all duration-300 hover:-translate-y-0.5 ${className || ""}`}
      style={{
        color: "var(--text)",
      }}
    >
      {children}
    </div>
  );
};

export default ThemedCard;

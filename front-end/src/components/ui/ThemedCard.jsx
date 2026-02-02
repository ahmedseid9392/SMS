import React from "react";

const ThemedCard = ({ children, className }) => {
  return (
    <div
      className={`p-6 rounded-xl shadow-md transition ${className}`}
      style={{
        background: "var(--card)",
        color: "var(--text)",
        border: "1px solid var(--border)"
      }}
    >
      {children}
    </div>
  );
};

export default ThemedCard;

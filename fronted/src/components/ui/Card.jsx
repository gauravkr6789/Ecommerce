import React from "react";

const Card = ({
  children,
  className=""
}) => {

  return (
    <div
      className={`
        bg-white
        dark:bg-gray-900
        border
        border-gray-200
        dark:border-gray-700
        rounded-xl
        shadow-lg
        transition
        ${className}
      `}
    >
      {children}
    </div>
  );
};


export default Card;
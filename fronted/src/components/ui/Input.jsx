import React from "react";

const Input = ({
  label,
  className = "",
  ...props
}) => {

  return (
    <div className="w-full">

      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <input
        className={`
          w-full
          px-4
          py-2.5
          rounded-lg
          border
          border-gray-300
          dark:border-gray-700
          bg-white
          dark:bg-gray-900
          text-gray-900
          dark:text-white
          outline-none
          focus:ring-2
          focus:ring-blue-500
          transition
          ${className}
        `}
        {...props}
      />

    </div>
  );
};

export default Input;
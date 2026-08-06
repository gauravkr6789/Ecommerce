import React from "react";

const Button = ({
  children,
  variant = "primary",
  type = "button",
  className = "",
  ...props
}) => {

  const styles = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-800 dark:text-white",

    danger:
      "bg-red-500 hover:bg-red-600 text-white",

    success:
      "bg-green-600 hover:bg-green-700 text-white",

    outline:
      "border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800",
  };


  return (
    <button
      type={type}
      className={`
        px-5 py-2.5
        rounded-lg
        font-medium
        transition-all
        duration-300
        disabled:opacity-50
        ${styles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
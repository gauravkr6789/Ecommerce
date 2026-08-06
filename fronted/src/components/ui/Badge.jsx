import React from "react";


const Badge = ({
  children,
  variant="primary"
}) => {


const colors = {

primary:
"bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",

success:
"bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",

danger:
"bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",

};


return (

<span
className={`
px-3
py-1
rounded-full
text-xs
font-medium
${colors[variant]}
`}
>
{children}
</span>

);

};


export default Badge;
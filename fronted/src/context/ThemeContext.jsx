import React, { createContext, useEffect, useState } from "react";

export const themeContext = createContext();

const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {

        document.documentElement.classList.toggle(
            "dark",
            theme === "dark"
        );

        localStorage.setItem("theme", theme);

    }, [theme]);

    const toggletheme = () => {
        setTheme(prev =>
            prev === "light" ? "dark" : "light"
        );
    };

    return (
        <themeContext.Provider
            value={{ theme, toggletheme }}
        >
            {children}
        </themeContext.Provider>
    );
};

export default ThemeProvider;
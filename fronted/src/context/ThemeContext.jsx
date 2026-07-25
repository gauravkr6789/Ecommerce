import React, { createContext, useState } from "react";

export const themeContext = createContext();

const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState("light");

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
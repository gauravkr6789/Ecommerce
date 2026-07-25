import { themeContext } from "../../context/ThemeContext";
import { useContext } from "react";

export const UseTheme=()=>{
    return useContext(themeContext)
}
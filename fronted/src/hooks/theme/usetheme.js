import { themeContext } from "../../context/ThemeContext";
import { useContext } from "react";

export const useTheme=()=>{
    return useContext(themeContext)
}
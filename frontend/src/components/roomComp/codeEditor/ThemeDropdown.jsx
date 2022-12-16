import React from "react";
import Select from "react-select";
import monacoThemes from "monaco-themes/themes/themelist";
import { customStyles } from "../../../constants/customStyles";
import "./codeEditor.css"



const ThemeDropdown = ({ handleThemeChange, theme }) => {
    return (
    <Select
        // maxMenuHeight={110}
        className="myClassName"
        placeholder={`Select Theme`}
        // options={languageOptions}
        options={Object.entries(monacoThemes).map(([themeId, themeName]) => ({
        label: themeName,
        value: themeId,
        key: themeId,
        }))}
        value={theme}

        styles={customStyles}
        onChange={handleThemeChange}
    />



    // <select name="" id="" onChange={handleThemeChange}>
    //     {
    //         Object.entries(monacoThemes).map(([themeId, themeName])=>(
    //             <option 
    //             key={themeId} 
    //             value={theme}
    //             >
    //                 {themeName}
    //             </option>
    //         ))
    //     }
    // </select>
    );
};

export default ThemeDropdown;
export const customStyles = {
control: (base, _state) => ({
    ...base,
    width: "100%",
    minHeight: '20px', 
    height: '32px',
    maxWidth: "14rem",
    minWidth: "12rem",
    borderRadius: "5px",
    color: "#000",
    fontSize: "0.8rem",
    backgroundColor: "#FFFFFF",
    cursor: "pointer",
    border: "2px solid #000000",
    // boxShadow: "5px 5px 0px 0px rgba(0,0,0);",
    ":hover": {
    border: "2px solid #000000",
    boxShadow: "none",
    display: "flex",
    alignItems: "center"

    },
}),
option: (styles) => {
    return {
    ...styles,
    color: "#000",
    fontSize: "0.8rem",
    // lineHeight: "1.75rem",
    width: "100%",
    background: "#fff",
    zIndex: "1000",
    ":hover": {
        backgroundColor: "rgb(243 244 246)",
        color: "#000",
        cursor: "pointer",
    },
    };
},
menu: (styles) => {
    return {
    ...styles,
    height: "1rem",
    backgroundColor: "#fff",
    maxWidth: "14rem",
    border: "2px solid #000000",
    borderRadius: "5px",
    boxShadow: "5px 5px 0px 0px rgba(0,0,0);",
    zIndex: "1000",
    };
},

placeholder: (defaultStyles) => {
    return {
    ...defaultStyles,
    color: "#000",
    fontSize: "0.8rem",
    // lineHeight: "1rem",
    zIndex: "1000",
    };
},
};
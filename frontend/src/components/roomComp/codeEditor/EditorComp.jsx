import React, { useEffect, useRef, useState } from 'react';
import Editor from "@monaco-editor/react";
import { defineTheme } from "../../../lib/defineTheme";
import ThemeDropdown from "./ThemeDropdown"
import { updateCSSCode, updateJSCode, updateXMLCode } from '../../../http';
import "./codeEditor.css"




const EditorComp = ({language, value, setEditorState, socketRef, roomId, onCodeChange,theme  }) => {

    const editorRef = useRef(null);

    const handleChange = (value,) => {

        async function init() {
            onCodeChange(value);
            setEditorState(value);

            // console.log(editor)
            // console.log(data.text)

            if(language === "html"){

                console.log("this is xml:", language)
                await socketRef.current.emit("XML_CODE_CHANGE", {
                roomId,
                code:value
            });

            await updateXMLCode({xml:value, roomId })
            }

            else if(language === "css"){
                console.log("this is css:", language)
                await socketRef.current.emit("CSS_CODE_CHANGE", {
                    roomId,
                    code:value
                });

                await updateCSSCode({css:value, roomId })

            }

            else {
                console.log("this is js:", language)
                await socketRef.current.emit("JS_CODE_CHANGE", {
                    roomId,
                    code:value
                });
                await updateJSCode({js:value, roomId })
            }
        }
        init();
    }


    useEffect(() => {
        async function init() {

            onCodeChange(value);
            setEditorState(value);

            if( language === "html"){
                console.log("emitting or sending:", language)
                await socketRef.current.emit("XML_CODE_CHANGE", {
                    roomId,
                    code:value
            });
            }
            else if(language === "css"){
                console.log("emitting or sending:", language)
                await socketRef?.current?.emit("CSS_CODE_CHANGE", {
                    roomId,
                    code:value
                });
            }
            else if(language === "javascript") {
                console.log("emitting or sending:", language)
                await socketRef?.current?.emit("JS_CODE_CHANGE", {
                    roomId,
                    code:value
                });
            }
        }

        init();

    }, [value, language, onCodeChange, setEditorState]);



    useEffect(() => {
        if( socketRef?.current && language === "html"){
            socketRef?.current.on("XML_CODE_CHANGE", ({ xml }) => {
                console.log("receiving xml", xml)
                if (xml)  {
                    onCodeChange(xml);
                    setEditorState(xml)
                }
            });
        }

        else if( socketRef.current && language === "css"){
            socketRef?.current?.on("CSS_CODE_CHANGE", ({ css }) => {
                console.log("receiving css", css)
                if (css)  {
                    onCodeChange(css);
                    setEditorState(css)
                }
            });
        }

        else{
            socketRef?.current?.on("JS_CODE_CHANGE", 
            ({ js }) => {
                console.log("receiving js", js)
                if (js)  {
                    onCodeChange(js);
                    setEditorState(js)
                }
            });
        }



        return () => {
            if(language === "html"){
                socketRef?.current?.off("XML_CODE_CHANGE");
            }
            else if(language === "css"){
                socketRef?.current.off("CSS_CODE_CHANGE");
            }
            else{
                socketRef?.current.off("JS_CODE_CHANGE");
            }
        };

    }, [socketRef.current, language, setEditorState]);




return (
<div className="editorContainer">
    <div className='themes'>
        {/* <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} /> */}
    </div>


    <Editor
        onChange={handleChange}
        ref={editorRef}
        value= {value}
        className="code-mirror-wrapper"
        height="100vh"
        width={`100%`}
        theme={theme}
        language={language}
    />
</div>
)
}

export default EditorComp
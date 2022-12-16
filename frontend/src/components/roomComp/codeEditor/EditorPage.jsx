import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import EditorCom from './EditorComp';
import { initSocket } from '../../../socket/editorSocket';
import EditorButton from '../../shared/editorButton/EditorButton';
import {useNavigate,useParams,} from 'react-router-dom';
import "./codeEditor.css"
import { useSelector } from 'react-redux';
import { getRoom } from '../../../http';
import Preview from './Preview';
import JSCompiler from './JSCompiler';
import { languageOptions } from "../../../constants/languageOptions";
import useKeyPress from '../../../hooks/useKeyPress';
import { defineTheme } from '../../../lib/defineTheme';
import ThemeDropdown from './ThemeDropdown';




const EditorPage = () => {

    const user = useSelector((state) => state.auth.user);
    const reactNavigator = useNavigate();

    const [openedEditor, setOpenedEditor] = useState("html");
    const [activeButton, setActiveButton] = useState("html");

    const [language, setLanguage] = useState(languageOptions[0]);
    
    const [codes, setCodes] = useState()
    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");
    const [js, setJs] = useState("");

    const [srcDoc, setSrcDoc] = useState(``);
    const { id: roomId } = useParams();

    // We use useRef hook to persist values between renders
    const socketRef = useRef(null);
    const htmlCodeRef = useRef(null);
    const cssCodeRef = useRef(null);
    const JsCodeRef = useRef(null);

    // ------------------------------
    
    
    useEffect(() => {
        const fetchRoom = async () => {
            const { data } = await getRoom(roomId);
            await setCodes((prev) => data.code[0]);
        };
        fetchRoom();
    }, [])

    useEffect(() => {
        setHtml(codes?.xml)
        setCss(codes?.css);
        setJs(codes?.js)

    }, [codes, setCodes, roomId,]);
    // ------------------------------


    const onTabClick = (editorName) => {
        setOpenedEditor(editorName);
        setActiveButton(editorName);
    };


    //To Render code
    useEffect(() => {
    const timeOut = setTimeout(() => {
        setSrcDoc(
        `
            <html>
                <body>${html}</body>
                <style>${css}</style>
                <script>${js}</script>
            </html>
        `
            )
        }, 400);

        return () => clearTimeout(timeOut)
    }, [html, css, js])



    const enterPress = useKeyPress("Enter");
    const ctrlPress = useKeyPress("Control");

    useEffect(() => {
        if (enterPress && ctrlPress) {
            console.log("enterPress", enterPress);
            console.log("ctrlPress", ctrlPress);
            // handleCompile();
        }
    }, [ctrlPress, enterPress]);


    useEffect(() => {
        const init = async ()=> {
            socketRef.current = await initSocket()
            // console.log(socketRef)

            // Error handling
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));
            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            // Send roomId and user to server
            socketRef.current.emit("JOIN", {
                roomId,
                username: user?.name,
            });

            // Listening for joined event
            socketRef.current.on(
                "JOINED",
                ({ clients, username, socketId }) => {
                    if (username !== user) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                }
            );
        }
        
        init()

        return () => {
            socketRef.current.disconnect();
            socketRef.current.off("JOINED");
            socketRef.current.off("DISCONNECTED");
        };
    }, []);




    // ------------------------------------
    const [theme, setTheme] = useState("cobalt")
    
    function handleThemeChange(th) {
        const theme = th;
        console.log("theme...", theme);
    
        if (["light", "vs-dark"].includes(theme.value)) {
        setTheme(theme);
    } else {
        defineTheme(theme.value).then((_) => setTheme(theme));
    }}

    useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
        setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
    }, []);
    


    return (
        <div className="mainWrap">
            <div className='colsWrapper'>
                <div className="editorWrap">
                    <div className='topWrapEditor'>
                        <div className='buttons'>
                            <EditorButton
                            backgroundColor={activeButton === "html" ? "green" : ""}
                            title="HTML"
                            onClick={() => {
                                onTabClick("html");
                            }}
                            />
                            <EditorButton
                            backgroundColor={activeButton === "css" ? "green" : ""}
                            title="CSS"
                            onClick={() => {
                                onTabClick("css");
                            }}
                            />
                            <EditorButton
                            backgroundColor={activeButton === "js" ? "green" : ""}
                            title="JavaScript"
                            onClick={() => {
                                onTabClick("js");
                            }}
                            />
                            <EditorButton
                            backgroundColor={activeButton === "preview" ? "green" : ""}
                            title="Preview"
                            onClick={() => {
                                onTabClick("preview");
                            }}
                            />
                            <EditorButton
                            backgroundColor={activeButton === "compiler" ? "green" : ""}
                            title="Compiler"
                            onClick={() => {
                                onTabClick("compiler");
                            }}
                            />
                            <ThemeDropdown handleThemeChange={handleThemeChange} 
                            theme={theme} />
                        </div>

                        <div className='editors'>
                            {
                                openedEditor === "html" ? (
                                    <EditorCom
                                    language={languageOptions[0].value}
                                    theme={theme.value}
                                    value={html}
                                    setEditorState={setHtml}
                                    socketRef={socketRef}
                                    roomId={roomId}
                                    onCodeChange={(code) => {
                                        htmlCodeRef.current = code;
                                    }}/>
                                ): openedEditor === "css" ? (
                                    <EditorCom
                                    language={languageOptions[1].value}
                                    value={css}
                                    theme={theme.value}
                                    setEditorState={setCss}
                                    socketRef={socketRef}
                                    roomId={roomId}
                                    onCodeChange={(code) => {
                                        cssCodeRef.current = code;
                                    }}/>
                                ): openedEditor === "js" ? (
                                    <EditorCom
                                    language={languageOptions[2].value}
                                    value={js}
                                    theme={theme.value}
                                    setEditorState={setJs}
                                    socketRef={socketRef}
                                    roomId={roomId}
                                    onCodeChange={(code) => {
                                        JsCodeRef.current = code;
                                    }}/>
                                ): openedEditor === "preview" ? (
                                    <Preview
                                    srcDoc={srcDoc}
                                    />
                                ): (
                                    <JSCompiler
                                    js={js}
                                    srcDoc={srcDoc}
                                    />
                                )
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;
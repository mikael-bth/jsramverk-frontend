import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import Editor from './editor';
import docsModel from '../models/docs';

function DocToolbar() {
    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState({});
    const [socket, setSocket] = useState(null);
    const [docLoaded, setDocLoaded] = useState(false);
    const cursorPos = useRef([]);

    useEffect(() => {
        (async () => {
            const allDocs = await docsModel.getAllDocs();
            setDocs(allDocs);
        })();
        const socket = io(docsModel.getURL());
        socket.on("connect", () => {
            setSocket(socket);
        });

        socket.on("doc", (doc) => {
            const trixEditor = document.querySelector("trix-editor");
            if (doc.html !== trixEditor.innerHTML) {
                cursorPos.current = trixEditor.editor.getSelectedRange();
                trixEditor.innerHTML = doc.html;
                trixEditor.editor.setSelectedRange(cursorPos.current);
            }
        });

        if (Object.keys(currentDoc).length !== 0) {
            socket.emit("create", currentDoc["_id"]);
            socket.emit("doc", currentDoc);
        }
        
        return () => {
            socket.disconnect();
            setSocket(null);
        };
    }, [currentDoc]);

    async function handleEditorChange(html, text) {
        if (docLoaded) {
            const updatedDoc = currentDoc;
            updatedDoc.html = html;
            socket.emit("doc", updatedDoc);
            await docsModel.updateDoc(updatedDoc);
        }
    }

    async function loadDoc() {
        setDocLoaded(false);
        const trixEditor = document.querySelector("trix-editor");
        const docSelect = document.getElementById("docSelect");
        const selectedDoc = docSelect.options[docSelect.selectedIndex].value;
        if (selectedDoc === "-99") {
            return;
        }

        const activeDoc = document.getElementById("activeDoc");
        const loadedDoc = await docsModel.getDoc(selectedDoc);

        setCurrentDoc(loadedDoc[0]);
        trixEditor.innerHTML = loadedDoc[0].html;
        activeDoc.innerHTML = loadedDoc[0].name;
        setDocLoaded(true);
    }

    async function openCreate() {
        const createWindow = document.getElementById("docCreate");
        const createBG = document.getElementById("docCreateBG");
        createWindow.style.display = "flex"
        createBG.style.display = "block"
    }

    async function createDoc() {
        setDocLoaded(false);
        const docName = document.getElementById("name").value;

        if (docName === "") {
            alert("Inget namn valt");
            return;
        }
        if (nameTaken()) {
            alert("Ett dokument med det namnet finns redan");
            return;
        }

        const activeDoc = document.getElementById("activeDoc");
        const trixEditor = document.querySelector("trix-editor");

        let newDoc = {
            name: docName,
            html: trixEditor.innerHTML
        }
        const response = await docsModel.createDoc(newDoc);
        newDoc["_id"] = response.id;
        setCurrentDoc(newDoc);
        trixEditor.innerHTML = "";
        activeDoc.innerHTML = docName;
        setDocLoaded(true);
        closeCreate();

        function nameTaken() {
            let taken = false;
            for (const doc of docs) {
                if (doc.name === docName) {
                    taken = true;
                }
            }
            return taken;
        }
    }

    async function reloadDocSelect() {
        const allDocs = await docsModel.getAllDocs();
        setDocs(allDocs);
    }

    function closeCreate() {
        const createWindow = document.getElementById("docCreate");
        const createBG = document.getElementById("docCreateBG");
        createWindow.style.display = "none"
        createBG.style.display = "none"
    }

    return <div>
    <div className="docToolbar">
        <button id="reload" name="reload" value={"&#8635;"} onClick={reloadDocSelect} readOnly>&#8635;</button>
        <p id="activeDoc"></p>
        <select id="docSelect" readOnly>
            <option value="-99" key="0" readOnly>-- Dokument -- </option>
            {docs.map((doc, index) => <option value={doc.name} key={index} readOnly>{doc.name}</option>)}
        </select>
        <input id="load" name="load" value={"Ladda dokument"} onClick={loadDoc} readOnly></input>
        <input id="new"  name="new"  value={"Nytt dokument"}  onClick={openCreate} readOnly></input>
        <div id="docCreateBG" onClick={closeCreate}></div>
        <div id="docCreate">
            <input id="name" name="name" type="text" placeholder="NAMN"></input>
            <input id="create" name="create" value={"Skapa"} onClick={createDoc} readOnly></input>
        </div>
    </div>
    <Editor handleChange={handleEditorChange}></Editor>
    </div>;
}

export default DocToolbar;
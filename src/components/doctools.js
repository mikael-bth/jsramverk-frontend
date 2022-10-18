import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

import docsModel from '../models/docs';

function DocToolbar() {
    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState({});
    const [socket, setSocket] = useState(null);
    const trixEditor = document.querySelector("trix-editor");


    useEffect(() => {
        (async () => {
            const allDocs = await docsModel.getAllDocs();
            setDocs(allDocs);
        })();
        const socket = io(docsModel.getURL());
        socket.on("connect", () => {
            console.log(socket.id);
            setSocket(socket);
        });

        return () => {
            console.log("here");
            socket.disconnect();
            setSocket(null);
        };
    }, [currentDoc]);

    useEffect(() => {

    })

    async function loadDoc() {
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
    }

    async function saveDoc() {
        if (Object.keys(currentDoc).length === 0) {
            openCreate();
            return;
        }

        const updatedDoc = {
            name: currentDoc.name,
            html: trixEditor.innerHTML
        }
        await docsModel.updateDoc(updatedDoc);
    }

    async function openCreate() {
        const createWindow = document.getElementById("docCreate");
        const createBG = document.getElementById("docCreateBG");
        createWindow.style.display = "flex"
        createBG.style.display = "block"
    }

    async function createDoc() {
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

        let newDoc = {
            name: docName,
            html: trixEditor.innerHTML
        }
        const response = await docsModel.createDoc(newDoc);
        newDoc["_id"] = response.id;
        setCurrentDoc(newDoc);
        activeDoc.innerHTML = docName;
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

    function closeCreate() {
        const createWindow = document.getElementById("docCreate");
        const createBG = document.getElementById("docCreateBG");
        createWindow.style.display = "none"
        createBG.style.display = "none"
    }

    return <div className="docToolbar">
        <p id="activeDoc"></p>
        <select id="docSelect">
            <option value="-99" key="0">-- Dokument -- </option>
            {docs.map((doc, index) => <option value={doc.name} key={index}>{doc.name}</option>)}
        </select>
        <input id="load" name="load" value={"Ladda dokument"} onClick={loadDoc}></input>
        <input id="new"  name="new"  value={"Nytt dokument"}  onClick={openCreate}></input>
        <input id="save" name="save" value={"Spara"}  onClick={saveDoc}></input>
        <div id="docCreateBG" onClick={closeCreate}></div>
        <div id="docCreate">
            <input id="name" name="name" type="text" placeholder="NAMN"></input>
            <input id="create" name="create" value={"Skapa"} onClick={createDoc}></input>
        </div>
    </div>;
}

export default DocToolbar;
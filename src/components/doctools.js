import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import Editor from './editor';
import docsModel from '../models/docs';

function DocToolbar() {
    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState({});
    const [activeDocName, setActiveDocName] = useState("");
    const [socket, setSocket] = useState(null);
    const [docLoaded, setDocLoaded] = useState(false);
    const cursorPos = useRef([]);
    const [docUsers, setDocUsers] = useState([]);

    if (sessionStorage.getItem("logOut")) {
        sessionStorage.removeItem("logOut");
        const trixEditor = document.querySelector("trix-editor");
        const docPermission = document.getElementById("openPermission");
        trixEditor.innerHTML = "";
        trixEditor.editor.setSelectedRange(0, 0);
        docPermission.style.display = "none";
        setActiveDocName("");
        setCurrentDoc({})
    }

    useEffect(() => {
        (async () => {
            const allDocs = await docsModel.getDocNameList();
            console.log(allDocs);
            setDocs(allDocs);
        })();
        const socket = io(docsModel.getURL());
        socket.on("connect", () => {
            setSocket(socket);
        });

        socket.on("doc", (doc) => {
            setEditorText(doc.html);
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

    function setEditorText(html) {
        const trixEditor = document.querySelector("trix-editor");
        cursorPos.current = trixEditor.editor.getSelectedRange();
        trixEditor.editor.setSelectedRange(0, 0);
        trixEditor.innerHTML = html;
        trixEditor.editor.setSelectedRange(cursorPos.current);
    }

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
        const docSelect = document.getElementById("docSelect");
        const selectedDoc = docSelect.options[docSelect.selectedIndex].value;
        if (selectedDoc === "-99") {
            return;
        }

        const trixEditor = document.querySelector("trix-editor");
        const docPermission = document.getElementById("openPermission");
        try {
            const loadedDoc = await docsModel.getDoc(selectedDoc);
            setCurrentDoc(loadedDoc[0]);
            setDocUsers(loadedDoc[0].users);
            trixEditor.innerHTML = loadedDoc[0].html;
            setActiveDocName(loadedDoc[0].name);
            docPermission.style.display = "block";
            setDocLoaded(true);
        } catch (error) {
            alert(error);
        }
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

        const docPermission = document.getElementById("openPermission");
        const trixEditor = document.querySelector("trix-editor");

        let newDoc = {
            name: docName,
            html: ""
        }
        try {
            await docsModel.createDoc(newDoc);
            const createdDoc = await docsModel.getDoc(newDoc.name);
            setCurrentDoc(createdDoc[0]);
            setDocUsers(createdDoc[0].users);
            setActiveDocName(docName);
            trixEditor.innerHTML = "";
            docPermission.style.display = "block";
            setDocLoaded(true);
        } catch (error) {
            alert(error);
        }
        
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
        const allDocs = await docsModel.getDocNameList();
        setDocs(allDocs);
    }

    function closeCreate() {
        const createWindow = document.getElementById("docCreate");
        const createBG = document.getElementById("docCreateBG");
        createWindow.style.display = "none"
        createBG.style.display = "none"
    }

    function openPermission() {
        const permissionWindow = document.getElementById("docPermission");
        permissionWindow.style.display = "block";
    }

    function closePermission() {
        const permissionWindow = document.getElementById("docPermission");
        permissionWindow.style.display = "none";
    }

    async function addUserPermission() {
        const newUser = document.getElementById("newUser").value;
        if (newUser === "") return;
        if (currentDoc.users.includes(newUser)) {
            alert("User already has permission to edit this document");
            return;
        }
        const update = {
            name: currentDoc.name,
            user: newUser,
            method: "add"
        }
        await docsModel.updatePermission(update);
        const updatedDoc = await docsModel.getDoc(currentDoc.name);
        setCurrentDoc(updatedDoc[0]);
        setDocUsers(updatedDoc[0].users);
    }

    async function removeUserPermission(data) {
        if (currentDoc.users.length === 1) {
            alert("Can't remove, you need atleast one user with permission to the document");
            return;
        }
        const user = data.target.value;
        const update = {
            name: currentDoc.name,
            user: user,
            method: "remove"
        }
        await docsModel.updatePermission(update);
        let updatedDoc
        try {
            updatedDoc = await docsModel.getDoc(currentDoc.name);
        } catch (e) {
            alert(e);
            const docPermission = document.getElementById("openPermission");
            const trixEditor = document.querySelector("trix-editor");
            trixEditor.innerHTML = "";
            setActiveDocName("");
            docPermission.style.display = "none";
            closePermission();
            setCurrentDoc({});
            return;
        }
        setCurrentDoc(updatedDoc[0]);
        setDocUsers(updatedDoc[0].users);
    }

    return <div>
    <div className="docToolbar">
        <button id="reload" name="reload" onClick={reloadDocSelect} readOnly>&#8635;</button>
        <div id="docInfo">
            <p id="activeDoc">{activeDocName}</p>
            <button id="openPermission" name="openPermission" onClick={openPermission} title="Change document permissions" readOnly>&#128101;</button>
        </div>
        <div id="docPermission">
            <div id="permissionHeader">
                <button id="closePermission" name="closePermission" onClick={closePermission} readOnly>&#10006;</button>
                <p>{activeDocName}s allowed users</p>
            </div>
            <ul>
                {docUsers.map((user, index) => <li value={user} key={index} readOnly>
                    {user}
                    <button value={user} onClick={removeUserPermission} title={`Ta bort ${user}`} readOnly>&#10006;</button>
                </li>)}
            </ul>
            <div>
                <input id="newUser" name="newUser" placeholder="Ny användare" type="text"></input>
                <input id="addUser" name="addUser" value={"Lägg till"} onClick={addUserPermission} readOnly></input>
            </div>
        </div>
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
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import Editor from './editor';
import docsModel from '../models/docs';
import pdfModel from '../models/pdf';
import commentsModel from "../models/comments";

function DocToolbar() {
    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState({});
    const [activeDocName, setActiveDocName] = useState("");
    const [socket, setSocket] = useState(null);
    const [updateDB, setUpdateDB] = useState(false);
    const cursorPos = useRef([]);
    const [docUsers, setDocUsers] = useState([]);
    const [lineElemets, setLineElements] = useState([]);
    const [docComments, setDocComments] = useState([]);

    if (sessionStorage.getItem("logOut")) {
        sessionStorage.removeItem("logOut");
        window.location.reload();
    }

    useEffect(() => {
        (async () => {
            const allDocs = await docsModel.getDocNameList();
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

    async function handleEditorChange(html, text) {
        if (updateDB) {
            console.log("here");
            const updatedDoc = currentDoc;
            updatedDoc.html = html;
            socket.emit("doc", updatedDoc);
            await docsModel.updateDoc(updatedDoc);
        }
        const trixEditor = document.querySelector("trix-editor");
        const documentString = trixEditor.editor.getDocument().toString();
        const documentLines = documentString.split(/\r?\n/).length;
        let elementList = [];
        for (let i = 1; i < documentLines; i++) {
            elementList.push(<p id={i} key={i} onClick={openNewComment}
                title={`Add comment on line ${i}`}>+</p>)
        }
        setLineElements(elementList);
    }

    function setEditorText(html) {
        const trixEditor = document.querySelector("trix-editor");
        cursorPos.current = trixEditor.editor.getSelectedRange();
        trixEditor.editor.setSelectedRange(0, 0);
        trixEditor.innerHTML = html;
        trixEditor.editor.setSelectedRange(cursorPos.current);
    }

    function openLoadedDoc(loadedDoc) {
        const docPermission = document.getElementById("openPermission");
        const pdfButton = document.getElementById("createPDF");
        docPermission.style.display = "block";
        pdfButton.style.display = "block";
        setDocUsers(loadedDoc.users);
        setEditorText(loadedDoc.html);
        setActiveDocName(loadedDoc.name);
        setCurrentDoc(loadedDoc);
    }

    async function loadDoc() {
        setUpdateDB(false);
        const docSelect = document.getElementById("docSelect");
        const selectedDoc = docSelect.options[docSelect.selectedIndex].value;
        if (selectedDoc === "-99") {
            return;
        }

        try {
            const loadedDoc = await docsModel.getDoc(selectedDoc);
            const docComments = await commentsModel.getDocComments(selectedDoc);
            openLoadedDoc(loadedDoc[0]);
            setDocComments(docComments);
            setUpdateDB(true);
        } catch (error) {
            alert(error);
        }
    }

    async function createDoc() {
        setUpdateDB(false);
        const docName = document.getElementById("name").value;

        if (docName === "") {
            alert("Inget namn valt");
            return;
        }
        if (nameTaken()) {
            alert("Ett dokument med det namnet finns redan");
            return;
        }

        const newDoc = {
            name: docName,
            html: ""
        }
        try {
            await docsModel.createDoc(newDoc);
            const createdDoc = await docsModel.getDoc(newDoc.name);
            const docComments = await commentsModel.getDocComments(newDoc.name);
            openLoadedDoc(createdDoc[0]);
            setDocComments(docComments);
            setUpdateDB(true);
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
        try {
            const updatedDoc = await docsModel.getDoc(currentDoc.name);
            setCurrentDoc(updatedDoc[0]);
            setDocUsers(updatedDoc[0].users);
        } catch (e) {
            window.location.reload();
            alert(e);
        }
    }

    async function addComment() {
        const commentLine = document.getElementById("commentLine");
        const commentElement = document.getElementById("comment");
        const line = commentLine.innerHTML;
        const comment = commentElement.value;
        const newComment = {
            name: activeDocName,
            comment: {
                line: line,
                comment: comment
            }
        }
        await commentsModel.createComment(newComment);
        const updatedComments = await commentsModel.getDocComments(activeDocName);
        setDocComments(updatedComments);
        closeNewComment();
    }

    function filteredDocComments() {
        if (docComments.length === 0 || docComments.comments.length === 0) {
            return [];
        }

        const filteredComments = {};
        for (const comment of docComments.comments) {
            const commentInstance = {
                comment: comment.comment,
                author: comment.author
            }
            if (filteredComments.hasOwnProperty(comment.line)) {
                filteredComments[comment.line].push(commentInstance);
                continue;
            }
            filteredComments[comment.line] = [commentInstance];
        }
        const commentElements = [];
        for (const key in filteredComments) {
            const lineArray = filteredComments[key];
            const lineElement =  <input value={`Rad ${key} kommentarer`} id={key} className="lineInput" key={key} onClick={showLineComments} readOnly></input>
            const comments = lineArray.map((comment, index) => <div className={"lineComment" + key} id="lineComment" key={index}>
                <h3>{comment.author}:</h3>
                <p>{comment.comment}</p>
            </div>);
            const commentElement = []
            commentElement.push(lineElement);
            commentElement.push(comments);
            commentElements.push(commentElement);
        }
        return commentElements;
    }

    function showLineComments(data) {
        const line = data.target.id;
        const comments = document.getElementsByClassName(`lineComment${line}`);
        for (const comment of comments) {
            const commentStyle = getComputedStyle(comment);
            if (commentStyle.display === "block") {
                comment.setAttribute("style", "display:none;");
                continue;
            }
            comment.setAttribute("style", "display:block;");
        }
    }

    async function createPDF() {
        const trixEditor = document.querySelector("trix-editor");
        pdfModel.savePDF(trixEditor, currentDoc.name);
    }

    async function reloadDocSelect() {
        const allDocs = await docsModel.getDocNameList();
        setDocs(allDocs);
    }

    async function openCreate() {
        const createWindow = document.getElementById("docCreate");
        const createBG = document.getElementById("docCreateBG");
        createWindow.style.display = "flex"
        createBG.style.display = "block"
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

    function openNewComment(data) {
        const createWindow = document.getElementById("newComment");
        const createBG = document.getElementById("newCommentBG");
        const commentInfo = document.getElementById("newCommentInfo");
        const commentLine = document.getElementById("commentLine");
        const line = data.target.id;
        commentInfo.innerHTML = `Lägg till kommentar<br>Rad: ${line}`;
        commentLine.innerHTML = line;
        createWindow.style.display = "flex";
        createBG.style.display = "block";
    }

    function closeNewComment() {
        const createWindow = document.getElementById("newComment");
        const createBG = document.getElementById("newCommentBG");
        createWindow.style.display = "none";
        createBG.style.display = "none";
    }

    return <div>
    <div className="docToolbar">
        <button id="reload" name="reload" onClick={reloadDocSelect} readOnly>&#8635;</button>
        <div id="docInfo">
            <p id="activeDoc">{activeDocName}</p>
            <button id="openPermission" name="openPermission" onClick={openPermission} title="Change document permissions" readOnly>&#128101;</button>
            <button id="createPDF" name="createPDF" onClick={createPDF} title="Save the document as a PDF" readOnly>
                <img src="https://cdn-icons-png.flaticon.com/512/29/29099.png" alt="pdf"></img>
            </button>
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
        <div id="newCommentBG" onClick={closeNewComment}></div>
        <div id="newComment">
            <p id="commentLine"></p>
            <p id="newCommentInfo"></p>
            <textarea id="comment" name="comment" wrap="soft" placeholder="KOMMENTAR"></textarea>
            <input id="createComment" name="createComment" value={"Lägg till"} onClick={addComment} readOnly></input>
        </div>
    </div>
    <div className="editorContainer">
        <Editor handleChange={handleEditorChange}></Editor>
        <div className="editorSidebar">
            <div id="linesMarker">
                { lineElemets }
            </div>
            <div>
                <h2>Comments</h2>
                <div className="commentsContainer">
                    {filteredDocComments().map((comment, index) => <div className="comments" key={index} readOnly>{comment}</div>)}
                </div>
            </div>
        </div>
    </div>
    </div>;
}

export default DocToolbar;
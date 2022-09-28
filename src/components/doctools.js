import React, { useState, useEffect } from "react";

import docsModel from '../models/docs';


function DocToolbar() {
    const [docs, setDocs] = useState([]);
    const [currentDoc, setCurrentDoc] = useState({});

    useEffect(() => {
        (async () => {
            const allDocs = await docsModel.getAllDocs();
            setDocs(allDocs);
        })();
    }, [currentDoc]);

    async function loadDoc() {
        const trixEditor = document.querySelector("trix-editor")
        const docSelect = document.getElementById("docSelect")
        const selectedDoc = docSelect.options[docSelect.selectedIndex].value;
        if (selectedDoc === "-99") {
            setCurrentDoc({});
            trixEditor.innerHTML = "";
            return;
        }
        const loadedDoc = await docsModel.getDoc(selectedDoc);
        setCurrentDoc(loadedDoc[0]);
        trixEditor.innerHTML = loadedDoc[0].html;
    }

    async function saveDoc() {
        const trixEditor = document.querySelector("trix-editor")
        if (Object.keys(currentDoc).length === 0) {
            console.log("empty")
        }
        const updatedDoc = {
            name: currentDoc.name,
            html: trixEditor.innerHTML
        }
        console.log(updatedDoc);
        await docsModel.updateDoc(updatedDoc);
        }

    return <div>
        <select id="docSelect">
            <option value="-99" key="0">Nytt dokument</option>
            {docs.map((doc, index) => <option value={doc.name} key={index}>{doc.name}</option>)}
        </select>;
        <input id="load" name="load" value={"Ladda dokument"} onClick={loadDoc}></input>
        <input id="save" name="save" value={"Spara"} onClick={saveDoc}></input>;
    </div>
}

export default DocToolbar;
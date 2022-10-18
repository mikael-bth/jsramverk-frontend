let SERVER_URL = 'http://localhost:1337/'
if (window.location.href.includes("student")) {
    SERVER_URL = 'https://jsramverk-editor-mimn21.azurewebsites.net/';
}

const docs = {
    getAllDocs: async function getAllDocs() {
        const response = await fetch(`${SERVER_URL}docs`);
        const result = await response.json();

        return result;
    },

    getDoc: async function getDoc(name) {
        const response = await fetch(`${SERVER_URL}doc/${name}`);
        const result = await response.json();

        return result;
    },

    createDoc: async function createDoc(newDoc) {
        const response = await fetch(`${SERVER_URL}create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDoc)
        });
        return await response.json();
    },

    updateDoc: async function updateDoc(updatedDoc) {
        const response = await fetch(`${SERVER_URL}update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedDoc),
        });
        return response.status;
    },

    getURL: function getURL() {
        return SERVER_URL;
    },
};

export default docs;
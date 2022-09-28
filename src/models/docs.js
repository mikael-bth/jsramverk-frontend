const baseURL = 'http://localhost:1337/'

const docs = {
    getAllDocs: async function getAllDocs() {
        const response = await fetch(`${baseURL}docs`);
        const result = await response.json();

        return result;
    },

    getDoc: async function getDoc(name) {
        const response = await fetch(`${baseURL}doc/${name}`);
        const result = await response.json();

        return result;
    },

    createDoc: async function createDoc(newDoc) {
        const response = await fetch(`${baseURL}create`, {
            method: 'POST',
            body: JSON.stringify(newDoc)
        });
    },

    updateDoc: async function updateDoc(updatedDoc) {
        const docTest = {
            name: updatedDoc.name,
            html: updatedDoc.html
        }
        console.log(docTest);
        const response = await fetch(`${baseURL}update`, {
            method: 'PUT',
            body: JSON.stringify(docTest),
            headers: { 'content-type': 'application/json' },
        });
        console.log(response);
    },
};

export default docs;
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDoc)
        });
        return response.status;
    },

    updateDoc: async function updateDoc(updatedDoc) {
        const response = await fetch(`${baseURL}update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedDoc),
        });
        return response.status;
    },
};

export default docs;
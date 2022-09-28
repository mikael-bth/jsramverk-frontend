const docs = {
    getAllDocs: async function getAllDocs() {
        const response = await fetch('localhost:1337/docs');
        const result = await response.json();

        return result.data;
    },

    getDoc: async function getDoc(name) {
        const response = await fetch(`localhost:1337/doc/${name}`);
        const result = await response.json();

        return result.data;
    },

    createDoc: async function createDoc(newDoc) {
        const response = await fetch('localhost:1337/create', {
            method: "POST",
            body: JSON.stringify(newDoc),
            headers: {
                'content-type': 'application/json'
            },
        });
    },

    updateDoc: async function updateDoc(updatedDoc) {
        const response = await fetch('localhost:1337/update', {
            method: "PUT",
            body: JSON.stringify(updatedDoc),
            headers: {
                'content-type': 'application/json'
            },
        });
    },
};

export default docs;
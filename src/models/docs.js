const docs = {
    getAllDocs: async function getAllDocs() {
        const response = await fetch('localhost:1337/docs');
        const result = await response.json();

        return result.data;
    },
};

export default docs;
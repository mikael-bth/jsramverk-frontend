import usersModel from './users';

let SERVER_URL = 'http://localhost:1337/'
if (window.location.href.includes("student")) {
    SERVER_URL = 'https://jsramverk-editor-mimn21.azurewebsites.net/';
}

const docs = {
    getDocNameList: async function getDocNameList() {
        const response = await fetch(`${SERVER_URL}graphql`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: "{ docs { name } }" }),
        });
        const result = await response.json();
        return result.data.docs;
    },

    getDoc: async function getDoc(name) {
        const token = usersModel.getToken();
        if (!token) {
            throw new Error("Need to be logged in to do this.")
        }
        const response = await fetch(`${SERVER_URL}doc/${name}`, {
            headers: { 'x-access-token': token},
        });
        const result = await response.json();
        if (result.message) {
            throw new Error(result.message);
        }

        return result;
    },

    createDoc: async function createDoc(newDoc) {
        const token = usersModel.getToken();
        if (!token) {
            throw new Error("Need to be logged in to do this.")
        }
        const response = await fetch(`${SERVER_URL}create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
            'x-access-token': token},
            body: JSON.stringify(newDoc)
        });
        return await response.json();
    },

    updateDoc: async function updateDoc(updatedDoc) {
        const response = await fetch(`${SERVER_URL}update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(updatedDoc),
        });
        return response.status;
    },

    updatePermission: async function updatePermission(update) {
        const response = await fetch(`${SERVER_URL}updatepermission`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(update),
        });
        return response.status;
    },

    getURL: function getURL() {
        return SERVER_URL;
    },
};

export default docs;
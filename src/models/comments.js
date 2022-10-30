import usersModel from './users';

let SERVER_URL = 'http://localhost:1337/'
if (window.location.href.includes("student")) {
    SERVER_URL = 'https://jsramverk-editor-mimn21.azurewebsites.net/';
}

const comments = {
    getDocComments: async function getDocComments(docName) {
        const query = `{ documentComments(docName: "${docName}") {
            name,
            comments {
                line,
                comment,
                author
            }
        }}`;
        const response = await fetch(`${SERVER_URL}graphql`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query: query })
        });
        const result = await response.json();
        return result.data.documentComments;
    },

    createComment: async function createComment(newComment) {
        const token = usersModel.getToken();
        if (!token) {
            throw new Error("Need to be logged in to do this.")
        }
        const response = await fetch(`${SERVER_URL}createcomment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
            'x-access-token': token},
            body: JSON.stringify(newComment)
        });
        return await response.json();
    },
};

export default comments;
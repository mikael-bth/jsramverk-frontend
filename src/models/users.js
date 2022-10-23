let SERVER_URL = 'http://localhost:1337/'
if (window.location.href.includes("student")) {
    SERVER_URL = 'https://jsramverk-editor-mimn21.azurewebsites.net/';
}

const users = {
    login: async function login(user) {
        const response = await fetch(`${SERVER_URL}login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        return await response.json();
    },

    register: async function register(user) {
        const response = await fetch(`${SERVER_URL}register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        return await response.json();
    },

    verifyToken: async function verifyToken(token) {
        const response = await fetch(`${SERVER_URL}verify`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
            'x-access-token': token},
        });
        return await response.json();
    },

    logOut: function logOut() {
        sessionStorage.removeItem("token")
    },

    setToken: function setToken(token) {
        sessionStorage.setItem("token", token)
    },

    getToken: function getToken() {
        return sessionStorage.getItem("token");
    },
};

export default users;
import React, { useState, useEffect } from "react";

import usersModel from '../models/users';

function UserToolbar() {
    const [user, setUser] = useState(null);
    const [formFields, setFormFields] = useState(null);

    if (user === null && usersModel.getToken()) {
        const token = usersModel.getToken();
        verifyUser(token);
    }

    async function verifyUser(token) {
        const result = await usersModel.verifyToken(token);
        if (!result.message) {
            setUser(result.data.username);
            return;
        }
        usersModel.logOut();
    }

    useEffect(() => {
        const formContainer = document.querySelector("#formContainer");
        const containerHeight = formContainer.clientHeight;
        const containerElement = document.getElementById("formContainer");
        const heightOffset = containerHeight / 2;
        containerElement.style.top = `calc(50% - ${heightOffset}px)`;
    }, [formFields]);

    function userLogin() {
        const formBG = document.getElementById("formBG");
        const formContainer = document.getElementById("formContainer");
        formBG.style.display = "block";
        formContainer.style.display = "flex"
        const loginFields = <fieldset>
            <legend>Login</legend>
            <label htmlFor="username">Användarnamn:</label>
            <input id="username" name="username" type="text"></input>
            <label htmlFor="password">Lösenord:</label>
            <input id="password" name="password" type="password"></input>
            <input id="submit" name="submit" value={"Logga in"} onClick={sendForm} readOnly></input>
        </fieldset>
        setFormFields(loginFields);
    }

    function closeForm() {
        const formBG = document.getElementById("formBG");
        const formContainer = document.getElementById("formContainer");
        formBG.style.display = "none";
        formContainer.style.display = "none";
        setFormFields(null);
    }

    function userRegister() {
        const formBG = document.getElementById("formBG");
        const formContainer = document.getElementById("formContainer");
        formBG.style.display = "block";
        formContainer.style.display = "flex"
        const registerFields = <fieldset>
            <legend>Register</legend>
            <label htmlFor="username">Användarnamn:</label>
            <input id="username" name="username" type="text"></input>
            <label htmlFor="password">Lösenord:</label>
            <input id="password" name="password" type="password"></input>
            <input id="submit" name="submit" value={"Registrera"} onClick={sendForm} readOnly></input>
        </fieldset>
        setFormFields(registerFields);
    }

    function userLogOut() {
        const formBG = document.getElementById("formBG");
        const formContainer = document.getElementById("formContainer");
        formBG.style.display = "block";
        formContainer.style.display = "flex"
        const logOutFields = <fieldset>
            <legend>Log out</legend>
            <input id="username" name="username" type="text" value={user} readOnly></input>
            <input id="submit" name="submit" value={"Logga ut"} onClick={sendForm} readOnly></input>
        </fieldset>
        setFormFields(logOutFields);
    }

    async function sendForm(data) {
        switch (data.target.value) {
            case "Logga ut": {
                setUser(null);
                usersModel.logOut();
                sessionStorage.setItem("logOut", "true");
                closeForm();
                break;
            }

            case "Logga in": {
                const user = {
                    username: data.target.form[1].value,
                    password: data.target.form[2].value
                }
                const res = await usersModel.login(user);
                if (res.message) {
                    alert(res.message);
                    break;
                }
                setUser(user.username);
                usersModel.setToken(res.token);
                closeForm();
                break;
            }

            case "Registrera": {
                const user = {
                    username: data.target.form[1].value,
                    password: data.target.form[2].value
                }
                const res = await usersModel.register(user);
                if (res.message) {
                    alert(res.message);
                    break;
                }
                closeForm();
                break;
            }

            default: 
                console.log("Unknown form");
                break;
        }
    }

    return <div>
        <div className="userInputs">
        {user === null
        ? <div>
            <input id="login" name="login" value={"Login"} onClick={userLogin} readOnly></input>
            <input id="register" name="register" value={"Register"} onClick={userRegister} readOnly></input>
        </div>
        :<div>
            <input id="user" name="user" value={user} readOnly></input>
            <input id="logout" name="logout" value={"Log out"} onClick={userLogOut} readOnly></input>
        </div>
        }
        </div>
        <div id="formBG" onClick={closeForm}></div>
        <div id="formContainer">
            <form id="userForm">
                {formFields}
            </form>
        </div>
    </div>;
}

export default UserToolbar;
"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";
import { sessionManager } from "/js/utils/session.js";

function main() {
    showLoggedUsername();
    addLogoutHandler(); // Manejador del Logout
    // hideElements();
}


function hideElements() {
    let loginLink = document.getElementById("header-login");
    let registerLink = document.getElementById("header-register");
    let uploadLink = document.getElementById("header-upload");
    let logoutLink = document.getElementById("header-logout");

    if (sessionManager.isLogged()) {
        loginLink.style.display = "none";
        registerLink.style.display = "none";
    } else {
        uploadLink.style.display = "none";
        logoutLink.style.display = "none";
    }
}

function addLogoutHandler () { // Borrar usuario y token, devolviendo control al inicio
    let logoutButton = document.getElementById ("navbar-logout");
    logoutButton.addEventListener ("click", function () { // Al Pulsar logout
    sessionManager.logout (); // Función que borra variables localStorage
    window.location.href = "index.html"; // Devuelve control al inicio
    }); 
}

function showLoggedUsername() {
    let headerElement = document.getElementById("header-username");
    let username = "Invitado";
    let avatarUrl = "/web/images/avatar.png";

    if (sessionManager.isLogged()) {
        let userData = sessionManager.getLoggedUser();
        username = "@" + userData.username;
        avatarUrl = userData.avatarUrl;
    }
    headerElement.href = "profile.html";
    headerElement.appendChild(parseHTML(`<span id="pill"><span id="text-pill">${username}</span><img src=${avatarUrl} id="picture-pill" class="img-fluid " alt="Imagen de perfil de ${username}"></span>`));    
}

document.addEventListener("DOMContentLoaded", main);
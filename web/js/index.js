"use strict";

/* Manejo de autenticación JSON */
import { authAPI } from "/js/api/auth.js";
/* Manejo de la sesion (login, logut, tokens, id,...) */
import { sessionManager } from "/js/utils/session.js";
/* Validador de usuario */
import { userValidator } from "/js/validators/users.js";
/* Manejo de mensajes en la web */
import { messageRenderer } from "/js/renderers/messages.js";

/* Función principal */
function main() {
    /* Guardamos el boton de login */
    let loginBtn = document.getElementById("btn-login");
    /* Llamamos a handleLoginSubmit si se hace click */
    loginBtn.onclick = handleLoginSubmit;
}

/* ASINCRONA: HandleLoginSubmit */
async function handleLoginSubmit(event) {
    /* Para no enviar el form si este contiene errores */
    event.preventDefault();

    /* Guardamos los inputs del formulario  */
    let emailInpt = document.getElementById("email-input");
    let passwordInpt = document.getElementById("password-input");
    /* guardamos el valor de dichos inputs */
    let email = emailInpt.value;
    let password = passwordInpt.value;
    /* Creamos un formulario vacío. */
    let formData = new FormData();
    /* Metemos en el formulario, el email y la contraseña */
    formData.append("email", email);
    formData.append("password", password);
    
    /* guardamos el objeto errorDiv donde vamos a mostrar los errores */
    let errorsDiv = document.getElementById("errors");
    errorsDiv.innerHTML = "";

    /* Validamos los campos y comprobamos si contiene errores */
    let errors = userValidator.validateLogin(formData);

    /* Si no contiene errores */
    if (errors.length === 0) {
        /* Enviamos el formuario */
        try {
            /* guardamos la respuesta de AUTHAPI al hacer login */
            let response = await authAPI.login(formData);

            /* Guardamos el token y el usuario */
            let token = response.sessionToken;
            let userData = response.user;

            /* Logeamos con el usuario y el token de auth */
            sessionManager.login(token, userData);
            /* Cambiamos la web al profile */
            window.location.href = "profile.html";
        } catch (err) {
            /* si algo falla, guardamos el mensaje y lo mostramos como alerta */
            let errorMessage = err.response.data.message;
            messageRenderer.showErrorAsAlert(errorMessage);
        }

    } else {
        for (let err of errors) {
            messageRenderer.showErrorAsAlert(err);
        }
    }
}

document.addEventListener("DOMContentLoaded", main);
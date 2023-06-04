"use strict";

import { picturesAPI_auto } from "/js/api/_pictures.js";
import { messageRenderer } from "/js/renderers/messages.js";
import { sessionManager } from "/js/utils/session.js";
import { picturesAPI } from "/js/api/pictures.js";


let urlParams = new URLSearchParams(window.location.search);
let pictureId = urlParams.get("pictureId");
let currentpicture = null;

function main() {
    if (pictureId !== null) {
        loadpictureData();
    }
    let pictureForm = document.getElementById("form-picture-upload");
    pictureForm.onsubmit = handlepictureSubmit;

    let urlInput = document.getElementById("input-url");
    urlInput.onchange = handleURLchange;
}

function handleURLchange(event) {
    let url = event.target.value;
    let picturePreview = document.getElementById("picture-preview");
    picturePreview.src = url;
}

async function loadpictureData() {
    // Editing a picture
    let pageTitle = document.getElementById("page-title");
    pageTitle.textContent = "Editando foto";
    let pageButton = document.getElementById("page-button");
    pageButton.textContent = "Guardar";

    currentpicture = await picturesAPI_auto.getById(pictureId);

    let urlInput = document.getElementById("input-url");
    let titleInput = document.getElementById("input-title");
    let descrInput = document.getElementById("input-description");
    let picturePreview = document.getElementById("picture-preview");

    urlInput.value = currentpicture.pictureURL;
    titleInput.value = currentpicture.name;
    descrInput.value = currentpicture.description;
    picturePreview.src = currentpicture.pictureURL;
    
}

async function handlepictureSubmit(event) {
    event.preventDefault();
    let form = event.target;
    let formData = new FormData(form);
    // Validar el formulario
    try {
        if (currentpicture === null) {
            // Creating a new picture
            let pictures = await picturesAPI.getAllByuserId(sessionManager.getLoggedId());
            console.log(pictures);
            if(pictures.length < 5){
                formData.append("userId", sessionManager.getLoggedId());
                let resp = await picturesAPI_auto.create(formData);
                pictureId = resp.lastId;
                window.location.href = "pictureView.html?pictureId=" + pictureId;
            }
            else{
                messageRenderer.showErrorAsAlert("Solo se pueden subir 5 fotos por Usuario.");
            }
            
        } else {
            // Editing a picture
            formData.append("userId", currentpicture.userId);
            await picturesAPI_auto.update(formData, pictureId);
            window.location.href = "pictureView.html?pictureId=" + pictureId;
        }

    } catch (err) {
        let errorMessage = err.response.data.message;
        messageRenderer.showErrorAsAlert(errorMessage);
    }
}

document.addEventListener("DOMContentLoaded", main);
"use strict";

import { picturesAPI_auto } from "/js/api/_pictures.js";
import { picturesRenderer } from "/js/renderers/pictures.js";
import { galleryRenderer } from "/js/renderers/gallery.js";
import { picturesAPI } from "/js/api/pictures.js";
import { usersAPI_auto } from "/js/api/_users.js";
import { sessionManager } from "/js/utils/session.js";

let urlParams = new URLSearchParams(window.location.search);
const pictureId = urlParams.get("pictureId");

function main() {
    loadpicture();
}
async function loadpicture() {
    let picture = await picturesAPI_auto.getById(pictureId);
    let usuario = await usersAPI_auto.getById(picture.userId);
    let details = picturesRenderer.asDetails({ ...picture,userId: usuario.userId, username: usuario.username, avatarUrl: usuario.avatarUrl });
    let detailsCol = document.getElementById("details-column");
    detailsCol.append(details);
    edit(picture.userId);
    loadGallery(picture.userId, pictureId);
  
}


function edit(pictureUserId) {
    let userId = sessionManager.getLoggedId();
    if (userId === pictureUserId) {
        let edits = picturesRenderer.asEdit();
        let editCol = document.getElementById("edit-delete");
        editCol.append(edits);
        let btnEdit = document.getElementById("button-edit");
        let btnDelete = document.getElementById("button-delete");
        btnEdit.onclick = handleEditpicture;
        btnDelete.onclick = handleDeletepicture;
    }
}
async function handleDeletepicture(event) {
    if (confirm("¿Seguro que quiere borrar la foto?")) {
        await picturesAPI_auto.delete(pictureId);
        window.location.href = "profile.html";
    }
}
function handleEditpicture(event) {
    window.location.href = "upload_picture.html?pictureId=" + pictureId;
}

async function loadGallery(userId, pictureId) {
    let pictures = await picturesAPI.getAllByuserId(userId);
    if ((pictures.length - 1) === 0) {
        let string = document.getElementById("card-gallery");
        string.textContent = "Este usuario no tiene más fotos";
    }
    else {
        let newpictures = pictures.filter((item) => item.pictureId !== Number(pictureId));
        let gallery = galleryRenderer.asCardGallery(newpictures, 4);
        let galleryContainer = document.querySelector("#card-gallery");
        galleryContainer.append(gallery);
    }
}

document.addEventListener("DOMContentLoaded", main);
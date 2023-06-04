"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";

const msgsDivID = "errors";
const browseResultsDiv = document.getElementById("friendsBrowseResults");

function getErrorsDiv() {
    return document.getElementById(msgsDivID);
}

const userRenderer = {
    asBrowseResult: (user) => {
        let template = `
        <div class="col-md-4">
            <div class="row friend-result">
            <div class="col-8 friend-info text-center">
                <h4>${user.name}</h4>
                <h6 class="text-muted">${user.description}</h6>
                <hr />
                <div class="row friend-buttons">
                <div class="col">
                    <button class="btn btn-primary">Enviar mensaje</button>
                </div>
                <div class="col">
                    <button class="btn ${user.isFriend ? 'btn-danger">Eliminar amigo</button>' : 'btn-success">Agregar amigo</button>'}
                </div>
                </div>
            </div>
            <div class="col-1 friend-img">
                <img src="${user.avatarUrl}" alt="Foto del Usuario"
                class="avatar-img" />
            </div>
            </div>
        </div>`

        browseResultsDiv.append(parseHTML(template));
    },
    asProfile: (user, profileId) => {
        let template = `
        <div class="row">
            <div class="col-md-4 p--profile-img centered"><img class="img-circle-large" src="${user.avatarUrl}" alt="Foto de perfil"></div>
            <div class="col-md p--profile-info">
                <div class="row">
                    <h1>${user.firstName} ${user.lastName}</h1>
                    <div class="col-md">
                        <span class="p--username">${user.username}</span>${
                            (user.userId === profileId) ? `<a class="btn btn-outline-dark" href="editProfile.html" role="button">Editar perfil</a>` 
                            : '<button id="friendButton" class="btn btn-success" data-userId="'+user.userId+'">Añadir amigo</button>'
                        }
                    </div>
                </div>
                <div class="row">
                    <col-md>${user.bio}</col-md>
                </div>
                <div id="profile-hobbies" class="row"></div>
            </div>
        </div>`;

        return parseHTML(template);
    },

    asMessageViewProfile: (c) => {
        let template = `
        <div class="col-md-3">
            <div class="card">
                <h5 class="card-header">${c.username}</h5>
                <div class="card-body">
                    <p class="card-text">${c.lastMessage}</p>
                    <button class="btn btn-primary friend-responder" data-userId="${c.userId}">Responder</button>
                </div>
            </div>
        </div>`;

        return parseHTML(template);
    },

    asRequestViewProfile: (friendReq) => {
        let template = `
        <div class="col-md-3">
            <div class="card">
                <h5 class="card-header">${friendReq.username}</h5>
                <div class="card-body">
                    <p class="card-text">Solicitud de amistad</p>
                    <button class="btn btn-primary friend-aceptar" data-friendReqId="${friendReq.userFriendRequestId}">Aceptar</button>
                    <button class="btn btn-danger friend-rechazar" data-friendReqId="${friendReq.userFriendRequestId}">Rechazar</button>
                </div>
            </div>  
        </div>`;

        return parseHTML(template);
    },

};

export { userRenderer };
"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";


const picturesRenderer = {
    asCard: function (picture) {
        let html = `<div class="col" id=>
        <a href="pictureView.html?pictureId=${picture.pictureId}">
            <img id="picture" class="mt-2 mb-2" style="width: 90%;" src="${picture.pictureURL}">
        </a>
    </div>`;
        let card = parseHTML(html);
        return card;
    },
    asEdit: function(){
        let html = `<div class="row text-center mt-4 mb-3">
        <div class="col" style="width: 10%;"></div>
        <button class="btn btn-primary" id="button-edit" style="width: 30%;"><i class="fa fa-pencil"
                aria-hidden="true"></i>Editar</button>
        <div class="col" style="width: 20%;"></div>
        <button class="btn btn-dark" id="button-delete" style="width: 30%;"><i class="fa fa-trash"
                aria-hidden="true"></i>Eliminar</button>
        <div class="col" style="width: 10%;"></div>
    </div>`;
        let editbutton = parseHTML(html);
        return editbutton;
    },

    asDetails: function (picture) {
        let html = `<div> <div class="row centered">
        <h2>${picture.name}</h2>
    </div>
    <div class="row centered">
        <h4>${picture.description}</h4>
    </div>
    <div class="row" id="center-image">
        <img src="${picture.pictureURL}" id="photo" alt="${picture.description}">
    </div>
    
    <hr>
    <div class="row text-center">
        <p>Subida por
            <a class="enlace" href="profile.html?userId=${picture.userId}">
                @${picture.username}
                <img src="${picture.avatarUrl}" alt="Foto de perfil" class="profile-picture rounded-circle">
            </a>
        </p>
    </div></div>`;
        let details = parseHTML(html);
        return details;
    },

    asProfileViewPicture: function(p) {
        let template = `
        <div class="col-md-2">
            <a href="pictureView.html?pictureId=${p.pictureId}"><img class="img-square-medium" src="${p.pictureURL}" alt="${p.name}"></a>
        </div>`;

        return parseHTML(template);
    },

    asFriendProfileView: function(user) {
        let template = `
        <div class="col-md-2">
            <a href="profile.html?${user.userId}"><img class="img-circle-medium" src="${user.avatarUrl}" alt="${user.username}"></a>
        </div>`;

        return parseHTML(template);
    }
};

export { picturesRenderer };
"use strict";

import { sessionManager } from "/js/utils/session.js";
import { userRenderer } from "/js/renderers/users.js";
import { picturesRenderer } from "/js/renderers/pictures.js";
 import { picturesAPI } from "/js/api/pictures.js";
import { userFriendsAPI } from "/js/api/userfriends.js";
import { conversationsAPI } from "/js/api/conversations.js";
import { conversationmsgAPI_auto } from "/js/api/_conversationmsg.js";
import { usersAPI_auto } from "/js/api/_users.js";
import { parseHTML } from "/js/utils/parseHTML.js";
import { userhobbiesAPI } from "/js/api/userhobbies.js";
import { loading } from "/js/global.js";
import { conversationsUtils } from "/js/conversationsUtils.js";
import { isFriend, sendRequest, acceptRequest, declineRequest } from "/js/friendsRequestUtils.js";

const urlParams = new URLSearchParams(window.location.search);
let userData = sessionManager.getLoggedUser();
let userId; //id de usuario logueado
let profileId; //id del prefil que estamos viendo

function main() {
    loading();
    userId = sessionManager.getLoggedId();
    if (userId === null) {
        window.location.href = "index.html";
    }

    if ((urlParams.get('userId') === userId) || (!urlParams.has('userId'))) {
        profileId = userId;
    } else {
        profileId = urlParams.get('userId');
    }
    loadProfile(userId, profileId);
}

function loadProfile(userId, profileId) {
    loadUserInfo(userId, profileId);
    loadUserPictures(profileId);
    if (userId === profileId){
        loadUserFriends(userId);
        loadUserMessages(userId);
    }
}

async function loadUserInfo(userId, profileId){
    let profileData = {...userData};
    if (userId !== profileId) {
        try {
            profileData = await usersAPI_auto.getById(profileId);
        } catch (error) {
            console.log(error);
        }
    }
    let userInfo = userRenderer.asProfile(profileData, userId);
    
    let hobbies = await userhobbiesAPI.getAllByUserId(profileId);
    let badgeClasses = ['bg-primary', 'bg-success', 'bg-danger', 'bg-warning text-dark', 'bg-dark'];
    let hobbieSpan = userInfo.querySelector('#profile-hobbies');
    hobbies.map((hobby) => {
        console.log(hobby.name);
        hobbieSpan.appendChild(parseHTML(`<div class="col-md"><span class="badge badgeHobby p-2 rounded-pill ${badgeClasses[Math.floor(Math.random()*badgeClasses.length)]}" data-hobbyId=${hobby.hobbyId}>${hobby.name}</span></div>`))
    });
    document.getElementById("user-info").appendChild(userInfo);
}

async function loadUserPictures(profileId){
    let picturesContainer = document.getElementById("user-pictures");
    try {
        let resp = await picturesAPI.getAllByuserId(profileId);
        resp.map((picture) => picturesContainer.appendChild(picturesRenderer.asProfileViewPicture(picture)));
    } catch (error) {
        picturesContainer.appendChild(parseHTML('<h4>El usuario aún no tiene ninguna foto :(</h4>'));
        console.log(error);
    }
    loading("close");
}

async function loadUserFriends(userId) {
    let friendsTitle = parseHTML(`<div class="row"><div class="col-md mb-3"><h4>Amigos</h4></div></div>`);
    let friendsContainer = parseHTML(`<div id="user-friends" class="row centered"></div>`);
    let userContainer = document.getElementById('user-container');
    
    userContainer.appendChild(document.createElement('hr'));
    userContainer.appendChild(friendsTitle);
    userContainer.appendChild(friendsContainer);
    try {
        let respFriends = await userFriendsAPI.getAllUserFriends(userId);
        respFriends.map(async (friend) => {
            console.log(friend);
            let friendElem;
            if(friend.userAceptanteId === userId){
                friendElem = await loadFriend(friend.userSolicitanteId);
            } else {
                friendElem = await loadFriend(friend.userAceptanteId);
            }
            friendsContainer.appendChild(friendElem);
        });
    } catch (error) {
        friendsContainer.appendChild(parseHTML('<h4>Aún no tienes ningun amigo! <a class="btn btn-primary mx-4" href="friends.html">Busca alguno</a></h4>'));
        console.log(error);
    }
}

async function loadFriend(userId){
    let respUser = await usersAPI_auto.getById(userId);
    return picturesRenderer.asFriendProfileView(respUser);
}

async function loadUserMessages(userId) {
    let messagesTitle = parseHTML(`<div class="row"><div class="col-md mb-3"><h4>Mensajes</h4></div></div>`);
    let messagesContainer = parseHTML(`<div id="user-messages" class="mb-4 row centered"></div>`);
    let userContainer = document.getElementById('user-container');

    userContainer.appendChild(document.createElement('hr'));
    userContainer.appendChild(messagesTitle);
    userContainer.appendChild(messagesContainer);
    // Para los msgs de conversaciones abiertas
    try {
        let respConversations = await conversationsAPI.getAllByuserId(userId);
        respConversations.map(async (conver) => {
            console.log(conver);
            let converElem;
            if(conver.userIniciaId === userId){
                converElem = await loadMessage(conver.userOtroId, conver.conversationMsgId);
            } else {
                converElem = await loadMessage(conver.userIniciaId, conver.conversationMsgId);
            }
            messagesContainer.appendChild(converElem);
        });
    } catch (error) {
        messagesContainer.appendChild(parseHTML('<h4>Aún no tienes ningun chat! <a class="btn btn-primary mx-4" href="friends.html">Abre uno</a></h4>'));
        console.log(error);
    }
    // Para las peticiones de amisatad recibidas
    try {
        let respFriendsReq = await userFriendsAPI.getAllUserPendingRequest(userId);
        respFriendsReq.map(async (req) => {
            let reqElem = await loadRequest(req);
            reqElem.querySelector(".friend-aceptar").onclick = acceptRequest;
            reqElem.querySelector(".friend-rechazar").onclick = declineRequest;
            messagesContainer.appendChild(reqElem);
        });
    } catch (error) {
        console.log(error);
    }
}

async function loadMessage(userId, conversationId){
    let respUser, respConver;
    try {
        respUser = await usersAPI_auto.getById(userId);
        respConver = await conversationmsgAPI_auto.getById(conversationId);
    } catch (error) {
        console.error(error);
        return;
    }
    let conver = {
        isOpen: conversationsUtils.isOpen(respConver),
        username: respUser.username,
        lastMessage: respConver.conversacion, // por ahora, implementar en conversationsUtils un get de ultimo mensaje
        userId: respUser.userId,

    }
    console.log(conver);
    return userRenderer.asMessageViewProfile(conver);
}

async function loadRequest(req){
    let respUser;
    try {
        respUser = await usersAPI_auto.getById(req.userFriendRequestId);
    } catch (error) {
        console.error(error);
    }
    return userRenderer.asRequestViewProfile({userFriendRequestId: req.userFriendRequestId, username: respUser.username});
}

document.addEventListener('DOMContentLoaded', main);
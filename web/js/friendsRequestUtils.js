"use strict";

import { sessionManager } from "/js/utils/session.js";
import { userfriendrequestAPI_auto } from "/js/api/_userfriendrequest.js";

function isFriend(friendRequest) {
    let userId = sessionManager.getLoggedId();
    return (friendRequest.userSolicitanteId === userId) || (friendRequest.userAceptanteId === userId) &&
    ((friendRequest.aceptanteRevocacionDate === null) && (friendRequest.solicitanteRevocacionDate === null));
}

async function sendRequest(event) {
    let button = event.target;
    let friendId = button.getAttribute('data-userId');
    let userId = sessionManager.getLoggedId();

    try {
        let response = await userfriendrequestAPI_auto.create({userSolicitanteId: userId, userAceptanteId: friendId, solicitanteDate: new Date().toISOString().slice(0, 19).replace('T', ' ')});
        window.location.href = "friends.html";
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

async function acceptRequest(event) {
    let button = event.target;
    let friendReqId = button.getAttribute('data-friendReqId');
    let userId = sessionManager.getLoggedId();

    try {
        let respFriendsReq = await userfriendrequestAPI_auto.getById(friendReqId);
        if (userId === respFriendsReq.userAceptanteId) {
            let response = await userfriendrequestAPI_auto.update({...respFriendsReq, aceptanteDate: new Date().toISOString().slice(0, 19).replace('T', ' ')}, friendReqId);
            window.location.href = "profile.html";
        }
    } catch (error) {
        console.log(error);
    }
}

async function deleteFriend(event) {
    let button = event.target;
    let friendReqId = button.getAttribute('data-friendReqId');
    let userId = sessionManager.getLoggedId();

    try {
        let respFriendsReq = await userfriendrequestAPI_auto.getById(friendReqId);
        if (userId === respFriendsReq.userSolicitanteId) {
            let response = await userfriendrequestAPI_auto.update({...respFriendsReq, solicitanteRevocacionDate: new Date().toISOString().slice(0, 19).replace('T', ' ')}, friendReqId);
            console.log(response);
        } else {
            let response = await userfriendrequestAPI_auto.update({...respFriendsReq, aceptanteRevocacionDate: new Date().toISOString().slice(0, 19).replace('T', ' ')}, friendReqId);
            console.log(response);
        }
        window.location.href = "profile.html";
    } catch (error) {
        console.log(error);
    }
}

async function declineRequest(event) {
    let button = event.target;
    let friendReqId = button.getAttribute('data-friendReqId');

    try {
        await userfriendrequestAPI_auto.delete(friendReqId);
        window.location.href = "profile.html";
    } catch (error) {
        console.log(error);
    }
}

export { isFriend, sendRequest, acceptRequest, deleteFriend, declineRequest };
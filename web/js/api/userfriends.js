"use strict";

import { BASE_URL, requestOptions } from './common.js';

const userFriendsAPI = {
    /**
    * Busqueda de amigos de un user por su userId
    */
    getAllUserFriends: async function (userId) {
        let response = await axios.get(`${BASE_URL}/users/${userId}/friends`, requestOptions);
        return response.data;
    },
    getAllUserPendingRequest: async function (userId) {
        let response = await axios.get(`${BASE_URL}/users/${userId}/requests`, requestOptions);
        return response.data;
    },

};

export { userFriendsAPI };
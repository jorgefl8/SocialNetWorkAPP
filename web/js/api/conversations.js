"use strict";

import { BASE_URL, requestOptions } from './common.js';

const conversationsAPI = {
    /**
    * Busqueda de amigos de un user por su userId
    */
    getAllByuserId: async function (userId) {
        let response = await axios.get(`${BASE_URL}/users/${userId}/conversations`, requestOptions);
        return response.data;
    },

};

export { conversationsAPI };
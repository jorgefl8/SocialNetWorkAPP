"use strict";

import { BASE_URL, requestOptions } from './common.js';

const userhobbiesAPI = {

    getAllByUserId: async function(userId) {
        let response = await axios.get(`${BASE_URL}/users/${userId}/hobbies`, requestOptions);
        return response.data;
    },

    deleteAllByUserId: async function (userId) {
        let response = await axios.delete(`${BASE_URL}/users/${userId}/hobbies`, requestOptions);
        return response.data;
    },
};

export {userhobbiesAPI};
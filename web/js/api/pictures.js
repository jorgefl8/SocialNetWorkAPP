"use strict";

import { BASE_URL, requestOptions } from './common.js';

const picturesAPI = {
    /**
    * Busqueda postcode por municipalityId
    */
    getAllByuserId: async function (userId) {
        let response = await axios.get(`${BASE_URL}/users/${userId}/pictures`, requestOptions);
        return response.data;
    },

};

export { picturesAPI };
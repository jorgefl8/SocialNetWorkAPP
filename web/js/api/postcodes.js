"use strict";

import { BASE_URL, requestOptions } from './common.js';

const postcodesAPI = {
    /**
    * Busqueda postcode por municipality Id
    */
    getPostcodeByMunicipalityId: async function (municipalityId) {
        let response = await axios.get(`${BASE_URL}/postcodes/municipality/${municipalityId}`, requestOptions);
        return response.data;
    },

};

export { postcodesAPI };
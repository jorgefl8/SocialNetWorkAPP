"use strict";

import { BASE_URL, requestOptions } from './common.js';

const municipalitiesAPI = {

    /**
    * Busqueda parcial de el nombre introducido
    */
    getPartialSearchByName: async function (partialName) {
        let response = await axios.get(`${BASE_URL}/municipalities/search/${partialName}`, requestOptions);
        return response.data;
    }
    /* He quitado aquí una coma, no se si será importante */
};

export { municipalitiesAPI };
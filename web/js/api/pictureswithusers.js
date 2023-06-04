"use strict";

import { BASE_URL, requestOptions } from './common.js';

const pictureswithusersAPI = {

    getBypictureId: async function(pictureId) {
        let response = await axios.get(
            `${BASE_URL}/pictureswithusers?pictureId=${pictureId}`,
            requestOptions
        );
        return response.data[0];
    },

};

export { pictureswithusersAPI };
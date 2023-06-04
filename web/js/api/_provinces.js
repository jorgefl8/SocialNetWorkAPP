/*
 * DO NOT EDIT THIS FILE, it is auto-generated. It will be updated automatically.
 * All changes done to this file will be lost upon re-running the 'silence createapi' command.
 * If you want to create new API methods, define them in a new file.
 *
 * Silence is built and maintained by the DEAL research group at the University of Seville.
 * You can find us at https://deal.us.es
 */

"use strict";

import { BASE_URL, requestOptions } from './common.js';

const provincesAPI_auto = {

    /**
    * Gets all provinces
    */
    getAll: async function(formData) {
        let response = await axios.get(`${BASE_URL}/provinces`, requestOptions);
        return response.data;
    },

    /**
    * Gets an entry from 'provinces' by its primary key
    */
    getById: async function(provinceId) {
        let response = await axios.get(`${BASE_URL}/provinces/${provinceId}`, requestOptions);
        return response.data[0];
    },

    /**
    * Creates a new entry in 'provinces'
    */
    create: async function(formData) {
        let response = await axios.post(`${BASE_URL}/provinces`, formData, requestOptions);
        return response.data;
    },

    /**
    * Updates an existing entry in 'provinces' by its primary key
    */
    update: async function(formData, provinceId) {
        let response = await axios.put(`${BASE_URL}/provinces/${provinceId}`, formData, requestOptions);
        return response.data;
    },

    /**
    * Deletes an existing entry in 'provinces' by its primary key
    */
    delete: async function(provinceId) {
        let response = await axios.delete(`${BASE_URL}/provinces/${provinceId}`, requestOptions);
        return response.data;
    },
};

export {provincesAPI_auto};
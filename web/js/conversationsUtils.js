"use strict";

import { conversationsAPI } from "/js/api/conversations.js";

const conversationsUtils = {
    isOpen: function (conver) {
        return conver.finDate === null;
    },
};

export { conversationsUtils };
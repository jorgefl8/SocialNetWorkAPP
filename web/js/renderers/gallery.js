"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";
import { picturesRenderer } from "/js/renderers/pictures.js";

const galleryRenderer = {
    asCardGallery: function (pictures, picturesPerRow) {
        let colSize = 12 / picturesPerRow;
        let gallery = parseHTML('<div class="row"></div>');

        for (let picture of pictures) {
            let col = parseHTML(`<div class="col-md-${colSize}"></div>`);
            let card = picturesRenderer.asCard(picture);
            col.append(card);
            gallery.append(col);
        }

        return gallery;
    },
};

export { galleryRenderer };
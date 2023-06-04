"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";

function loading(close){
    let body = document.getElementsByTagName('body')[0];
    console.log('loading');
    if (close === undefined){
        if(document.getElementById('loading') === null){
            body.classList.add('loading');
            body.appendChild(parseHTML(`
            <div id="loading-content">
                <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>`));
        }
    } else {
        document.getElementById('loading-content').remove();
        body.classList.remove('loading');
    }
}

export { loading };
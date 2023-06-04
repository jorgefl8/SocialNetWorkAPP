"use strict";

import { userRenderer } from './renderers/users.js'

var friends = [
    {
        name: 'Frank',
        description: 'Hola soy Frank!',
        avatarUrl: 'https://i.pinimg.com/236x/cc/39/f5/cc39f51c43b28c8900fa4c2ba1a2534c.jpg',
        isFriend: true
    },
    {
        name: 'Frankcisco',
        description: 'Hola soy Frankcisco!',
        avatarUrl: 'https://static.wikia.nocookie.net/esgta/images/e/e6/Sweet_%28SA%29.png/revision/latest/scale-to-width-down/200?cb=20150720011211',
        isFriend: false
    },
    {
        name: 'Frank 2',
        description: 'Hola soy Frank!',
        avatarUrl: 'http://pm1.narvii.com/6456/b2756ea358a7f0a09c1cf04bf922d133f13ec53a_00.jpg',
        isFriend: true
    },
    {
        name: 'Frank 3',
        description: 'Hola soy Frank!',
        avatarUrl: 'https://i.pinimg.com/236x/cc/39/f5/cc39f51c43b28c8900fa4c2ba1a2534c.jpg',
        isFriend: false
    },
    {
        name: 'Frank 4',
        description: 'Hola soy Frank!',
        avatarUrl: 'https://i.pinimg.com/236x/cc/39/f5/cc39f51c43b28c8900fa4c2ba1a2534c.jpg',
        isFriend: false
    },
    {
        name: 'Hola mundo',
        description: 'Hola soy Hola mundo xd!',
        avatarUrl: 'https://www.mividaporunperro.com/wp-content/uploads/2020/08/cual-es-la-raza-del-perro-del-meme-cheems-1.jpg',
        isFriend: true
    },
    {
        name: 'Frank',
        description: 'Hola soy Frank otra vez!',
        avatarUrl: 'https://i.pinimg.com/236x/cc/39/f5/cc39f51c43b28c8900fa4c2ba1a2534c.jpg',
        isFriend: true
    }
];

function main() {
    loadFriendSuggestions(friends);
}

function loadFriendSuggestions(users){
    users.map(user => userRenderer.asBrowseResult(user));
}

document.addEventListener('DOMContentLoaded', main);
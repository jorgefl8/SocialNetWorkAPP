'use strict';

/* Manejo de autenticación JSON */
import { authAPI } from "/js/api/auth.js";
/* Busqueda parcial de el nombre introducido */
import { municipalitiesAPI } from "/js/api/municipalities.js";
/* Busqueda postcode por municipality Id */
import { postcodesAPI } from "/js/api/postcodes.js";
import { userhobbiesAPI } from "/js/api/userhobbies.js";
/* Api (auto) de postcodes */
import { postcodesAPI_auto } from "/js/api/_postcodes.js";
import { usersAPI_auto } from "/js/api/_users.js";
/* Api (auto) de hobbies */
import { hobbiesAPI_auto } from "/js/api/_hobbies.js";
import { userhobbiesAPI_auto } from "/js/api/_userhobbies.js";
/* Para la inclusion de html */
import { parseHTML } from "/js/utils/parseHTML.js";
/* Manejo de mensajes en la web */
import { messageRenderer } from "/js/renderers/messages.js";
/* Manejo de la sesion (login, logut, tokens, id,...) */
import { sessionManager } from "/js/utils/session.js";
/* Validador de usuario */
import { userValidator } from "/js/validators/users.js";

/* Variables predefinidas */
var blockAutocomplete = false;
var badgeClasses = ['bg-primary', 'bg-success', 'bg-danger', 'bg-warning text-dark', 'bg-dark'];

/* Funcion principal */
function main(){
    rellenaDatosUsuario();
    rellenaHobbies();
    addEventHandlers();
}

async function rellenaDatosUsuario(){
    let userData = sessionManager.getLoggedUser();
    console.log(userData);
    let usernameInput = document.getElementById("userName-input");
    usernameInput.value = userData.username;
    let firstnameInput = document.getElementById("name-input");
    firstnameInput.value = userData.firstName;
    let lastnameInput = document.getElementById("lastname-input");
    lastnameInput.value = userData.lastName;
    let avatarURLInput = document.getElementById("avatarUrl-input");
    avatarURLInput.value = userData.avatarUrl;
    let emailInput = document.getElementById("email-input");
    emailInput.value = userData.email;
    let birthdateInput = document.getElementById("birthdate");
    birthdateInput.valueAsDate = new Date(userData.dateOfBirth);
    let addressInput = document.getElementById("address-input");
    addressInput.value = userData.address;
    addressInput.setAttribute('data-municipality', userData.municipalityId);
    addressInput.setAttribute('data-province', userData.provinceId);
    let postcodeInput = document.getElementById("postalCode");
    let postCode = await postcodesAPI_auto.getById(userData.postcodeId);
    postcodeInput.value = postCode.postcode;
    postcodeInput.setAttribute("data-postcodeId", postCode.postcodeId);
    let genderInput = document.getElementById("gender");
    let userGender = userData.gender;
    if (userGender === "male"){
        genderInput.querySelector("#maleGender").setAttribute("checked", true);
    }
    if (userGender === "female"){
        genderInput.querySelector("#femaleGender").setAttribute("checked", true);
    }
    if (userGender === "other"){
        genderInput.querySelector("#undefinedGender").setAttribute("checked", true);
    }
    let weightInput = document.getElementById("weight-input");
    weightInput.value = userData.weight;
    let heightInput = document.getElementById("height-input");
    heightInput.value = userData.height;
    let hobbiesContainer = document.getElementById("hobbies-selected");
    rellenaConHobbiesUsuario(userData.userId);
    let bioInput = document.getElementById("bio-input");
    bioInput.value = userData.bio;
}

async function rellenaConHobbiesUsuario(userId){
    try {
        let hobbiesList = await userhobbiesAPI.getAllByUserId(userId);
        hobbiesList.map((hobby) => {
            selectHobby(hobby.hobbyId, hobby.name, hobby.userHobbyId);
        });
    } catch (error) {
        console.log(error);
    }
}

/* funcion addEventHandlers */
function addEventHandlers(){
    /* guardamos los elementos direccion, crear nuevo hobbie y formulario de registro */
    let addressInp = document.getElementById('address-input');
    let newHobbyBtn = document.getElementById('newHobby-create');
    let darBajaBtn = document.getElementById('btn_baja');
    let editProfileForm= document.getElementById('editProfileForm');
    /* A cada letra que se escriba (onkeyup) se ejecuta la funcion partialSearchMunincipalities */
    addressInp.onkeyup = partialSearchMunicipalities;
    /* Al hacer click, ejecuta la funcion createNewHobby */
    newHobbyBtn.onclick = createNewHobby;
    /* Al hacer click, ejecuta la funcion handleSubmitEdit */
    editProfileForm.onsubmit = handleSubmitEdit;

    darBajaBtn.onclick = darBajaUser;
}

async function darBajaUser(){
    let userData = sessionManager.getLoggedUser();
    let userPassword = document.getElementById('password-input');

    if(userPassword.value !== "BAJA"){
        messageRenderer.showErrorAsAlert('Para darse de baja introduzca "BAJA" en password');
        return;
    }else{
        usersAPI_auto.delete(userData.userId)
        .then(x =>  {window.location.href = "index.html";})
        .catch(x => {messageRenderer.showErrorAsAlert('No se puede borrar este usuario');});
    }
}

/* funcion partialSearchMunincipalities */
async function partialSearchMunicipalities(event){
    /* introducimos campo vacío en el elemento de errores */
    document.getElementById('errors').innerHTML = '';
    
    /*  Guardamos los elementos ubicacion y lista de resultados */
    let ubiContainer = document.getElementById('autocomplete-ubi');
    let oldResults = document.getElementById('resulst-list');
    /* Los caracteres que están escritos (por el momento) */
    let partialName = event.target.value;
    /* Si no hay nada escrito */
    if (partialName.length < 1){
        /* Borramos los resultados anteriores */
        if(oldResults !== null){
            oldResults.remove();
        }
        /* Devolvemos porque no queremos continuar la funcion */
        return;
    }
    /* Si no es la primera vez que pasa por esta funcion devolvemos */
    if (blockAutocomplete){
        return;
    }
    blockAutocomplete = true;

    /* si tenemos resultados anteriores, los borramos */
    if(oldResults !== null){
        oldResults.remove();
    }

    try {
        /* Buscamos en minicipalities  */
        let resp = await municipalitiesAPI.getPartialSearchByName(partialName);
        
        let respList = parseHTML("<div id='resulst-list' class='list-group'></div>");
        for (let r of resp) {
            console.log(r);
            let respItem = parseHTML(`<button type="button" class="list-group-item list-group-item-action" selected">${r.municipalityName}, ${r.provinceName}</button>`);
            respItem.onclick = () => {
                selectAutocompleteItem(r.municipalityId, r.provinceId, `${r.municipalityName}, ${r.provinceName}`);
                buscaPostcode(r.municipalityId);
            };
            respList.appendChild(respItem);
        }
        ubiContainer.appendChild(respList);
    } catch (error) {
        messageRenderer.showErrorAsAlert('No se ha encontrado el municipio! :C');
    }
    blockAutocomplete = false;
}

/* funcion rellenaHobbies */
async function rellenaHobbies(){
    /* Guardamos el input de hobbies */
    let hobbiesInp = document.getElementById('hobbies-input');
    try {
        /* Obtenemos todos los Hobbies que hay en la BBDD (AWAIT) */
        let resp = await hobbiesAPI_auto.getAll();
        /* por cada hobbie */
        resp.map((hobby) => {
            /* Creamos un objeto option(HTML) */
            let hobbyOpt = new Option(hobby.name, hobby.hobbyId);
            /* cuando se hace click en un hobby se selecciona esa eleccion */
            hobbyOpt.onclick = () => {selectHobby(hobby.hobbyId, hobby.name)};
            /* Se añade a las opciones  */
            hobbiesInp.appendChild(hobbyOpt);
        });
        /* Si algo falla, enviamos mensaje de error */
    } catch (error) {
        messageRenderer.showErrorAsAlert(error);
    }
}

async function buscaPostcode(municipalityId){
    let postcodeInp = document.getElementById('postalCode');
    try {
        let postCoderesp = await postcodesAPI.getPostcodeByMunicipalityId(municipalityId);
        postcodeInp.value = postCoderesp[0].postcode;
        postcodeInp.setAttribute("data-postcodeId", postCoderesp[0].postcodeId);
        postcodeInp.setAttribute("disabled", true);
    } catch (error) {
        messageRenderer.showWarningAsAlert('No tenemos aún el codigo postal! Dinos cual es :)');
        postcodeInp.removeAttribute("disabled");
        postcodeInp.removeAttribute("data-postcodeId");
    }
}

function selectAutocompleteItem(municipalityId, provinceId, addressName){
    document.getElementById('resulst-list').remove();
    let addressInp = document.getElementById('address-input');

    addressInp.value = addressName;
    addressInp.setAttribute('data-municipality', municipalityId);
    addressInp.setAttribute('data-province', provinceId);
}

async function createNewHobby(event){
    let newHobbyInp = document.getElementById('newHobby-input');
    let newHobby = newHobbyInp.value;
    if (newHobbyInp.value === ''){
        return;
    }
    newHobbyInp.value = '';
    try {
        let hobbyName = newHobby.charAt(0).toUpperCase() + newHobby.slice(1).toLowerCase();
        let newHobbyId = await hobbiesAPI_auto.create({name: hobbyName});
        console.log(newHobbyId);
        await rellenaHobbies();
        selectHobby(newHobbyId.lastId, hobbyName);
    } catch (error) {
        messageRenderer.showErrorAsAlert('Ya existe ese Hobby! Seleccionalo de la lista');
    }
}

function selectHobby(hobbyId, hobbyName, userHobbyId){
    let badgeContainer = document.getElementById('hobbies-selected');
    
    if(document.querySelector(`#hobbies-selected #badgeHobby-${hobbyId}`)){
        return false;
    }
    let badgeClass = badgeClasses[Math.floor(Math.random()*badgeClasses.length)]; // Para que tenga un color aleatorio
    let hobbyBadge = parseHTML(`<span class="badge badgeHobby p-2 rounded-pill ${badgeClass}" data-hobbyId=${hobbyId}>${hobbyName}</span>`);
    let hobbyCol = parseHTML(`<div id="badgeHobby-${hobbyId}" class="col my-2"></div>`);
    hobbyBadge.onclick = (event) => {
        let target = event.target;
        let parentTarget = event.target.parentNode;
        if (userHobbyId) {
            try {
                userhobbiesAPI_auto.delete(userHobbyId);
            } catch (error) {
                console.log(error);
                return;
            }
        }
        else if (event.target.parentNode !== badgeContainer){
            event.target.parentNode.remove();
            return;
        }
        event.target.remove();
    }
    hobbyCol.appendChild(hobbyBadge);
    badgeContainer.appendChild(hobbyCol);
}

async function handleSubmitEdit(event) {
    let userId = sessionManager.getLoggedId();
    let form = event.target;
    let formData = new FormData(form);
    event.preventDefault();
    let hobbiesList = document.querySelectorAll('.badgeHobby');
    let hobbiesIds = [];
    Array.from(hobbiesList, (hobbySpan) => { 
        let hobbyId = hobbySpan.getAttribute('data-hobbyId');
        hobbiesIds.push(hobbyId);
        userhobbiesAPI_auto.create({userId: userId, hobbyId: hobbyId})
    });

    let errors = userValidator.validateRegister(formData);
    let errorsDiv = document.getElementById("errors");
    errorsDiv.innerHTML = "";

    if (errors.length === 0) {
        // No hay errores, hay que enviar el formulario
        let username = formData.get("username");
        let email = formData.get("email");
        let firstName = formData.get("firstName");
        let lastName = formData.get("lastName");
        let password = formData.get("password");
        let dateOfBirth = formData.get("dateOfBirth");
        let gender = formData.get("gender");
        let hairColor = formData.get("hairColor");
        let eyeColor = formData.get("eyeColor");
        let height = formData.get("height");
        let weight = formData.get("weight");
        let bio = formData.get("bio");
        let address = formData.get("address");
        let avatarUrl = formData.get("avatarUrl");
        let ubiInput = document.getElementById('address-input');
        let provinceId = ubiInput.getAttribute("data-province");
        let municipalityId = ubiInput.getAttribute("data-municipality");
        let postcodeId = document.getElementById('postalCode').getAttribute('data-postcodeId');

        if (postcodeId === null) {
            try {
                let postcode = document.getElementById('postalCode').value;
                let postcodeResp = await postcodesAPI_auto.create({municipalityId: municipalityId, postcode: postcode});
                postcodeId = postcodeResp.lastId;
            } catch (error) {
                messageRenderer.showErrorAsAlert('Error registrando su codigo postal!');
            }
        }
        let registerData = {
            username: username,
            email: email,
            password: password,
            dateOfBirth: dateOfBirth,
            gender: gender,
            hairColor: hairColor,
            eyeColor: eyeColor,
            height: height,
            weight: weight,
            bio: bio,
            address: address,
            provinceId: provinceId,
            municipalityId: municipalityId,
            postcodeId: postcodeId,
            firstName: firstName,
            lastName: lastName,
            avatarUrl: avatarUrl
        }

        let response = await usersAPI_auto.update(registerData, userId);
        console.log('Update de profile hecho!');
        await creaHobbies(hobbiesIds);
        window.location.href = "profile.html";
    } else {
        // Mostrar los errores de validación
        for (let err of errors) {
            messageRenderer.showErrorAsAlert(err);
        }
    }
}

async function creaHobbies(hobbiesIds) {
    let userId = sessionManager.getLoggedId();
    try {
        await userhobbiesAPI.deleteAll(userId);
        hobbiesIds.map((hobbyId) => {
            userhobbiesAPI_auto.create({userId: userId, hobbyId: hobbyId});
        });
    } catch (error) {
        console.log(error);
        return;
    }
}

document.addEventListener("DOMContentLoaded", main);
"use strict";


const userValidator = {

    /* Validación de Login @param:formData */
    validateLogin: function (formData) {
        /* Array de los errores */
        let errors = [];

        /* guardamos el email del formulario(formData) */
        let email = formData.get("email");
        /* guardamos la contraseña del formulario(formData) */
        let password = formData.get("password");

         /* Si la longitud del email es menor que 1, error++ */
        if (email.length <= 1) {
            errors.push("El email debe de tener mas de un caracter.");
        }

        /* Si la longitud de la contraseña es menor que 1, error++ */
        if (password.length <= 1) {
            errors.push("La contraseña debe de tener mas de 1 caracteres");
        }

        /* Devolvemos los errores */
        return errors;
    },

    /* Validacion del registro @param:formData */
    validateRegister: function (formData) {
        console.log('Validating...');
        console.log(formData);
        /* Array de los errores */
        let errors = [];

        /* Inputs del form */
        let username = formData.get("username");
        let email = formData.get("email");
        let firstName = formData.get("firstName");
        let lastName = formData.get("lastName");
        let password = formData.get("password");
        let password2 = formData.get("password2");
        let dateOfBirth = formData.get("dateOfBirth");
        let height = formData.get("height");
        let weight = formData.get("weight");
        let bio = formData.get("bio");
        let birthDate = new Date(dateOfBirth);
        let today = new Date();

        /* El primer nombre tiene que tener mas de un caracteres */
        if (firstName.length <= 1) {
            errors.push("El nombre debe de tener mas de un caracter.");
        }

        /* El apellido debe de tener mas de un caracter */
        if (lastName.length <= 1) {
            errors.push("El apellido debe de tener mas de un caracter.");
        }

        /* El nombre de usuario debe de tener mas de 3 caracteres */
        if (username.length < 3) {
            errors.push("El nombre de usuario debe de tener al menos 4 caracteres.");
        }
        
        /* El email debe cumplir con un formato de nombre@servidor.algo */
        let reCorto = /\S+@\S+\.\S+/
        if (!reCorto.test(email)) {
            errors.push("Formato de email incorrecto");
        }

        /* Condiciones de la contraseña */
        if (password.length < 8) {
            errors.push("La contraseña debe contener al menos 8 caracteres."); 
        }
        if (email.search(/[a-z]/i) < 0) {
            errors.push("La contraseña debe contener al menos una letra.");
        }
/*         if (email.search(/[0-9]/) < 0) {
            errors.push("La contraseña debe contener al menos 1 digito."); 
        } */
        if (password !== password2) {
            errors.push("Las dos contraseñas deben coincidir.");
        }
        if (password.toLowerCase().includes(username.toLowerCase())) {
            errors.push("La contraseña no puede contener el nombre de usuario.");
        }

        /* Condición de rellenar biografía. */
        if (bio.length < 1) {
            errors.push("Escribe algo sobre ti en la biografía.");
        }

        /* Condicion de altura positiva */
        if (height <= 0) {
            errors.push("La altura debe ser un número positivo.");
        }

        /* Condicion de peso positivo */
        if (weight <= 0) {
            errors.push("El peso debe ser un número positivo.");
        }

        /* Condicion de mayoría de edad */
        if ((today - birthDate) / (31557600000) < 18.0) {
            errors.push("Debes ser mayor de edad para poder registrarte.");
        }

        /* Devolvemos los errores */
        return errors;
    },

};

export { userValidator };
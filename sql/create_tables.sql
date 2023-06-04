/* Carlos Arévalo, Nov/2021
 David Ruiz, Dic/2021
 Miguel Bermudo & Agustín Borrego, Mar/2022
 */
-- Creación esquema
DROP TABLE IF EXISTS ConversationMsg;
DROP TABLE IF EXISTS SearchPreferences;
DROP TABLE IF EXISTS UserFriendRequest;
DROP TABLE IF EXISTS UserHobbies;
DROP TABLE IF EXISTS Hobbies;
DROP TABLE IF EXISTS Pictures;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS PostCodes;
DROP TABLE IF EXISTS Municipalities;
DROP TABLE IF EXISTS Provinces;
-- Creación tablas
-- Provincias
CREATE TABLE Provinces (
	provinceId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	provinceName VARCHAR(64) NOT NULL
	/* Obligatorio */
);
-- Municipios de una provincia
CREATE TABLE Municipalities (
	municipalityId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	provinceId INT NOT NULL,
	/* Obligatorio */
	municipalityName VARCHAR(64) NOT NULL,
	/* Obligatorio */
	FOREIGN KEY(provinceId) REFERENCES Provinces(provinceId)
);
-- Codigo postal
CREATE TABLE PostCodes (
	postcodeId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	municipalityId INT NOT NULL,
	/* Obligatorio */
	postcode CHAR(5) NOT NULL,
	UNIQUE(postcode),
	FOREIGN KEY(municipalityId) REFERENCES Municipalities(municipalityId)
);
-- Usuarios
CREATE TABLE Users (
	userId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	username VARCHAR(128) NOT NULL,
	/*RN_1_0a*/
	email VARCHAR(128) NOT NULL,
	/*RN_1_0a*/
	password VARCHAR(128) NOT NULL,
	/*RN_1_0a*/
	dateOfBirth DATETIME NOT NULL,
	/*RN_1_0a*/
	registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP(),
	/*RN_1_0a RN_1_0b {readonly}*/
	withdrawalDate DATETIME,
	gender ENUM('male', 'female', 'other') NOT NULL,
	/*RN_1_0a, RN1_0z*/
	hairColor ENUM('black','brunette','blonde','ginger','white','gray','other') NOT NULL,
	/*RN_1_0a, RN1_0z*/
	eyeColor ENUM('black', 'brown', 'blue', 'green', 'gray', 'other') NOT NULL,
	/*RN_1_0a, RN1_0z*/
	height INT NOT NULL,
	/*RN_1_0a, RN_1_0z*/
	weight INT NOT NULL,
	/*RN_1_0a, RN_1_0z*/
	bio VARCHAR(1024) NOT NULL,
	/*RN_1_0a*/
	address VARCHAR(64) NOT NULL,
	/*RN_1_0a*/
	provinceId INT NOT NULL,
	/* Obligatorio */
	municipalityId INT,
	postcodeId INT,
	firstName VARCHAR(128) NOT NULL,
	/* No sale en los requisitos */
	lastName VARCHAR(128) NOT NULL,
	/* No sale en los requisitos */
	avatarUrl VARCHAR(512),
	/* No sale en los requisitos */
	FOREIGN KEY(provinceId) REFERENCES Provinces(provinceId),
	FOREIGN KEY(municipalityId) REFERENCES Municipalities(municipalityId),
	UNIQUE(email),
	/*RN_1_02*/
	CONSTRAINT RN_1_0b_negative_height CHECK(height >= 50),
	/*RI_1_0b*/
	CONSTRAINT RN_1_0b_negative_weight CHECK(weight >= 5),
	/*RI_1_0b*/
	CONSTRAINT RN_1_3_register_date_after_DoB CHECK(registrationDate >= dateOfBirth),
	CONSTRAINT RN_1_3_register_date_earlier_withdrawal CHECK(
		NOT (withdrawalDate IS NOT NULL)
		OR (withdrawalDate >= registrationDate)
	)
);
-- Fotos de un usuario
CREATE TABLE Pictures (
	pictureId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(64) NOT NULL
	/* Obligatorio RN_1_0c*/
,
	description VARCHAR(1024) NOT NULL
	/* Obligatorio RN_1_0c */
,
	pictureURL VARCHAR(2048) NOT NULL
	/* Obligatorio RN_1_0c */
,
	userId INT NOT NULL,
	FOREIGN KEY(userId) REFERENCES Users(userId)
);
-- Aficiones (conjunto de referencia)
CREATE TABLE Hobbies (
	hobbyId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(64) NOT NULL,
	UNIQUE(name)
	/* Obligatorio */
);
-- Aficiones de un usuario
CREATE TABLE UserHobbies (
	userHobbyId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	userId INT NOT NULL,
	hobbyId INT NOT NULL,
	UNIQUE(userId, hobbyId),
	FOREIGN KEY(userId) REFERENCES Users(userId),
	FOREIGN KEY(hobbyId) REFERENCES Hobbies(hobbyId)
);
-- Solicitudes de amistas RI-2-01
CREATE TABLE UserFriendRequest (
	userFriendRequestId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	userSolicitanteId INT NOT NULL,
	userAceptanteId INT NOT NULL,
	solicitanteDate DATETIME DEFAULT CURRENT_TIMESTAMP(),
	aceptanteDate DATETIME,
	solicitanteRevocacionDate DATETIME,
	aceptanteRevocacionDate DATETIME,
	FOREIGN KEY(userSolicitanteId) REFERENCES Users(userId),
	FOREIGN KEY(userAceptanteId) REFERENCES Users(userId)
);
-- Preferencias de busqueda RI-3-01
CREATE TABLE SearchPreferences(
	searchPreferencesId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	userId INT NOT NULL,
	ageRangeMin INT NOT NULL,
	ageRangeMax INT NOT NULL,
	heightRangeMin INT NOT NULL,
	heightRangeMax INT NOT NULL,
	weightRangeMin INT NOT NULL,
	weightRangeMax INT NOT NULL,
	gender ENUM('male', 'female', 'other') NOT NULL,
	hairColor ENUM(
		'black',
		'brunette',
		'blonde',
		'ginger',
		'white',
		'gray',
		'other'
	) NOT NULL,
	eyeColor ENUM('black', 'brown', 'blue', 'green', 'gray', 'other') NOT NULL,
	provinceId INT,
	municipalityId INT,
	postcodeId INT,
	hobbiesListId JSON, /* Lista JSON de ids de hobbies */
	FOREIGN KEY(userId) REFERENCES Users(userId),
	FOREIGN KEY(provinceId) REFERENCES Provinces(provinceId),
	FOREIGN KEY(municipalityId) REFERENCES Municipalities(municipalityId),
	FOREIGN KEY(postcodeId) REFERENCES PostCodes(postcodeId)
);

CREATE TABLE ConversationMsg(
	conversationMsgId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	userIniciaId INT NOT NULL,
	userOtroId INT NOT NULL,
	conversacion JSON NOT NULL,
	inicioDate DATETIME DEFAULT CURRENT_TIMESTAMP(),
	finDate DATETIME,
	FOREIGN KEY(userIniciaId) REFERENCES Users(userId),
	FOREIGN KEY(userOtroId) REFERENCES Users(userId)
);
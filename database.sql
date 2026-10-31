CREATE DATABASE kan_village;

-- Connect to kan_village database before running below queries

CREATE TABLE villageapp (
    villageapp_id SERIAL PRIMARY KEY,
    villageapp_name VARCHAR(100),
    villageapp_desc VARCHAR(200),
    villageapp_about VARCHAR(200)
);

CREATE TABLE villageorganisation (
    villageorganisation_id SERIAL PRIMARY KEY,
    organisation_name VARCHAR(45),
    f_organisation_id VARCHAR(45),
    f_villageapp_id INT REFERENCES villageapp(villageapp_id),
    isemergency VARCHAR(45)
);

CREATE TABLE villageadvertisement (
    villageadvertisement_id SERIAL PRIMARY KEY,
    advertisement_name VARCHAR(100),
    advertisement_image VARCHAR(200),
    advertisement_desc VARCHAR(200),
    start_date VARCHAR(45),
    end_date VARCHAR(45),
    f_villageapp_id INT REFERENCES villageapp(villageapp_id),
    f_villageorganisation_id INT REFERENCES villageorganisation(villageorganisation_id)
);

CREATE TABLE villageapp_user (
    villageapp_userid SERIAL PRIMARY KEY,
    villageapp_username VARCHAR(45),
    contact VARCHAR(45),
    isimportant VARCHAR(45),
    f_role_id VARCHAR(45),
    f_user_id VARCHAR(45),
    f_elastic_id INT,
    f_villageapp_id INT REFERENCES villageapp(villageapp_id)
);
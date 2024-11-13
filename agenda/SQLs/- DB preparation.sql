CREATE DATABASE IF NOT EXISTS agenda ;

USE agenda;

DROP TABLE IF EXISTS family;
CREATE TABLE family (
	id INT AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
); -- family

DROP TABLE IF EXISTS agendas;
CREATE TABLE agendas (
	id INT AUTO_INCREMENT,
	descr VARCHAR(255) NOT NULL,
    exec_id INT(255) NOT NULL,
    created_dt DATE NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (exec_id) REFERENCES family(id)
); -- agendas

/********************************************/
INSERT INTO family ( name, nickname, role )
VALUES 
( 'Avraham', 'dad', 'father' ) ,
( 'Sarra', 'mom', 'mother' ) ,
( 'Yakov', 'Kobi', 'san' ) ,
( 'Issak', 'Itzi', 'san' ) ,
( 'Miriam', 'Miri', 'daughter' ) 

/********************************************/
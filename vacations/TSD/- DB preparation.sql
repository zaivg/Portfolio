/********************************************/
/***** CREATE SCHEMA db_vacations ***********/
/********************************************/
DROP DATABASE IF EXISTS db_vacations ;
CREATE DATABASE IF NOT EXISTS db_vacations ;

USE db_vacations;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id INT AUTO_INCREMENT,
	f_name VARCHAR(255) NOT NULL,
	l_name VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT 0,
	login VARCHAR(255) NOT NULL,
	psw VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY users_uk (login),
    CONSTRAINT users_admin_uk CHECK (IF(login="admin", is_admin=1, is_admin=0))
); -- users


DROP TABLE IF EXISTS vacations;
CREATE TABLE vacations (
	id INT AUTO_INCREMENT,
    descr VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    dt_from DATE NOT NULL,
    dt_to DATE NOT NULL,
    price DECIMAL(65,2) NOT NULL,
    img VARCHAR(255) ,
    PRIMARY KEY (id),
    UNIQUE KEY vacations_uk (descr, destination, dt_from, dt_to),
    CONSTRAINT vacations_price_positive CHECK (price >= 0)
); -- vacations


DROP TABLE IF EXISTS followers;
CREATE TABLE followers (
	user_id INT  NOT NULL,
	vacation_id INT  NOT NULL,
    PRIMARY KEY (user_id, vacation_id),
	FOREIGN KEY followers_fk_user (user_id) REFERENCES users(id), 
    FOREIGN KEY followers_fk_vacation (vacation_id) REFERENCES vacations(id)
); -- followers


/********************************************/
/***** ADD STORE PROCEDURES *****************/
/********************************************/
DROP PROCEDURE IF EXISTS db_vacations.sp_AddUser;
DELIMITER //
CREATE PROCEDURE db_vacations.sp_AddUser( _f_name VARCHAR(255), _l_name VARCHAR(255)
										, _login VARCHAR(255), _psw VARCHAR(255)
										, OUT statusCode INT, OUT statusText VARCHAR(255) )
BEGIN

IF (SELECT COUNT(*) FROM users WHERE UPPER(login) = UPPER(_login) ) > 0 THEN
	SET statusCode = 400; # Bad Request
    SET statusText = "This login already exists.";
ELSE
	INSERT INTO users ( f_name, l_name, login, psw )
	VALUES ( _f_name, _l_name, _login, _psw );
 	SET statusCode = 201; # Created
    SET statusText = 'Created';
END IF;

END;
//
DELIMITER ;
# sp_AddUser

/********************************************/
/***** ADD ADMIN (psw = 'admin') ************/
/********************************************/
-- Add ADMIN: (psw = 'admin')
INSERT INTO users (f_name, l_name, is_admin, login, psw)
VALUES ('ADMIN', 'ADMIN', 1, 'admin', '$2a$10$iXj..WTDJ1P2pVdYql8oyOSr.bo8QnGrNNg75uQoHpNTDsY5mwwWy') ;
/********************************************/

const formidable = require('formidable');
const { PRIVATE_KEY, SALT_ROUNDS, UPLOAD_DIR } = require('./options');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');


/**** db connection *****/
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_vacations',
    flags: 'MULTI_STATEMENTS'
});//.createConnection

db.connect(err => {
    if (err) throw err
    LogMainStart("connected to My SQL");
});


/**** hash / compare assword *****/
const hashPassword = (psw) => {
    return new Promise(function (resolve, reject) {
        bcryptjs.genSalt(SALT_ROUNDS, (err, salt) => {
            if (err) reject(err);
            bcryptjs.hash(psw, salt, (err, hash) => {
                if (err) reject(err);
                resolve(hash);
            });//bcryptjs.hash()
        });//bcryptjs.genSalt()        
    })//Promise
}//hashPassword()


const comparePassword = (psw, hashedPsw) => {
    return new Promise(function (resolve, reject) {
        bcryptjs.compare(psw, hashedPsw, (err, isOK) => {
            if (err) reject(err);
            resolve(isOK);
        });//bcryptjs.compare()
    })//Promise
}//comparePassword()


const getRowDataPacket = (result) => {//returns RowDataPacket
    if (!result || result.length == 0) return undefined;

    if (result.length > 1) return result[1][0];
    else return result[0];
}//getRowDataPacket();


/**** token *****/
const setToken = (user) => {
    return new Promise(function (resolve, reject) {
        jwt.sign(JSON.stringify(user), PRIVATE_KEY, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });//jwt.sign()
    })//Promise
}//setToken()


// middleware:
const ver_token = (req, res, next) => {
    LogReqStart(req, "ver_token");
    // console.log('req.session.token: ', req.session.token);

    if (!req.session.token) {
        console.log("ver_token: token is not found!");
        res.status(403).send("Authorization required");
    } else {
        jwt.verify(req.session.token, PRIVATE_KEY, (err, payload) => {
            if (err) {
                console.log("ver_token: ERROR:", err);
                res.status(403).send("Authorization required");
            } else {
                req.user = payload;
            }//jwt.verify is OK
        })//jwt.verify()
        next();
    }//else token exists

}//ver_token()


// middleware:
const upload_file = (req, res, next) => {
    LogReqStart(req, "upload_file");
    var form = new formidable.IncomingForm();
    form.uploadDir = UPLOAD_DIR;
    form.keepExtensions = true;
    form.multiples = false;

    form.parse(req, (err, fields, files) => {
        try {
            if (err) throw err;
            req.fileInfo =  files[Object.keys(files)[0]];
            req.vacation = fields.vacation;
        } catch (err) {
            console.log("upload_file: ERROR:", err);
            res.status(500).send(err.toString());//Internal Server Error;
        }
    })//form.parse

    form.on('error', function (err) {
        console.log("upload_file: ERROR (onError):", err);
        res.status(500).send(err.toString());//Internal Server Error;
    });

    form.on('end', function () {
        //console.log("upload_file: (onEnd)");
        next();
    });

}//upload_file()


/**** log *****/
LogMainStart = (str) => {
    console.log('='.repeat(50) + '\n'
        , str
        , '\n' + '='.repeat(50));
}; //LogMainStart()


LogReqStart = (req, title = "") => {
    console.log('-'.repeat(50) + '\n'
        ,title , req.method, req.originalUrl
        , '\n' + '-'.repeat(50));
}; //LogReqStart()

module.exports = {
    db
    , hashPassword
    , comparePassword
    , getRowDataPacket
    , setToken
    , ver_token
    , upload_file
    , LogMainStart
    , LogReqStart
}
/***** /users *****/
const express = require('express');
const router = express.Router();
const { db
    , hashPassword, comparePassword
    , getRowDataPacket
    , setToken, ver_token
    , LogReqStart
} = require('./global');


// Sign In ---------------- :
router.post('/signin', async (req, res) => {
    LogReqStart(req);
    //console.log("req.body:", req.body);
    let pswHashed = "";
    let { f_name, l_name, login, psw } = req.body;
    if (!(f_name && l_name && login && psw)) {
        res.status(400).send("Failed! All fields are required"); //400:Bad Request
        return;
    }
    try {
        await hashPassword(psw)
            .then(hashed => { pswHashed = hashed })
            .catch(err => { throw err })

        const sql = `CALL sp_AddUser(${"?,".repeat(4)} @statusCode, @statusText); `
            + `select @statusCode as statusCode, @statusText as statusText`;
        //console.log("sql = ", sql);
        db.query(sql, [f_name, l_name, login, pswHashed], (err, result, fields) => {
            if (err) {
                console.log("ERROR:", err);
                res.status(500).send(err.sqlMessage); //Internal Server Error
            }
            //console.log("result:", result);
            let statusInfo = getRowDataPacket(result);
            if (statusInfo.statusCode === 201) {//Created
                try {
                    const sql = `SELECT id, f_name, l_name, is_admin, login FROM users WHERE login = "${login}"`;
                    //console.log("sql = ", sql);
                    db.query(sql, async (err, result, fields) => {
                        if (err) {
                            console.log("ERROR:", err);
                            res.status(500).send(err.sqlMessage); //Internal Server Error
                            return;
                        }
                        // console.log("result:", result);

                        if (!result.length) { //user is not found:
                            req.session.destroy();
                            res.status(400).send(`User '${login}' has not been added`); //Bad Request
                            return;
                        }

                        const user = getRowDataPacket(result);
                        //console.log("user:", user);

                        await setToken(user)
                            .then(t => { token = t })
                            .catch(err => { throw err }) //comparePassword

                        req.session.token = token;
                        req.session.save();

                        res.status(201).json(user).send();//201=Created
                    });//db.query

                } catch (err) {
                    console.log("ERROR:", err);
                    res.status(500).send(err); //Internal Server Error
                }//catch (err)

            } else {//statusCode!=Creaeted
                res.status(statusInfo.statusCode).send(statusInfo.statusText);
            }
        });//db.query
    } catch (err) {
        console.log("ERROR:", err);
        res.status(500).send(err); //Internal Server Error
    }//catch (err)
})//post(/)


// Login ---------------- :
router.post('/login', async (req, res) => {
    LogReqStart(req);
    //console.log("req.body:", req.body);

    const { login, psw } = req.body;

    if (!(login, psw)) {
        res.status(400).send("All fields are required!"); //Bad Request
        return;
    }

    try {
        const sql = `SELECT id, f_name, l_name, is_admin, login, psw FROM users WHERE login = "${login}"`;
        //console.log("sql = ", sql);
        db.query(sql, async (err, result, fields) => {
            if (err) {
                console.log("ERROR:", err);
                res.status(500).send(err.sqlMessage); //Internal Server Error
                return;
            }
            // console.log("result:", result);

            if (!result.length) { //user is not found:
                req.session.destroy();
                res.status(400).send(`User '${login}' is not found! Registration required.`); //Bad Request
                return;
            }

            const user = getRowDataPacket(result);
            //console.log("user:", user);

            await comparePassword(psw, user.psw/*hashed*/)
                .then(isOK => { isPswOK = isOK })
                .catch(err => { throw err }) //comparePassword

            if (!isPswOK) {//Incorrect password!:
                res.status(400).send("Incorrect password!"); //Bad Request
                return;
            }

            user.psw = undefined;//don't save / send passwod!
            await setToken(user)
                .then(t => { token = t })
                .catch(err => { throw err }) //comparePassword

            req.session.token = token;
            req.session.save();

            res.status(200).json(user).send();//200=OK 
        });//db.query

    } catch (err) {
        console.log("ERROR:", err);
        res.status(500).send(err); //Internal Server Error
    }//catch (err)
})//post(/)


// Unlogin ---------------- :
router.get('/unlogin', async (req, res) => {
    LogReqStart(req);

    req.session.destroy();
    res.send();//200=OK 
})//post(/)


// Check Token ---------------- :
router.get('/', ver_token, (req, res) => {
    LogReqStart(req);
    console.log("user", req.user);

    res.json(req.user);
});//router.get('/:id')


module.exports = router;
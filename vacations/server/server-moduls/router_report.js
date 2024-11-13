/***** /report *****/
const express = require('express');
const router = express.Router();
const { db
    , ver_token
    , LogReqStart
} = require('./global');


// get data for the report (admin) ---------------- :
router.get('/', ver_token, (req, res) => {
    LogReqStart(req);
    const user = req.user;
    
    if (!user.is_admin) {
        res.status(405).send("Only administrator is allowed to update vacations!"); //Method Not Allowed
        return;
    }

    const sql = `SELECT v.destination AS x, COUNT( f.vacation_id ) AS y 
    FROM vacations AS v LEFT JOIN followers AS f
    ON f.vacation_id = v.id
    GROUP BY v.id, v.destination 
    ORDER BY v.id`;
    //console.log("sql = ", sql);
        db.query(sql, (err, result, fields) => {
            if (err) {
                console.log("ERROR:", err);
                res.status(500).send(err); //Internal Server Error;
        }
        // console.log("result:", result);
        res.json( { user, vacations: result } ); //200: OK
    });//db.query
});//router.get( '/')


module.exports = router;
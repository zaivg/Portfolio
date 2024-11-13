/***** /following *****/
const express = require('express');
const router = express.Router();
const { db
    , ver_token
    , LogReqStart
} = require('./global');


// Get all Vacation for admin/user ---------------- :
router.get('/vacations', ver_token, (req, res) => {
    LogReqStart(req);
    const user = req.user;

    const sql =
        `SELECT v.*, v.img AS old_img
        , IF(f.user_id IS null, 0, 1) AS is_follow
     FROM vacations AS v LEFT JOIN followers AS f
     ON f.vacation_id = v.id AND f.user_id = ${ user.id}
     ORDER BY is_follow DESC, v.destination`;
    //console.log("sql = ", sql);
    db.query(sql, (err, result, fields) => {
        if (err) {
            console.log("ERROR:", err);
            res.status(500).send(err); //Internal Server Error;
        }
        // console.log("result:", result);
        res.json( { user, vacations: result } ); //200: OK
    });//db.query
});//router.get( '/vacations')


// Update Vacation by non-admin user (follow/unfollow)  ---------------- :
router.put('/:vacation_id/:is_follow', ver_token, (req, res) => {
    LogReqStart(req);

    const user = req.user;
    if (user.is_admin) {
        res.status(405).send("Only a user is allowed to follow/unfollow the vacations!"); //Method Not Allowed
        return;
    }

    const vacation_id= req.params.vacation_id;
    const is_follow = +req.params.is_follow;
    //console.log("vacation_id=", vacation_id, "is_follow=", is_follow);
    if (!vacation_id || isNaN(is_follow)) {
        res.status(500).send("Missing some parameter"); //Internal Server Error
        return;
    }

    let sql="";
    if (is_follow) {
        sql = `REPLACE INTO followers ( user_id, vacation_id )
        VALUES ( ${ user.id}, ${vacation_id} )`;
    } else {
        sql = `DELETE FROM followers 
        WHERE user_id = ${ user.id} AND vacation_id = ${vacation_id} `;
    }
    //console.log("sql = ", sql);
    db.query(sql, (err, result, fields) => {
        if (err) {
            console.log("ERROR:", err);
            res.status(500).send(err.sqlMessage); //Internal Server Error
        }
        //console.log("result:", result);
        res.send(is_follow ? "Followed" : "Unfollowed"); //200: OK
    });//db.query

}); //router.post('/follow/:vacation_id')


module.exports = router;
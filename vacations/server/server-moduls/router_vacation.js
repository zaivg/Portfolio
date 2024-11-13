/***** /vacation *****/
const express = require('express');
const fs = require('fs');
const router = express.Router();
const { UPLOAD_DIR } = require('./options');
const { db
    , ver_token
    , upload_file
    , LogReqStart
    , getRowDataPacket
} = require('./global');


const getFileName = (fileInfo) => {
    if (!!fileInfo) return fileInfo.path.split("\\").pop();
}//getFileName()


const deleteOldImg = (old_img) => {
    if (!old_img) return;
    fs.unlink(UPLOAD_DIR + old_img, (err) => {
        if (err) console.log(`ERROR deleting old image file ${old_img}: ${err}`);
        else console.log(`Old image file ${old_img} deleted!`);
    });//fs.unlink
}//deleteOldImg()


// Add Vacation by admin ---------------- :
router.post('/', ver_token, upload_file, (req, res) => {
    LogReqStart(req);
    const user = req.user;
    console.log("user=", user);

    if (!user.is_admin) {
        res.status(405).send("Only administrator is allowed to add vacations!"); //Method Not Allowed
        return;
    }//!user.is_admin

    const imgFileName = getFileName(req.fileInfo);
    const { descr, destination, dt_from, dt_to, price } = JSON.parse(req.vacation);
    //console.log("req.vacation=", req.vacation, "imgFileName=", imgFileName);

    if (!(descr && destination && dt_from && dt_to && (price !== undefined))) {
        console.log("Failed! All fields are must : descr, destination, dt_from, dt_to, price", descr, destination, dt_from, dt_to, price);
        res.status(400).send("Failed! All fields marked with * are required"); //400:Bad Request
        return;
    }

    const sql = `INSERT INTO vacations ( descr, destination, dt_from, dt_to, price, img )
            VALUES ( "${descr}", "${destination}", "${dt_from}", "${dt_to}", ${price}, ${!!imgFileName ? "'" + imgFileName + "'" : "null"} );`;
    //console.log("sql = ", sql);
    db.query(sql, (err, result) => {
        if (err) {
            console.log("ERROR:", err);
            res.status(500).send(err.sqlMessage); //Internal Server Error
        }
        //console.log("result:", result);
        res.sendStatus(201); //Created
    });//db.query

})//post(/)


// Update Vacation by admin ---------------- :
router.put('/', ver_token, upload_file, (req, res) => {
    LogReqStart(req);
    const user = req.user;
    //console.log("user=", user);

    if (!user.is_admin) {
        res.status(405).send("Only administrator is allowed to update vacations!"); //Method Not Allowed
        return;
    }//!user.is_admin

    const imgFileName = getFileName(req.fileInfo);
    const { id, descr, destination, dt_from, dt_to, price, img, old_img } = JSON.parse(req.vacation);
    //console.log("req.vacation=", req.vacation, "imgFileName=", imgFileName);

    if (!(descr && destination && dt_from && dt_to && (price !== undefined))) {
        console.log("Failed! All fields are must : descr, destination, dt_from, dt_to, price", descr, destination, dt_from, dt_to, price);
        res.status(400).send("Failed! All fields marked with * are required"); //400:Bad Request
        return;
    }
    let sqlImg = "";
    if (!!imgFileName) { sqlImg = `, img = '${imgFileName}' `; }
    else if (!img) { sqlImg = `, img = null`; }

    const sql = `UPDATE vacations
    SET descr = "${descr}", 
        destination = "${destination}", 
        dt_from = "${dt_from}", 
        dt_to = "${dt_to}", 
        price = ${price} 
        ${ sqlImg}
    WHERE id = ${id}`;
    //console.log("sql = ", sql);

    db.query(sql, (err, result, fields) => {
        if (err) {
            console.log("ERROR:", err);
            res.status(500).send(err.sqlMessage); //Internal Server Error
        }
        //console.log("result:", result);

        if (old_img && (img !== old_img)) deleteOldImg(old_img)

        res.send("Updated"); //200: OK
    });//db.query
})//put(/)


// Delete Vacation by admin ---------------- :
router.delete('/:vacation_id', ver_token, (req, res) => {
    LogReqStart(req);

    const user = req.user;
    if (!user.is_admin) {
        res.status(405).send("Only administrator is allowed to update vacations!"); //Method Not Allowed
        return;
    }

    const vacation_id = req.params.vacation_id;
    //console.log("vacation_id = ", vacation_id);
    if (!vacation_id) {
        res.status(500).send("Missing parameter"); //Internal Server Error
        return;
    }

    //Delete image file if needs:
    let sql = `SELECT img FROM vacations WHERE id = ${vacation_id}`;
    //console.log("sql = ", sql);
    db.query(sql, (err, result, fields) => {
        if (err) {
            console.log("ERROR:", err);
            res.status(500).send(err); //Internal Server Error;
        }
        //console.log("result:", result);
        let imgFileName;
        if (result.length !== 0) imgFileName = getRowDataPacket(result).img
        //console.log("imgFileName:", imgFileName);
        if (!!imgFileName) deleteOldImg(imgFileName);
    });//db.query

    //Delete row:
    sql = `DELETE FROM vacations WHERE id = ${vacation_id}`;
    //console.log("sql = ", sql);
    db.query(sql, (err, result, fields) => {
        if (err) {
            console.log("ERROR:", err);
            res.status(500).send(err.sqlMessage); //Internal Server Error
        }
        // console.log("result:", result);
        res.send("Deleted"); //200: OK
    });//db.query

});//router.delete(/vacation_id)

module.exports = router;
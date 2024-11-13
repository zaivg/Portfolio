const express = require('express');
const cors = require('cors')
const mysql = require('mysql');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());//decrypts body to json

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'agenda'
});//.createConnection

db.connect(err => {
    if (err) throw err
    console.log("connected to My SQL")
});

// let convertDtToSQL = (dt) => {
//     console.log(dt);
//     const parts = dt.split('T')
//     return parts[0] + ' ' + parts[1].split('.')[0];
// }//convertDtToSQL()


// family ---------------- :
app.get('/family', (req, res) => {
    console.log(req.method, req.url);

    const sql = `SELECT id, nickname FROM family ORDER BY nickname`
    db.query(sql, (err, result, fields) => {
        if (err) {
            res.sendStatus(400); //Bad Request
            throw err;
        }
        // console.log("result:", result);
        res.json(result);
    });//db.query
});//app.get( '/family')


// agendas ---------------- :
app.get('/agendas', (req, res) => {
    console.log(req.method, req.url);

    const sql = `SELECT  f.nickname, f.role, a.*
    FROM family as f INNER JOIN  agendas as a 
    ON f.id = a.exec_id
    ORDER BY created_dt, f.nickname`
    db.query(sql, (err, result, fields) => {
        if (err) {
            res.sendStatus(400); //Bad Request
            throw err;
        }
        // console.log("result:", result);
        res.json(result);
    });//db.query
});//app.get('/agendas')


app.post('/agendas', (req, res) => {
    console.log(req.method, req.url);
    console.log(" req.body:", req.body);

    const { descr, exec_id } = req.body;
    if (!( descr && exec_id )) {
        res.status(400).send("Failed! All fields are must"); //400:Bad Request
        return;
    }

    const sql = `INSERT INTO agendas ( descr, exec_id, created_dt )
    VALUES ( ' ${descr}', ' ${exec_id}', now() )`
    console.log("sql:", sql);
    db.query(sql, (err, result, fields) => {
        if (err) {
            res.sendStatus(400);
            throw err;
        }
        console.log("result:", result);
        res.sendStatus(201); //Created
    });//db.query
})//post(/some)


app.delete('/agendas/:id', (req, res) => {
    console.log(req.method, req.url);
    console.log("req.params.id:", req.params.id);

    if (!req.params.id) {
        res.sendStatus(400); //Bad Request
        return;
    }

    sql = `DELETE FROM agendas WHERE id = ${req.params.id}`;
    db.query(sql, (err, result, fields) => {
        if (err) {
            res.sendStatus(400);
            throw err;
        }
        console.log("result:", result);
        res.sendStatus(200); //OK
    });//db.query

});//app.delete(/some/:id)



/***** listen *****/
app.listen(port, () => console.log("Server started on port " + port));

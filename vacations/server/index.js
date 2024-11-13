const express = require('express');
const app = express();
const http = require("http").createServer(app);
const io = require('socket.io')(http);

const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { port, CORS_OPTIONS, SESSION_OPTIONS, STATIC_DIR } = require('./server-moduls/options');
const { LogMainStart } = require('./server-moduls/global');
const router_users = require('./server-moduls/router_users');
const router_vacation = require('./server-moduls/router_vacation');
const router_following = require('./server-moduls/router_following');
const router_report = require('./server-moduls/router_report');

app.use(cors(CORS_OPTIONS));
app.use(express.json());//decrypts body to json
app.use(cookieParser())
//app.use(bodyParser.urlencoded({extended: true}));
app.use(session(SESSION_OPTIONS));//session
app.use(express.static(STATIC_DIR));

app.use('/users', router_users);
app.use('/vacation', router_vacation);
app.use('/following', router_following);
app.use('/report', router_report);


/***** sockets *****/
io.on('connection', (socket) => {
    LogMainStart("New client connected: " + socket.id);


    socket.on('clientAction', () => {
        console.log('>>> client action');
        socket.broadcast.emit('refreshInfo'); // io.emit('refreshInfo');
    });//socket.on('clientAction')


    socket.on('disconnect', () => {
        LogMainStart("Client disconnected: " + socket.id);
    });//socket.on('disconnect')
});//io.on('connection')


/***** listen *****/
http.listen(port, () => LogMainStart("Server started on port " + port));


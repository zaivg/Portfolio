const port = 3000;
const client_port = port + 1;
const ORIGIN = ['http://localhost:' + port
              , 'http://localhost:' + client_port];
const PRIVATE_KEY = "somePrivateKey";
const SALT_ROUNDS = 10;
const STATIC_DIR = 'uploads';
const UPLOAD_DIR = process.cwd() + `/${STATIC_DIR}/`;
const SESSION_SECRET = "someSessionSecret";
const EXPIRE_DAYS = 7;


const CORS_OPTIONS = {
  credentials: true,
  origin: ORIGIN
}


const getDtExpire = () => {
  let dtExpire = new Date();
  dtExpire.setDate(dtExpire.getDate() + EXPIRE_DAYS);
  return dtExpire;
}; //getDtExpire()


const SESSION_OPTIONS = { 
  secret: SESSION_SECRET, 
  resave: false, 
  saveUninitialized: true,
  cookie: {   path: '/',
              expires: getDtExpire(), 
              secure: false,
              httpOnly: true
          },
} //SESSION_OPTIONS{}


module.exports = {
    port
  , STATIC_DIR
  , UPLOAD_DIR
  , PRIVATE_KEY
  , SESSION_SECRET
  , SALT_ROUNDS
  , CORS_OPTIONS
  , SESSION_OPTIONS
}
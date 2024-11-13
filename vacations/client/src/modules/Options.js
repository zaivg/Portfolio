const SERVER_ROOT = "http://localhost:3000";
const IMG_TYPES = ['image/png', 'image/jpeg', 'image/gif']
const IMG_SIZE_MAX = 5242880; //5MB
const LBL_MSG_IMG_TYPES_SIZE = 'Allowed images: png, jpeg ,gif until 5MB';
const LBL_MSG_IMG_NO_CHOISEN = 'Image not chosen';


module.exports = { 
      SERVER_ROOT
    , IMG_TYPES 
    , IMG_SIZE_MAX
    , LBL_MSG_IMG_TYPES_SIZE
    , LBL_MSG_IMG_NO_CHOISEN
} ;
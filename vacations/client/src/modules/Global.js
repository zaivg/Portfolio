import { SERVER_ROOT } from './Options'
import openSocket from 'socket.io-client';
const socket = openSocket(SERVER_ROOT);

const getTokenUser = () => {
  return new Promise(async function (resolve, reject) {
    try {
      let data = await fetch(SERVER_ROOT + "/users", {
        credentials: "include",
        method: 'GET'
      });

      if (data.status === 200) {
        let dataJSON = await data.json();
        console.log("getTokenUser(): OK ");
        resolve(dataJSON);
      } else {
        let text = await data.text();
        console.log("getTokenUser(): text", text);
        reject(text);
      }

    } catch (err) {
      console.log("getTokenUser(): ERROR: ", err);
      reject(err.toString());
    }
  })//Promise()
} //getTokenUser()


const getDispatchParams = (type, payload = undefined) => {
  return { type, payload };
}

const getDateFormatted = (date, isISO) => {
  if (!date) return;
  const dt = new Date(date);
  const sDT = isISO ? dt.toISOString() : dt.toLocaleString();
  return sDT.split("T")[0]
}//getDateFormatted()


/***** SOCKETS *****/
const subscribeToRefreshInfo = (cb) => {
  console.log(">>>>>> subscribeToRefreshInfo");
  socket.on('refreshInfo', () => { 
    console.log(">>>>>> refreshInfo");
    cb() });
}//subscribeToRefreshInfo()

const sendClientAction = () => {
  console.log(">>>>>> sendClientAction");
  socket.emit('clientAction');
}//sendClientAction()



export {
  getTokenUser
  , getDispatchParams
  , getDateFormatted
  , subscribeToRefreshInfo, sendClientAction
};
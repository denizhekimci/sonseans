const firebase = require("firebase-admin");

var serviceAccount = require("../firebase/sonseansbot-a8463-firebase-connection.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://sonseansbot-a8463.firebaseio.com'
});

var connection = firebase.database();

function saveChat(chat_id, person){
    connection.ref('/chats/' + chat_id).set(person);
}

function getChatsRF(){
    return connection.ref('/chats');
}

module.exports = {

    getChatsRF : getChatsRF,

    saveChat : saveChat
};
import {fbAuth, dbUsers} from '../firebase/data.js';
const search = document.getElementById('searchgroup');
search.remove();
var parametrs = location.search.substring(1).split('&');
var temp = parametrs[0].split('=');
const indexP = decodeURI(temp[1]);
console.log(indexP);
// var data = [];
var curUser;
const getUser = () => {
  fbAuth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      dbUsers
          .where('email', '==', user.email)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              curUser = doc.data();
              curUser.id = doc.id;
            });
          });
    }
  });
};
getUser();

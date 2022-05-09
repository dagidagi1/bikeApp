import {dbProducts, fbAuth, dbUsers, dbOrders} from '../firebase/data.js';
const search = document.getElementById('searchgroup');
search.remove();
var parametrs = location.search.substring(1).split('&');
var temp = parametrs[0].split('=');
const index_p = decodeURI(temp[1]);
console.log(index_p);
var data = [];
var cur_user;
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
              cur_user = doc.data();
              cur_user.id = doc.id;
            });
          });
    }
  });
};
getUser();

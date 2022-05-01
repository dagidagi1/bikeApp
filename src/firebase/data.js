import { state } from "../../firebase.js";

let data = [];

firebase.initializeApp(state.firebaseConfig);
// Set database variable
//import "firebase/firestore";
var database = firebase.firestore();
database
  .collection("products")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
  });
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      console.log(user);
      var uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
export { data as data };

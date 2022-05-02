import { state } from "../../firebase.js";
firebase.initializeApp(state.firebaseConfig);
// Set database variable
//import "firebase/firestore";
var database = firebase.firestore();
var prod = database.collection('products');
var usrs = database.collection("users");
var fbAuth = firebase.auth();
  export {fbAuth as fbAuth};
  export { prod as dbProducts };
  export { usrs as dbUsers };

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
export { data as data };

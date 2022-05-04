import { state } from "../../firebase.js";
firebase.initializeApp(state.firebaseConfig);
// Set database variable
//import "firebase/firestore";
var storageRef = firebase.storage().ref();
var database = firebase.firestore();
var prod = database.collection("products");
var usrs = database.collection("users");
var stores = database.collection("stores");
var orders = database.collection("orders");
var fbAuth = firebase.auth();
export { fbAuth as fbAuth };
export { prod as dbProducts };
export { usrs as dbUsers };
export { stores as dbStores };
export { orders as dbOrders };
export {storageRef as storageRef};

import { fbAuth, dbUsers, dbStores } from "../firebase/data.js";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const storeName = document.getElementById("store_name");
let userId = null;
let shopId = null;

document.getElementById("create_btn").addEventListener("click", function () {
  const workHours = new Map();
  DAYS_OF_WEEK.forEach((d) => {
    if (document.getElementById(d).checked == false) {
      workHours.set(d, [false]);
    } else {
      workHours.set(d, [
        true,
        document.getElementById(`${d}_from`).value,
        document.getElementById(`${d}_till`).value,
      ]);
    }
  });
  const wH = Object.fromEntries(workHours);
  fbAuth.onAuthStateChanged((user) => {
    if (user) {
      dbUsers
        .where("email", "==", user.email)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            userId = doc.id;
          });
          dbStores
            .add({
              name: storeName.value,
              workHours: wH,
              products: [],
              income: 0,
              sells: 0,
              orders: [],
            })
            .then((docRef) => {
              shopId = docRef.id;
              var userRef = dbUsers.doc(userId);
              userRef.update({
                store: shopId,
              });
            })
            .then(() => {
              location.replace("shop_dashboard.html" + "?id=" + shopId);
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
        });
    }
  });
});

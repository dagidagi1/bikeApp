import { dbProducts, fbAuth, dbUsers, dbOrders } from "../firebase/data.js";
const search = document.getElementById("searchgroup");
search.remove();
var parametrs = location.search.substring(1).split("&");
var temp = parametrs[0].split("=");
const index_p = decodeURI(temp[1]);
console.log(index_p);
var data = [];
var cur_user;
const userNameNavBar = document.getElementById("navbar_profile_name");
const wish_list = document.getElementById("wish_list");
const shopping_cart = document.getElementById("shopping_cart");
const updateNavBar = () => {
  fbAuth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      dbUsers
        .where("email", "==", user.email)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            cur_user = doc.data();
            cur_user.id = doc.id;
            console.log(cur_user);
            userNameNavBar.innerText = doc.data().name;
            if (doc.data().wishList.length > 0) wish_list.style = "color: red";
            if (doc.data().shoppingList.length > 0)
              shopping_cart.style = "color: red";
          });
        });
    }
  });
};
updateNavBar();

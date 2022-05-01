import { dbProducts, fbAuth, dbUsers } from "../firebase/data.js";
const search = document.getElementById("searchgroup");
search.remove();
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
            userNameNavBar.innerText = doc.data().name;
            if (doc.data().wishList.length > 0) wish_list.style = "color: red";
            if (doc.data().orderList.length > 0)
              shopping_cart.style = "color: red";
          });
        });
    }
  });
};
updateNavBar();

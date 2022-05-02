import { dbProducts, fbAuth, dbUsers } from "../firebase/data.js";
const type = document.getElementById("type_d");
const name = document.getElementById("product_page_name");
const price = document.getElementById("product_page_price");
const description = document.getElementById("description_d");
const manufacturer = document.getElementById("manufactur_d");
const max_speed = document.getElementById("max_speed_d");
const weight = document.getElementById("weight_d");
const wheel_size = document.getElementById("wheel_size_d");
const quantity = document.getElementById("quantetity_d");
const search = document.getElementById("searchgroup");
const userNameNavBar = document.getElementById("navbar_profile_name");
const wish_list = document.getElementById("wish_list");
const shopping_cart = document.getElementById("shopping_cart");
search.remove();
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

const redirectToDiscription = () => {};
redirectToDiscription();

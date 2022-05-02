import { dbProducts, fbAuth, dbUsers } from "../firebase/data.js";
let username = document.getElementById("username");
let phone_number = document.getElementById("phone_number");
let email = document.getElementById("email");
const search = document.getElementById("searchgroup");
search.remove();
let user;
const userNameNavBar = document.getElementById("navbar_profile_name");
const wish_list = document.getElementById("wish_list");
const shopping_cart = document.getElementById("shopping_cart");
const updateNavBar = () => {
  fbAuth.onAuthStateChanged((u) => {
    if (u) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      dbUsers
        .where("email", "==", u.email)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            user = doc.data();
            user.id = doc.id;
            console.log(user);
            userNameNavBar.innerText = doc.data().name;
            updateDetails();
            if (doc.data().store != false) has_store = doc.data().store;
            if (doc.data().wishList.length > 0) wish_list.style = "color: red";
            if (doc.data().orderList.length > 0)
              shopping_cart.style = "color: red";
          });
        });
    }
  });
};
updateNavBar();
const edit_btn = document.getElementById("edit_btn");
const save_btn_set = document.getElementById("save_btn");
edit_btn.addEventListener("click", () => {
  save_btn_set.disabled = false;
  email.disabled = false;
  username.disabled = false;
  phone_number.disabled = false;
  edit_btn.disabled = true;
});

save_btn_set.addEventListener("click", () => {
  user.name = username.value;
  user.phone = phone_number.value;
  dbUsers.doc(user.id).update(user);
});

const updateDetails = () => {
  username.value = user.name;
  phone_number.value = user.phone;
  email.value = user.email;
  email.disabled = true;
  username.disabled = true;
  phone_number.disabled = true;
  save_btn_set.disabled = true;
};

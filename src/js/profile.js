import { dbProducts, fbAuth, dbUsers, dbOrders } from "../firebase/data.js";
const username = document.getElementById("username");
const phone_number = document.getElementById("phone_number");
const email = document.getElementById("email");
const passwored = document.getElementById("passwored");
const passwored_c = document.getElementById("passwored_c");
const save_pass = document.getElementById("save_password");
const search = document.getElementById("searchgroup");
search.remove();
var user;
var orders = [];
let cur_user;
fbAuth.onAuthStateChanged((u) => {
  cur_user = u;
});
const edit_btn = document.getElementById("edit_btn");
const save_btn_set = document.getElementById("save_btn");
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
            userNameNavBar.innerText = doc.data().name;
            updateDetails();
            if (doc.data().store != false) has_store = doc.data().store;
            if (doc.data().wishList.length > 0) wish_list.style = "color: red";
            if (doc.data().shoppingList.length > 0)
              shopping_cart.style = "color: red";
          });
        });
    }
  });
};
edit_btn.addEventListener("click", () => {
  save_btn_set.disabled = false;
  email.disabled = false;
  username.disabled = false;
  phone_number.disabled = false;
  edit_btn.disabled = true;
});

save_btn_set.addEventListener("click", () => {
  saveToFirebase();
});
save_pass.addEventListener("click", () => {
  changePassword();
});
function updateDetails() {
  username.value = user.name;
  phone_number.value = user.phone;
  email.value = user.email;
  email.disabled = true;
  username.disabled = true;
  phone_number.disabled = true;
  save_btn_set.disabled = true;
  dbUsers.doc(user.id).set(user);
}
function saveToFirebase() {
  user.name = username.value;
  user.phone = phone_number.value;
  edit_btn.disabled = false;
  updateDetails();
}
function changePassword() {
  if (passwored.value === passwored_c.value && passwored.value.length > 5) {
    user.password = passwored.value;
    updateDetails();
    console.log(cur_user);
    cur_user
      .updatePassword(passwored.value)
      .then(() => {
        alert("Password changed");
      })
      .catch((error) => {
        alert(error);
      });
  } else alert("error");
  updateDetails();
}
updateNavBar();

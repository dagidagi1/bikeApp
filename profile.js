import { user } from "./user.js";
const search = document.getElementById("searchgroup");
search.remove();
<<<<<<< HEAD
let username = document.getElementById("username");
let phone_number = document.getElementById("phone_number");
let email = document.getElementById("email");
=======
const userNameNavBar = document.getElementById("navbar_profile_name");
const wish_list = document.getElementById("wish_list");
const shopping_cart = document.getElementById("shopping_cart");
const updateNavBar = () => {
  userNameNavBar.innerText = user.name;
  if (user.wishList.length > 0) wish_list.style = "color: red";
  if (user.orderList.length > 0) shopping_cart.style = "color: red";
};
updateNavBar();
let username=document.getElementById("username");
let phone_number=document.getElementById("phone_number");
let email=document.getElementById("email");
>>>>>>> 7eea06447a66330cdc0666f1f65cf55f11675e1a

const updateDetails = () => {
  username.value = user.name;
  phone_number.value = user.phone;
  email.value = user.email;
};
updateDetails();

import { data } from "/data.js";
const search = document.getElementById("searchgroup");
search.remove();
const userNameNavBar = document.getElementById("navbar_profile_name");
const wish_list = document.getElementById("wish_list");
const shopping_cart = document.getElementById("shopping_cart");
wish_list.style = "color: red";
export const updateName = (name) => {
  userNameNavBar.innerText = name;
};

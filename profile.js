import { user } from "./user.js";
const search = document.getElementById("searchgroup");
search.remove();
let username = document.getElementById("username");
let phone_number = document.getElementById("phone_number");
let email = document.getElementById("email");

const updateDetails = () => {
  username.value = user.name;
  phone_number.value = user.phone;
  email.value = user.email;
};
updateDetails();

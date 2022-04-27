import { data } from "../firebase/data.js";
const type = document.getElementById("type_d");
const name = document.getElementById("product_page_name");
const price = document.getElementById("product_page_price");
const description = document.getElementById("description_d");
const manufacturer = document.getElementById("manufactur_d");
const max_speed = document.getElementById("max_speed_d");
const weight = document.getElementById("weight_d");
const wheel_size = document.getElementById("wheel_size_d");
const quantity = document.getElementById("quantetity_d");
const userName = document.getElementById("navbar_profile_name");
const search = document.getElementById("searchgroup");
if (search != null) search.remove();
export const redirectToDiscription = (i) => {
  console.log(i);
  type.innerText = data[i].type;
};

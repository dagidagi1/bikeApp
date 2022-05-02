import { dbProducts, fbAuth, dbUsers } from "../firebase/data.js";
var parametrs = location.search.substring(1).split("&");
var temp = parametrs[0].split("=");
const index_p = decodeURI(temp[1]);
let data = [];
let cur_user;
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
const img = document.getElementById("product_page_image");
const add_wish_btn = document.getElementById("wish_btn");
const add_cart_btn = document.getElementById("add_to_card");
add_cart_btn.addEventListener("click", () => {
  addToCart();
});
add_wish_btn.addEventListener("click", () => {
  addToWishList();
});
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
            cur_user = doc.data();
            console.log(cur_user);
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
dbProducts.get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  console.log(data);
  updateDescriptions(data[index_p]);
});
const updateDescriptions = (data) => {
  type.innerText = data.type === 0 ? "Bycicle" : "Scooter";
  name.innerText = data.name;
  price.innerText = data.price + "$";
  description.innerText = data.description;
  manufacturer.innerText = data.manufacturer;
  max_speed.innerText = data.max_speed;
  weight.innerText = data.weight;
  wheel_size.innerText = data.wheel_size;
  img.src =
    data.type === 0
      ? "assets/img/200829b1-9d17-4b9b-8bf8-36baba8859e6.jpg"
      : "assets/img/snimok6.png";
};
const addToCart = () => {
  //need to call firebase to update user
  cur_user.orderList.push(index_p);
};
const addToWishList = () => {
  cur_user.wishList.push(index_p);
};

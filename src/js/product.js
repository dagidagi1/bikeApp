import { dbProducts, fbAuth, dbUsers, dbOrders } from "../firebase/data.js";
var parametrs = location.search.substring(1).split("&");
var temp = parametrs[0].split("=");
const index_p = decodeURI(temp[1]);
var data = [];
var cur_user;
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
const getUser = () => {
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
          });
        });
    }
  });
};
getUser();
dbProducts.get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  console.log(data);
  updateDescriptions(data[index_p]);
});
const updateDescriptions = (data) => {
  if (data.type === 0)
    type.innerText = data.category === 0 ? "Bycicle" : "Scooter";
  if (data.type === 1)
    type.innerText =
      data.category === 0 ? "Electric Bycicle" : "Electric Scooter";
  name.innerText = data.name;
  price.innerText = data.price + "$";
  description.innerText = data.description;
  manufacturer.innerText = data.manufacturer;
  max_speed.innerText = data.max_speed;
  weight.innerText = data.weight;
  wheel_size.innerText = data.wheel_size;
  img.src = data.src;
};
const addToCart = () => {
  // const r = Math.floor(1000 + Math.random() * 9000);
  // dbOrders.doc("#" + r).set({
  //   email: cur_user.email,
  //   nameProduct: data[index_p].name,
  //   order_number: "#" + r,
  //   status: "Waiting",
  //   src: data[index_p].src,
  //   review: false,
  // });

  cur_user.shoppingList.push(index_p);
  dbUsers.doc(cur_user.id).update(cur_user);
  updateNavBar();
};
const addToWishList = () => {
  cur_user.wishList.push(index_p);
  dbUsers.doc(cur_user.id).update(cur_user);
  updateNavBar();
};

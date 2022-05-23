import { dbProducts, fbAuth, dbUsers, storageRef } from "../firebase/data.js";
var parametrs = location.search.substring(1).split("&");
var temp = parametrs[0].split("=");
const idP = temp[1].split("-");
var curUser;
var product;
const type = document.getElementById("type_d");
const name = document.getElementById("product_page_name");
const price = document.getElementById("product_page_price");
const description = document.getElementById("description_d");
const manufacturer = document.getElementById("manufactur_d");
const maxSpeed = document.getElementById("max_speed_d");
const weight = document.getElementById("weight_d");
const wheelSize = document.getElementById("wheel_size_d");
const quantity = document.getElementById("quantetity_d");
const search = document.getElementById("searchgroup");
const img = document.getElementById("product_page_image");
const addWishBtn = document.getElementById("wish_btn");
const addCartBtn = document.getElementById("add_to_card");
addCartBtn.addEventListener("click", () => {
  addToCart();
});
addWishBtn.addEventListener("click", () => {
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
            curUser = doc.data();
            curUser.id = doc.id;
          });
        });
    }
  });
};
getUser();
dbProducts.get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    if (doc.id === idP[0]) {
      product = doc.data();
      product.id = doc.id;
    }
  });
  updateDescriptions(product);
});
const updateDescriptions = (p) => {
  if (p.type === 1) {
    type.innerText = p.category === 0 ? "Bycicle" : "Scooter";
  } else {
    type.innerText = p.category === 0 ? "Electric Bycicle" : "Electric Scooter";
  }
  name.innerText = p.name;
  price.innerText = "It's price " + p.price + "$";
  description.innerText = p.description;
  manufacturer.innerText = p.manufacturer;
  maxSpeed.innerText = p.maxSpeed + " km/h";
  weight.innerText = p.weight + " kg";
  wheelSize.innerText = p.wheelSize + '" inch';
  img.src = p.src;
  if (p.hasImg) {
    storageRef
      .child(p.id)
      .getDownloadURL()
      .then((url) => {
        // Or inserted into an <img> element
        img.src = url;
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
const addToCart = () => {
  if (+quantity.value > 0) {
    if (!curUser.shoppingList.includes(product.id)) {
      curUser.shoppingList.push({ id: product.id, quantity: +quantity.value });
      dbUsers.doc(curUser.id).set(curUser);
    }
  } else {
    alert("Quantity must be positive");
  }
};
const addToWishList = () => {
  if (!curUser.wishList.includes(product.id)) {
    curUser.wishList.push(product.id);
    dbUsers.doc(curUser.id).set(curUser);
  }
};

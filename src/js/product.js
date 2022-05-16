import { dbProducts, fbAuth, dbUsers, storageRef } from "../firebase/data.js";
var parametrs = location.search.substring(1).split("&");
var temp = parametrs[0].split("=");
const indexP = temp[1].split("-");
var data = [];
var newData;
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
// const quantity = document.getElementById('quantetity_d');
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
  let i = 0;
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
    data[i].id = doc.id;
    i++;
  });
  if (indexP[1] === "B") {
    newData = data.filter((d) => {
      return d.category === 0;
    });
    product = newData[Number(indexP[0])];
    updateDescriptions(newData[Number(indexP[0])]);
  } else if (indexP[1] === "S") {
    newData = data.filter((d) => {
      return d.category === 1;
    });
    product = newData[Number(indexP[0])];
    updateDescriptions(newData[Number(indexP[0])]);
  } else if (indexP[1] === "LTH") {
    newData = data.sort((a, b) => a.price - b.price);
    product = newData[Number(indexP[0])];
    updateDescriptions(newData[Number(indexP[0])]);
  } else if (indexP[1] === "HTL") {
    newData = data.sort((a, b) => b.price - a.price);
    product = newData[Number(indexP[0])];
    updateDescriptions(newData[Number(indexP[0])]);
  } else if (indexP[1] === "BB") {
    newData = data
      .filter((a) => a.category === 0)
      .sort((a, b) => {
        b.price - a.price;
      });
    product = newData[Number(indexP[0])];
    updateDescriptions(newData[+indexP[0]]);
  } else if (indexP[1] === "SS") {
    newData = data
      .filter((a) => a.category === 1)
      .sort((a, b) => {
        b.price - a.price;
      });
    product = newData[Number(indexP[0])];
    updateDescriptions(newData[indexP[0] - 5]);
  } else {
    product = data[Number(indexP[0])];
    updateDescriptions(data[Number(indexP[0])]);
  }
});
const updateDescriptions = (data) => {
  if (data.type === 1) {
    type.innerText = data.category === 0 ? "Bycicle" : "Scooter";
  }
  if (data.type === 0) {
    type.innerText =
      data.category === 0 ? "Electric Bycicle" : "Electric Scooter";
  }
  name.innerText = data.name;
  price.innerText = "It's price " + data.price + "$";
  description.innerText = data.description;
  manufacturer.innerText = data.manufacturer;
  maxSpeed.innerText = data.maxSpeed + " km/h";
  weight.innerText = data.weight + " kg";
  wheelSize.innerText = data.wheelSize + '" inch';
  img.src = data.src;
  if (data.hasImg) {
    storageRef
      .child(data.id)
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
  let index = Number(indexP[0]);
  if (indexP[1] != "all") {
    index = data.findIndex((pro) => {
      return pro.name === product.name;
    });
  }
  curUser.shoppingList.push(index);
  dbUsers.doc(curUser.id).set(curUser);
};
const addToWishList = () => {
  let index = Number(indexP[0]);
  if (indexP[1] != "all") {
    index = data.findIndex((pro) => {
      return pro.name === product.name;
    });
  }
  curUser.wishList.push(Number(indexP[0]));
  dbUsers.doc(curUser.id).set(curUser);
};

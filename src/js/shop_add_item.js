import {
  dbProducts,
  fbAuth,
  dbUsers,
  dbStores,
  storageRef,
} from "../firebase/data.js";

const redColor = "#e74a3b";

const vCategory = document.getElementById("category");
const vType = document.getElementById("vehicle_type");
const vName = document.getElementById("vehicle_name");
const price = document.getElementById("price");
const manufacturer = document.getElementById("manufacturer");
const maxSpeed = document.getElementById("max_speed");
const weight = document.getElementById("weight");
const wheelSize = document.getElementById("wheelSize");
const quantity = document.getElementById("quantity");
const description = document.getElementById("description");
const addItemBtn = document.getElementById("addItemBtn");
const photo = document.getElementById("photo");
var shopId = null;
var file = 0;
var storeRef;
var docId;
photo.addEventListener("change", (e) => {
  file = e.target.files[0];
});

addItemBtn.addEventListener("click", function () {
  if (formValidation() === false) {
    return;
  } else {
    saveProduct();
  }
});

function saveProduct() {
  fbAuth.onAuthStateChanged((user) => {
    if (user) {
      dbUsers
        .where("email", "==", user.email)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            shopId = doc.data().store;
          });
          let src;
          let hasImg = true;
          if (file == 0) hasImg = false;
          if (vCategory.selectedIndex === 0) {
            src = "assets/img/200829b1-9d17-4b9b-8bf8-36baba8859e6.jpg";
          } else {
            src = "assets/img/snimok6.png";
          }
          dbProducts
            .add({
              store_id: shopId,
              category: vCategory.selectedIndex,
              type: vType.selectedIndex,
              name: vName.value,
              price: price.value,
              manufacturer: manufacturer.value,
              maxSpeed: maxSpeed.value,
              weight: weight.value,
              wheelSize: wheelSize.value,
              quantity: quantity.value,
              description: description.value,
              deleted: false,
              src: src,
              hasImg: hasImg,
            })
            .then((docRef) => {
              docId = docRef.id;
              storeRef = dbStores.doc(shopId);
              if (hasImg) {
                storageRef
                  .child(docId)
                  .put(file)
                  .then((snapshot) => {
                    storeRef.update({
                      products: firebase.firestore.FieldValue.arrayUnion(docId),
                    });
                    location.replace("shop_dashboard.html" + "?id=" + shopId);
                  });
              } else {
                location.replace("shop_dashboard.html" + "?id=" + shopId);
              }
            })
            .then(() => {})
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
        });
    }
  });
}

function formValidation() {
  var flag = true;
  if (vName.value == null || vName.value == "") {
    vName.style.borderColor = redColor;
    document.getElementById("name_err").style.display = "block";
    flag = false;
  } else {
    vName.style.borderColor = "";
    document.getElementById("name_err").style.display = "none";
  }
  if (
    price.value == null ||
    price.value == "" ||
    /^\d+(\.\d+)?$/.test(price.value) == false
  ) {
    price.style.borderColor = redColor;
    if (price.value == null || price.value == "") {
      document.getElementById("price_err").textContent =
        "Price cannot be empty";
      document.getElementById("price_err").style.display = "block";
    } else {
      document.getElementById("price_err").textContent =
        "Price must contain only numbers";
      document.getElementById("price_err").style.display = "block";
    }
    flag = false;
  } else {
    price.style.borderColor = "";
    document.getElementById("price_err").style.display = "none";
  }
  if (manufacturer.value == null || manufacturer.value == "") {
    manufacturer.style.borderColor = redColor;
    document.getElementById("manufacturer_err").style.display = "block";
    flag = false;
  } else {
    manufacturer.style.borderColor = "";
    document.getElementById("manufacturer_err").style.display = "none";
  }
  if (
    maxSpeed.value == null ||
    maxSpeed.value == "" ||
    /^\d+(\.\d+)?$/.test(maxSpeed.value) == false
  ) {
    maxSpeed.style.borderColor = redColor;
    if (maxSpeed.value == null || maxSpeed.value == "") {
      document.getElementById("maxSpeed_err").textContent =
        "Max speed cannot be empty";
      document.getElementById("maxSpeed_err").style.display = "block";
    } else {
      document.getElementById("maxSpeed_err").textContent =
        "Speed must contain only numbers";
      document.getElementById("maxSpeed_err").style.display = "block";
    }
    flag = false;
  } else {
    maxSpeed.style.borderColor = "";
    document.getElementById("maxSpeed_err").style.display = "none";
  }
  if (
    weight.value == null ||
    weight.value == "" ||
    /^\d+(\.\d+)?$/.test(weight.value) == false
  ) {
    weight.style.borderColor = redColor;
    if (weight.value == null || weight.value == "") {
      document.getElementById("weight_err").textContent =
        "Weight cannot be empty";
      document.getElementById("weight_err").style.display = "block";
    } else {
      document.getElementById("weight_err").textContent =
        "Weight must contain only numbers";
      document.getElementById("weight_err").style.display = "block";
    }
    flag = false;
  } else {
    weight.style.borderColor = "";
    document.getElementById("weight_err").style.display = "none";
  }
  if (
    wheelSize.value == null ||
    wheelSize.value == "" ||
    /^\d+(\.\d+)?$/.test(wheelSize.value) == false
  ) {
    wheelSize.style.borderColor = redColor;
    if (wheelSize.value == null || wheelSize.value == "") {
      document.getElementById("wheelSizeErr").textContent =
        "Wheel size cannot be empty";
      document.getElementById("wheelSizeErr").style.display = "block";
    } else {
      document.getElementById("wheelSizeErr").textContent =
        "Wheel size must contain only numbers";
      document.getElementById("wheelSizeErr").style.display = "block";
    }
    flag = false;
  } else {
    wheelSize.style.borderColor = "";
    document.getElementById("wheelSizeErr").style.display = "none";
  }
  if (
    quantity.value == null ||
    quantity.value == "" ||
    /^\d+$/.test(quantity.value) == false
  ) {
    quantity.style.borderColor = redColor;
    if (quantity.value == null || quantity.value == "") {
      document.getElementById("quantity_err").textContent =
        "Wheel size cannot be empty";
      document.getElementById("quantity_err").style.display = "block";
    } else {
      document.getElementById("quantity_err").textContent =
        "Wheel size must contain only numbers";
      document.getElementById("quantity_err").style.display = "block";
    }
    flag = false;
  } else {
    quantity.style.borderColor = "";
    document.getElementById("quantity_err").style.display = "none";
  }
  if (description.value == null || description.value == "") {
    description.style.borderColor = redColor;
    document.getElementById("description_err").style.display = "block";
    flag = false;
  } else {
    description.style.borderColor = "";
    document.getElementById("description_err").style.display = "none";
  }
  return flag;
}

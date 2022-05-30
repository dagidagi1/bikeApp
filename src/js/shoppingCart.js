import { dbProducts, fbAuth, dbUsers, storageRef } from "../firebase/data.js";
const search = document.getElementById("searchgroup");
const modal1 = new bootstrap.Modal(document.getElementById("modal-1"));
const closeShip = document.getElementById("close_ship");
closeShip.addEventListener("click", () => {
  modal1.hide();
});
search.remove();
var data = [];
let price = 0;
var curUser;
const shoppingCart = document.getElementById("shopping_cart");
const shoppingCartTable = document.getElementById("shopping_cart_table");
const totalPrice = document.getElementById("total_price");
const chekoutShopCartBtn = document.getElementById("chekout_shop_cart");
chekoutShopCartBtn.addEventListener("click", () => {
  location.replace("chekout.html" + "?email=" + curUser.email);
});
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
            getShopList();
          });
        });
    }
  });
};
function getShopList() {
  data = [];
  dbProducts.get().then((querySnapshot) => {
    let j = 0;
    querySnapshot.forEach((doc) => {
      for (let i = 0; i < curUser.shoppingList.length; i++) {
        if (curUser.shoppingList[i].id === doc.id) {
          data.push(doc.data());
          data[j].id = doc.id;
          data[j].quantity = curUser.shoppingList[i].quantity;
          j++;
        }
      }
    });
    init();
  });
}
const makeRow = (d, i) => {
  return `<tr>
    <td>
    <a href="product.html?id=${d.id}">
      <img id="img${i}"
        src=""
        width="80px"
      />
    </td>
    <td>${d.name}</td>
    <td>
      Quantity:&nbsp;<input
        type="number"
        value="${d.quantity}"
        min="1"
        step="1"
        style="
          border-style: hidden;
          min-width: auto;
          max-width: 50px;
          color: var(--bs-gray-800);
        "
        id="quantity${d.id}"
      />
    </td>
    <td>${d.price}$</td>
    <td class="text-end">
      <button class="btn btn-primary" type="button" id="btn_delete_${i}" value="${d.id}">
        Delete
      </button>
    </td>
  </tr>`;
};
function deleteItem(i) {
  totalPrice.innerText = ` Subtotal: ${price}$`;
  curUser.shoppingList.pop(i);
  dbUsers.doc(curUser.id).set(curUser);
  if (curUser.shoppingList.length == 0) shoppingCart.style = "";
  getShopList();
}
function init() {
  shoppingCartTable.innerHTML = "";
  price = 0;
  for (let i = 0; i < data.length; i++) {
    shoppingCartTable.innerHTML += makeRow(data[i], i);
    price += +data[i].price * data[i].quantity;
    if (data[i].hasImg) {
      storageRef
        .child(data[i].id)
        .getDownloadURL()
        .then((url) => {
          // Or inserted into an <img> element
          const img = document.getElementById(`img${i}`);
          img.src = url;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const img = document.getElementById(`img${i}`);
      img.src = data[i].src;
    }
  }
  totalPrice.innerText = ` Subtotal: ${price}$`;
  for (let i = 0; i < data.length; i++) {
    document.getElementById(`btn_delete_${i}`).addEventListener("click", () => {
      deleteItem(document.getElementById(`btn_delete_${i}`).value);
    });
    document
      .getElementById(`quantity${data[i].id}`)
      .addEventListener("change", (e) => {
        e.preventDefault();
        curUser.shoppingList[i].quantity = +document.getElementById(
          `quantity${data[i].id}`
        ).value;
        dbUsers.doc(curUser.id).set(curUser);
        getShopList();
      });
  }
}
getUser();

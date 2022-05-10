import {dbProducts, fbAuth, dbUsers, storageRef} from '../firebase/data.js';
const search = document.getElementById('searchgroup');
search.remove();
const data = [];
let price = 0;
var curUser;
const shoppingCart = document.getElementById('shopping_cart');
const shoppingCartTable = document.getElementById('shopping_cart_table');
const totalPrice = document.getElementById('total_price');
const chekoutShopCartBtn = document.getElementById('chekout_shop_cart');
chekoutShopCartBtn.addEventListener('click', () => {
  location.replace('chekout.html' + '?email=' + curUser.email);
});
const getUser = () => {
  fbAuth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      dbUsers
          .where('email', '==', user.email)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              curUser = doc.data();
              curUser.id = doc.id;
              init();
            });
          });
    }
  });
};
const makeRow = (d, i) => {
  return `<tr>
    <td>
      <img id="img${i}"
        src=""
        width="80px"
      />
    </td>
    <td>${d.name}</td>
    <td>
      Quantity:&nbsp;<input
        type="number"
        value="1"
        min="1"
        step="1"
        style="
          border-style: hidden;
          min-width: auto;
          max-width: 50px;
          color: var(--bs-gray-800);
        "
      />
    </td>
    <td>${d.price}$</td>
    <td class="text-end">
      <button class="btn btn-primary" type="button" id="btn_delete_${i}" value="${i}">
        Delete
      </button>
    </td>
  </tr>`;
};
function deleteItem(i) {
  totalPrice.innerText = ` Subtotal: ${price}$`;
  curUser.shoppingList.pop(i);
  dbUsers.doc(curUser.id).set(curUser);
  if (curUser.shoppingList.length == 0) shoppingCart.style = '';
}
function init() {
  shoppingCartTable.innerHTML = '';
  price = 0;
  for (let i = 0; i < curUser.shoppingList.length; i++) {
    shoppingCartTable.innerHTML += makeRow(data[+curUser.shoppingList[i]], i);
    price += +data[+curUser.shoppingList[i]].price;
    if (data[+curUser.shoppingList[i]].hasImg) {
      storageRef
          .child(data[+curUser.shoppingList[i]].id)
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
      img.src = data[+curUser.shoppingList[i]].src;
    }
  }
  totalPrice.innerText = ` Subtotal: ${price}$`;
  for (let i = 0; i < curUser.shoppingList.length; i++) {
    document.getElementById(`btn_delete_${i}`).addEventListener('click', () => {
      console.log(document.getElementById(`btn_delete_${i}`).value);
      deleteItem(document.getElementById(`btn_delete_${i}`).value);
      init();
    });
  }
}
getUser();
dbProducts.get().then((querySnapshot) => {
  let i = 0;
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
    data[i].id = doc.id;
    i++;
  });
});

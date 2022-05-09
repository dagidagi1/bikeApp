import {dbProducts, fbAuth, dbUsers} from '../firebase/data.js';
const search = document.getElementById('searchgroup');
search.remove();
const data = [];
let price = 0;
var curUser;
const shoppingCart = document.getElementById('shoppingCart');
const shoppingCartTable = document.getElementById('shoppingCartTable');
const totalPrice = document.getElementById('totalPrice');
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
      <img
        src="${d.src}"
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
    shoppingCartTable.innerHTML += makeRow(
        data[+curUser.shoppingList[i]],
        i,
    );
    price += data[+curUser.shoppingList[i]].price;
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
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
});

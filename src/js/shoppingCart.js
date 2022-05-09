import {dbProducts, fbAuth, dbUsers, dbOrders} from '../firebase/data.js';
const search = document.getElementById('searchgroup');
search.remove();
const data = [];
let price = 0;
var cur_user;
const shopping_cart = document.getElementById('shopping_cart');
const shopping_cart_table = document.getElementById('shopping_cart_table');
const total_price = document.getElementById('total_price');
const chekout_shop_cart_btn = document.getElementById('chekout_shop_cart');
chekout_shop_cart_btn.addEventListener('click', () => {
  location.replace('chekout.html' + '?email=' + cur_user.email);
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
              cur_user = doc.data();
              cur_user.id = doc.id;
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
  total_price.innerText = ` Subtotal: ${price}$`;
  cur_user.shoppingList.pop(i);
  dbUsers.doc(cur_user.id).set(cur_user);
  if (cur_user.shoppingList.length == 0) shopping_cart.style = '';
}
function init() {
  shopping_cart_table.innerHTML = '';
  price = 0;
  for (let i = 0; i < cur_user.shoppingList.length; i++) {
    shopping_cart_table.innerHTML += makeRow(
        data[+cur_user.shoppingList[i]],
        i,
    );
    price += data[+cur_user.shoppingList[i]].price;
  }
  total_price.innerText = ` Subtotal: ${price}$`;
  for (let i = 0; i < cur_user.shoppingList.length; i++) {
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

import {fbAuth, dbUsers} from '../firebase/data.js';
const userNameNavBar = document.getElementById('navbar_profile_name');
const wishList = document.getElementById('wish_list');
const shoppingCart = document.getElementById('shopping_cart');
function update() {
  fbAuth.onAuthStateChanged((user) => {
    if (user) {
      // updates the name and color of wish list and cart.
      dbUsers
          .where('email', '==', user.email)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              userNameNavBar.innerText = doc.data().name;
              if (doc.data().wishList.length > 0) wishList.style = 'color: red';
              if (doc.data().shoppingList.length > 0) {
                shoppingCart.style = 'color: red';
              }
            });
          });
    }
  });
}
update();
document.getElementById('logout_btn').addEventListener('click', function() {
  fbAuth
      .signOut()
      .then(() => {
        location.replace('index.html');
      })
      .catch((error) => {
        console.log('Logout err: ', error);
      });
});

const homeBtn = document.getElementById('nav_home_btn');
const catalogBtn = document.getElementById('nav_catalog_btn');
const ordersBtn = document.getElementById('nav_orders_btn');
const storeBtn = document.getElementById('nav_store_btn');
homeBtn.setAttribute('data-bss-hover-animate', 'pulse');
catalogBtn.setAttribute('data-bss-hover-animate', 'pulse');
ordersBtn.setAttribute('data-bss-hover-animate', 'pulse');
storeBtn.setAttribute('data-bss-hover-animate', 'pulse');
homeBtn.addEventListener('click', function() {
  location.replace('registered_home.html');
});
catalogBtn.addEventListener('click', function() {
  location.replace('catalogue.html');
});
ordersBtn.addEventListener('click', function() {
  location.replace('orders_list.html');
});
storeBtn.addEventListener('click', function() {
  location.replace('shop_dashboard.html');
});

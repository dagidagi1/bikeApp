import {fbAuth, dbUsers} from "../firebase/data.js"
const userNameNavBar = document.getElementById("navbar_profile_name");
const wish_list = document.getElementById("wish_list");
const shopping_cart = document.getElementById("shopping_cart");

fbAuth.onAuthStateChanged((user) => {
  if (user) {
    // updates the name and color of wish list and cart.
    dbUsers
      .where("email", "==", user.email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          userNameNavBar.innerText = doc.data().name;
          if (doc.data().wishList.length > 0) wish_list.style = "color: red";
          if (doc.data().shoppingList.length > 0) shopping_cart.style = "color: red";
        });
      });
  }
});

document.getElementById("home_reg_logout_btn").addEventListener('click', function(){
  //logout navbar button(li)
  //alert("test logout");
  fbAuth.signOut().then(() => {
    location.replace("index.html");
  }).catch((error) => {
    console.log("Logout err: ", error);
  });
});

document.getElementById("nav_home_btn").addEventListener('click', function() {
  location.replace("registered_home.html");
})
document.getElementById("nav_catalog_btn").addEventListener('click', function() {
  location.replace("catalogue.html");
})
document.getElementById("nav_orders_btn").addEventListener('click', function() {
  location.replace("orders_list.html");
})
document.getElementById("nav_store_btn").addEventListener('click', function() {
  location.replace("shop_dashboard.html");
})
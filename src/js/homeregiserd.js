import { dbProducts, fbAuth, dbUsers } from "../firebase/data.js";
const search = document.getElementById("searchgroup");
search.remove();
let col;
let data = [];
const userNameNavBar = document.getElementById("navbar_profile_name");
const wish_list = document.getElementById("wish_list");
const shopping_cart = document.getElementById("shopping_cart");
const my_store = document.getElementById("nav_store");
var has_store = false;
const updateNavBar = () => {
  fbAuth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      dbUsers
        .where("email", "==", user.email)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            userNameNavBar.innerText = doc.data().name;
            if(doc.data().store != false) has_store = doc.data().store;
            if (doc.data().wishList.length > 0) wish_list.style = "color: red";
            if (doc.data().orderList.length > 0)
              shopping_cart.style = "color: red";
          });
        });
    }
  });
};
updateNavBar();
function productElment(d, i) {
  return `<div class="col">
  <a href="product.html">
  <div class="card" id="${i}">
  <div class="card-body"><img class="img-fluid" src=${
    d.type === "Bicycle"
      ? "../../assets/img/200829b1-9d17-4b9b-8bf8-36baba8859e6.jpg"
      : "../../assets/img/snimok6.png"
  }>
      <h4 class="card-title" style="color: var(--bs-gray);">${d.name}</h4>
      <h6 class="text-muted card-subtitle mb-2" style="font-weight: bold;">${
        d.price
      }$</h6>
  </div>
</div> 
</a></div> `;
}
const init = () => {
  let d = data
    .filter((a) => a.type === "Bicycle")
    .sort((a, b) => {
      b.price - a.price;
    });
  col = document.getElementById(`col_0`);
  col.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    col.innerHTML += productElment(d[i], i);

    document.getElementById(`${i}`)?.addEventListener("click", () => {
      globalVariable = { example_attribute: i };
    });
  }
  d = data
    .filter((a) => a.type === "Scooter")
    .sort((a, b) => {
      b.price - a.price;
    });
  col = document.getElementById(`col_1`);
  for (let i = 0; i < 5; i++) {
    col.innerHTML += productElment(d[i], i);
    document.getElementById(`${i}`)?.addEventListener("click", () => {
      redirectToDiscription(i);
    });
  }
  my_store.addEventListener("click", function(){
    if(has_store != false){
      location.replace("shop_dashboard.html" + '?id=' + has_store);
    }
    else {location.replace("shop_unregistered.html");}
  })
};

dbProducts.get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  init();
});

dbUsers.get().then((querySnapshot) => {
  // contains all users list, idk if needed here!
  let ddd = [];
  querySnapshot.forEach((doc) => {
    ddd.push(doc.data());
  });
  //console.log(ddd);
});

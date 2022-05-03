import { dbProducts, fbAuth, dbUsers, dbOrders } from "../firebase/data.js";
const MAX_IN_ROW = 4;
const serachType = ["Bike", "bicycle", "scooter", "BMX"];
let col;
var data = [];
var orders = [];
const dropdownChoiceAll = document.getElementById("ct_all");
const dropdownChoiceBicycle = document.getElementById("ct_bic");
const dropdownChoiceScooter = document.getElementById("ct_scot");
const dropdownHTL = document.getElementById("pr_HL");
const dropdownLTH = document.getElementById("pr_LH");
const dropdownNONE = document.getElementById("pr_n");
const btn_category = document.getElementById("btn_category");
const btn_price = document.getElementById("btn_price");
const searchInput = document.getElementById("navbar_search_field");
const searchBtn = document.getElementById("navbar_search_button");
const userNameNavBar = document.getElementById("navbar_profile_name");
const wish_list = document.getElementById("wish_list");
const shopping_cart = document.getElementById("shopping_cart");
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
            if (doc.data().wishList.length > 0) wish_list.style = "color: red";
            if (doc.data().shoppingList.length > 0)
              shopping_cart.style = "color: red";
          });
        });
    }
  });
};
function Search(input) {
  return data.filter((d) => {
    if (d.description.toLocaleLowerCase().includes(input.toLocaleLowerCase())) {
      return d;
    }
  });
}

searchInput.addEventListener("input", () => {
  serachType.forEach((st) => {
    if (
      searchInput.value.toLocaleLowerCase().includes(st.toLocaleLowerCase())
    ) {
      searchInput.value = st;
    }
  });
});
searchBtn.addEventListener("click", () => {
  const d = Search(searchInput.value);
  init(d);
});
function productElment(d, i) {
  return `<div class="col">
    <a href="product.html?index=${i}">
      <div class="card">
          <div class="card-body"><img class="img-fluid" src="${d.src}">
              <h4 class="card-title" style="color: var(--bs-gray);">${d.name}</h4>
              <h6 class="text-muted card-subtitle mb-2" style="font-weight: bold;">${d.price}$</h6>
          </div>
      </div> 
    </a>
  </div>`;
}
//inside init there is a call to productelement with undified object
const init = (data) => {
  for (var i = 0; i < 10; i++) {
    col = document.getElementById(`col_${i}`);
    col.innerHTML = "";
    for (var j = 0; data.length != 0 && j < MAX_IN_ROW; j++) {
      col.innerHTML += productElment(
        data[j + i * MAX_IN_ROW],
        j + i * MAX_IN_ROW
      );
    }
  }
};
dropdownNONE.addEventListener("click", () => {
  btn_price.innerText = "None";
  init(data);
});
dropdownHTL.addEventListener("click", () => {
  btn_price.innerText = "High to Low";
  const d = data.sort((a, b) => b.price - a.price);
  init(d);
});
dropdownLTH.addEventListener("click", () => {
  btn_price.innerText = "Low to High";
  const d = data.sort((a, b) => a.price - b.price);
  init(d);
});
dropdownChoiceAll.addEventListener("click", () => {
  btn_category.innerText = "All";
  init(data);
});
dropdownChoiceBicycle.addEventListener("click", () => {
  const newData = data.filter((d) => {
    return d.type === 0;
  });
  btn_category.innerText = "Bicycle";
  init(newData);
});
dropdownChoiceScooter.addEventListener("click", () => {
  const newData = data.filter((d) => {
    return d.type === 1;
  });
  btn_category.innerText = "Scooter";
  init(newData);
});
updateNavBar();

dbProducts.get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  init(data);
});

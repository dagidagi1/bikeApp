import { data } from "../firebase/data.js";
import { user } from "../firebase/user.js";
const search = document.getElementById("searchgroup");
search.remove();
let col;
const userNameNavBar = document.getElementById("navbar_profile_name");
const wish_list = document.getElementById("wish_list");
const shopping_cart = document.getElementById("shopping_cart");
const updateNavBar = () => {
  userNameNavBar.innerText = user.name;
  if (user.wishList.length > 0) wish_list.style = "color: red";
  if (user.orderList.length > 0) shopping_cart.style = "color: red";
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
  while(data === undefined){console.log("huyna")};
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
  console.log(d);
  col = document.getElementById(`col_1`);
  for (let i = 0; i < 5; i++) {
    col.innerHTML += productElment(d[i], i);
    document.getElementById(`${i}`)?.addEventListener("click", () => {
      redirectToDiscription(i);
    });
  }
};
setTimeout(init, 1000);

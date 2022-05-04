import {
  dbProducts,
  fbAuth,
  storageRef,
  dbUsers,
  dbOrders,
} from "../firebase/data.js";
const search = document.getElementById("searchgroup");
search.remove();
let col;
var data = [];
var orders = [];
var has_store = false;

function productElment(d, i) {
  return `<div class="col">
  <a href="product.html?index=${i}">
  <div class="card">
  <div class="card-body"><img class="img-fluid" src="${d.src}">
      <h4 class="card-title" style="color: var(--bs-gray);">${d.name}</h4>
      <h6 class="text-muted card-subtitle mb-2" style="font-weight: bold;">${d.price}$</h6>
  </div>
</div> 
</a></div> `;
}
const init = () => {
  let d = data
    .filter((a) => a.type === 0)
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
    .filter((a) => a.type === 1)
    .sort((a, b) => {
      b.price - a.price;
    });
  col = document.getElementById(`col_1`);
  for (let i = 5; i < 10; i++) {
    col.innerHTML += productElment(d[i - 5], i);
  }
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

import { data } from "./data.js";
const col = document.getElementById("col_0");
const btnCategory = document.getElementById("btn_category");
const btnPrice = document.getElementById("btn_price");
const dropCategory = document.getElementById("drop_cat");

function productElment(d) {
  return `<div class="col">
  <a href="product.html">
    <div class="card">
        <div class="card-body"><img class="img-fluid" src=${"assets/img/200829b1-9d17-4b9b-8bf8-36baba8859e6.jpg"}>
            <h4 class="card-title" style="color: var(--bs-gray);">${d.name}</h4>
            <h6 class="text-muted card-subtitle mb-2" style="font-weight: bold;">${
              d.price
            }$</h6>
        </div>
    </div> 
  </a>
</div>`;
}
for (let i = 0; i < data.length; i++) {
  col.innerHTML += productElment(data[i]);
}

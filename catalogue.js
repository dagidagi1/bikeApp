import { data } from "./data.js";
const MAX_IN_ROW = 4;
let col;
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
function Search(input) {
  return data.filter((d) => {
    if (d.description.toLocaleLowerCase().includes(input.toLocaleLowerCase())) {
      return d;
    }
  });
}

searchBtn.addEventListener("click", () => {
  const d = Search(searchInput.value);
  console.log(d);
  init(d);
});
function productElment(d) {
  return `<div class="col">
    <a href="product.html">
      <div class="card">
          <div class="card-body"><img class="img-fluid" src=${"assets/img/200829b1-9d17-4b9b-8bf8-36baba8859e6.jpg"}>
              <h4 class="card-title" style="color: var(--bs-gray);">${
                d.name
              }</h4>
              <h6 class="text-muted card-subtitle mb-2" style="font-weight: bold;">${
                d.price
              }$</h6>
          </div>
      </div> 
    </a>
  </div>`;
}

const init = (data) => {
  for (let i = 0; i < (data.length % 4) + 1; i++) {
    col = document.getElementById(`col_${i}`);
    col.innerHTML = "";
    for (let j = 0; j < MAX_IN_ROW; j++) {
      col.innerHTML += productElment(data[j + i * MAX_IN_ROW], j);
    }
  }
};
dropdownNONE.addEventListener("click", () => {
  btn_price.innerHTML = "None";
  init(data);
});
dropdownHTL.addEventListener("click", () => {
  btn_price.innerHTML = "High to Low";
  const d = data.sort((a, b) => b.price - a.price);
  init(d);
});
dropdownLTH.addEventListener("click", () => {
  btn_price.innerHTML = "Low to High";
  const d = data.sort((a, b) => a.price - b.price);
  init(d);
});
dropdownChoiceAll.addEventListener("click", () => {
  btn_category.innerHTML = "All";
  init(data);
});
dropdownChoiceBicycle.addEventListener("click", () => {
  const newData = data.filter((d) => {
    return d.type.normalize() === "Bicycle";
  });
  btn_category.innerHTML = "Bicycle";
  init(newData);
});
dropdownChoiceScooter.addEventListener("click", () => {
  const newData = data.filter((d) => {
    return d.type.normalize() === "Scooter";
  });
  btn_category.innerHTML = "Scooter";
  init(newData);
});

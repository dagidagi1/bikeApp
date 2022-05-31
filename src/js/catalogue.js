import { dbProducts, storageRef } from "../firebase/data.js";
const MAX_IN_ROW = 4;
const serachType = ["Bike", "bicycle", "scooter", "BMX"];
let col;
var data = [];
const dropdownChoiceAll = document.getElementById("ct_all");
const dropdownChoiceBicycle = document.getElementById("ct_bic");
const dropdownChoiceScooter = document.getElementById("ct_scot");
const dropdownHTL = document.getElementById("pr_HL");
const dropdownLTH = document.getElementById("pr_LH");
const dropdownNONE = document.getElementById("pr_n");
const categoryBtn = document.getElementById("btn_category");
const priceBtn = document.getElementById("btn_price");
const searchInput = document.getElementById("navbar_search_field");
const searchBtn = document.getElementById("navbar_search_button");
const modal1 = new bootstrap.Modal(document.getElementById("modal-1"));
const closeShip = document.getElementById("close_ship");
var loader = document.getElementById("loaderDiv");
loader.style.display = "block";
closeShip.addEventListener("click", () => {
  modal1.hide();
});
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
  loader.style.display = "block";
  const d = Search(searchInput.value);
  init(d);
});
function productElment(d, i) {
  return `<div class="col">
    <a href="product.html?id=${d.id}">
      <div class="card">
          <div class="card-body"><img class="img-fluid" id="img${i}" src="">
              <h4 class="card-title" style="color: var(--bs-gray);">${d.name}</h4>
              <h6 class="text-muted card-subtitle mb-2" style="font-weight: bold;">${d.price}$</h6>
          </div>
      </div> 
    </a>
  </div>`;
}
// inside init there is a call to productelement with undified object
const init = (da, sort = "all") => {
  let index = da.length;
  for (var i = 0; i < 10; i++) {
    col = document.getElementById(`col_${i}`);
    col.innerHTML = "";
    for (var j = 0; index > 0 && j < MAX_IN_ROW; j++) {
      const x = j + i * MAX_IN_ROW;
      if (
        !da[j + i * MAX_IN_ROW].deleted &&
        +da[j + i * MAX_IN_ROW].quantity > 0
      ) {
        col.innerHTML += productElment(
          da[j + i * MAX_IN_ROW],
          j + i * MAX_IN_ROW,
          sort
        );
        if (da[j + i * MAX_IN_ROW].hasImg) {
          storageRef
            .child(da[j + i * MAX_IN_ROW].id)
            .getDownloadURL()
            .then((url) => {
              // Or inserted into an <img> element
              const img = document.getElementById(`img${x}`);
              img.src = url;
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          const img = document.getElementById(`img${x}`);
          img.src = da[j + i * MAX_IN_ROW].src;
        }
        index--;
      }
    }
  }
  loader.style.display = "none";
};
dropdownNONE.addEventListener("click", () => {
  loader.style.display = "block";
  priceBtn.innerText = "None";
  init(data);
});
dropdownHTL.addEventListener("click", () => {
  loader.style.display = "block";
  priceBtn.innerText = "High to Low";
  const d = data.sort((a, b) => b.price - a.price);
  init(d);
});
dropdownLTH.addEventListener("click", () => {
  loader.style.display = "block";
  priceBtn.innerText = "Low to High";
  const d = data.sort((a, b) => a.price - b.price);
  init(d);
});
dropdownChoiceAll.addEventListener("click", () => {
  loader.style.display = "block";
  categoryBtn.innerText = "All";
  init(data);
});
dropdownChoiceBicycle.addEventListener("click", () => {
  loader.style.display = "block";
  const newData = data.filter((d) => {
    return d.category === 0;
  });
  categoryBtn.innerText = "Bicycle";
  init(newData);
});
dropdownChoiceScooter.addEventListener("click", () => {
  loader.style.display = "block";
  const newData = data.filter((d) => {
    return d.category === 1;
  });
  categoryBtn.innerText = "Scooter";
  init(newData);
});

dbProducts.get().then((querySnapshot) => {
  let i = 0;
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
    data[i].id = doc.id;
    i++;
  });
  init(data);
});

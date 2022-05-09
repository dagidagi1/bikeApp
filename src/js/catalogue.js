import {
  dbProducts,
  fbAuth,
  dbUsers,
  dbOrders,
  storageRef,
} from "../firebase/data.js";
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
function productElment(d, i, sort = "all") {
  return `<div class="col">
    <a href="product.html?index=${i}-${sort}">
      <div class="card">
          <div class="card-body"><img class="img-fluid" id="img${i}" src="">
              <h4 class="card-title" style="color: var(--bs-gray);">${d.name}</h4>
              <h6 class="text-muted card-subtitle mb-2" style="font-weight: bold;">${d.price}$</h6>
          </div>
      </div> 
    </a>
  </div>`;
}
//inside init there is a call to productelement with undified object
const init = (da, sort = "all") => {
  let index = da.length;
  for (var i = 0; i < 10; i++) {
    col = document.getElementById(`col_${i}`);
    col.innerHTML = "";
    for (var j = 0; index > 0 && j < MAX_IN_ROW; j++) {
      let x = j + i * MAX_IN_ROW;
      if (!da[i].deleted) {
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
};
dropdownNONE.addEventListener("click", () => {
  btn_price.innerText = "None";
  init(data);
});
dropdownHTL.addEventListener("click", () => {
  btn_price.innerText = "High to Low";
  const d = data.sort((a, b) => b.price - a.price);
  init(d, "HTL");
});
dropdownLTH.addEventListener("click", () => {
  btn_price.innerText = "Low to High";
  const d = data.sort((a, b) => a.price - b.price);
  init(d, "LTH");
});
dropdownChoiceAll.addEventListener("click", () => {
  btn_category.innerText = "All";
  init(data);
});
dropdownChoiceBicycle.addEventListener("click", () => {
  const newData = data.filter((d) => {
    return d.category === 0;
  });
  btn_category.innerText = "Bicycle";
  init(newData, "B");
});
dropdownChoiceScooter.addEventListener("click", () => {
  const newData = data.filter((d) => {
    return d.category === 1;
  });
  btn_category.innerText = "Scooter";
  init(newData, "S");
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

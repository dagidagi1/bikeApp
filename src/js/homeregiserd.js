import { dbProducts, dbUsers, storageRef } from "../firebase/data.js";
const search = document.getElementById("searchgroup");
search.remove();
let col;
var data = [];
// var orders = [];
// var has_store = false;

function productElment(d, i) {
  return `<div class="col">
  <a href="product.html?index=${i}">
  <div class="card">
  <div class="card-body"><img class="img-fluid" src="" id="img${i}">
      <h4 class="card-title" style="color: var(--bs-gray);">${d.name}</h4>
      <h6 class="text-muted card-subtitle mb-2" style="font-weight: bold;">${d.price}$</h6>
  </div>
</div> 
</a></div> `;
}
const init = () => {
  let d = data
    .filter((a) => a.category === 0)
    .sort((a, b) => {
      b.price - a.price;
    });
  col = document.getElementById("col_0");
  col.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    if (!d[i].deleted) {
      col.innerHTML += productElment(d[i], i);
      document.getElementById(`${i}`)?.addEventListener("click", () => {
        globalVariable = { example_attribute: i };
      });
      if (d[i].hasImg) {
        storageRef
          .child(d[i].id)
          .getDownloadURL()
          .then((url) => {
            // Or inserted into an <img> element
            const img = document.getElementById(`img${i}`);
            img.src = url;
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        const img = document.getElementById(`img${i}`);
        img.src = d[i].src;
      }
    }
  }
  d = data
    .filter((a) => a.category === 1)
    .sort((a, b) => {
      b.price - a.price;
    });
  col = document.getElementById("col_1");
  for (let i = 0; i < 5; i++) {
    if (!d[i].deleted) {
      col.innerHTML += productElment(d[i], i + 5);
    }
    if (d[i].hasImg) {
      storageRef
        .child(d[i].id)
        .getDownloadURL()
        .then((url) => {
          // Or inserted into an <img> element
          const img = document.getElementById(`img${i + 5}`);
          img.src = url;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const img = document.getElementById(`img${i + 5}`);
      img.src = d[i].src;
    }
  }
};

dbProducts.get().then((querySnapshot) => {
  let i = 0;
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
    data[i].id = doc.id;
    i++;
  });
  init();
});

dbUsers.get().then((querySnapshot) => {
  // contains all users list, idk if needed here!
  const ddd = [];
  querySnapshot.forEach((doc) => {
    ddd.push(doc.data());
  });
  // console.log(ddd);
});

import {dbProducts, dbUsers, storageRef} from '../firebase/data.js';
const search = document.getElementById('searchgroup');
const modal1 = new bootstrap.Modal(document.getElementById('modal-1'));
const closeShip = document.getElementById('close_ship');
var loader = document.getElementById('loaderDiv');
loader.style.display = 'block';
closeShip.addEventListener('click', () => {
  modal1.hide();
});
search.remove();
let col;
var data = [];

function productElment(d, i) {
  return `<div class="col">
  <a href="product.html?id=${d.id}"">
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
  col = document.getElementById('col_0');
  col.innerHTML = '';
  for (let i = 0; i < 5 && i < d.length; i++) {
    if (!d[i].deleted && +d[i].quantity > 0) {
      col.innerHTML += productElment(d[i], i);
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
  col = document.getElementById('col_1');
  for (let i = 0; i < 5 && i < d.length; i++) {
    if (!d[i].deleted && +d[i].quantity > 0) {
      col.innerHTML += productElment(d[i], i + 5);

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
  }
  loader.style.display = 'none';
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

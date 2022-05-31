import {dbProducts, fbAuth, dbUsers, storageRef} from '../firebase/data.js';
const search = document.getElementById('searchgroup');
search.remove();
const wishListIcon = document.getElementById('wish_list');
var data = [];
var curUser;
const wishListTable = document.getElementById('wish_list_table');
const modal1 = new bootstrap.Modal(document.getElementById('modal-1'));
const closeShip = document.getElementById('close_ship');
var loader = document.getElementById('loaderDiv');
loader.style.display = 'block';
closeShip.addEventListener('click', () => {
  modal1.hide();
});
const getUser = () => {
  fbAuth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      dbUsers
          .where('email', '==', user.email)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              curUser = doc.data();
              curUser.id = doc.id;
              getWishList();
            });
          });
    }
  });
};
function makeRow(d, i) {
  return `<tr>
    <td>
    <a href="product.html?id=${d.id}">
      <img id="img${i}"
        src=""
        width="80px"
      />
    </td>
    <td>${d.name}</td>
    <td class="text-end">
      <div class="btn-group" role="group">
        <button
          class="btn btn-primary"
          type="button"
          style="
            color: var(--bs-table-striped-color);
            background: var(--bs-table-bg);
            border-style: hidden;
          "
          id="add_to_cart${i}"
          value="${d.id}"
        >
          Add to cart&nbsp;<i
            class="fa fa-cart-plus"
          ></i></button
        ><button
          class="btn btn-primary"
          type="button"
          style="
            background: var(--bs-table-bg);
            color: var(--bs-table-striped-color);
            border-style: hidden;
          "
          id="delete${i}"
          value="${d.id}"
        >
          Delete&nbsp;<i class="fa fa-trash"></i>
        </button>
      </div>
    </td>
  </tr>`;
}
function init() {
  wishListTable.innerHTML = '';
  for (let i = 0; i < data.length; i++) {
    wishListTable.innerHTML += makeRow(data[i], i);
    if (data[i].hasImg) {
      storageRef
          .child(data[i].id)
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
      img.src = data[i].src;
    }
  }
  for (let i = 0; i < data.length; i++) {
    document.getElementById(`delete${i}`).addEventListener('click', () => {
      deleteItem(document.getElementById(`delete${i}`).value);
      init();
    });
    document.getElementById(`add_to_cart${i}`).addEventListener('click', () => {
      addToCart(document.getElementById(`add_to_cart${i}`).value);
      init();
    });
  }
  loader.style.display = 'none';
}
getUser();
function getWishList() {
  dbProducts.get().then((querySnapshot) => {
    let i = 0;
    querySnapshot.forEach((doc) => {
      if (curUser.wishList.includes(doc.id)) {
        data.push(doc.data());
        data[i].id = doc.id;
        i++;
      }
    });
    init();
  });
}
function deleteItem(i) {
  curUser.wishList.pop(i);
  data.pop(i);
  dbUsers.doc(curUser.id).set(curUser);
  if (curUser.wishList.length == 0) wishListIcon.style = '';
}
function addToCart(i) {
  curUser.shoppingList.push({id: i, quantity: 1});
  curUser.wishList.pop(i);
  data.pop(i);
  dbUsers.doc(curUser.id).set(curUser);
  if (curUser.wishList.length == 0) wishListIcon.style = '';
}

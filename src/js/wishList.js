import { dbProducts, fbAuth, dbUsers, storageRef } from "../firebase/data.js";
const search = document.getElementById("searchgroup");
search.remove();
let wishListIcon = document.getElementById("wish_list");
const data = [];
var curUser;
const wishListTable = document.getElementById("wish_list_table");
const getUser = () => {
  fbAuth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      dbUsers
        .where("email", "==", user.email)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            curUser = doc.data();
            curUser.id = doc.id;
            init();
          });
        });
    }
  });
};
function makeRow(d, i) {
  return `<tr>
    <td>
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
          value="${i}"
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
          value="${i}"
        >
          Delete&nbsp;<i class="fa fa-trash"></i>
        </button>
      </div>
    </td>
  </tr>`;
}
function init() {
  wishListTable.innerHTML = "";
  for (let i = 0; i < curUser.wishList.length; i++) {
    wishListTable.innerHTML += makeRow(data[+curUser.wishList[i]], i);
    if (data[+curUser.wishList[i]].hasImg) {
      storageRef
        .child(data[+curUser.wishList[i]].id)
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
      img.src = data[+curUser.wishList[i]].src;
    }
  }
  for (let i = 0; i < curUser.wishList.length; i++) {
    document.getElementById(`delete${i}`).addEventListener("click", () => {
      deleteItem(document.getElementById(`delete${i}`).value);
      init();
    });
    document.getElementById(`add_to_cart${i}`).addEventListener("click", () => {
      addToCart(document.getElementById(`add_to_cart${i}`).value);
      init();
    });
  }
}
getUser();
dbProducts.get().then((querySnapshot) => {
  let i = 0;
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
    data[i].id = doc.id;
    i++;
  });
});
function deleteItem(i) {
  curUser.wishList.pop(i);
  dbUsers.doc(curUser.id).set(curUser);
  if (curUser.wishList.length == 0) wishListIcon.style = "";
}
function addToCart(i) {
  const index = data.findIndex((pro) => {
    return pro.name === data[+curUser.wishList[i]].name;
  });
  curUser.shoppingList.push(index);
  curUser.wishList.pop(index);
  dbUsers.doc(curUser.id).set(curUser);
  if (curUser.wishList.length == 0) wishListIcon.style = "";
}

import { dbProducts, fbAuth, dbUsers, dbOrders } from "../firebase/data.js";
const search = document.getElementById("searchgroup");
search.remove();
const userNameNavBar = document.getElementById("navbar_profile_name");
const wish_list = document.getElementById("wish_list");
const shopping_cart = document.getElementById("shopping_cart");
const shopping_cart_table = document.getElementById("shopping_cart_table");
const updateNavBar = () => {
  fbAuth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      dbUsers
        .where("email", "==", user.email)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            userNameNavBar.innerText = doc.data().name;
            if (doc.data().wishList.length > 0) wish_list.style = "color: red";
            if (doc.data().shoppingList.length > 0)
              shopping_cart.style = "color: red";
          });
        });
    }
  });
};
const makeRow = (d, i) => {
  return `<tr>
    <td>
      <img
        src="${d.src}"
        width="80px"
      />
    </td>
    <td>${d.name}</td>
    <td>
      Quantity:&nbsp;<input
        type="number"
        value="1"
        min="1"
        step="1"
        style="
          border-style: hidden;
          min-width: auto;
          max-width: 50px;
          color: var(--bs-gray-800);
        "
      />
    </td>
    <td>${d.price}$</td>
    <td class="text-end">
      <button class="btn btn-primary" type="button" id="btn_delete" value="${i}">
        Delete
      </button>
    </td>
  </tr>`;
};
updateNavBar();

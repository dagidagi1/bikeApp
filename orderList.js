import { user } from "./user.js";
const rate_order_text = document.getElementById("rate_order_text");
const rate_order = document.getElementById("rate_order");
const btn_review = document.getElementById("submit_review");
const search = document.getElementById("searchgroup");
search.remove();
const orderList = document.getElementById("orderList");
const userNameNavBar = document.getElementById("navbar_profile_name");
const wish_list = document.getElementById("wish_list");
const shopping_cart = document.getElementById("shopping_cart");
const updateNavBar = () => {
  userNameNavBar.innerText = user.name;
  if (user.wishList.length > 0) wish_list.style = "color: red";
  if (user.orderList.length > 0) shopping_cart.style = "color: red";
};
const makeRowOrder = (ord) => {
  if (ord.status === "Shipping") {
    return `<tr>
    <td>${ord.order_number}</td>
    <td>
      <img
        src='assets/img/200829b1-9d17-4b9b-8bf8-36baba8859e6.jpg'
        width="80px"
      />
    </td>
    <td>${ord.nameProduct}</td>
    <td style="color: var(--bs-info)">${ord.status}</td>
    <td class="text-end"></td>
  </tr>`;
  } else if (ord.status === "Waiting") {
    return `<td>${ord.order_number}</td>
    <td>
      <img
        src='assets/img/200829b1-9d17-4b9b-8bf8-36baba8859e6.jpg'
        width="80px"
      />
    </td>
    <td>${ord.nameProduct}</td>
    <td style="color: var(--bs-danger)">${ord.status}</td>
    <td class="text-end">
      <button
      id="btncancel"
        class="btn btn-primary"
        type="button"
        style="
          background: var(--bs-table-bg);
          color: var(--bs-table-striped-color);
          border-style: hidden;
        "
        value="${ord.order_number}"
      >
        Cancel order&nbsp;<i class="fa fa-ban"></i>
      </button>
    </td>
  </tr>`;
  } else if (ord.status === "Cancelled") {
    return `<td>${ord.order_number}</td>
    <td>
      <img
        src='assets/img/200829b1-9d17-4b9b-8bf8-36baba8859e6.jpg'
        width="80px"
      />
    </td>
    <td>${ord.nameProduct}</td>
    <td style="color: var(--bs-success)">${ord.status}</td>
    <td class="text-end">
    </td>
  </tr>`;
  } else if (ord.review) {
    return `<td>${ord.order_number}</td>
    <td>
      <img
        src='assets/img/200829b1-9d17-4b9b-8bf8-36baba8859e6.jpg'
        width="80px"
      />
    </td>
    <td>${ord.nameProduct}</td>
    <td style="color: var(--bs-success)">${ord.status}</td>
    <td class="text-end">
    </td>
  </tr>`;
  } else {
    return `<td>${ord.order_number}</td>
  <td>
    <img
      src='assets/img/200829b1-9d17-4b9b-8bf8-36baba8859e6.jpg'
      width="80px"
    />
  </td>
  <td>${ord.nameProduct}</td>
  <td style="color: var(--bs-success)">${ord.status}</td>
  <td class="text-end">
    <button
    id="feedBack"
      class="btn btn-primary visible"
      type="button"
      style="
        background: var(--bs-table-bg);
        color: var(--bs-table-striped-color);
        border-style: hidden;"
      value="${ord.order_number}"
      data-bs-target="#modal-1"
              data-bs-toggle="modal"
              
    >
      Leave feedback&nbsp;<i class="fa fa-pencil"></i>
    </button>
  </td>
</tr>`;
  }
};
const CancelOrder = (e) => {
  user.orderList.map((o) => {
    if (o.order_number === e) o.status = "Cancelled";
  });
  init();
};
const feedBack = (e) => {
  user.orderList.map((o) => {
    if (o.order_number === e) {
      o.rate = rate_order.value;
      o.rate_order_text = rate_order_text.value;
      o.review = true;
    }
  });
};
btn_review.addEventListener("click", () => {
  feedBack(document.getElementById("feedBack").value);
  init();
  location.replace("/orders_list.html");
});
const init = () => {
  orderList.innerHTML = "";
  for (let i = 0; i < user.orderList.length; i++) {
    orderList.innerHTML += makeRowOrder(user.orderList[i], i);
  }
  document.getElementById("feedBack")?.addEventListener("click", () => {
    feedBack(document.getElementById("feedBack").value);
  });
  document.getElementById("btncancel")?.addEventListener("click", () => {
    CancelOrder(document.getElementById("btncancel").value);
  });
};
const saveToFirebase = () => {};
init();
updateNavBar();

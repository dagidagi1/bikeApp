import {fbAuth, dbUsers, dbOrders} from '../firebase/data.js';
const rate_order_text = document.getElementById('rate_order_text');
const rate_order = document.getElementById('rate_order');
const btn_submit_review = document.getElementById('submit_review');
const search = document.getElementById('searchgroup');
search.remove();
var orders = [];
var user;
fbAuth.onAuthStateChanged((u) => {
  if (u) {
    dbUsers
        .where('email', '==', u.email)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            user = doc.data();
            loadorders();
          });
        });
  }
});
const loadorders = () => {
  dbOrders
      .where('email', '==', user.email)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          orders.push(doc.data());
        });
        init();
      });
};
const orderList = document.getElementById('orderList');
const userNameNavBar = document.getElementById('navbar_profile_name');
const wish_list = document.getElementById('wish_list');
const shopping_cart = document.getElementById('shopping_cart');
const updateNavBar = () => {
  fbAuth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      dbUsers
          .where('email', '==', user.email)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              userNameNavBar.innerText = doc.data().name;
              if (doc.data().wishList.length > 0) wish_list.style = 'color: red';
              if (doc.data().shoppingList.length > 0) {
                shopping_cart.style = 'color: red';
              }
            });
          });
    }
  });
};
const makeRowOrder = (ord) => {
  if (ord.status === 'Shipping') {
    return `<tr>
    <td>${ord.order_number}</td>
    <td>
      <img
        src='${ord.src}'
        width="80px"
      />
    </td>
    <td>${ord.nameProduct}</td>
    <td style="color: var(--bs-info)">${ord.status}</td>
    <td class="text-end"></td>
  </tr>`;
  } else if (ord.status === 'Waiting') {
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
  } else if (ord.status === 'Cancelled') {
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
    id="BtnfeedBack"
      class="btn btn-primary visible"
      type="button"
      style="
        background: var(--bs-table-bg);
        color: var(--bs-table-striped-color);
        border-style: hidden;"
      value="${ord.order_number}"
      data-bs-target="#modal-2"
              data-bs-toggle="modal"

    >
      Leave feedback&nbsp;<i class="fa fa-pencil"></i>
    </button>
  </td>
</tr>`;
  }
};
const CancelOrder = (e) => {
  orders.map((o) => {
    if (o.order_number === e) {
      o.status = 'Cancelled';
      dbOrders.doc(o.order_number).set(o);
      init();
    }
  });
};
const feedBack = (e) => {
  orders.map((o) => {
    if (o.order_number === e) {
      o.rate = rate_order.value;
      o.rate_order_text = rate_order_text.value;
      o.review = true;
      dbOrders.doc(o.order_number).set(o);
    }
  });
};
btn_submit_review.addEventListener('click', () => {
  feedBack(document.getElementById('BtnfeedBack').value);
  init();
});
const init = () => {
  orderList.innerHTML = '';
  for (let i = 0; i < orders.length; i++) {
    orderList.innerHTML += makeRowOrder(orders[i], i);
  }
  document.getElementById('btncancel')?.addEventListener('click', () => {
    CancelOrder(document.getElementById('btncancel').value);
    init();
  });
};
updateNavBar();

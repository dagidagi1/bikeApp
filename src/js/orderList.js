import {
  fbAuth,
  dbUsers,
  dbOrders,
  dbProducts,
  storageRef,
} from "../firebase/data.js";
const rateOrderText = document.getElementById("rateOrderText");
const rateOrder = document.getElementById("rateOrder");
const submitReviewBtn = document.getElementById("submit_review");
const search = document.getElementById("searchgroup");
search.remove();
var orders = [];
var data = [];
var user;
fbAuth.onAuthStateChanged((u) => {
  if (u) {
    dbUsers
      .where("email", "==", u.email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          user = doc.data();
        });
        loadData();
      });
  }
});
const loadorders = () => {
  let i = 0;
  dbOrders
    .where("email", "==", user.email)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        orders.push(doc.data());
        orders[i].id = data.filter((d) => {
          if (d.name === orders[i].nameProduct) return d.id;
        });
        i++;
      });
      init();
    });
};
const orderList = document.getElementById("orderList");
const makeRowOrder = (ord) => {
  if (ord.status === "Shipping") {
    return `<tr>
    <td>${ord.order_number}</td>
    <td>
      <img
      id="${ord.order_number}"
        src=''
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
      id="${ord.order_number}"
      src=''
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
      id="${ord.order_number}"
      src=''
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
      id="${ord.order_number}"
      src=''
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
    id="${ord.order_number}"
    src=''
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
      o.status = "Cancelled";
      dbOrders.doc(o.order_number).set(o);
      init();
    }
  });
};
const feedBack = (e) => {
  orders.map((o) => {
    if (o.order_number === e) {
      o.rate = rateOrder.value;
      o.rateOrderText = rateOrderText.value;
      o.review = true;
      dbOrders.doc(o.order_number).set(o);
    }
  });
};
submitReviewBtn.addEventListener("click", () => {
  feedBack(document.getElementById("BtnfeedBack").value);
  init();
});
const init = () => {
  orderList.innerHTML = "";
  for (let i = 0; i < orders.length; i++) {
    orderList.innerHTML += makeRowOrder(orders[i], i);
    if (orders[i].id[0].hasImg) {
      storageRef
        .child(orders[i].id[0].id)
        .getDownloadURL()
        .then((url) => {
          // Or inserted into an <img> element
          const img = document.getElementById(`${orders[i].order_number}`);
          img.src = url;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const img = document.getElementById(`${orders[i].order_number}`);
      img.src = orders[i].src;
    }
  }
  document.getElementById("btncancel")?.addEventListener("click", () => {
    CancelOrder(document.getElementById("btncancel").value);
    init();
  });
};
function loadData() {
  dbProducts.get().then((querySnapshot) => {
    let i = 0;
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
      data[i].id = doc.id;
      i++;
    });
    loadorders();
  });
}

import {
  fbAuth,
  dbUsers,
  dbOrders,
  dbProducts,
  storageRef,
} from "../firebase/data.js";
const rateOrderText = document.getElementById("rate_order_text");
const rateOrder = document.getElementById("rate_order");
const submitReviewBtn = document.getElementById("submit_review");
const modal = new bootstrap.Modal(document.getElementById("modal-2"));
const modal1 = new bootstrap.Modal(document.getElementById("modal-1"));
const closeShip = document.getElementById("close_ship");
closeShip.addEventListener("click", () => {
  modal1.hide();
});
const search = document.getElementById("searchgroup");
const orderList = document.getElementById("orderList");
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
        loadorders();
      });
  }
});
const loadorders = () => {
  let i = 0;
  dbOrders
    .where("buyer", "==", user.email)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        orders.push(doc.data());
        orders[i].id = doc.id;
        i++;
      });
      dbProducts.get().then((querySnapshot) => {
        i = 0;
        querySnapshot.forEach((doc) => {
          for (let j = 0; j < orders.length; j++) {
            if (doc.id === orders[j].prodId) {
              data.push(doc.data());
              data[i].id = doc.id;
              i++;
            }
          }
        });
        init();
      });
    });
};
const makeRowOrder = (ord, da) => {
  if (ord.status === "Shipping") {
    return `<tr>
    <td>${ord.prodId}</td>
    <td>
      <img
      id="${ord.prodId}"
        src=''
        width="80px"
      />
    </td>
    <td>${da.name}</td>
    <td style="color: var(--bs-info)">${ord.status}</td>
    <td class="text-end"></td>
  </tr>`;
  } else if (ord.status === "Waiting") {
    return `<td>${ord.prodId}</td>
    <td>
      <img
      id="${ord.prodId}"
      src=''
        width="80px"
      />
    </td>
    <td>${da.name}</td>
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
        value="${ord.prodId}"
      >
        Cancel order&nbsp;<i class="fa fa-ban"></i>
      </button>
    </td>
  </tr>`;
  } else if (ord.status === "Cancelled") {
    return `<td>${ord.prodId}</td>
    <td>
      <img
      id="${ord.prodId}"
      src=''
        width="80px"
      />
    </td>
    <td>${da.name}</td>
    <td style="color: var(--bs-success)">${ord.status}</td>
    <td class="text-end">
    </td>
  </tr>`;
  } else if (ord.review) {
    return `<td>${ord.prodId}</td>
    <td>
      <img
      id="${ord.prodId}"
      src=''
        width="80px"
      />
    </td>
    <td>${da.name}</td>
    <td style="color: var(--bs-success)">${ord.status}</td>
    <td class="text-end">
    </td>
  </tr>`;
  } else {
    return `<td>${ord.prodId}</td>
  <td>
    <img
    id="${ord.prodId}"
    src=''
      width="80px"
    />
  </td>
  <td>${da.name}</td>
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
      value="${ord.prodId}"
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
    if (o.prodId === e) {
      o.status = "Cancelled";
      dbOrders.doc(o.id).set(o);
      init();
    }
  });
};
const feedBack = (e) => {
  orders.map((o) => {
    if (o.prodId === e) {
      o.rate = rateOrder.value;
      o.rateOrderText = rateOrderText.value;
      o.review = true;
      dbOrders.doc(o.id).set(o);
    }
  });
  modal.hide();
};
submitReviewBtn.addEventListener("click", () => {
  feedBack(document.getElementById("BtnfeedBack").value);
  init();
});
const init = () => {
  orderList.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < orders.length; j++) {
      if (data[i].id === orders[j].prodId) {
        orderList.innerHTML += makeRowOrder(orders[j], data[i]);
        if (data[i].hasImg) {
          storageRef
            .child(data[i].id)
            .getDownloadURL()
            .then((url) => {
              // Or inserted into an <img> element
              const img = document.getElementById(`${orders[j].prodId}`);
              img.src = url;
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          const img = document.getElementById(`${orders[j].prodId}`);
          img.src = data[i].src;
        }
        break;
      }
    }
  }
  document.getElementById("btncancel")?.addEventListener("click", () => {
    CancelOrder(document.getElementById("btncancel").value);
    init();
  });
};

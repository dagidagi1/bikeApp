import { order } from "./orderdata.js";
console.log(order.status);
const search = document.getElementById("searchgroup");
search.remove();
const orderList = document.getElementById("orderList");
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
        onclick="CancelOrder(this)"
        data-tip=${ord.order_number}
      >
        Cancel order&nbsp;<i class="fa fa-ban"></i>
      </button>
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
        class="btn btn-primary visible"
        type="button"
        style="
          background: var(--bs-table-bg);
          color: var(--bs-table-striped-color);
          border-style: hidden;
        "
        onclick="feedBack(this)"
        data-tip=${ord.order_number}
      >
        Leave feedback&nbsp;<i class="fa fa-pencil"></i>
      </button>
    </td>
  </tr>`;
  }
};
const CancelOrder = (btn) => {
  console.log("cancelorder");
};
const feedBack = (btn) => {
  console.log("feedBack");
};
const init = () => {
  for (let i = 0; i < order.length; i++) {
    orderList.innerHTML += makeRowOrder(order[i], i);
  }
};
init();

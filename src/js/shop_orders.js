import {dbProducts, dbStores, dbOrders, storageRef} from '../firebase/data.js';

var parametrs = location.search.substring(1).split('&');
var temp = parametrs[0].split('=');
const store_id = decodeURI(temp[1]);

const ordersTable = document.getElementById('ordersTable');

var listOfOrders = null;

const storeRef = dbStores.doc(store_id);

storeRef.get().then((doc) => {
  if (doc.exists) {
    listOfOrders = doc.data().orders;
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!');
  }
}).then(() => {
  listOfOrders.forEach((item) => {
    get_element(item);
  });
}).catch((error) => {
  console.log('Error getting document:', error);
});

document.addEventListener('click', (e) => {
  var obj = e.target.id.split('/');
  if (obj[0] == 'approveBtn') {
    changeStatus(obj[1], 'Approved');
  } else if (obj[0] == 'denyBtn') {
    changeStatus(obj[1], 'Denied');
  }
});

function get_element(item) {
  var orderRef = dbOrders.doc(item);
  orderRef.get().then((doc) => {
    if (doc.exists) {
      var prodId = doc.data().prodId;
      var quantity = doc.data().quantity;
      var status = doc.data().status;
      var delivery = doc.data().delivery;
      var itemRef = dbProducts.doc(prodId);
      itemRef.get().then((doc) => {
        if (doc.exists) {
          var img = doc.data().src;
          var iId = doc.id;
          var hasImg = doc.data().hasImg;
          var v_name = doc.data().name;
          build_element(orderRef.id, img, v_name, quantity, delivery, status, hasImg, iId);
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      });
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  }).catch((error) => {
    console.log('Error getting document:', error);
  });
}

function build_element(oId, iImg, iName, oQuantity, oDelivery, oStatus, hasImg, iId) {
  const approveBtn = document.createElement('button');
  approveBtn.setAttribute('class', 'btn btn-primary');
  approveBtn.setAttribute('type', 'button');
  approveBtn.setAttribute('style', 'background: var(--bs-table-bg);color: var(--bs-table-striped-color);border-style: hidden;');
  approveBtn.innerHTML = 'Approve ';
  var approveIcon = document.createElement('i');
  approveIcon.setAttribute('class', 'fa fa-check');
  approveBtn.append(approveIcon);

  const denyBtn = document.createElement('button');
  denyBtn.setAttribute('class', 'btn btn-primary');
  denyBtn.setAttribute('type', 'button');
  denyBtn.setAttribute('style', 'background: var(--bs-table-bg);color: var(--bs-table-striped-color);border-style: hidden;');
  denyBtn.innerHTML = 'Deny ';
  var denyIcon = document.createElement('i');
  denyIcon.setAttribute('class', 'fa fa-remove');
  denyBtn.append(denyIcon);

  var row = document.createElement('tr');
  row.setAttribute('id', 'row/' + oId);

  var col0 = document.createElement('td');
  var orderNum = document.createElement('span');
  orderNum.textContent = oId;
  col0.appendChild(orderNum);
  row.appendChild(col0);

  var col1 = document.createElement('td');
  var img = document.createElement('img');
  img.width = 80;
  if (hasImg == false) {
    img.src = iImg;
  } else {
    storageRef.child(iId).getDownloadURL()
        .then((url) => {
          // Or inserted into an <img> element
          img.src = url;
        })
        .catch((error) => {
          console.log(error);
        });
  }
  col1.appendChild(img);
  row.appendChild(col1);

  var col2 = document.createElement('td');
  var bike_name = document.createElement('span');
  bike_name.textContent = iName;
  col2.appendChild(bike_name);
  row.appendChild(col2);

  var col3 = document.createElement('td');
  var quantity = document.createElement('span');
  quantity.textContent = `Quantity: ${oQuantity}`;
  col3.appendChild(quantity);
  row.appendChild(col3);

  var col4 = document.createElement('td');
  var delivery = document.createElement('span');
  var deliveryTime = new Date(oDelivery);
  oDelivery = deliveryTime.toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    hourCycle: 'h24',
  });
  delivery.textContent = `Delivery time: ${oDelivery}`;
  col4.appendChild(delivery);
  row.appendChild(col4);

  var col5 = document.createElement('td');
  col5.setAttribute('class', 'text-end');

  if (oStatus == 'Waiting') {
    var btn_group = document.createElement('div');
    btn_group.setAttribute('class', 'btn-group');
    btn_group.setAttribute('role', 'group');
    approveBtn.setAttribute('id', 'approveBtn/' + oId);
    denyBtn.setAttribute('id', 'denyBtn/' + oId);
    btn_group.append(approveBtn);
    btn_group.append(denyBtn);
    col5.appendChild(btn_group);
  } else {
    var statusSpan = document.createElement('span');
    statusSpan.textContent = oStatus;
    switch (oStatus) {
      case 'Approved':
        statusSpan.style.color = '#20c9a6';
        break;
      case 'Denied':
        statusSpan.style.color = '#e74a3b';
        break;
      default:
        break;
    }
    col5.appendChild(statusSpan);
  }

  row.appendChild(col5);
  ordersTable.appendChild(row);
}

function changeStatus(oId, oStatus) {
  dbOrders.doc(oId).update({
    status: oStatus,
  });
  ordersTable.removeChild(document.getElementById('row/'+oId));
  get_element(oId);
}

import {dbProducts, dbStores, dbOrders, storageRef} from '../firebase/data.js';

var parametrs = location.search.substring(1).split('&');
var temp = parametrs[0].split('=');
const storeId = decodeURI(temp[1]);

const ordersTable = document.getElementById('ordersTable');

var listOfOrders = null;

const storeRef = dbStores.doc(storeId);

storeRef.get().then((doc) => {
  if (doc.exists) {
    listOfOrders = doc.data().orders;
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!');
  }
}).then(() => {
  listOfOrders.forEach((item) => {
    getElement(item);
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

function getElement(item) {
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
          var vName = doc.data().name;
          buildElement(orderRef.id, img, vName, quantity, delivery, status, hasImg, iId);
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

function buildElement(oId, iImg, iName, oQuantity, oDelivery, oStatus, hasImg, iId) {
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
  var bikeName = document.createElement('span');
  bikeName.textContent = iName;
  col2.appendChild(bikeName);
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
    var btnGroup = document.createElement('div');
    btnGroup.setAttribute('class', 'btn-group');
    btnGroup.setAttribute('role', 'group');
    approveBtn.setAttribute('id', 'approveBtn/' + oId);
    denyBtn.setAttribute('id', 'denyBtn/' + oId);
    btnGroup.append(approveBtn);
    btnGroup.append(denyBtn);
    col5.appendChild(btnGroup);
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
  let order = await dbOrders.doc(oId).get();
  dbOrders.doc(oId).update({
    status: oStatus,
  });
  if(oStatus == "Approved"){
    storeRef.get().then((doc)=>{
      const d = new Date();
      let m = d.getMonth();
      let income = doc.data().income;
      let sells = doc.data().sells;
      income[m] += order.data().quantity;
      sells[m] += order.data().price;
      storeRef.update({
        sells: sells,
        income: income,
      });
    }).catch((error)=>{
      console.log('Error getting document:', error)
    })
  }
  ordersTable.removeChild(document.getElementById('row/'+oId));
  getElement(oId);
}

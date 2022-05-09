import {dbStores, dbUsers, fbAuth} from '../firebase/data.js';
var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var storeId = null;
var storeRef = null;
// var top_orders_list = document.getElementById('top_orders_list');
// var top_income_list = document.getElementById('top_income_list');
const modal = new bootstrap.Modal(document.getElementById('modal-1'));

// Get document of store from Firebase

window.onload = function example() {
  fbAuth.onAuthStateChanged((user) => {
    if (user) {
      dbUsers.doc(user.email).get().then((doc) => {
        if (doc.data().store != false) {
          storeId = doc.data().store;
          getStore();
        } else {
          document.getElementById('mainContainer').innerHTML = `<div class="text-center">
                    <p class="text-center">Sorry, You haven't opened store yet :(</p>
                    <a class="btn btn-primary" role="button" id="create_shop_btn" href="shop_register.html">Create store</a>
                  </div>
                </div>
         `;
        }
      });
    } else {
      location.replace('registered_home.html');
    }
  });
};


function getStore() {
  storeRef = dbStores.doc(storeId);
  storeRef.get().then((doc) => {
    if (doc.exists) {
      init(doc.data());
    } else {
      // doc.data() will be undefined in this case
      console.log('No store with this id!\nid: ', storeId);
      // location.replace("registered_home.html");
    }
  }).catch((error) => {
    console.log('Error getting document:', error);
  });
}

document.getElementById('save_btn').addEventListener('click', () => {
  const workHours = new Map();
  daysOfWeek.forEach((d) => {
    if (document.getElementById(`modal_${d}`).checked == false) {
      workHours.set(d, [false]);
    } else {
      workHours.set(d, [true, document.getElementById(`${d}_from`).value, document.getElementById(`${d}_till`).value]);
    }
  });
  const wH = Object.fromEntries(workHours);
  storeRef.update({
    workHours: wH,
  }).catch((error) => {
    console.log('Error getting document:', error);
  });
  daysOfWeek.forEach((day) => {
    if (document.getElementById('modal_' + day).checked == false) {
      document.getElementById(day).textContent = 'Closed';
    } else {
      document.getElementById(day).textContent = `${document.getElementById(day + '_from').value}:00 - ${document.getElementById(day + '_till').value}:00`;
    }
  });
  modal.hide();
});

document.getElementById('items').addEventListener('click', function() {
  location.replace('shop_items.html' + '?id=' + storeId);
});

document.getElementById('ordersCard').addEventListener('click', function() {
  location.replace('shop_orders.html' + '?id=' + storeId);
});

function init(data) {
  document.getElementById('subMainContainer').style.display = 'flex';
  initStatistics(data);
  initTopCustomers();
  initWorkHours(data.workHours);
  initCharts();
}

function initStatistics(data) {
  document.getElementById('shop_items').textContent = data.products.length;
  document.getElementById('earnings').textContent = data.income;
  document.getElementById('sells').textContent = data.sells;
  document.getElementById('orders').textContent = data.orders.length;
  document.getElementById('statistics_cards').style.display = 'flex';
}

function initTopCustomers() {
  document.getElementById('top_customers_card').style.display = 'block';
}

function initWorkHours(workHours) {
  const wH = new Map(Object.entries(workHours));
  daysOfWeek.forEach((day) => {
    const elem = document.getElementById(day);
    const modalElem = document.getElementById('modal_' + day);
    const hours = wH.get(day);
    if (hours[0] == false) {
      elem.textContent = 'Closed';
      modalElem.checked = false;
    } else {
      elem.textContent = `${hours[1]}:00 - ${hours[2]}:00`;
      const fm = document.getElementById(day + '_from');
      const tl = document.getElementById(day + '_till');
      fm.value = hours[1];
      tl.value = hours[2];
    }
  });
  // Display work hours
  document.getElementById('workHours_card').style.display = 'block';
}

function initCharts() {
  const ctx1 = document.getElementById('earning_chart').getContext('2d');
  new Chart(ctx1, {
    type: 'line',
    data: {
      labels: ['January', 'Fabruary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [{
        data: getChart1Data(),
        backgroundColor: 'rgba(78,115,223, 1)',
        borderColor: 'rgba(78,115,223, 1)',
        pointStyle: 'circle',
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 1,
        fill: false,
      }],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      legend: {
        display: false,
      },
    },
  });
  const ctx2 = document.getElementById('sells_chart').getContext('2d');
  new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: ['Bicycles', 'Scooters'],
      datasets: [{
        data: getChart2Data(),
        backgroundColor: [
          'rgb(78,115,223)',
          'rgb(28,200,138)',
        ],
      }],
    },
    options: {
      responsive: true,
      legend: {
        position: 'bottom',
      },
    },
  });
  document.getElementById('charts_card').style.display = 'flex';
}

function getChart1Data() {
  return [1200, 1900, 300, 500, 2000, 3000, 1000, 800, 1300, 2000, 700, 1500];
}

function getChart2Data() {
  return [2000, 1000];
}

import {fbAuth, dbUsers, dbStores} from '../firebase/data.js';

const redColor = '#e74a3b';
const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

var loader = document.getElementById('loaderDiv');

const storeName = document.getElementById('store_name');
let userId = null;
let shopId = null;

document.getElementById('create_btn').addEventListener('click', function() {
  loader.style.display = 'block';
  if (formValidation() == false) {
    loader.style.display = 'none';
    return;
  } else {
    saveStore();
  }
});

function saveStore() {
  const workHours = new Map();
  DAYS_OF_WEEK.forEach((d) => {
    if (document.getElementById(d).checked == false) {
      workHours.set(d, [false]);
    } else {
      workHours.set(d, [
        true,
        document.getElementById(`${d}_from`).value,
        document.getElementById(`${d}_till`).value,
      ]);
    }
  });
  const wH = Object.fromEntries(workHours);
  fbAuth.onAuthStateChanged((user) => {
    if (user) {
      dbUsers
          .where('email', '==', user.email)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              userId = doc.id;
            });
            dbStores
                .add({
                  name: storeName.value,
                  workHours: wH,
                  products: [],
                  income: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  sells: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  orders: [],
                })
                .then((docRef) => {
                  shopId = docRef.id;
                  var userRef = dbUsers.doc(userId);
                  userRef.update({
                    store: shopId,
                  });
                })
                .then(() => {
                  location.replace('shop_dashboard.html' + '?id=' + shopId);
                })
                .catch((error) => {
                  console.error('Error adding document: ', error);
                });
          });
    }
  });
}

function formValidation() {
  if (storeName.value == null || storeName.value == '') {
    storeName.style.borderColor = redColor;
    return false;
  }
  let flag = true;
  DAYS_OF_WEEK.forEach((d)=>{
    var from = parseInt(document.getElementById(`${d}_from`).value);
    var till = parseInt(document.getElementById(`${d}_till`).value);
    if (from < 0 || from >24 || till < 0 || till > 24 || till <= from) {
      console.log(d, from, till);
      if (from < 0 || from >24) {
        document.getElementById(`${d}_from`).style.borderColor = redColor;
        flag = false;
      }
      if (till < 0 || till > 24) {
        document.getElementById(`${d}_till`).style.borderColor = redColor;
        flag = false;
      }
      if (till <= from) {
        document.getElementById(`${d}_till`).style.borderColor = redColor;
        document.getElementById(`${d}_from`).style.borderColor = redColor;
        flag = false;
      }
    } else {
      document.getElementById(`${d}_till`).style.borderColor = '';
      document.getElementById(`${d}_from`).style.borderColor = '';
    }
  });
  return flag;
}

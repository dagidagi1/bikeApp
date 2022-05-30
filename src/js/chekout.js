import { fbAuth, dbUsers, dbProducts, dbStores, dbOrders } from '../firebase/data.js';
//import datepicker from datepicker;
//import datepicker from '../../node_modules/js-datepicker/src/datepicker.js';
var pageHtml = document.getElementById('checkout_form');
window.onload = function exam() {
  const search = document.getElementById('searchgroup');
  search.remove();
  //pageHtml.style.visibility = 'hidden';
  init();
  pageHtml.style.visibility = 'visible';
}
function findOrderObjByItemId(id) {
  let returnVal = 0;
  data.forEach((elem) => {
    if (id === elem.prodId)
      returnVal = elem;
  });
  return returnVal;
}
var data = [];
var endOperation;
document.addEventListener('change', (e) => {
  var id = e.target.id.split('/');
  if (id[0].slice(-7, -3) === 'Date') {
    let orderRef = findOrderObjByItemId(id[0].slice(0, -7));
    let selectedDate = orderRef.getSelectedDateByIndex(document.getElementById(orderRef.getDateSelectorId()).value).getDay();
    let hours = orderRef.getWorkHours()[selectedDate];
    let options = '';
    for (let i = parseInt(hours[0]); i <= parseInt(hours[1]); i++) {
      options += `<option value=${i}> ${i + ':00'}</option>`;
    }
    document.getElementById(orderRef.getTimeSelectorId()).innerHTML = options;
  }
  if(id[0].slice(-7, -3) === 'Time'){
    let orderRef = findOrderObjByItemId(id[0].slice(0, -7));
    let t = document.getElementById(orderRef.getTimeSelectorId()).value;
    orderRef.setSelectedTime(t);
    console.log(orderRef.delivery.toString());
  }
});
var parametrs = location.search.substring(1).split('&');
var temp = parametrs[0].split('=');
const userEmail = decodeURI(temp[1]);
console.log(userEmail);
var totalPrice = 0;
class order {
  constructor(itemId) {
    this.prodId = itemId;
    this.quantity = 0;
    this.status = 'Waiting';
    this.delivery = '';
    this.buyer = userEmail;
  }
  getDateSelectorId() {
    return this.prodId + 'DateSel';
  }
  getTimeSelectorId() {
    return this.prodId + 'TimeSel';
  }
  extractWorkHoursStr() {
    let str = '';
    Object.entries(this.workHours).forEach((element) => {
      if (element[1][0])
        str += element[0] + ' ' + element[1][1] + ' - ' + element[1][2] + '\n'
    })
    return str;
  }
  extractAvailableDaysForDelivery() {
    let daysArr = []
    Object.entries(this.workHours).forEach((element) => {
      if (element[1][0])
        daysArr.push(element[0])
      //str += element[0] + ' ' + element[1][1] + ' - ' + element[1][2] + '\n'
    })
    let currDate = new Date();
    return daysArr;
  }
  get3WeeksDates() {
    let workHours = this.getWorkHours();
    let dates = [];
    var sunday = this.getNextSunday(new Date());
    for (let i = 0; i < 7; i++) {
      if (workHours[i][0] != workHours[i][1]) {
        dates.push(this.addDays(sunday, i));
        dates.push(this.addDays(sunday, i + 7));
        dates.push(this.addDays(sunday, i + 14));
      }
    }
    return dates;
  }

  getSelectedDateByIndex(index){
    this.setSelectedDate(this.get3WeeksDates()[index]);
    return this.get3WeeksDates()[index];
  }
  setSelectedDate(date){
    this.delivery = date;
    let time = this.getWorkHours()[date.getDay()][0];
    this.delivery.setHours(parseInt(time),0,0);
  }
  setSelectedTime(time){
    this.delivery.setHours(parseInt(time),0,0);
  }
  getNextSunday(date) {
    var result = new Date(date);
    var daysRemain = 7 - result.getDay();
    result.setDate(result.getDate() + daysRemain);
    return result;
  }
  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  getWorkHours() {
    let arr = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    if (this.workHours['Sunday'][0]) {
      arr[0][0] = this.workHours['Sunday'][1];
      arr[0][1] = this.workHours['Sunday'][2];
    }
    if (this.workHours['Monday'][0]) {
      arr[1][0] = this.workHours['Monday'][1];
      arr[1][1] = this.workHours['Monday'][2];
    }
    if (this.workHours['Tuesday'][0]) {
      arr[2][0] = this.workHours['Tuesday'][1];
      arr[2][1] = this.workHours['Tuesday'][2];
    }
    if (this.workHours['Wednesday'][0]) {
      arr[3][0] = this.workHours['Wednesday'][1];
      arr[3][1] = this.workHours['Wednesday'][2];
    }
    if (this.workHours['Thursday'][0]) {
      arr[4][0] = this.workHours['Thursday'][1];
      arr[4][1] = this.workHours['Thursday'][2];
    }
    if (this.workHours['Friday'][0]) {
      arr[5][0] = this.workHours['Friday'][1];
      arr[5][1] = this.workHours['Friday'][2];
    }
    if (this.workHours['Saturday'][0]) {
      arr[6][0] = this.workHours['Saturday'][1];
      arr[6][1] = this.workHours['Saturday'][2];
    }
    return arr;
  }
}
const country = document.getElementById("checkout_country");
const city = document.getElementById("checkout_city");
const address = document.getElementById("checkout_address");

const cardName = document.getElementById("checkout_card_name");
const cardNumber = document.getElementById("checkout_card_number");
const cardExp = document.getElementById("checkout_card_exp");
const cardCvv = document.getElementById("checkout_card_cvv");

const checkoutBtn = document.getElementById('checkout_submit_btn');
function init() {
  let itemsIds = [];
  dbUsers.doc(userEmail).get().then((doc) => {
    if (doc.exists) {
      itemsIds = doc.data().shoppingList;
    }
    else {
      alert("err with find user in the collection");
      return;
    }
    if (itemsIds.length === 0) {
      //init empty page, with message for empty cart.
      alert("There are no items inside cart");
    }
    else {
      doc.data().shoppingList.forEach((element) => {
        let orderObj = new order(element['id']);
        orderObj.quantity = parseInt(element['quantity']);
        dbProducts.doc(orderObj.prodId).get().then((doc) => {
          orderObj.price = parseInt(doc.data().price) * orderObj.quantity;
          totalPrice += orderObj.price;
          document.getElementById("checkout_total_amount").innerHTML = totalPrice;
          orderObj.shopId = doc.data().store_id;
          orderObj.name = doc.data().name;
          dbStores.doc(orderObj.shopId).get().then((doc) => {
            orderObj.workHours = doc.data().workHours;
            buildRow(orderObj);
            data.push(orderObj);
          });
        });
      });
    }
  });
}
checkoutBtn.addEventListener('click', function () {
  console.log(totalPrice);
  if (!inputValidity())
    return;
  else {
    endOperation = data.length;
    console.log(data);
    let nowTime = new Date();
    nowTime = nowTime.toDateString();
    //add spinner, and add new order to db. 
    data.forEach((element) => {
      addOrderToDB(element, nowTime);
      
    });
  }
});

function addOrderToDB(orderObj, nowTime) {
  let date = document.getElementById(orderObj.getDateSelectorId()).innerHTML;
  let deliveryTime =
    dbOrders.add({
      prodId: orderObj.prodId,
      quantity: orderObj.quantity,
      status: orderObj.status,
      delivery: orderObj.delivery.toString(),
      store: orderObj.shopId,
      price: orderObj.price,
      buyer: orderObj.buyer,
      orderTime: nowTime,
    }).then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
      //ordersCount--;
      dbStores.doc(orderObj.shopId).update({
        orders: firebase.firestore.FieldValue.arrayUnion(docRef.id),
      }).then((d) => {
        endOperation--;
        finished(endOperation);
      });
    });
}
function finished(counter) {
  if (counter == 0) {
    console.log("finished");
    //delete cart at the user. 
    //dbUsers.doc(userEmail)
    //then => redirect to home page.
  }
}
function inputValidity() {
  //add delivery time check!
  const cardNameSp = document.getElementById("checkout_card_name_sp");
  const cardNumSp = document.getElementById("checkout_card_num_sp");
  const cardExpSp = document.getElementById("checkout_card_exp_sp");
  const cardCvvSp = document.getElementById("checkout_card_cvv_sp");
  const countrySp = document.getElementById("checkout_country_sp");
  const citySp = document.getElementById("checkout_city_sp");
  const addressSp = document.getElementById("checkout_address_sp");
  let today = new Date();
  let todayM = today.getMonth() + 1;
  let todayY = today.getFullYear();
  let cardExpYM = cardExp.value.split('-');
  let flag = true;
  data.forEach((elem) => {
    let dateField = document.getElementById(elem.getDateSelectorId());
    if (dateField.value === '-1') {
      console.log(dateField.value);
      dateField.style.borderColor = 'red';
      flag = false;
    }
    else {
      dateField.style.borderColor = '';
    }
  });
  if (!flag) return flag;
  if (cardName.value.length === 0) {
    //card name is not empty
    cardName.style.borderColor = "red";
    cardNameSp.style.display = "block";
    return false;
  } else {
    cardNameSp.style.display = "none";
    cardName.style.borderColor = "";
  }
  if (cardNumber.value.length === 16 && !isNaN(cardNumber.value)) {
    //card number contains only digits and 16 digits length
    cardNumSp.style.display = "none";
    cardNumber.style.borderColor = "";
  } else {
    cardNumber.style.borderColor = "red";
    cardNumSp.style.display = "block";
    return false;
  }
  if (todayY < parseInt(cardExpYM[0]) || (todayY === parseInt(cardExpYM[0]) && todayM < parseInt(cardExpYM[1]))) {
    //there is exp date, and card is not expired. TODO
    cardExpSp.style.display = "none";
    cardExp.style.borderColor = "";
  } else {
    cardExp.style.borderColor = "red";
    cardExpSp.style.display = "block";
    return false;
  }
  if (cardCvv.value.length === 3 && !isNaN(cardCvv.value)) {
    //card cvv contains only digits and 3 digits length.
    cardCvvSp.style.display = "none";
    cardCvv.style.borderColor = "";
  } else {
    cardCvv.style.borderColor = "red";
    cardCvvSp.style.display = "block";
    return false;
  }
  if (country.value.length === 0) {
    //country is not empty.
    country.style.borderColor = "red";
    countrySp.style.display = "block";
    return false;
  } else {
    countrySp.style.display = "none";
    country.style.borderColor = "";
  }
  if (city.value.length === 0) {
    //city is not empty.
    city.style.borderColor = "red";
    citySp.style.display = "block";
    return false;
  } else {
    citySp.style.display = "none";
    city.style.borderColor = "";
  }
  if (address.value.length === 0) {
    //address is not empty.
    address.style.borderColor = "red";
    addressSp.style.display = "block";
    return false;
  } else {
    addressSp.style.display = "none";
    address.style.borderColor = "";
  }
  return true;
}
var deliveryTable = document.getElementById('checkout_delivery_table');

function buildRow(orderObj) {
  let gavno = '';
  gavno += `<div class="row align-items-center">
  <div class="col-auto align-self-center">
    <p class="text-secondary" style="font-weight: bold; width: 280px">
      ${orderObj.name}
    </p>
  </div>
  <div class="col-auto">
  <select id=${orderObj.getDateSelectorId()}>
  <option value=${-1}>Date</option>`;
  let opts = orderObj.get3WeeksDates();
  //let index = opts.length;
  for(let index = 0; index<opts.length; index++){
    gavno += `<option value=${index}>${formatDate(opts[index])}</option>`
  }
  gavno += `
  </select>
  </div>
  <div class="col-auto">
    <div>
      <select id=${orderObj.getTimeSelectorId()}>
      </select>
    </div>
  </div>
</div>
`;
  deliveryTable.innerHTML += gavno;
  //orderObj.setDateSelectorEvent();
}
function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}
function formatDate(date) {
  return [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
}
import {fbAuth, dbUsers} from '../firebase/data.js';
const search = document.getElementById('searchgroup');
search.remove();

var parametrs = location.search.substring(1).split('&');
var temp = parametrs[0].split('=');
const userEmail = decodeURI(temp[1]);
console.log(userEmail);

const country = document.getElementById("checkout_country");
const city = document.getElementById("checkout_city");
const address = document.getElementById("checkout_address");

const cardName = document.getElementById("checkout_card_name");
const cardNumber = document.getElementById("checkout_card_number");
const cardExp = document.getElementById("checkout_card_exp");
const cardCvv = document.getElementById("checkout_card_cvv");

const checkoutBtn = document.getElementById('checkout_submit_btn');
function init(){
  let itemsIds = [];
  dbUsers.doc(userEmail).get().then((doc)=>{
    if(doc.exists){
      itemsIds = doc.data().shoppingList;
    }
    else {
      alert("err with find user in the collection");
      return;
    }
    if(itemsIds.length ===0){
      //init empty page, with message for empty cart.
      alert("There are no items inside cart");
    }
    else{
      //for each item init row for delivery time.
    }
  })
}
checkoutBtn.addEventListener('click',function() {
  if(!inputValidity())
    return;
  else{
    //add spinner, and add new order to db.
    console.log(country.value, city.value, address.value);
    console.log('card name: '+ cardName.value, 'card num: '+ cardNumber.value, 'card exp: ' + cardExp.value, 'card cvv: '+cardCvv.value);
  }
});

function inputValidity(){
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
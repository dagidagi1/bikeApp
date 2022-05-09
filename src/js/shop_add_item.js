import {dbProducts, fbAuth, dbUsers, dbStores, storageRef} from '../firebase/data.js';

const red_color = '#e74a3b';

const v_category = document.getElementById('category');
const v_type = document.getElementById('vehicle_type');
const v_name = document.getElementById('vehicle_name');
const price = document.getElementById('price');
const manufacturer = document.getElementById('manufacturer');
const max_speed = document.getElementById('max_speed');
const weight = document.getElementById('weight');
const wheel_size = document.getElementById('wheel_size');
const quantity = document.getElementById('quantity');
const description = document.getElementById('description');
const add_item_btn = document.getElementById('add_item_btn');
const photo = document.getElementById('photo');
var shop_id = null;
var file = 0;
var storeRef; var doc_id;
photo.addEventListener('change', (e) => {
  file = e.target.files[0];
});

add_item_btn.addEventListener('click', function() {
  if (formValidation() === false) {
    return;
  } else {
    saveProduct();
  }
});

function saveProduct() {
  fbAuth.onAuthStateChanged((user) => {
    if (user) {
      dbUsers.where('email', '==', user.email).get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              shop_id = doc.data().store;
            });
            let src; let hasImg = true;
            if (file == 0) hasImg = false;
            if (v_category.selectedIndex === 0) {
              src = 'assets/img/200829b1-9d17-4b9b-8bf8-36baba8859e6.jpg';
            } else {
              src = 'assets/img/snimok6.png';
            }
            dbProducts.add({
              store_id: shop_id,
              category: v_category.selectedIndex,
              type: v_type.selectedIndex,
              name: v_name.value,
              price: price.value,
              manufacturer: manufacturer.value,
              max_speed: max_speed.value,
              weight: weight.value,
              wheel_size: wheel_size.value,
              quantity: quantity.value,
              description: description.value,
              deleted: false,
              src: src,
              hasImg: hasImg,
            }).then((docRef) => {
              doc_id = docRef.id;
              storeRef = dbStores.doc(shop_id);
              if (hasImg) {
                storageRef.child(doc_id).put(file).then((snapshot) => {
                  storeRef.update({
                    products: firebase.firestore.FieldValue.arrayUnion(doc_id),
                  });
                  location.replace('shop_dashboard.html' + '?id=' + shop_id);
                });
              } else {
                location.replace('shop_dashboard.html' + '?id=' + shop_id);
              }
            }).then(() => {
            })
                .catch((error) => {
                  console.error('Error adding document: ', error);
                });
          });
    }
  });
}

function formValidation() {
  var flag = true;
  if (v_name.value == null || v_name.value == '') {
    v_name.style.borderColor = red_color;
    document.getElementById('name_err').style.display = 'block';
    flag = false;
  } else {
    v_name.style.borderColor = '';
    document.getElementById('name_err').style.display = 'none';
  }
  if (price.value == null || price.value == '' || price.value <= 0 || !/^\d+(\.\d+)?$/.test(price.value) == false) {
    price.style.borderColor = red_color;
    if (price.value == null || price.value == '') {
      document.getElementById('price_err').style.display = 'block';
    } else if (/^\d+(\.\d+)?$/.test(price.value) == false) {
      document.getElementById('price_err').textContent = 'Price must contain only numbers';
      document.getElementById('price_err').style.display = 'block';
    } else {
      document.getElementById('price_err').textContent = 'Price cannot be negative';
      document.getElementById('price_err').style.display = 'block';
    }
    flag = false;
  } else {
    price.style.borderColor = '';
    document.getElementById('price_err').style.display = 'none';
  }
  if (manufacturer.value == null || manufacturer.value == '') {
    manufacturer.style.borderColor = red_color;
    document.getElementById('manufacturer_err').style.display = 'block';
    flag = false;
  } else {
    manufacturer.style.borderColor = '';
    document.getElementById('manufacturer_err').style.display = 'none';
  }

  return flag;
}

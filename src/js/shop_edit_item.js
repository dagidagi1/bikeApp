import {dbProducts, storageRef, fbAuth, dbUsers} from '../firebase/data.js';

var parametrs = location.search.substring(1).split('&');
var temp = parametrs[0].split('=');
const prodId = decodeURI(temp[1]);

var file = 0;
var hasImg = false;
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
const photo = document.getElementById('photo');

const itemRef = dbProducts.doc(prodId);
itemRef.get().then((doc) => {
  if (doc.exists) {
    const data = doc.data();
    v_category.selectedIndex = data.category;
    v_type.selectedIndex = data.type;
    v_name.value = data.name;
    price.value = data.price;
    manufacturer.value = data.manufacturer;
    max_speed.value = data.max_speed;
    weight.value = data.weight;
    wheel_size.value = data.wheel_size;
    quantity.value = data.quantity;
    description.value = data.description;
    hasImg = data.hasImg;
    document.getElementById('mainCard').style.display = 'block';
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!');
  }
}).catch((error) => {
  console.log('Error getting document:', error);
});

photo.addEventListener('change', (e) => {
  file = e.target.files[0];
  hasImg = true;
});

document.getElementById('add_item_btn').addEventListener('click', function() {
  itemRef.update({
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
    hasImg: hasImg,
  }).then(() => {
    if (file != 0) {
      storageRef.child(prodId).put(file).then((snapshot) => {
        fbAuth.onAuthStateChanged((user)=>{
          if (user) {
            dbUsers.doc(user.email).get().then((doc)=>{
              location.replace('shop_items.html' + '?id=' + doc.data().store);
            });
          }
        });
      });
    }
  }).catch((error) => {
    console.error('Error adding document: ', error);
  });
});

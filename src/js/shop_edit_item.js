import { dbProducts, storageRef, fbAuth, dbUsers } from '../firebase/data.js';

const red_color = '#e74a3b';

var parametrs = location.search.substring(1).split('&');
var temp = parametrs[0].split('=');
const prodId = decodeURI(temp[1]);

var file = 0;
var hasImg = false;
const vCategory = document.getElementById('category');
const vType = document.getElementById('vehicle_type');
const vName = document.getElementById('vehicle_name');
const price = document.getElementById('price');
const manufacturer = document.getElementById('manufacturer');
const maxSpeed = document.getElementById('maxSpeed');
const weight = document.getElementById('weight');
const wheelSize = document.getElementById('wheelSize');
const quantity = document.getElementById('quantity');
const description = document.getElementById('description');
const photo = document.getElementById('photo');

const itemRef = dbProducts.doc(prodId);
itemRef.get().then((doc) => {
  if (doc.exists) {
    const data = doc.data();
    vCategory.selectedIndex = data.category;
    vType.selectedIndex = data.type;
    vName.value = data.name;
    price.value = data.price;
    manufacturer.value = data.manufacturer;
    maxSpeed.value = data.maxSpeed;
    weight.value = data.weight;
    wheelSize.value = data.wheelSize;
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

document.getElementById('add_item_btn').addEventListener('click', () => {
  if (formValidation() == false) {
    return;
  } else {
    updateItem();
  }
})


function updateItem() {
  itemRef.update({
    category: vCategory.selectedIndex,
    type: vType.selectedIndex,
    name: vName.value,
    price: price.value,
    manufacturer: manufacturer.value,
    maxSpeed: maxSpeed.value,
    weight: weight.value,
    wheelSize: wheelSize.value,
    quantity: quantity.value,
    description: description.value,
    hasImg: hasImg,
  }).then(() => {
    if (file != 0) {
      storageRef.child(prodId).put(file).then((snapshot) => {
        fbAuth.onAuthStateChanged((user) => {
          if (user) {
            dbUsers.doc(user.email).get().then((doc) => {
              location.replace('shop_items.html' + '?id=' + doc.data().store);
            });
          }
        });
      });
    }
    else{
      fbAuth.onAuthStateChanged((user) => {
        if (user) {
          dbUsers.doc(user.email).get().then((doc) => {
            location.replace('shop_items.html' + '?id=' + doc.data().store);
          });
        }
      });
    }
  }).catch((error) => {
    console.error('Error adding document: ', error);
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
  if (price.value == null || price.value == '' || /^\d+(\.\d+)?$/.test(price.value) == false) {
    price.style.borderColor = red_color;
    if (price.value == null || price.value == '') {
        document.getElementById('price_err').textContent = "Price cannot be empty";
      document.getElementById('price_err').style.display = 'block';
    } else {
      document.getElementById('price_err').textContent = 'Price must contain only numbers';
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
  if (max_speed.value == null || max_speed.value == '' || /^\d+(\.\d+)?$/.test(max_speed.value) == false) {
    max_speed.style.borderColor = red_color;
    if (max_speed.value == null || max_speed.value == '') {
        document.getElementById('max_speed_err').textContent = "Max speed cannot be empty";
      document.getElementById('max_speed_err').style.display = 'block';
    } else {
      document.getElementById('max_speed_err').textContent = 'Speed must contain only numbers';
      document.getElementById('max_speed_err').style.display = 'block';
    }
    flag = false;
  } else {
    max_speed.style.borderColor = '';
    document.getElementById('max_speed_err').style.display = 'none';
  }
  if (weight.value == null || weight.value == '' || /^\d+(\.\d+)?$/.test(weight.value) == false) {
    weight.style.borderColor = red_color;
    if (weight.value == null || weight.value == '') {
        document.getElementById('weight_err').textContent = "Weight cannot be empty";
      document.getElementById('weight_err').style.display = 'block';
    } else {
      document.getElementById('weight_err').textContent = 'Weight must contain only numbers';
      document.getElementById('weight_err').style.display = 'block';
    }
    flag = false;
  } else {
    weight.style.borderColor = '';
    document.getElementById('weight_err').style.display = 'none';
  }
  if (wheel_size.value == null || wheel_size.value == '' || /^\d+(\.\d+)?$/.test(wheel_size.value) == false) {
    wheel_size.style.borderColor = red_color;
    if (wheel_size.value == null || wheel_size.value == '') {
        document.getElementById('wheel_size_err').textContent = "Wheel size cannot be empty";
      document.getElementById('wheel_size_err').style.display = 'block';
    } else {
      document.getElementById('wheel_size_err').textContent = 'Wheel size must contain only numbers';
      document.getElementById('wheel_size_err').style.display = 'block';
    }
    flag = false;
  } else {
    wheel_size.style.borderColor = '';
    document.getElementById('wheel_size_err').style.display = 'none';
  }
  if (quantity.value == null || quantity.value == '' || /^\d+$/.test(quantity.value) == false) {
    quantity.style.borderColor = red_color;
    if (quantity.value == null || quantity.value == '') {
        document.getElementById('quantity_err').textContent = "Wheel size cannot be empty";
      document.getElementById('quantity_err').style.display = 'block';
    } else {
      document.getElementById('quantity_err').textContent = 'Wheel size must contain only numbers';
      document.getElementById('quantity_err').style.display = 'block';
    }
    flag = false;
  } else {
    quantity.style.borderColor = '';
    document.getElementById('quantity_err').style.display = 'none';
  }
  if (description.value == null || description.value == '') {
    description.style.borderColor = red_color;
    document.getElementById('description_err').style.display = 'block';
    flag = false;
  } else {
    description.style.borderColor = '';
    document.getElementById('description_err').style.display = 'none';
  }
  return flag;
}

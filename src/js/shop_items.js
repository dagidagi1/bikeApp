import {dbProducts, dbStores, storageRef} from '../firebase/data.js';

var parametrs = location.search.substring(1).split('&');
var temp = parametrs[0].split('=');
const storeId = decodeURI(temp[1]);

var loader = document.getElementById('loaderDiv');
loader.style.display = 'block';

const bicycleTable = document.getElementById('bicycle_table');
const scooterTable = document.getElementById('scooter_table');

var listOfItems = null;

var storeRef = dbStores.doc(storeId);
storeRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        listOfItems = doc.data().products;
      } else {
      // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    })
    .then(() => {
      listOfItems.forEach((item) => {
        getElement(item);
      });
    }).then(()=>{
      loader.style.display = 'none';
    })
    .catch((error) => {
      console.log('Error getting document:', error);
    });

document.addEventListener('click', (e) => {
  if (e.target.id.slice(0, 9) == 'deleteBtn') {
    loader.style.display = 'block';
    deleteRow(e.target.id.slice(9));
  }
});

function getElement(item) {
  var itemRef = dbProducts.doc(item);
  itemRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          var img = doc.data().src;
          var vName = doc.data().name;
          var price = doc.data().price;
          var vType = doc.data().category;
          var hasImg = doc.data().hasImg;
          buildElement(item, img, vName, price, vType, hasImg);
        } else {
        // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });
}

function buildElement(iId, imgSrc, iName, iPrice, iType, hasImg) {
  const editBtn = document.createElement('button');
  editBtn.setAttribute('class', 'btn btn-primary');
  editBtn.setAttribute('type', 'button');
  editBtn.setAttribute(
      'style',
      'color: var(--bs-table-striped-color);background: var(--bs-table-bg);border-style: hidden;',
  );
  editBtn.innerHTML = 'Edit ';
  var editIcon = document.createElement('i');
  editIcon.setAttribute('class', 'fa fa-pencil');
  editBtn.appendChild(editIcon);

  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('class', 'btn btn-primary');
  deleteBtn.setAttribute('type', 'button');
  deleteBtn.setAttribute(
      'style',
      'color: var(--bs-table-striped-color);background: var(--bs-table-bg);border-style: hidden;',
  );
  deleteBtn.innerHTML = 'Delete ';
  var deleteIcon = document.createElement('i');
  deleteIcon.setAttribute('class', 'fa fa-trash');
  deleteBtn.appendChild(deleteIcon);

  var row = document.createElement('tr');
  row.setAttribute('id', 'row' + iId);
  var col1 = document.createElement('td');
  var img = document.createElement('img');
  img.setAttribute('id', 'item_img' + iId);
  img.width = 80;
  if (hasImg == false) {
    img.src = imgSrc;
  } else {
    storageRef
        .child(iId)
        .getDownloadURL()
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
  var price = document.createElement('span');
  price.textContent = `${iPrice}$`;
  col3.appendChild(price);
  row.appendChild(col3);

  var btns = document.createElement('td');
  btns.setAttribute('class', 'text-end');
  var btnGroup = document.createElement('form');
  btnGroup.setAttribute('name', 'parametrs');
  btnGroup.setAttribute('method', 'GET');
  btnGroup.setAttribute('action', 'shop_edit_item.html');
  btnGroup.setAttribute('class', 'btn-group');
  btnGroup.setAttribute('role', 'group');
  var id = document.createElement('input');
  id.setAttribute('type', 'hidden');
  id.setAttribute('name', 'id');
  id.setAttribute('value', iId);
  editBtn.setAttribute('id', 'editBtn' + iId);
  editBtn.setAttribute('type', 'submit');
  deleteBtn.setAttribute('id', 'deleteBtn' + iId);
  btnGroup.appendChild(id);
  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(deleteBtn);
  btns.appendChild(btnGroup);
  row.appendChild(btns);

  if (iType == 0) {
    bicycleTable.appendChild(row);
  } else {
    scooterTable.appendChild(row);
  }
}

function deleteRow(num) {
  var rowToDelete = document.getElementById('row' + num);
  if (bicycleTable.querySelector(`#row${num}`) != null) {
    bicycleTable.removeChild(rowToDelete);
  } else {
    scooterTable.removeChild(rowToDelete);
  }
  var index = listOfItems.indexOf(num);
  if (index > -1) {
    listOfItems.splice(index, 1);
  }
  storeRef
      .update({
        products: listOfItems,
      })
      .then(() => {
        dbProducts.doc(num).update({
          deleted: true,
        });
      }).then(()=>{
        loader.style.display = 'none';
      });
}

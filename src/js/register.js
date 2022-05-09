import {dbProducts, fbAuth, dbUsers} from '../firebase/data.js';
var data = [];
const email = document.querySelector('#reg_email');
const password = document.getElementById('reg_password');
const confirmPass = document.getElementById('reg_conf_pass');
const name = document.getElementById('reg_name');
const phone = document.getElementById('reg_phone');
window.onload = function example() {
  fbAuth.onAuthStateChanged((user) => {
    if (user) {
      location.replace('registered_home.html');
    }
  });
};
function checkInput() {
  const nameSp = document.getElementById('reg_name_sp');
  const phoneSp = document.getElementById('reg_phone_sp');
  const passSp = document.getElementById('reg_pass_sp');
  const confPassSp = document.getElementById('reg_conf_pass_sp');
  if (!/^[a-z A-Z]+$/.test(name.value)) {
    name.style.borderColor = 'red';
    nameSp.style.display = 'block';
    return false;
  } else {
    nameSp.style.display = 'none';
    name.style.borderColor = '';
  }
  if (!/^[0-9]{10}$/.test(phone.value)) {
    phone.style.borderColor = 'red';
    phoneSp.style.display = 'block';
    return false;
  } else {
    phone.style.borderColor = '';
    phoneSp.style.display = 'none';
  }
  if (password.value.length < 6) {
    password.style.borderColor = 'red';
    passSp.style.display = 'block';
    return false;
  } else {
    password.style.borderColor = '';
    passSp.style.display = 'none';
  }
  if (!(password.value === confirmPass.value)) {
    confirmPass.style.borderColor = 'red';
    confPassSp.style.display = 'block';
    return false;
  } else {
    confirmPass.style.borderColor = '';
    confPassSp.style.display = 'none';
  }
  // if (/^[a-zA-Z]+$/.test(name) && /^[0-9]{10}$/.test(phone) && password === confirmPass && password.length > 5)
  return true;
}
function save() {
  // adds users email+password to firebase auth and then to collection with the remain user data.
  const emailSp = document.getElementById('reg_email_sp');
  if (checkInput() === true) {
    let flag = false;
    fbAuth
        .createUserWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
        // Signed in
          flag = true;
          email.style.borderColor = '';
          emailSp.style.display = 'none';
        })
        .catch((error) => {
          // color the email.
          email.style.borderColor = 'red';
          emailSp.style.display = 'block';
        // ..
        });
    if (flag === true) {
      dbUsers
          .doc(email.value)
          .set({
            email: email.value,
            name: name.value,
            phone: phone.value,
            store: false,
            shoppingList: [],
            wishList: [],
          })
          .then((docRef) => {
          // alert("Document written with ID: ", docRef.id);
            location.replace('registered_home.html');
          })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });
    }
  }
}

function login() {
  const logEmail = document.getElementById('login_email');
  const logPass = document.getElementById('login_pass');
  fbAuth
      .signInWithEmailAndPassword(logEmail.value, logPass.value)
      .then((userCredential) => {
      // Signed in
        location.replace('registered_home.html');
      })
      .catch((error) => {
        alert(error.code);
      });
}
document.getElementById('reg_btn').addEventListener('click', save, false);
document.getElementById('login_btn').addEventListener('click', login, false);
document.getElementById('email_ver_btn').addEventListener('click', function() {
  firebase
      .auth()
      .sendPasswordResetEmail(document.getElementById('forg_email').value)
      .then(() => {})
      .catch((error) => {
        alert(error.code);
      });
});
let col;
function productElment(d, i) {
  return `<div class="col">
    <a>
    <div class="card" id="${i}">
    <div class="card-body"><img class="img-fluid" src="${d.src}">
        <h4 class="card-title" style="color: var(--bs-gray);">${d.name}</h4>
        <h6 class="text-muted card-subtitle mb-2" style="font-weight: bold;">${d.price}$</h6>
    </div>
  </div> 
  </a></div> `;
}
const init = () => {
  let d = data
      .filter((a) => a.category === 0)
      .sort((a, b) => {
        b.price - a.price;
      });
  col = document.getElementById('col_0');
  col.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    if (!data[i].deleted) {
      col.innerHTML += productElment(d[i], i);
      document.getElementById(`${i}`)?.addEventListener('click', () => {
        // redirectToDiscription(i);
      });
    }
  }
  d = data
      .filter((a) => a.category === 1)
      .sort((a, b) => {
        b.price - a.price;
      });
  console.log(d);
  col = document.getElementById('col_1');
  for (let i = 0; i < 5; i++) {
    if (!data[i].deleted) {
      col.innerHTML += productElment(d[i], i);

      document.getElementById(`${i}`)?.addEventListener('click', () => {
        // redirectToDiscription(i);
      });
    }
  }
};
dbProducts.get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  console.log(data);

  init();
});

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
  if (!/^[a-z A-Z]+$/.test(name.value)) return 'Invalid name';
  if (!/^[0-9]{10}$/.test(phone.value)) return 'Invalid phone';
  if (password.value.length < 6) return 'Password must be at least 6 characters.';
  if (!(password.value === confirmPass.value)) return 'Passwords doesnt match!';
  //if (/^[a-zA-Z]+$/.test(name) && /^[0-9]{10}$/.test(phone) && password === confirmPass && password.length > 5)
  return 0;
}
function save() {
  // adds users email+password to firebase auth and then to collection with the remain user data.
  const inputErr = checkInput();
  if (inputErr == 0) {
    fbAuth
        .createUserWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
        // Signed in
          var user = userCredential.user;
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorCode);
        // ..
        });
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
  } else {
    alert(inputErr);
  }
}

function login() {
const logEmail = document.getElementById('login_email');
const logPass = document.getElementById('login_pass');
  fbAuth
      .signInWithEmailAndPassword(logEmail.value, logPass.value)
      .then((userCredential) => {
      // Signed in
        var user = userCredential.user;
        location.replace('registered_home.html');
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorCode);
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
        var errorCode = error.code;
        var errorMessage = error.message;
      // ..
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
        redirectToDiscription(i);
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

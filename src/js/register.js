import { dbProducts, fbAuth, dbUsers } from "../firebase/data.js";
var data = [];
function save() {
  //saves user only in auth
  var email = document.querySelector("#reg_email").value;
  var password = document.getElementById("reg_password").value;
  var name = document.getElementById("reg_name").value;
  var phone = document.getElementById("reg_phone").value;

  fbAuth
    .createUserWithEmailAndPassword(email, password)
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
    .doc()
    .add({
      email: email,
      password: password,
      name: name,
      phone: phone,
      store: false,
    })
    .then((docRef) => {
      alert("Document written with ID: ", docRef.id);
      location.replace("registered_home.html");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

function get() {
  var username = document.getElementById("username").value;

  var user_ref = database.ref("users/" + username);
  user_ref.on("value", function (snapshot) {
    var data = snapshot.val();

    alert(data.email);
  });
}

function update() {
  var username = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  var updates = {
    email: email,
    password: password,
  };

  database.ref("users/" + email).update(updates);

  alert("updated");
}

function remove() {
  var email = document.getElementById("email").value;

  database.ref("users/" + email).remove();

  alert("deleted");
}
function login() {
  var email = document.getElementById("login_email").value;
  var password = document.getElementById("login_pass").value;
  fbAuth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      location.replace("registered_home.html");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorCode);
    });
}
document.getElementById("reg_btn").addEventListener("click", save, false);
document.getElementById("login_btn").addEventListener("click", login, false);
document.getElementById("email_ver_btn").addEventListener("click", function () {
  firebase
    .auth()
    .sendPasswordResetEmail(document.getElementById("forg_email").value)
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
    <div class="card-body"><img class="img-fluid" src=${
      d.type === 0
        ? "../../assets/img/200829b1-9d17-4b9b-8bf8-36baba8859e6.jpg"
        : "../../assets/img/snimok6.png"
    }>
        <h4 class="card-title" style="color: var(--bs-gray);">${d.name}</h4>
        <h6 class="text-muted card-subtitle mb-2" style="font-weight: bold;">${
          d.price
        }$</h6>
    </div>
  </div> 
  </a></div> `;
}
const init = () => {
  let d = data
    .filter((a) => a.type === 0)
    .sort((a, b) => {
      b.price - a.price;
    });
  col = document.getElementById(`col_0`);
  col.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    col.innerHTML += productElment(d[i], i);
    document.getElementById(`${i}`)?.addEventListener("click", () => {
      redirectToDiscription(i);
    });
  }
  d = data
    .filter((a) => a.type === 1)
    .sort((a, b) => {
      b.price - a.price;
    });
  console.log(d);
  col = document.getElementById(`col_1`);
  for (let i = 0; i < 5; i++) {
    col.innerHTML += productElment(d[i], i);

    document.getElementById(`${i}`)?.addEventListener("click", () => {
      //redirectToDiscription(i);
    });
  }
};
dbProducts.get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  console.log(data);
  init();
});

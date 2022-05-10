import {fbAuth, dbUsers} from '../firebase/data.js';
const username = document.getElementById('username');
const phoneNumber = document.getElementById('phone_number');
const email = document.getElementById('email');
const passwored = document.getElementById('passwored');
const passworedC = document.getElementById('passwored_c');
const savePass = document.getElementById('save_password');
const search = document.getElementById('searchgroup');
search.remove();
var user;
// var orders = [];
let curUser;
fbAuth.onAuthStateChanged((u) => {
  curUser = u;
});
const editBtn = document.getElementById('edit_btn');
const saveBtnSet = document.getElementById('save_btn');
const getUser = () => {
  fbAuth.onAuthStateChanged((u) => {
    if (u) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      dbUsers
          .where('email', '==', u.email)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              user = doc.data();
              user.id = doc.id;
              console.log(user);
              updateDetails();
              if (doc.data().store != false) hasStore = doc.data().store;
            });
          });
    }
  });
};
editBtn.addEventListener('click', () => {
  saveBtnSet.disabled = false;
  email.disabled = false;
  username.disabled = false;
  phoneNumber.disabled = false;
  editBtn.disabled = true;
});

saveBtnSet.addEventListener('click', () => {
  saveToFirebase();
});
savePass.addEventListener('click', () => {
  changePassword();
});
function updateDetails() {
  username.value = user.name;
  phoneNumber.value = user.phone;
  email.value = user.email;
  email.disabled = true;
  username.disabled = true;
  phoneNumber.disabled = true;
  saveBtnSet.disabled = true;
  dbUsers.doc(user.id).set(user);
}
function saveToFirebase() {
  user.name = username.value;
  user.phone = phoneNumber.value;
  editBtn.disabled = false;
  updateDetails();
}
function changePassword() {
  if (passwored.value === passworedC.value && passwored.value.length > 5) {
    user.password = passwored.value;
    updateDetails();
    console.log(curUser);
    curUser
        .updatePassword(passwored.value)
        .then(() => {
          alert('Password changed');
        })
        .catch((error) => {
          alert(error);
        });
  } else alert('error');
  updateDetails();
}
getUser();

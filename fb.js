// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCavKsAEr_YoIpryJGDElMoS_gje0y4YCQ",
    authDomain: "testik-6ec9e.firebaseapp.com",
    projectId: "testik-6ec9e",
    storageBucket: "testik-6ec9e.appspot.com",
    messagingSenderId: "170160044452",
    appId: "1:170160044452:web:65a6aaacd88d6bfd0f6931"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Set database variable
  var database = firebase.database()
  function ssave() {
    
    var email = document.querySelector("#reg_email").value;
    var password = document.getElementById('reg_password').value
    var name = document.getElementById('reg_name').value
    var phone = document.getElementById('reg_phone').value
    console.log(email,password,name,phone)
    database.ref('users/' + email).set({
      email : email,
      password : password,
      name : name,
      phone : phone,
    })
  
    alert('Saved')
  }
  function save(){
    var email = document.querySelector("#reg_email").value;
    var password = document.getElementById('reg_password').value
    var name = document.getElementById('reg_name').value
    var phone = document.getElementById('reg_phone').value
    firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    console.log(user)
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorCode)
    // ..
  });

  }
  function get() {
    var username = document.getElementById('username').value
  
    var user_ref = database.ref('users/' + username)
    user_ref.on('value', function(snapshot) {
      var data = snapshot.val()
  
      alert(data.email)
  
    })
  
  }
  function update() {
    var username = document.getElementById('username').value
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value
  
    var updates = {
      email : email,
      password : password
    }
  
    database.ref('users/' + email).update(updates)
  
    alert('updated')
  }
  function remove() {
    var email = document.getElementById('email').value
    
    database.ref('users/' + email).remove()
  
    alert('deleted')
  }
  function login(){
    var email = document.getElementById('login_email').value
    var password = document.getElementById('login_pass').value
    firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        console.log(user)
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorCode)

  })
  }
  function forgot_pass(){
    firebase.auth().sendPasswordResetEmail(document.getElementById("forg_email").value).then(() => {
      // Password reset email sent!
      alert("Password reset email sent!")
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorCode)
    });
  }
  document.getElementById("reg_btn").addEventListener("click", save, false)
  document.getElementById("login_btn").addEventListener("click", login, false)
  document.getElementById("email_ver_btn").addEventListener("click", forgot_pass, false)
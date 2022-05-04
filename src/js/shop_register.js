import { fbAuth, dbUsers, dbStores } from "../firebase/data.js";

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

let store_name = document.getElementById("store_name")
let user_id = null
let shop_id = null

document.getElementById("create_btn").addEventListener("click", function(){
    let work_hours = new Map();
    DAYS_OF_WEEK.forEach((d)=>{
        if(document.getElementById(d).checked == false){
            work_hours.set(d, [false]);
        }
        else{
            work_hours.set(d, [true, document.getElementById(`${d}_from`).value, document.getElementById(`${d}_till`).value]);
        }
    })
    const w_h = Object.fromEntries(work_hours);
    fbAuth.onAuthStateChanged((user) => {
        if (user) {
            dbUsers.where("email", "==", user.email).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    user_id = doc.id;
                });
                dbStores.add({
                    name: store_name.value,
                    work_hours: w_h,
                    products: [],
                    income: 0,
                    sells: 0,
                    orders: 0
                }).then((docRef) => {
                    shop_id = docRef.id
                    var userRef = dbUsers.doc(user_id)
                    userRef.update({
                        store: shop_id
                    });
                }).then(()=>{
                    location.replace("shop_dashboard.html" + "?id=" + shop_id);
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });
            })
        }
    });
})



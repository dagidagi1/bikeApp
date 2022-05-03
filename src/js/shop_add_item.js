import { dbProducts, fbAuth, dbUsers, dbStores } from "../firebase/data.js";

const v_category = document.getElementById("category")
const v_type = document.getElementById("vehicle_type")
const v_name = document.getElementById("vehicle_name")
const price = document.getElementById("price")
const manufacturer = document.getElementById("manufacturer")
const max_speed = document.getElementById("max_speed")
const weight = document.getElementById("weight")
const wheel_size = document.getElementById("wheel_size")
const quantity = document.getElementById("quantity")
const description = document.getElementById("description")
const add_item_btn = document.getElementById("add_item_btn")
const photo = document.getElementById("photo")
var shop_id = null

photo.addEventListener("change", (e) => {
    const file = e.target.files[0];
    console.log(file);
})

add_item_btn.addEventListener("click", function () {
    fbAuth.onAuthStateChanged((user) => {
        if (user) {
            dbUsers.where("email", "==", user.email).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    shop_id = doc.data().store;
                });
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
                    deleted: false
                }).then((docRef) => {
                    const doc_id = docRef.id
                    var storeRef = dbStores.doc(shop_id)
                    storeRef.update({
                        products: firebase.firestore.FieldValue.arrayUnion(doc_id)
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
});

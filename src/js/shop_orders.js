import { dbProducts, dbStores } from "../firebase/data.js";

var parametrs = location.search.substring(1).split('&')
var temp = parametrs[0].split("=")
const store_id = decodeURI(temp[1])

const ordersTable = document.getElementById("ordersTable")

var listOfOrders = null

const storeRef = dbStores.doc(store_id);

storeRef.get().then((doc) => {
    if (doc.exists) {
        listOfOrders = doc.data().orders;
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).then(() => {
    listOfOrders.forEach(item => {
        get_element(item);
    });
}).catch((error) => {
    console.log("Error getting document:", error);
});
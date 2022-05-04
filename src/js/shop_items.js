import { dbProducts, dbStores } from "../firebase/data.js";

var parametrs = location.search.substring(1).split('&')
var temp = parametrs[0].split("=")
const store_id = decodeURI(temp[1])

const bicycle_table = document.getElementById("bicycle_table")
const scooter_table = document.getElementById("scooter_table")

var list_of_items = null

var storeRef = dbStores.doc(store_id);
storeRef.get().then((doc) => {
    if (doc.exists) {
        list_of_items = doc.data().products;
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).then(() => {
    list_of_items.forEach(item => {
        get_element(item);
    });
}).catch((error) => {
    console.log("Error getting document:", error);
});

document.addEventListener("click", (e) => {
    if (e.target.id.slice(0, 10) == "delete_btn") {
        delete_row(e.target.id.slice(10))
    }
})

function get_element(item) {
    var itemRef = dbProducts.doc(item);
    itemRef.get().then((doc) => {
        if (doc.exists) {
            var img = doc.data().src
            var v_name = doc.data().name
            var price = doc.data().price
            var v_type = doc.data().category
            build_element(item, img, v_name, price, v_type)
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

function build_element(i_id, img_src, i_name, i_price, i_type) {
    const edit_btn = document.createElement('button')
    edit_btn.setAttribute("class", "btn btn-primary")
    edit_btn.setAttribute("type", "button")
    edit_btn.setAttribute("style", "color: var(--bs-table-striped-color);background: var(--bs-table-bg);border-style: hidden;")
    edit_btn.innerHTML = "Edit "
    var edit_icon = document.createElement('i')
    edit_icon.setAttribute("class", "fa fa-pencil")
    edit_btn.appendChild(edit_icon)

    const delete_btn = document.createElement('button')
    delete_btn.setAttribute("class", "btn btn-primary")
    delete_btn.setAttribute("type", "button")
    delete_btn.setAttribute("style", "color: var(--bs-table-striped-color);background: var(--bs-table-bg);border-style: hidden;")
    delete_btn.innerHTML = "Delete "
    var delete_icon = document.createElement('i')
    delete_icon.setAttribute("class", "fa fa-trash")
    delete_btn.appendChild(delete_icon)

    var row = document.createElement('tr')
    row.setAttribute("id", "row" + i_id)
    var col1 = document.createElement('td')
    var img = document.createElement('img')
    img.width = 80
    img.src = img_src
    col1.appendChild(img)
    row.appendChild(col1)

    var col2 = document.createElement('td')
    var bike_name = document.createElement('span')
    bike_name.textContent = i_name
    col2.appendChild(bike_name)
    row.appendChild(col2)

    var col3 = document.createElement('td')
    var price = document.createElement('span')
    price.textContent = `${i_price}$`
    col3.appendChild(price)
    row.appendChild(col3)

    var btns = document.createElement('td')
    btns.setAttribute("class", "text-end")
    var btn_group = document.createElement('form')
    btn_group.setAttribute("name", "parametrs")
    btn_group.setAttribute("method", "GET")
    btn_group.setAttribute("action", "shop_edit_item.html")
    btn_group.setAttribute("class", "btn-group")
    btn_group.setAttribute("role", "group")
    var id = document.createElement('input')
    id.setAttribute("type", "hidden")
    id.setAttribute("name", "id")
    id.setAttribute("value", i_id)
    edit_btn.setAttribute("id", "edit_btn" + i_id)
    edit_btn.setAttribute("type", "submit")
    delete_btn.setAttribute("id", "delete_btn" + i_id)
    btn_group.appendChild(id)
    btn_group.appendChild(edit_btn)
    btn_group.appendChild(delete_btn)
    btns.appendChild(btn_group)
    row.appendChild(btns)

    if (i_type == 0) {
        bicycle_table.appendChild(row)
    }
    else {
        scooter_table.appendChild(row)
    }
}


function delete_row(num) {
    var row_to_delete = document.getElementById("row" + num)
    if (bicycle_table.querySelector(`#row${num}`) != null) {
        bicycle_table.removeChild(row_to_delete)
    }
    else {
        scooter_table.removeChild(row_to_delete)
    }
    var index = list_of_items.indexOf(num);
    if (index > -1) {
        list_of_items.splice(index, 1);
    }
    storeRef.update({
        products: list_of_items
    }).then(() => {
        dbProducts.doc(num).update({
            deleted: true
        })
    })
}
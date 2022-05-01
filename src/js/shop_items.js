bicycle_table = document.getElementById("bicycle_table")
for (var i = 0; i < 2; ++i) {
    edit_btn = document.createElement('button')
    edit_btn.setAttribute("class", "btn btn-primary")
    edit_btn.setAttribute("type", "button")
    edit_btn.setAttribute("style", "color: var(--bs-table-striped-color);background: var(--bs-table-bg);border-style: hidden;")
    edit_btn.innerHTML = "Edit "
    edit_icon = document.createElement('i')
    edit_icon.setAttribute("class", "fa fa-pencil")
    edit_btn.appendChild(edit_icon)

    delete_btn = document.createElement('button')
    delete_btn.setAttribute("class", "btn btn-primary")
    delete_btn.setAttribute("type", "button")
    delete_btn.setAttribute("style", "color: var(--bs-table-striped-color);background: var(--bs-table-bg);border-style: hidden;")
    delete_btn.innerHTML = "Delete "
    delete_icon = document.createElement('i')
    delete_icon.setAttribute("class", "fa fa-trash")
    delete_btn.appendChild(delete_icon)

    var row = document.createElement('tr')
    row.setAttribute("id", "row" + i)
    var col1 = document.createElement('td')
    var img = document.createElement('img')
    img.width = 80
    img.src = "../../assets/img/200829b1-9d17-4b9b-8bf8-36baba8859e6.jpg?h=8b07a07b5836d85b907557b7ac4e48bc"
    col1.appendChild(img)
    row.appendChild(col1)

    var col2 = document.createElement('td')
    var bike_name = document.createElement('span')
    bike_name.textContent = "Bike name"
    col2.appendChild(bike_name)
    row.appendChild(col2)

    var col3 = document.createElement('td')
    var price = document.createElement('span')
    price.textContent = "Some price"
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
    id = document.createElement('input')
    id.setAttribute("type", "hidden")
    id.setAttribute("name", "id")
    id.setAttribute("value", i)
    edit_btn.setAttribute("id", "edit_btn" + i)
    edit_btn.setAttribute("type", "submit")
    delete_btn.setAttribute("id", "delete_btn" + i)
    btn_group.appendChild(id)
    btn_group.appendChild(edit_btn)
    btn_group.appendChild(delete_btn)
    btns.appendChild(btn_group)
    row.appendChild(btns)

    bicycle_table.appendChild(row)
}

for(i = 0; i < 2; ++i){
    document.getElementById('delete_btn' + i).addEventListener('click', function(){delete_row(this.id.at(-1));});
}

function delete_row(num){
    row_to_delete = document.getElementById("row" + num)
    bicycle_table.removeChild(row_to_delete)
    // update databse
}
var parametrs = location.search.substring(1).split('&')
var temp = parametrs[0].split("=")
id = decodeURI(temp[1])

v_category = document.getElementById("category")
v_category.selectedIndex = id

v_type = document.getElementById("vehicle_type")
v_type.selectedIndex = id

v_name = document.getElementById("vehicle_name")
v_name.value = id

price = document.getElementById("price")
price.value = id

manufacturer = document.getElementById("manufacturer")
manufacturer.value = id

max_speed = document.getElementById("max_speed")
max_speed.value = id

weight = document.getElementById("weight")
weight.value = id

wheel_size = document.getElementById("wheel_size")
wheel_size.value = id

quantity = document.getElementById("quantity")
quantity.value = id

description = document.getElementById("description")
description.value = id


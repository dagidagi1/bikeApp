var parametrs = location.search.substring(1).split('&')
var temp = parametrs[0].split("=")
id = decodeURI(temp[1])

alert(id)


let sName = document.getElementById("create_store_name");
let hours = document.getElementById("create_store_tb");
document
  .getElementById("create_store_submit_btn")
  .addEventListener("click", function () {
    console.log(hours);
    location.replace("shop_dashboard.html");
  });
const search = document.getElementById("searchgroup");
search.remove();
create_store_submit_btn;

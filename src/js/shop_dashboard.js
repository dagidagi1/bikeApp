import { dbStores } from "../firebase/data.js";
var days_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// Get store id from Url link
var parametrs = location.search.substring(1).split('&')
var temp = parametrs[0].split("=")
const store_id = decodeURI(temp[1])
var top_orders_list = document.getElementById("top_orders_list")
var top_income_list = document.getElementById("top_income_list")
const modal = new bootstrap.Modal(document.getElementById("modal-1"))

// Get document of store from Firebase
var docRef = dbStores.doc(store_id);
docRef.get().then((doc) => {
    if (doc.exists) {
        init(doc.data())
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        location.replace("registered_home.html");
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});

document.getElementById("save_btn").addEventListener("click", () => {
    let work_hours = new Map();
    days_of_week.forEach((d) => {
        if (document.getElementById(`modal_${d}`).checked == false) {
            work_hours.set(d, [false]);
        }
        else {
            work_hours.set(d, [true, document.getElementById(`${d}_from`).value, document.getElementById(`${d}_till`).value]);
        }
    })
    const w_h = Object.fromEntries(work_hours);
    docRef.update({
        work_hours: w_h
    }).then(() => {
        modal.hide()
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
})

function init(data) {
    init_statistics(data);
    init_top_customers();
    init_work_hours(data.work_hours);
    init_charts();
}

function init_statistics(data) {
    document.getElementById("shop_items").textContent = data.products.length
    document.getElementById("earnings").textContent = data.income
    document.getElementById("sells").textContent = data.sells
    document.getElementById("orders").textContent = data.orders
    document.getElementById("statistics_cards").style.display = "flex"
}

function init_top_customers() {
    document.getElementById("top_customers_card").style.display = "block"
}

function init_work_hours(work_hours) {
    const w_h = new Map(Object.entries(work_hours))
    days_of_week.forEach((day) => {
        const elem = document.getElementById(day);
        const modal_elem = document.getElementById("modal_" + day);
        const hours = w_h.get(day);
        if (hours[0] == false) {
            elem.textContent = "Closed";
            modal_elem.checked = false;
        }
        else {
            elem.textContent = `${hours[1]}:00 - ${hours[2]}:00`;
            const fm = document.getElementById(day + "_from");
            const tl = document.getElementById(day + "_till");
            fm.value = hours[1];
            tl.value = hours[2];
        }
    });
    // Display work hours
    document.getElementById("work_hours_card").style.display = "block";
}

function init_charts() {
    const ctx1 = document.getElementById('earning_chart').getContext('2d');
    const myChart1 = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['January', 'Fabruary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                data: get_chart1_data(),
                backgroundColor: 'rgba(78,115,223, 1)',
                borderColor: 'rgba(78,115,223, 1)',
                pointStyle: 'circle',
                pointRadius: 2,
                pointHoverRadius: 5,
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            legend: {
                display: false
            }
        }
    });
    const ctx2 = document.getElementById('sells_chart').getContext('2d');
    const myChart2 = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Bicycles', 'Scooters'],
            datasets: [{
                data: get_chart2_data(),
                backgroundColor: [
                    'rgb(78,115,223)',
                    'rgb(28,200,138)'
                ],
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'bottom',
            }
        }
    });
    document.getElementById("charts_card").style.display = "flex"
}

function get_chart1_data() {
    return [1200, 1900, 300, 500, 2000, 3000, 1000, 800, 1300, 2000, 700, 1500]
}

function get_chart2_data() {
    return [2000, 1000]
}
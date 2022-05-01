
document.getElementById("add_item_btn").addEventListener("click", function(){
    document.getElementById("sells").textContent="Wrong"
    document.getElementById("earnings").textContent="Wrong"
});

init_charts();

var top_orders_list = document.getElementById("top_orders_list")
var top_income_list = document.getElementById("top_income_list")

for(var i = 0; i<3; ++i){
    var entry = document.createElement('li');
    entry.appendChild(document.createTextNode("First Last"));
    top_orders_list.appendChild(entry);
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
            responsive : true, 
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            legend:{
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
        options:{
            responsive: true,
            legend:{
                position: 'bottom',
            }
        }
    });
}


function get_chart1_data(){
    return [1200, 1900, 300, 500, 2000, 3000, 1000, 800, 1300, 2000, 700, 1500]
}

function get_chart2_data(){
    return [2000, 1000]
}
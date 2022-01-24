

var basic = document.getElementById('addBasic');
var full = document.getElementById('addFull');





basic.addEventListener('click', function () {

    var basic = {
        id: window.location.href.split("?")[1],
        full: false,
        score: document.getElementById('reviewScore').value,
    }



    var userJSON = JSON.stringify(basic)


    console.log(userJSON)

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        };
    }

    xhttp.open("POST", "/review", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(userJSON);

})

full.addEventListener('click', function () {





    var full = {
        id: window.location.href.split("?")[1],
        full: true,
        summary: document.getElementById('reviewSummary').value,
        text: document.getElementById('reviewText').value,
        score: document.getElementById('reviewScore').value,
    }



    var userJSON = JSON.stringify(full)


    console.log(userJSON)

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        };
    }

    xhttp.open("POST", "/review", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(userJSON);

})





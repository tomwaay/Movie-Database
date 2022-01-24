var followBtn = document.getElementById('followButton')


followBtn.addEventListener('click', function () {
    var personFollowed = window.location.href.split("?")[1].replace("%20", " ").replace("%20", " ")

    var person = {name: personFollowed}

    var data = JSON.stringify(person)


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        };
    }

    xhttp.open("POST", "/followperson", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(data);

})

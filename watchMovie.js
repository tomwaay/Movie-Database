var watchBtn = document.getElementById('watchButton')

watchBtn.addEventListener('click', function (){
    var movieWatched = window.location.href.split("?")[1]

    var movie = {_id: movieWatched}

    data = JSON.stringify(movie)

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        };
    }

    xhttp.open("POST", "/watchmovie", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(data);
})
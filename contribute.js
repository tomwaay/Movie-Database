var movie = document.getElementById('addMovie');

movie.addEventListener('click', function () {

    //check membership of username and password
    //send to server
    var movie = {
        Title: document.getElementById('contributeTitle').value,
        Time: document.getElementById('contributeTime').value,
        Year: document.getElementById('contributeYear').value,
        Writer: document.getElementById('contributeWriters').value.split(','),
        Director: document.getElementById('contributeDirectors').value.split(','),
        Actors: document.getElementById('contributeActors').value.split(','),
        Genre: document.getElementById('contributeActors').value,
        Poster: document.getElementById('contributeImg').value,
        Similiar: [],
        Reviews: []
    }



    var userJSON = JSON.stringify(movie)


    console.log(userJSON)

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        }
        else if(this.status == 403){
            alert("You are not a contributing user and do not have permission to contribute.")
        }
    }

    xhttp.open("POST", "/contribute", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(userJSON);

})



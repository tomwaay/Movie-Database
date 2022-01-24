var searchbtn = document.getElementById('searchButton');


searchbtn.addEventListener('click', function(){

    var titleSearch = document.getElementById('titleSearch').value
    var genreSearch = document.getElementById('genreSearch').value
    var actorSearch = document.getElementById('actorSearch').value
    var resultsDiv = document.getElementById("results")

    document.getElementById('titleSearch').value = ""
    document.getElementById('genreSearch').value = ""
    document.getElementById('actorSearch').value = ""

    while(resultsDiv.firstChild){
        resultsDiv.removeChild(resultsDiv.firstChild)
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("ok local")

            var resObj = JSON.parse(xhttp.responseText);
            console.log(resObj)
            resObj.forEach(function(movie){
                
                var charLink = document.createElement('a')
                charLink.setAttribute('href', "/movies?"+movie._id)
                charLink.innerText = movie.Title

                var breakDiv = document.createElement('br')

                
                resultsDiv.classList.add("result")
                resultsDiv.appendChild(charLink)
                resultsDiv.appendChild(breakDiv)
            })



        };
    }

xhttp.open("GET", "/searchresults?title="+titleSearch+"?genre="+genreSearch+"?actor="+actorSearch, true);
xhttp.send();

})


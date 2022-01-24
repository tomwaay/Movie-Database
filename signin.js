var signin = document.getElementById('signinButton');
var signup = document.getElementById('signupButton');



signin.addEventListener('click', function () {

    //check membership of username and password
    //send to server
    var data = {}


    data.username = document.getElementById('usernameInput').value
    data.password = document.getElementById('passwordInput').value

    document.getElementById('usernameInput').value = ""
    document.getElementById('passwordInput').value = ""

    var userJSON = JSON.stringify(data)
    
    
    console.log(userJSON)

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        let signedin = false;
        if (this.readyState == 4 && this.status == 200) {
            signedin = true
            alert("Logged In!")
            window.location.replace("http://localhost:3000/profile")
        }
        if(this.readyState == 4  && this.status == 404 && !signedin){
            alert("Incorrect login!")
            window.location.replace("http://localhost:3000/userauth")
        }
        
    }

    xhttp.open("POST", "/login",true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(userJSON);



})

signup.addEventListener('click', function () {

    //check membership of username and password
    //send to server
    var data = {}


    data.username = document.getElementById('usernameInput').value
    data.password = document.getElementById('passwordInput').value

    document.getElementById('usernameInput').value = ""
    document.getElementById('passwordInput').value = ""

    var userJSON = JSON.stringify(data)
    

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        };
    }

    xhttp.open("POST", "/signup",true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(userJSON);
    window.location.replace("http://localhost:3000/profile")

})


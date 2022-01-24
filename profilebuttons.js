unfollowBtn = document.getElementsByClassName("unfollowPerson")
logoutBtn = document.getElementById("logoutButton")
save = document.getElementById("acctypeSave")


save.addEventListener('click', function(){

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.replace("http://localhost:3000/profile")
        };
    }

    xhttp.open("GET", "/changeAcctType", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
})



logoutBtn.addEventListener('click', function(){
    usertoLogout = logoutBtn.className
    console.log(usertoLogout)

    var user = {username: usertoLogout}
    var data = JSON.stringify(user)

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            alert("Logged out user "+usertoLogout)
            window.location.replace("http://localhost:3000/userauth")
        };
    }

    xhttp.open("POST", "/logout", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(data);
})





buttonCount = unfollowBtn.length

for(var i = 0; i<buttonCount; i++){
    unfollowBtn[i].onclick = function(e){
        personName = this.id
        
        var unfollowed = {name: personName}

        data = JSON.stringify(unfollowed)

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
            };
        }

        xhttp.open("POST", "/unfollowperson", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(data);


    }
}



unfollowBtn = document.getElementsByClassName("userFollowPerson")
followOther = document.getElementById("followOther")

info = followOther.className


followOther = document.addEventListener('click',function(){
    userInfo = info.split("?")
    console.log(userInfo)
    userID = userInfo[0]
    userName = userInfo[1]

    var user = {_id: userID, username: userName}

    var data = JSON.stringify(user) 

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
        };
    }

    xhttp.open("POST", "/followother", true);
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

        xhttp.open("POST", "/followperson", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(data);

    }
}
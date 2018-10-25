//----------- Codes for login should go here-------
    loginButton.onclick = LOGIN;
    createNewUser.onclick = NEWUSER;
    //Login Function,
function LOGIN(){
        let USERNAME = document.getElementById("usernameINPUT").value;
        let PASSWORD = document.getElementById("passwordINPUT").value;
            console.log(USERNAME, PASSWORD);
        }
function NEWUSER(){
           document.getElementById("usernameINPUT").value ="";
            document.getElementById("passwordINPUT").value ="";
        }

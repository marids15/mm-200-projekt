NewUserBUTTON.onclick = JustAddingUser;
    function JustAddingUser(){
        let Adder = document.createElement(`div`);
        Adder.classList.add("dsiplayPresentationsDIV");
        document.getElementById("MyPresentationDIV").appendChild(Adder);
        console.log("pressed Button");
         console.log(Adder);
    }

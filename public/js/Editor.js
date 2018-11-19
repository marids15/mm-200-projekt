
    let showSourceCode = false;
    let isInEditMode = true;
    // YES I KNOW it is a big no no to use the execCommand but as faar as i have tested it. it doe snot run any code typed into it.
function startTexfield() {
  var x = document.getElementById("inTxtRich");
  //var test = document.getElementById('inTxt').contentWindow.document.body.innerHTML;
  var y = (x.contentWindow || x.contentDocument);
  if (y.document)y = y.document;
  //console.log(y);
//  console.log(test);
  y.body.style.backgroundColor = "white";
}

    function enableEditMode (){ //MAKES US ABLEL To TYPE IN THE <IFRAME>
        richTextField.document.designMode = 'On';
        console.log("called");
    }
    function disableEditMode (){ //MAKES US ABLEL To TYPE IN THE <IFRAME>
      richTextField.document.designMode = 'Off';
      isInEditMode = false;
      console.log("off");
    }

    function execCmd(command){ //BASELINE
//preventDefault();
      console.log("heyy");
        richTextField.document.execCommand(command, false, null);
    }

    function execCommandWithArg(command, arg){ //WITH ARGUMENTS
        richTextField.document.execCommand(command, false, arg);
    }
    function toggleSource() {
      preventDefault();
        if(showSourceCode){
            showSourceCode = false;
            console.log("hereami");
            richTextField.document.getElementsByTagName('body')[0].innerHTML = richTextField.getElementsByTagName('body')[0].textContent;
        }
        else {
            richTextField.document.getElementsByTagName('body')[0].textContent = richTextField.getElementsByTagName('body')[0].innerHTML;
            showSourceCode = true;
        }
    }


    function toggleEdit () {
        if(isInEditMode){
            richTextField.document.designMode = 'Off';
            isInEditMode = false;
            console.log("off");
        }
        else {
            richTextField.document.designMode = 'On';
            isInEditMode = true;
            console.log("onn");
        }
    }

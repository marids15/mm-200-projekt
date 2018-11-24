//function to add text option in html tools
function doChange(){
  let element = document.getElementById("updateTextDiv").innerHTML;
    document.getElementById("updateFontDiv").innerHTML =
    `
      <label>Set font: </label>
      <select class="selectBox" id="setFont">
      <option value="Default" selected>Default</option>
      <option value="TimesFont">Times New Roman</option>
      <option value="ArialFont">Arial</option>
      <option value="ComicFont">Comic Sans</option>
      <option value="ImpactFont">IMPACT</option>
      <option value="CourierFont">Courier</option>
      </select>
    `
    setFont.onchange = changeFont;
    document.getElementById("updateColorDiv").innerHTML =
    `
      <label>Set font color: </label>
      <select class="selectBox"  id="setFontColor">
      <option value="Default" selected>Default</option>
      <option value="darkfont">Dark</option>
      <option value="bluefont">Blue</option>
      <option value="pinkfont">Pink</option>
      <option value="redfont">Red</option>
      </select>
    `
    setFontColor.onchange = changeColor;
    document.getElementById("updateSizeDiv").innerHTML =
    `
      <label>Set font Size: </label>
      <select class="selectBox"  id="setFontSize">
      <option value="Default" selected>Default</option>
      <option value="XS">XS</option>
      <option value="Small">Small</option>
      <option value="Large">Large</option>
      <option value="XL">XL</option>
      </select>
    `
    setFontSize.onchange = changeFontSize;
}

//function clear selected text
function clearContentText(){
  document.getElementById("inTxt").value = "  ";
  document.getElementById("updateTextDiv").innerHTML = "";
}

let sizes = ["XS","Small", "Large", "XL"];

// function to change font size from selected option
function changeFontSize(){
  let textbox = myPresentation.getCurrentSlide().getCurrentElement();
  if (textbox !== 'null' && textbox.typeElement === TEXT) {
    let fontSize = document.getElementById("setFontSize").value;
    if(fontSize == "Default"){
      textbox.classList.remove(...sizes);
    }
    else {
      textbox.classList.remove(...sizes);
      textbox.classList.add(fontSize);
    }
  }
  else{ //it's not text element
    alert("not a text element");
  }
  updateSlideMenu();
}

let colore = ["bluefont", "darkfont", "pinkfont"];

// function to change font color from selected option
function changeColor(evt) {
  let textbox = myPresentation.getCurrentSlide().getCurrentElement();
  if (textbox !== 'null'&& textbox.typeElement === TEXT) {
  	let color = document.getElementById('setFontColor').value;

    if (color == "bluefont"){
      textbox.classList.remove(...colore);
      textbox.classList.add("bluefont");
    }
    else if (color== "Default"){
      textbox.classList.remove(...colore);
    }
    else if (color == "darkfont"){
      textbox.classList.remove(...colore);
      textbox.classList.add("darkfont");
    }
    else if (color == "pinkfont"){
      textbox.classList.remove(...colore);
      textbox.classList.add("pinkfont");
    }
    else if (color == "redfont"){
      textbox.classList.remove(...colore);
      textbox.classList.add("redfont");
    }
  }
  else{
    alert("not a text element");
  }
	updateSlideMenu();
}

let fonts = ["TimesFont", "ArialFont", "ComicFont", "ImpactFont", "CourierFont"];

// function to change font family from selected option
function changeFont(){
  let textbox = myPresentation.getCurrentSlide().getCurrentElement();
  if (textbox !== 'null'&& textbox.typeElement === TEXT) {
    let font = document.getElementById('setFont').value;

    if (font == "TimesFont"){
      textbox.classList.remove(...fonts);
      textbox.classList.add("TimesFont");
    }
    if (font == "ArialFont"){
      textbox.classList.remove(...fonts);
      textbox.classList.add("ArialFont");
    }
    if (font == "ComicFont"){
      textbox.classList.remove(...fonts);
      textbox.classList.add("ComicFont");
    }
    if (font == "ImpactFont"){
      textbox.classList.remove(...fonts);
      textbox.classList.add("ImpactFont");
    }
    if (font == "CourierFont"){
      textbox.classList.remove(...fonts);
      textbox.classList.add("CourierFont");
    }
    if (font == "Default"){
      textbox.classList.remove(...fonts);
    }
  }
  else{
    alert("not a text element");
  }
  updateSlideMenu();
}

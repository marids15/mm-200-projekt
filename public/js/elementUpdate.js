function doChange(){
//  console.log(evt.id);
let element = document.getElementById("updateTextDiv").innerHTML;
//let textbox = document.getElementById(element);
//console.log(element);
//  if (textbox.typeElement === TEXT) {
//document.getElementById("inTxt").value = evt.innerHTML;
  //document.getElementById("updateTextDiv").innerHTML= 'Now editing element:<div id="emlNR">'+evt.id+'</div><br>'; <i id="btnClearInput" class="fas fa-broom" onclick="updatevaluefield()"></i>
  document.getElementById("updateFontDiv").innerHTML = `
  <label>Set font: </label>
    <select class="selectBox" id="setFont">
    <option value="Default" selected>Default</option>
    <option value="Times">Times New Roman</option>
    <option value="Arial">Arial</option>
    <option value="ComicFont">Comic Sans</option>
    <option value="ImpactFont">IMPACT</option>
    <option value="CourierFont">Courier</option>
    </select>`
    setFont.onchange = changeFont;
    document.getElementById("updateColorDiv").innerHTML = `
    <label>Set font color: </label>
      <select class="selectBox"  id="setFontColor">
      <option value="Default" selected>Default</option>
      <option value="Dark">Dark</option>
      <option value="Blue">Blue</option>
      <option value="Pink">Pink</option>
      <option value="Red">Red</option>
      </select>`
      setFontColor.onchange = changeColor;
      document.getElementById("updateSizeDiv").innerHTML = `
      <label>Set font Size: </label>
        <select class="selectBox"  id="setFontSize">
        <option value="Default" selected>Default</option>
        <option value="XS">XS</option>
        <option value="Small">Small</option>
        <option value="Large">Large</option>
        <option value="XL">XL</option>
        </select>`
        setFontSize.onchange = changeFontSize;
}//}
function updatevaluefield(){
  document.getElementById("inTxt").value = "  "
  document.getElementById("updateTextDiv").innerHTML = "";
  console.log("heeeeeey");
}
let sizes = ["XS","Small", "Large", "XL"]

function changeFontSize(){
    let element = document.getElementById("emlNR").innerHTML;
    let textbox = document.getElementById(element);
    console.log(textbox);
    if (textbox.typeElement === TEXT) {
    let fontSize = document.getElementById("setFontSize").value;
    if(fontSize == "Default"){
      document.getElementById(element).classList.remove(...sizes);
  }
    else {
      document.getElementById(element).classList.remove(...sizes);
      document.getElementById(element).classList.add(fontSize);
  }}else{
    alert("not a text element");
  }
  	updateSlideMenu();
}
let colore = ["bluefont", "darkfont", "pinkfont"]
function changeColor(evt) {
  let element = document.getElementById("emlNR").innerHTML;
  let textbox = document.getElementById(element);
  console.log(textbox);
  if (textbox.typeElement === TEXT) {
	let color = document.getElementById('setFontColor').value;

  if (color == "Blue"){
    document.getElementById(element).classList.remove(...colore);
    document.getElementById(element).classList.add("bluefont");
  }
  if (color== "Default"){
    document.getElementById(element).classList.remove(...colore);
  }
  if (color == "Dark"){
    document.getElementById(element).classList.remove(...colore);
    document.getElementById(element).classList.add("darkfont");
  }
  if (color == "Pink"){
    document.getElementById(element).classList.remove(...colore);
    document.getElementById(element).classList.add("pinkfont");
  }
  if (color == "Red"){
    document.getElementById(element).classList.remove(...colore);
    document.getElementById(element).classList.add("redfont");
  }
}
else{
  alert("not a text element");
}
	updateSlideMenu();}

  let fonts = ["TimesFont", "ArialFont", "ComicFont", "ImpactFont", "CourierFont"]

function changeFont(){
  let element = document.getElementById("emlNR").innerHTML;
  let textbox = document.getElementById(element);
  console.log(textbox);
  if (textbox.typeElement === TEXT) {
  let font = document.getElementById('setFont').value;

  console.log(font);
  if (font == "Times"){
    document.getElementById(element).classList.remove(...fonts);
    document.getElementById(element).classList.add("TimesFont");
  }
  if (font == "Arial"){
    document.getElementById(element).classList.remove(...fonts);
    document.getElementById(element).classList.add("ArialFont");
  }
  if (font == "ComicFont"){
    document.getElementById(element).classList.remove(...fonts);
    document.getElementById(element).classList.add("ComicFont");
  }
  if (font == "ImpactFont"){
    document.getElementById(element).classList.remove(...fonts);
    document.getElementById(element).classList.add("ImpactFont");
  }
  if (font == "CourierFont"){
    document.getElementById(element).classList.remove(...fonts);
    document.getElementById(element).classList.add("CourierFont");
  }
  if (font == "Default"){
    document.getElementById(element).classList.remove(...fonts);
  }}
  else{
  alert("not a text element");
  }	updateSlideMenu();}

/*

*/

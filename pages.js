var menu = document.getElementById("menu");
var currentMenuHtml = "";
async function loadJsonFile() {
  try {
    // Fetch the JSON file (relative path)
    const response = await fetch('pages.json');

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parse the JSON response into a JavaScript object
    const jsonData = await response.json();
    const path = window.location.pathname;
    var pathList = path.split("/");
    console.log(pathList);
    for(var i = 0; i < jsonData.pages.length; i++){
      if(pathList[1] == jsonData.pages[i].link){
        currentMenuHtml += "<li style='background-color:lightgrey'><a href='" + jsonData.pages[i].link + "' target='" + jsonData.pages[i].target + "' style='color:black'>" + jsonData.pages[i].title + "</a></li>";
      } else {
        currentMenuHtml += "<li><a href='" + jsonData.pages[i].link + "' target='" + jsonData.pages[i].target + "'>" + jsonData.pages[i].title + "</a></li>";
      }
    }
    menu.innerHTML = currentMenuHtml;
  console.log('Loaded JSON data:', jsonData);
    return jsonData;
  } catch (error) {
    console.error('Error loading JSON file:', error);
  }
}
loadJsonFile()

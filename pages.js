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
    for(var i = 0; i < jsonData.pages.length; i++){
      currentMenuHtml += "<li><a href='" + jsonData.pages[i].link + "'>" + jsonData.pages[i].title + "</a></li>";
    }
    menu.innerHTML = currentMenuHtml;
  console.log('Loaded JSON data:', jsonData);
    return jsonData;
  } catch (error) {
    console.error('Error loading JSON file:', error);
  }
}

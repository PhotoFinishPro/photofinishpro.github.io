async function loadJsonFile() {  
      try {  
        // Fetch the JSON file (relative path)  
        const response = await fetch('pricing.json');  
 
        // Check if the request was successful  
        if (!response.ok) {  
          throw new Error(`HTTP error! Status: ${response.status}`);  
        }  
 
        // Parse the JSON response into a JavaScript object  
        const jsonData = await response.json();  
 
        // Use the data (log to console for testing)  
        console.log('Loaded JSON data:', jsonData);  
        return jsonData; // Return for use elsewhere  
      } catch (error) {  
        console.error('Error loading JSON file:', error);  
      }  
    }  
 
    // Call the function  
    var json = loadJsonFile();
console.log(json)
var test = json.TF[0].Packages[0].name;
console.log(test)

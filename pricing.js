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
            var sportsList = [];
      for(var i = 0; i < jsonData.SPORTS.length; i++){
            sportsList.append(jsonData.SPORTS[i].name);
      }
            console.log(sportsList);
            var test = jsonData.TF[0].Packages[0].name;
            console.log(test)
 
        // Use the data (log to console for testing)  
        console.log('Loaded JSON data:', jsonData);  
        return jsonData; // Return for use elsewhere  
      } catch (error) {  
        console.error('Error loading JSON file:', error);  
      }  
    }  
 
    // Call the function  
    loadJsonFile();


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
            var sportsAltList = [];
      for(var i = 0; i < jsonData.SPORTS.length; i++){
            sportsList.push(jsonData.SPORTS[i].name);
            sportsAltList.push(jsonData.SPORTS[i].alt_name);
      }
            console.log(sportsList);
            var innerHTMLForSelect = "<option> -- Please Select a Sport -- </option>";
            for (var i = 0; i < sportsList.length; i++){
                  innerHTMLForSelect += "<option value='" + sportsList[i] + "'>" + sportsList[i] +" (" + sportsAltList[i] + ")</option>";
            }
            var selectObj = document.getElementById("select");
            selectObj.innerHTML = innerHTMLForSelect;

            selectObj.addEventListener('change', function(event){
                  const selectedValue = event.target.value;
                  if(selectedValue == "TF"){
                        console.log("TF PRICING");
                  } else if (selectedValue == "XC"){
                        console.log("XC PRICING")
                  } else {
                        console.log("?")
                  }
            });
            
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


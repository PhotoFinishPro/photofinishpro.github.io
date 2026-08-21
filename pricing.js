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
            var all_costs = "";
            var sportsList = [];
            var sportsValList = [];
            var sportsActiveList = [];
            all_costs = jsonData.ALL[0].name + ": " + jsonData.ALL[0].description;
      for(var i = 0; i < jsonData.SPORTS.length; i++){
            sportsList.push(jsonData.SPORTS[i].display_name);
            sportsValList.push(jsonData.SPORTS[i].name);
            sportsActiveList.push(jsonData.SPORTS[i].active);
      }
            console.log(sportsList);
            var innerHTMLForSelect = "<option> -- Please Select a Sport -- </option>";
            for (var i = 0; i < sportsList.length; i++){
                  if(sportsActiveList[i]){
                        innerHTMLForSelect += "<option value='" + sportsValList[i] + "'>" + sportsList[i] + "</option>";
                  }
            }
            var selectObj = document.getElementById("select");
            var ALL_costsObj = document.getElementById("ALL_costs");
            ALL_costsObj.innerHTML = all_costs;
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


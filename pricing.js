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
            sportsValList.push(jsonData.SPORTS[i].display_name);
            sportsActiveList.push(jsonData.SPORTS[i].active);
      }
            console.log(sportsList);
            var innerHTMLForSelect = "<option selected disabled> -- Please Select a Sport -- </option>";
            for (var i = 0; i < sportsList.length; i++){
                  if(sportsActiveList[i]){
                        innerHTMLForSelect += "<option value='" + sportsValList[i] + "'>" + sportsList[i] + "</option>";
                  }
            }
            var selectObj = document.getElementById("select");
            var ALL_costsObj = document.getElementById("ALL_costs");
            var tableObj = document.getElementById("this_pricing_matrix");
            var formObj = document.getElementById("estimator_form");
            ALL_costsObj.innerHTML = all_costs;
            selectObj.innerHTML = innerHTMLForSelect;
            var splitsName = "";
            var currentTableHTML = "";
            selectObj.addEventListener('change', function(event){
                  const selectedValue = event.target.value;
                  if(selectedValue == "Track & Field Races (TF)"){
                        splitsName = jsonData.TF[0].Definitions[0].splits;
                        currentTableHTML = "<tr><th colspan ='4'>Pricing for " + selectedValue + "</th></tr>"
                        if(jsonData.TF[0].Definitions[0].disclaimers != null){
                              currentTableHTML += "<tr><td colspan ='4' style='color:red'>" + jsonData.TF[0].Definitions[0].disclaimers +"</td></tr>"
                        }
                        currentTableHTML += "<tr><td colspan='4'><strong><em>Packages:</em></strong></td></tr><tr><td><strong>Name:</strong></td><td><strong>Price:</strong></td><td><strong>Features:</strong></td><td><strong>Sample:</strong></td></tr>";
                        for(var i = 0; i < jsonData.TF[0].Packages.length; i++){
                              var thisPrice = "";
                              if(jsonData.TF[0].Packages[i].price == 0){
                                    thisPrice = "FREE with Event Volunteer";
                              } else if(jsonData.TF[0].Packages[i].alt_price != null){
                                    thisPrice = "$" + jsonData.TF[0].Packages[i].price + ", " + jsonData.TF[0].Packages[i].alt_price;
                              } else {
                                    thisPrice = "$" + jsonData.TF[0].Packages[i].price;
                              }
                              currentTableHTML += "<tr><td>" + jsonData.TF[0].Packages[i].name + "</td><td>" + thisPrice + "</td><td>" + jsonData.TF[0].Packages[i].description + "</td><td>" + jsonData.TF[0].Packages[i].sample + "</td></tr>"
                        }
                        currentTableHTML += "<tr><td colspan='4'><em><strong>Add-Ons</strong></em></td></tr>";
                        for(var i = 0; i < jsonData.TF[0].AddOns.length; i++){
                              var thisPrice = "";
                              if(jsonData.TF[0].AddOns[i].price == 0){
                                    thisPrice = "FREE with Event Volunteer";
                              } else if(jsonData.TF[0].AddOns[i].alt_price != null){
                                    thisPrice = "$" + jsonData.TF[0].AddOns[i].price + ", " + jsonData.TF[0].AddOns[i].alt_price;
                              } else {
                                    thisPrice = "$" + jsonData.TF[0].AddOns[i].price;
                              }
                              currentTableHTML += "<tr><td>" + jsonData.TF[0].AddOns[i].name + "</td><td>" + thisPrice + "</td><td>" + jsonData.TF[0].AddOns[i].description + "</td><td>" + jsonData.TF[0].AddOns[i].sample + "</td></tr>"
                        }
                        console.log("TF PRICING");
                        
                  } else if (selectedValue == "Cross Country Races (XC)"){
                        splitsName = jsonData.XC[0].Definitions[0].splits;
                        currentTableHTML = "<tr><th colspan ='4'>Pricing for " + selectedValue + "</th></tr>"
                        if(jsonData.XC[0].Definitions[0].disclaimers != null){
                              currentTableHTML += "<tr><td colspan ='4' style='color:red'>" + jsonData.XC[0].Definitions[0].disclaimers +"</td></tr>"
                        }
                        currentTableHTML += "<tr><td colspan='4'><strong><em>Packages:</em></strong></td></tr><tr><td><strong>Name:</strong></td><td><strong>Price:</strong></td><td><strong>Features:</strong></td><td><strong>Sample:</strong></td></tr>";
                        for(var i = 0; i < jsonData.XC[0].Packages.length; i++){
                              var thisPrice = "";
                              if(jsonData.XC[0].Packages[i].price == 0){
                                    thisPrice = "FREE with Event Volunteer";
                              } else if(jsonData.XC[0].Packages[i].alt_price != null){
                                    thisPrice = "$" + jsonData.XC[0].Packages[i].price + ", " + jsonData.XC[0].Packages[i].alt_price;
                              } else {
                                    thisPrice = "$" + jsonData.XC[0].Packages[i].price;
                              }
                              currentTableHTML += "<tr><td>" + jsonData.XC[0].Packages[i].name + "</td><td>" + thisPrice + "</td><td>" + jsonData.XC[0].Packages[i].description + "</td><td>" + jsonData.XC[0].Packages[i].sample + "</td></tr>"
                        }
                        currentTableHTML += "<tr><td colspan='4'><em><strong>Add-Ons</strong></em></td></tr>";
                        for(var i = 0; i < jsonData.XC[0].AddOns.length; i++){
                              var thisPrice = "";
                              if(jsonData.XC[0].AddOns[i].price == 0){
                                    thisPrice = "FREE with Event Volunteer";
                              } else if(jsonData.XC[0].AddOns[i].alt_price != null){
                                    thisPrice = "$" + jsonData.XC[0].AddOns[i].price + ", " + jsonData.XC[0].AddOns[i].alt_price;
                              } else {
                                    thisPrice = "$" + jsonData.XC[0].AddOns[i].price;
                              }
                              currentTableHTML += "<tr><td>" + jsonData.XC[0].AddOns[i].name + "</td><td>" + thisPrice + "</td><td>" + jsonData.XC[0].AddOns[i].description + "</td><td>" + jsonData.XC[0].AddOns[i].sample + "</td></tr>"
                        }
                        const packages = document.createElement("select");
                        packages.innerHTML = "";
                        formObj.appendChild(packages);
                        console.log("XC PRICING")
                  } else {
                        console.log("?")
                  }
                  tableObj.innerHTML = currentTableHTML;
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


// ---- EmailJS config ----
// Fill these in from your EmailJS account (emailjs.com):
//   PUBLIC_KEY   -> Account > General
//   SERVICE_ID   -> Email Services > your connected service
//   TEMPLATE_ID  -> Email Templates > your template
// Your template should reference these variables: {{from_name}}, {{from_email}},
// {{event_name}}, {{event_date}}, {{event_location}}, {{sport}}, {{line_items}}, {{total}}
var EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
var EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
var EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

if (window.emailjs) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

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

    const all_costs = jsonData.ALL[0].name + ": " + jsonData.ALL[0].description;

    // Build the "select a sport" dropdown
    var sportsList = [];
    var sportsActiveList = [];
    for (var i = 0; i < jsonData.SPORTS.length; i++) {
      sportsList.push(jsonData.SPORTS[i].display_name);
      sportsActiveList.push(jsonData.SPORTS[i].active);
    }
    var innerHTMLForSelect = "<option selected disabled> -- Please Select a Sport -- </option>";
    for (var i = 0; i < sportsList.length; i++) {
      if (sportsActiveList[i]) {
        innerHTMLForSelect += "<option value='" + sportsList[i] + "'>" + sportsList[i] + "</option>";
      }
    }

    var selectObj = document.getElementById("select");
    var ALL_costsObj = document.getElementById("ALL_costs");
    var tableObj = document.getElementById("this_pricing_matrix");
    var formObj = document.getElementById("estimator_form");
    var formContainer = document.getElementById("estimator_form_container");

    ALL_costsObj.innerHTML = all_costs;
    selectObj.innerHTML = innerHTMLForSelect;

    // Map each sport's display name back to its JSON key (XC / TF)
    var sportKeyByDisplayName = {};
    for (var i = 0; i < jsonData.SPORTS.length; i++) {
      sportKeyByDisplayName[jsonData.SPORTS[i].display_name] = jsonData.SPORTS[i].name;
    }

    // Add-ons that come FREE with the Professional package.
    // Exception: "Split Location" / "Enroute Timing" style multi-quantity add-ons
    // are not free -- they drop to the package's own discounted per-unit price
    // (Package.add_on) instead of their normal per-unit price.
    var PROFESSIONAL_INCLUDED = {
      XC: ["Live Results", "Finish Line Image Export", "Split Location (Requires Live Results)", "Digital Scoreboard", "Race Videos"],
      TF: ["Live Track Results", "Live Field Results", "Enroute Timing", "Race Videos", "Field Event Videos", "Lap Counter", "Digital Scoreboard"]
    };

    var currentSportKey = null;

    function formatPrice(item) {
      if (item.price == 0) {
        return "FREE with Event Volunteer";
      } else if (item.alt_price != null) {
        return "$" + item.price + ", " + item.alt_price;
      }
      return "$" + item.price;
    }

    // Builds the read-only pricing matrix table (same as before, shared by both sports)
    function buildPricingTableHTML(sportKey, displayName) {
      var sportData = jsonData[sportKey][0];
      var html = "<tr><th colspan='4'>Pricing for " + displayName + "</th></tr>";

      if (sportData.Definitions[0].disclaimers != null) {
        html += "<tr><td colspan='4' style='color:red'>" + sportData.Definitions[0].disclaimers + "</td></tr>";
      }

      html += "<tr><td colspan='4'><strong><em>Packages:</em></strong></td></tr>";
      html += "<tr><td><strong>Name:</strong></td><td><strong>Price:</strong></td><td><strong>Features:</strong></td><td><strong>Sample:</strong></td></tr>";
      for (var i = 0; i < sportData.Packages.length; i++) {
        var pkg = sportData.Packages[i];
        html += "<tr><td>" + pkg.name + "</td><td>" + formatPrice(pkg) + "</td><td>" + pkg.description + "</td><td>" + pkg.sample + "</td></tr>";
      }

      html += "<tr><td colspan='4'><em><strong>Add-Ons</strong></em></td></tr>";
      for (var i = 0; i < sportData.AddOns.length; i++) {
        var addOn = sportData.AddOns[i];
        html += "<tr><td>" + addOn.name + "</td><td>" + formatPrice(addOn) + "</td><td>" + addOn.description + "</td><td>" + addOn.sample + "</td></tr>";
      }

      return html;
    }

    // Builds the package <select> + add-on inputs for whichever sport is chosen.
    // Now shared between XC and TF (previously only XC had this).
    function buildEstimatorInputsHTML(sportKey) {
      var sportData = jsonData[sportKey][0];

      var packageOptions = "<option selected disabled> -- Please Select a Package -- </option>";
      for (var i = 0; i < sportData.Packages.length; i++) {
        var pkg = sportData.Packages[i];
        var priceLabel = pkg.price == 0 ? "FREE" : "$" + pkg.price;
        packageOptions += "<option value='" + pkg.name + "'>" + pkg.name + " -- " + priceLabel + "</option>";
      }

      var html = "<br><label for='packages'><strong>Package:</strong></label><br>";
      html += "<select id='packages' style='font-size:18px'>" + packageOptions + "</select><br><br>";

      html += "<strong>Add-Ons:</strong><br>";
      for (var i = 0; i < sportData.AddOns.length; i++) {
        var addOn = sportData.AddOns[i];
        var inputType = addOn.multiple ? "number" : "checkbox";
        var extraAttrs = addOn.multiple ? " min='0' value='0' style='width:60px;font-size:16px'" : " style='font-size:18px'";
        var priceLabel = formatPrice(addOn);
        var inputId = "addon_" + addOn.name;

        html += "<input type='" + inputType + "' id='" + inputId + "'" + extraAttrs + ">";
        html += "<label for='" + inputId + "'> " + addOn.name + " -- " + priceLabel + "</label><br>";
      }

      return html;
    }

    selectObj.addEventListener('change', function (event) {
      var selectedDisplayName = event.target.value;
      var sportKey = sportKeyByDisplayName[selectedDisplayName];

      if (!sportKey || !jsonData[sportKey]) {
        console.log("?");
        return;
      }

      currentSportKey = sportKey;
      tableObj.style = "font-size:18px";
      tableObj.innerHTML = buildPricingTableHTML(sportKey, selectedDisplayName);
      formObj.innerHTML = buildEstimatorInputsHTML(sportKey);

      // Clear any previous quote if the sport is changed
      var existingInvoice = document.getElementById("invoice_output");
      if (existingInvoice) existingInvoice.remove();
    });

    // ---- Quote / invoice logic ----

    function getAddOnActualPrice(addOn, selectedPackage, sportKey) {
      var includedList = PROFESSIONAL_INCLUDED[sportKey] || [];
      var isProfessional = selectedPackage.name === "Professional";

      if (isProfessional && includedList.indexOf(addOn.name) !== -1) {
        if (addOn.multiple) {
          // e.g. Split Location / Enroute Timing: discounted per-unit price from the package
          return selectedPackage.add_on != null ? selectedPackage.add_on : addOn.price;
        }
        return 0;
      }

      return addOn.price;
    }

    function sendQuoteEmail(quote, statusEl, sendBtn) {
      if (!window.emailjs) {
        statusEl.textContent = "Email service didn't load. Please email PhotoFinishProTiming@gmail.com directly.";
        statusEl.style.color = "red";
        return;
      }

      var lineItemsText = "";
      for (var i = 0; i < quote.lineItems.length; i++) {
        lineItemsText += quote.lineItems[i].label + ": $" + quote.lineItems[i].amount.toFixed(2) + "\n";
      }

      var templateParams = {
        from_name: quote.name,
        from_email: quote.email,
        event_name: quote.eventName,
        event_date: quote.eventDate,
        event_location: quote.eventLocation,
        sport: quote.sportKey,
        line_items: lineItemsText,
        total: quote.total.toFixed(2)
      };

      sendBtn.disabled = true;
      statusEl.style.color = "black";
      statusEl.textContent = "Sending...";

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams).then(
        function () {
          statusEl.textContent = "Quote sent! We'll be in touch soon.";
          statusEl.style.color = "green";
        },
        function (error) {
          console.error("EmailJS error:", error);
          statusEl.textContent = "Something went wrong sending your quote. Please email PhotoFinishProTiming@gmail.com directly.";
          statusEl.style.color = "red";
          sendBtn.disabled = false;
        }
      );
    }

    function renderQuote(quote) {
      var existing = document.getElementById("invoice_output");
      if (existing) existing.remove();

      var container = document.createElement("div");
      container.id = "invoice_output";

      var rows = "";
      for (var i = 0; i < quote.lineItems.length; i++) {
        rows += "<tr><td>" + quote.lineItems[i].label + "</td><td>$" + quote.lineItems[i].amount.toFixed(2) + "</td></tr>";
      }

      var html = "<hr><h4>Your Quote</h4>";
      html += "<table style='font-size:16px'>";
      html += "<tr><td><strong>Name:</strong></td><td>" + (quote.name || "-") + "</td></tr>";
      html += "<tr><td><strong>Email:</strong></td><td>" + (quote.email || "-") + "</td></tr>";
      html += "<tr><td><strong>Event:</strong></td><td>" + (quote.eventName || "-") + "</td></tr>";
      html += "<tr><td><strong>Date:</strong></td><td>" + (quote.eventDate || "-") + "</td></tr>";
      html += "<tr><td><strong>Location:</strong></td><td>" + (quote.eventLocation || "-") + "</td></tr>";
      html += "<tr><th colspan='2'>Line Items</th></tr>";
      html += rows;
      html += "<tr><td><strong>Total:</strong></td><td><strong>$" + quote.total.toFixed(2) + "</strong></td></tr>";
      html += "</table>";

      container.innerHTML = html;

      var sendBtn = document.createElement("button");
      sendBtn.type = "button";
      sendBtn.textContent = "Send This Quote to Us";
      sendBtn.style = "display:inline-block;margin-top:10px;font-size:18px";

      var statusEl = document.createElement("p");
      statusEl.id = "quote_status";
      statusEl.style = "font-size:16px";

      sendBtn.addEventListener('click', function () {
        sendQuoteEmail(quote, statusEl, sendBtn);
      });

      container.appendChild(sendBtn);
      container.appendChild(statusEl);

      formContainer.appendChild(container);
    }

    formContainer.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!currentSportKey) {
        alert("Please select a sport first.");
        return;
      }

      var sportData = jsonData[currentSportKey][0];
      var packageSelect = document.getElementById("packages");
      var selectedPackageName = packageSelect ? packageSelect.value : null;
      var selectedPackage = null;
      for (var i = 0; i < sportData.Packages.length; i++) {
        if (sportData.Packages[i].name === selectedPackageName) {
          selectedPackage = sportData.Packages[i];
          break;
        }
      }

      if (!selectedPackage) {
        alert("Please select a package.");
        return;
      }

      var name = document.getElementById("contact_name").value.trim();
      var email = document.getElementById("contact_email").value.trim();
      var eventName = document.getElementById("contact_event_name").value.trim();
      var eventDate = document.getElementById("contact_event_date").value.trim();
      var eventLocation = document.getElementById("contact_event_location").value.trim();
      var miles = parseFloat(document.getElementById("contact_miles").value) || 0;

      var lineItems = [];
      var total = 0;

      // Package
      lineItems.push({ label: selectedPackage.name + " Package", amount: selectedPackage.price });
      total += selectedPackage.price;

      // Add-ons
      for (var i = 0; i < sportData.AddOns.length; i++) {
        var addOn = sportData.AddOns[i];
        var inputEl = document.getElementById("addon_" + addOn.name);
        if (!inputEl) continue;

        var unitPrice = getAddOnActualPrice(addOn, selectedPackage, currentSportKey);

        if (addOn.multiple) {
          var qty = parseInt(inputEl.value) || 0;
          if (qty > 0) {
            var lineTotal = unitPrice * qty;
            lineItems.push({ label: addOn.name + " x" + qty, amount: lineTotal });
            total += lineTotal;
          }
        } else {
          if (inputEl.checked) {
            lineItems.push({ label: addOn.name, amount: unitPrice });
            total += unitPrice;
          }
        }
      }

      // Transportation cost: $ALL[0].price per every 5 miles, rounded up
      if (miles > 0) {
        var transportUnits = Math.ceil(miles / 5);
        var transportCost = transportUnits * jsonData.ALL[0].price;
        lineItems.push({ label: "Transportation (" + miles + " mi)", amount: transportCost });
        total += transportCost;
      }

      renderQuote({
        name: name,
        email: email,
        eventName: eventName,
        eventDate: eventDate,
        eventLocation: eventLocation,
        sportKey: currentSportKey,
        lineItems: lineItems,
        total: total
      });
    });

    console.log('Loaded JSON data:', jsonData);
    return jsonData;
  } catch (error) {
    console.error('Error loading JSON file:', error);
  }
}

loadJsonFile();

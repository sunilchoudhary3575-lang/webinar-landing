# Google Sheets Integration Setup Guide

Follow these steps to connect your registration form to a Google Sheet using your email **teambawradigitals7@gmail.com**.

---

### Step 1: Create a Google Sheet
1. Open Google Sheets: https://docs.google.com/spreadsheets/
2. Log in with **teambawradigitals7@gmail.com**.
3. Create a **New Blank Spreadsheet** and name it something like `Webinar Registrations`.
4. In the first row (Row 1), add the following column headers exactly:
   * **Column A:** `Timestamp`
   * **Column B:** `Full Name`
   * **Column C:** `Mobile Number`
   * **Column D:** `Email Address`
   * **Column E:** `Specialty`
   * **Column F:** `Clinic/Hospital Name`

---

### Step 2: Add Apps Script Code
1. In your Google Sheet menu, click on **Extensions** -> **Apps Script**.
2. Delete any default code in the editor (usually `function myFunction() { ... }`).
3. Copy and paste the following script into the editor:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  var name = "";
  var mobile = "";
  var email = "";
  var specialty = "";
  var clinicName = "";
  var timestamp = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
  
  try {
    var data = JSON.parse(e.postData.contents);
    name = data.name || "";
    mobile = data.mobile || "";
    email = data.email || "";
    specialty = data.specialty || "";
    clinicName = data.clinicName || "";
    if (data.timestamp) {
      timestamp = new Date(data.timestamp).toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
    }
  } catch(err) {
    name = e.parameter.name || "";
    mobile = e.parameter.mobile || "";
    email = e.parameter.email || "";
    specialty = e.parameter.specialty || "";
    clinicName = e.parameter.clinicName || "";
  }
  
  sheet.appendRow([timestamp, name, mobile, email, specialty, clinicName]);
  
  return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}

// Added doGet to test if the web app is live
function doGet(e) {
  return ContentService.createTextOutput("Google Sheets API is running! Use POST to submit data.");
}
```

4. Click the **Save** icon (disk icon) or press `Ctrl + S` to save the script.

---

### Step 3: Deploy as Web App
1. Click the **Deploy** button at the top right of the Apps Script page, and select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill out the configuration fields exactly as follows:
   * **Description:** `Webinar Registration API`
   * **Execute as:** `Me (teambawradigitals7@gmail.com)`
   * **Who has access:** Choose **Anyone** *(This is extremely important so that anyone visiting your landing page can submit data)*.
4. Click **Deploy**.
5. You might see a prompt to **Authorize access**. Click **Authorize access**, choose your Google account (`teambawradigitals7@gmail.com`), click **Advanced**, click **Go to Untitled project (unsafe)** or **Go to Webinar Registration API**, and click **Allow**.
6. Once deployed, copy the **Web App URL** from the screen (it ends with `/exec`).

---

### Step 4: Update the Code in `app.js`
1. Open the [app.js](file:///d:/Bawra%20Projects/landing%20page/app.js) file.
2. Near the top of the registration validation block, find:
   ```javascript
   const GOOGLE_SHEET_SCRIPT_URL = 'YOUR_GOOGLE_SHEET_WEB_APP_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_SHEET_WEB_APP_URL_HERE'` with the copied Web App URL.
4. Save the file. Your landing page will now automatically send data directly to your Google Sheet!

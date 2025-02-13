console.log("DEBUG: GOOGLE_SERVICE_ACCOUNT:", process.env.GOOGLE_SERVICE_ACCOUNT);

if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
    console.error("🚨 ERROR: GOOGLE_SERVICE_ACCOUNT environment variable is missing!");
    process.exit(1);
}
const express = require("express");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// ✅ Error handling: Check if the environment variable is set
if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
    console.error("🚨 ERROR: GOOGLE_SERVICE_ACCOUNT environment variable is missing!");
    process.exit(1);
}

// ✅ Correct Google Sheets authentication (only ONE declaration)
const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// ✅ Your Google Sheet ID
const SHEET_ID = "18Nm91NLMSKW8Mzf-vX7bWVn9EHuIcyUrYVkgM6-ERso"; 

// ✅ Contact form submission route
app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const client = await auth.getClient();
        const sheets = google.sheets({ version: "v4", auth: client });

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: "Sheet1!A:C",
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            requestBody: {
                values: [[name, email, message]],
            },
        });

        console.log(`✅ New Contact Submission: Name=${name}, Email=${email}, Message=${message}`);
        res.send("✅ Thank you! Your info has been saved.");
    } catch (error) {
        console.error("🚨 Error saving to Google Sheets:", error);
        res.status(500).send("🚨 Error saving data.");
    }
});

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});


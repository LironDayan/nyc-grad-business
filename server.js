const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Google Sheets setup
const auth = new google.auth.GoogleAuth({
    keyFile: "service-account.json", // Path to the service account JSON file
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SHEET_ID = "18Nm91NLMSKW8Mzf-vX7bWVn9EHuIcyUrYVkgM6-ERso"; // Your Google Sheet ID

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

        console.log(`New Contact Submission: Name=${name}, Email=${email}, Message=${message}`);
        res.send("Thank you! Your info has been saved.");
    } catch (error) {
        console.error("Error saving to Google Sheets:", error);
        res.status(500).send("Error saving data.");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


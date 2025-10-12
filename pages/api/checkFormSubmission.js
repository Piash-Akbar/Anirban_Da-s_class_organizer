import { google } from "googleapis";

const {
  SPREADSHEET_ID,
  SHEET_NAME,
  EMAIL_COLUMN,
  GOOGLE_API_KEY,
} = process.env;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  try {
    if (
      !SPREADSHEET_ID ||
      !SHEET_NAME ||
      !EMAIL_COLUMN ||
      !GOOGLE_API_KEY
    ) {
      console.error("Missing required environment variables for Google Sheets API.");
      return res.status(500).json({ error: "Server configuration error." });
    }

    const sheets = google.sheets({ version: "v4", auth: GOOGLE_API_KEY });

    console.log("Fetching sheet data for:", { email, spreadsheetId: SPREADSHEET_ID });

    const range = `${SHEET_NAME}!${EMAIL_COLUMN}:${EMAIL_COLUMN}`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    const rows = response.data.values || [];

    const hasSubmitted = rows.some(
      (row) => row[0] && row[0].toLowerCase() === email.toLowerCase()
    );

    return res.status(200).json({ hasSubmitted });
  } catch (error) {
    console.error("Error checking form submission:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      errors: error.errors,
    });
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
}

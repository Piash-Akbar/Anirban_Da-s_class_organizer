const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config({ path: ".env.local", debug: true });

console.log("Client ID from env:", process.env.GOOGLE_CLIENT_ID);
console.log("Redirect URI from env:", process.env.GOOGLE_REDIRECT_URI);

const auth = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const url = auth.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  prompt: "consent", // Ensure refresh token is returned
});
console.log("Visit this URL to authorize:", url);

async function getRefreshToken(code) {
  try {
    const { tokens } = await auth.getToken(code);
    console.log("Refresh Token:", tokens.refresh_token);
  } catch (error) {
    console.error("Error getting refresh token:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
  }
}

// Replace with new code after authorization
getRefreshToken("4/0AVGzR1CLuaKiZM_tQKZIqovTI3Wognjnyf4KPkI4daogHjgHb5U8a5ENjJsXuHRXtX6tfw");
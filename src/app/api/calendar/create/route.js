import { google } from "googleapis";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function POST(request) {
  try {
    console.log("🚀 API Route HIT: /api/calendar/create");
    
    // Debug: Log current working directory
    console.log("📁 Current working directory:", process.cwd());
    console.log("📁 Project root files:", require('fs').readdirSync(process.cwd()).slice(0, 10).join(', '));
    
    const requestData = await request.json();
    console.log("📥 Request data:", requestData.summary);

    // Debug service account file
    const serviceAccountPath = join(process.cwd(), "service-account.json");
    console.log("🔍 Looking for service account at:", serviceAccountPath);
    
    // Check if file exists
    const fileExists = existsSync(serviceAccountPath);
    console.log("✅ File exists:", fileExists);
    
    if (!fileExists) {
      // List all files in cwd to debug
      const files = require('fs').readdirSync(process.cwd());
      console.log("📋 All files in cwd:", files.filter(f => f.includes('service') || f.includes('json')).join(', '));
      
      // Try alternative paths
      const altPaths = [
        join(process.cwd(), "../service-account.json"),
        join(process.cwd(), "./service-account.json"),
        "/home/1.Study/MUSIC_CLASS/class_organizer/service-account.json"
      ];
      
      for (const path of altPaths) {
        console.log("🔍 Trying alternative path:", path, "exists:", existsSync(path));
      }
      
      return Response.json(
        { 
          success: false, 
          message: "Service account file not found",
          debug: {
            cwd: process.cwd(),
            expectedPath: serviceAccountPath,
            exists: fileExists,
            filesInRoot: files.slice(0, 20)
          }
        },
        { status: 500 }
      );
    }

    // Read file
    const rawData = readFileSync(serviceAccountPath, "utf8");
    console.log("📄 File size:", rawData.length, "bytes");
    
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(rawData);
      console.log("✅ Service account loaded:", serviceAccount.client_email);
    } catch (parseError) {
      console.error("❌ JSON Parse error:", parseError.message);
      console.log("📄 First 200 chars of file:", rawData.substring(0, 200));
      throw parseError;
    }

    // Rest of the code...
    const { summary, startDateTime, endDateTime, timeZone } = requestData;

    if (!summary || !startDateTime || !endDateTime) {
      return Response.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.events"],
    });

    const calendar = google.calendar({ version: "v3", auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
      return Response.json({ success: false, message: "GOOGLE_CALENDAR_ID not set" }, { status: 500 });
    }

    const event = {
      summary: summary.substring(0, 100),
      description: "Music class session",
      start: { dateTime: startDateTime, timeZone: timeZone || "Asia/Dhaka" },
      end: { dateTime: endDateTime, timeZone: timeZone || "Asia/Dhaka" },
      reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 10 }] },
    };

    const response = await calendar.events.insert({ calendarId, requestBody: event });

    return Response.json({
      success: true,
      eventId: response.data.id,
      eventLink: response.data.htmlLink,
    });

  } catch (error) {
    console.error("❌ Full error:", error);
    return Response.json(
      { success: false, message: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
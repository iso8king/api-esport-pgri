import { google } from "googleapis";

let calenderClient = null;

function getCalendarClient(){
    if(calenderClient) return calenderClient;

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes : ['https://www.googleapis.com/auth/calendar']
    });

    calenderClient = google.calendar({
        version : "v3",
        auth
    });

    return calenderClient;
}

const calendar_id = process.env.CALENDAR_ID;

export const createCalendarEvent = async({
    title, 
    description, 
    location,
    startDateTime, 
    endDateTime
}) => {
    const calendar = getCalendarClient();

    const response = await calendar.events.insert({
        calendarId : calendar_id,
        requestBody : {
            summary : title,
            description : description || "",
            location : location || "",
            start: { dateTime: startDateTime, timeZone: "Asia/Jakarta" },
            end: { dateTime: endDateTime, timeZone: "Asia/Jakarta" },
        }
    });

    return response.data.id;
}

export const updateCalendarEvent = async(googleEventId, {
    title, 
    description, 
    location,
    startDateTime, 
    endDateTime
}) => {
    const calendar = getCalendarClient();

    await calendar.events.update({
        calendarId : calendar_id,
        eventId : googleEventId,
        requestBody : {
            summary: title,
            description: description || "",
            location: location || "",
            start: { dateTime: startDateTime, timeZone: "Asia/Jakarta" },
            end: { dateTime: endDateTime, timeZone: "Asia/Jakarta" },
        }
    })
}

export const deleteCalendarEvent = async(googleEventId) => {
    const calendar = getCalendarClient();

    try {
        await calendar.events.delete({
            calendarId : calendar_id,
            eventId : googleEventId
        })
    } catch (e) {   
        if (e.code !== 404 && e.code !== 410) throw e;     
    }
}


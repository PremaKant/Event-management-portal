const express = require("express");
const cors = require("cors");
const fs = require("fs");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const eventsFile = "./data/events.json";
const bookingsFile = "./data/bookings.json";

app.get("/events", (req, res) => {
    const data = JSON.parse(fs.readFileSync(eventsFile));
    res.json(data);
});

app.post("/book", async (req, res) => {

    const booking = req.body;

    let bookings = [];

    if (fs.existsSync(bookingsFile)) {
        bookings = JSON.parse(fs.readFileSync(bookingsFile));
    }

    bookings.push(booking);

    fs.writeFileSync(
        bookingsFile,
        JSON.stringify(bookings, null, 2)
    );

    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "YOUR_GMAIL@gmail.com",
                pass: "YOUR_APP_PASSWORD"
            }
        });

        await transporter.sendMail({
            from: "YOUR_GMAIL@gmail.com",
            to: "premakantsingh@gmail.com",
            subject: "New Event Booking",
            text: `
New Booking Received

Name: ${booking.name}
Email: ${booking.email}
Event: ${booking.event || "Not Specified"}
            `
        });

        res.json({
            message: "Booking Successful and Email Sent"
        });

    } catch (error) {

        console.error(error);

        res.json({
            message: "Booking Saved but Email Failed"
        });
    }
});

app.listen(3000, () => {
    console.log("Server Running at Port 3000");
});
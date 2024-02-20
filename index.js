// import express from "express";
// import mongoose from "mongoose";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";
// import cors from "cors";
// import userRoute from "./routes/userRoute.js";
// import serviceProviderRoute from "./routes/serviceProviderRoute.js";
// import reviewRoute from "./routes/reviewRoute.js"; // Import the new route for reviews

// const app = express();
// app.use(bodyParser.json());
// app.use(cors());
// app.use;

// dotenv.config();

// const PORT = process.env.PORT || 7000;
// const URL = process.env.MONGOURL;

// mongoose
//   .connect(URL)
//   .then(() => {
//     console.log("DB connected successfully");

//     app.listen(PORT, () => {
//       console.log(`server is running`);
//     });
//   })
//   .catch((error) => console.log(error));

// app.use("/api/users", userRoute);
// app.use("/api/service-providers", serviceProviderRoute);
// app.use("/api/reviews", reviewRoute);

import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import cors from "cors"
import http from "http" // Import the http module
import { Server } from "socket.io" // Import the Server class from socket.io
import userRoute from "./routes/userRoute.js"
import serviceProviderRoute from "./routes/providerRoute.js"
import reviewRoute from "./routes/reviewRoute.js"
import cookieParser from "cookie-parser"
import nodemailer from "nodemailer"
import crypto from "crypto"
// import sendEmail from "./utils/sendEmail.js"

const app = express()
const server = http.createServer(app) // Create an HTTP server
const io = new Server(server) // Attach Socket.IO to the HTTP server

app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.json()) // Add this line to parse incoming JSON requests
app.use(express.urlencoded({ extended: true })) // Add this line to parse incoming form data
app.use(cors())
dotenv.config()

const PORT = process.env.PORT || 7000
const URL = process.env.MONGOURL

mongoose
	.connect(URL)
	.then(() => {
		console.log("DB connected successfully")

		server.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`)
		})
	})
	.catch((error) => console.log(error))

// WebSocket connection handling
io.on("connection", (socket) => {
	console.log("A user connected")

	// Add your WebSocket event handlers here

	socket.on("disconnect", () => {
		console.log("User disconnected")
	})
})

app.use("/api/user", userRoute)
app.use("/api/provider", serviceProviderRoute)
app.use("/api/reviews", reviewRoute)

// // Dummy database for storing email verification tokens
// const users = {}

// // Generate random token
// const generateToken = () => {
// 	return crypto.randomBytes(20).toString("hex")
// }

// // Send verification email
// app.post("/send-email", async (req, res) => {
// 	const email = req.body.email
// 	const token = generateToken()
// 	users[email] = token

// 	try {
// 		const url = `http://localhost:3000/verify-email/${token}`
// 		await sendEmail(email, "Verify Email", url)
// 	} catch (error) {
// 		res.status(500).send(error)
// 	}
// })

// // Verify email
// app.get("/verify-email/:token", (req, res) => {
// 	const token = req.params.token
// 	const email = Object.keys(users).find((key) => users[key] === token)

// 	if (email) {
// 		// Email verified, you can update your database or do other necessary operations here
// 		res.send("Email verified successfully")
// 	} else {
// 		res.status(400).send("Invalid or expired token")
// 	}
// })

function sendEmail({ recipient_email, OTP }) {
	return new Promise((resolve, reject) => {
		var transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		})

		const mail_configs = {
			from: process.env.MY_EMAIL,
			to: recipient_email,
			subject: "OTP for PASSWORD RECOVERY",
			html: `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>CodePen - OTP Email Template</title>
  

</head>
<body>
<!-- partial:index.partial.html -->
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing "The Servify". Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
    <p style="font-size:0.9em;">Regards,<br />The Servify</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>The Servify</p>
      <p>Mota Varachha, Surat</p>
      <p>India</p>
    </div>
  </div>
</div>
<!-- partial -->
  
</body>
</html>`,
		}
		transporter.sendMail(mail_configs, function (error, info) {
			if (error) {
				console.log(error)
				return reject({ message: `An error has occured` })
			}
			return resolve({ message: "Email sent succesfuly" })
		})
	})
}

app.post("/send_recovery_email", (req, res) => {
	sendEmail(req.body)
		.then((response) => res.send(response.message))
		.catch((error) => res.status(500).send(error.message))
})

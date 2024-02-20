import nodemailer from "nodemailer"

const sendMail = async (email, subject, text) => {
	try {
		const transporter = nodemailer.createTransport({
			host: "smtp.forwardemail.net",
			port: 465,
			secure: true,
			auth: {
				user: "theservify@gmail.com",
				pass: "kash5431mb",
			},
		})

		await transporter.sendMail({
			from: "theservify@gmail.com",
			to: email,
			subject: subject,
			text: text,
		})
		console.log("email sent successfully")
	} catch (error) {
		console.log("email not sent!")
		console.log(error)
		return error
	}
}

export default sendMail

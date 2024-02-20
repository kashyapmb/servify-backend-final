import mongoose from "mongoose"
import Review from "./reviewModel.js" // Import the Review model
import ServiceProvider from "./providerModel.js"
import User from "./userModel.js"
import bcrypt from "bcrypt"

const providerSchema = new mongoose.Schema({
	fname: {
		type: String,
		required: true,
	},
	lname: {
		type: String,
		required: true,
	},
	mobile: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: function (spemail) {
				const emailRegx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
				return emailRegx.test(spemail)
			},
			message: "Email format is invalid",
		},
	},
	password: {
		type: String,
		required: true,
		validate: {
			validator: function (password) {
				return password.length >= 6
			},
			message: "password must be greter than 6 character",
		},
	},
	age: {
		type: Number,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	profession: {
		type: String,
		required: true,
	},
	verified: {
		type: Boolean,
		required: true,
	},
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review",
		},
	],
})
providerSchema.pre("findOneAndDelete", async function (next) {
	const serviceProviderId = this._conditions._id

	// Delete associated reviews
	await Review.deleteMany({ serviceProviderId })
	next()
})
providerSchema.pre("save", async function (next) {
	const serviceprovider = this
	if (!serviceprovider.isModified("password")) return next()
	try {
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(serviceprovider.password, salt)
		serviceprovider.password = hashedPassword
		next()
	} catch (error) {
		console.log(error)
	}
})
export default mongoose.model("Providers", providerSchema)
//table nu naam aekvachan ma

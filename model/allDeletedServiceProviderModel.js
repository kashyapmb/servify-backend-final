import mongoose from "mongoose" // Import mongoose
import Review from "../model/reviewModel.js" // Import the Review model
import ServiceProvider from "./providerModel.js"
import User from "../model/userModel.js"

const allDeletedServiceProviderSchema = new mongoose.Schema({
	serviceProviderId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "ServiceProvider",
		required: true,
	},
	deletedAt: {
		type: Date,
		default: Date.now,
	},
	serviceProviderInfo: {
		type: {
			spname: String,
			spmobile: String,
			spaddress: String,
			spcity: String,
			spservicename: String,
			spemail: String,
			sppassword: String,
		},
		required: true,
	},
	reviews: [
		{
			userId: {
				_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				name: String,
				mobile: String,
			},
			rating: Number,
			review: String,
		},
	],
})

export default mongoose.model(
	"AllDeletedServiceProvider",
	allDeletedServiceProviderSchema
)

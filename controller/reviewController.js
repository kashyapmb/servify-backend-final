import Review from "../model/reviewModel.js"
import ServiceProvider from "../model/providerModel.js"

export const createReview = async (req, res) => {
	try {
		const reviewData = new Review(req.body)
		const savedData = await reviewData.save()
		io.emit("newReview", savedData)
		res.status(200).json(savedData)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

export const getReviewsByServiceProvider = async (req, res) => {
	try {
		const serviceProviderId = req.params.serviceProviderId

		// Ensure that the service provider exists
		const serviceProvider = await ServiceProvider.findById(serviceProviderId)
		if (!serviceProvider) {
			return res.status(404).json({ msg: "Service provider not found" })
		}

		// Retrieve reviews for the specified service provider
		// const reviews = await Review.find({ serviceProviderId }).populate("userId");
		const reviews = await Review.find({ serviceProviderId }).populate({
			path: "userId",
			select: "name mobile",
		})
		res.status(200).json(reviews)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

// GET localhost:8000/api/reviews/service-providers/SP_ID

// export const getReviewsByServiceProvider = async (req, res) => {
//   try {
//     const serviceProviderId = req.params.id;

//     // Ensure that the service provider exists
//     const serviceProvider = await ServiceProvider.findById(serviceProviderId);
//     if (!serviceProvider) {
//       return res.status(404).json({ msg: "Service provider not found" });
//     }

//     // Retrieve reviews for the specified service provider
//     const reviews = await Review.find({ serviceProviderId })
//       .sort({ createdAt: -1 }) // Sort by createdAt in descending order to show latest reviews first
//       .populate({
//         path: "userId",
//         select: "name mobile",
//       });

//     res.status(200).json(reviews);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

import express from "express";
import {
  createReview,
  getReviewsByServiceProvider,
} from "../controller/reviewController.js";

const route = express.Router();

route.post("/create", createReview);
route.get("/service-providers/:serviceProviderId", getReviewsByServiceProvider);

export default route;

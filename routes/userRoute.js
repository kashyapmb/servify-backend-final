import express from "express";
import {
  create,
  deleteUser,
  getAll,
  getOne,
  update,
  signup,
  login,
  logout,
  updatewithlogintoken,
} from "../controller/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const route = express.Router();

route.post("/create", create);
route.post("/signup", signup);
route.get("/logout", logout);
route.get("/login", login);
route.get("/getall", getAll);
route.get("/getone/:id", getOne);
route.put("/update/:id", update);
route.put("/updatewithlogintoken/:id", authMiddleware, updatewithlogintoken);
route.delete("/delete/:id", deleteUser);

export default route;

//apis
import user from "../model/userModel.js";
import Review from "../model/reviewModel.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import AllDeletedServiceProvider from "../model/allDeletedServiceProviderModel.js";

export const create = async (req, res) => {
  try {
    const userData = new user(req.body);
    if (!userData) {
      return res.status(404).json({ msg: "user data not found" });
    }

    const savedData = await userData.save();
    res.status(200).json(savedData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//for fetching all record
export const getAll = async (req, res) => {
  try {
    const userData = await user.find();
    if (!userData) {
      return res.status(404).json({ msg: "user data not found" });
    }
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//for fetching one perticular record
export const getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await user.findById(id);
    if (!userExist) {
      return res.status(404).json({ msg: "user data not found" });
    }
    res.status(200).json(userExist);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//for updating data
export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await user.findById(id);
    if (!userExist) {
      return res.status(404).json({ msg: "user data not found" });
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }
    const updatedData = await user.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // await Review.updateMany(
    //   { userId: id },
    //   {
    //     $set: {
    //       "userId.name": req.body.name,
    //       "userId.mobile": req.body.mobile,
    //     },
    //   }
    // );
    // Call a function to update AllDeletedServiceProvider collection
    await updateAllDeletedServiceProvider(id, req.body);
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//for deleting record
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await user.findById(id);
    if (!userExist) {
      return res.status(404).json({ msg: "user data not found" });
    }
    await user.findByIdAndDelete(id);

    res.status(200).json({ msg: "user deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const signup = async (req, res) => {
  try {
    const userData = new user(req.body);
    const { email } = userData;
    const existUser = await user.findOne({ email });
    if (existUser) {
      return res.status(400).json({ msg: "user already exist" });
    }

    const savedData = await userData.save();
    res.status(200).json(savedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await user.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "User not exist" });
    }

    // compare password with database password
    const isValidPassword = await bcrypt.compare(password, userExist.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "email or password invalid" });
    }
    const cookies = req.cookies;

    const tokenExist = cookies.token;

    if (tokenExist) {
      return res.status(400).json({ message: "Alreay logged in" });
    }

    const token = Jwt.sign({ userId: userExist._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Login successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export const logout = async (req, res) => {
  try {
    const tokenExist = req.cookies.token;

    if (!tokenExist) {
      return res.status(400).json({ message: "login required" });
    }
    res.clearCookie("token");
    res.status(200).json({ message: "logout successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export const updatewithlogintoken = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await user.findById(id);
    if (!userExist) {
      return res.status(404).json({ msg: "user data not found" });
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }
    const updatedData = await user.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

//when userdata updated it automatically update in deletedallserviceprovider collection
const updateAllDeletedServiceProvider = async (userId, updatedUserData) => {
  try {
    // Find entries in AllDeletedServiceProvider with the specified userId
    const entriesToUpdate = await AllDeletedServiceProvider.find({
      "reviews.userId._id": userId,
    });

    // Update user information in each entry
    for (const entry of entriesToUpdate) {
      entry.reviews.forEach((review) => {
        if (review.userId._id.toString() === userId) {
          review.userId.name = updatedUserData.name;
          review.userId.mobile = updatedUserData.mobile;
        }
      });

      await entry.save();
    }
  } catch (error) {
    console.error("Error updating AllDeletedServiceProvider:", error);
  }
};

import express from "express";
import passport from "passport";
import userController from "../controllers/user.controller";

const router = express.Router();
let authentication = passport.authenticate("jwt", { session: false });

router
  .route("/")
  .get(authentication, userController.getUsers)
  .put(authentication, userController.updateUserProfile);

export default router;

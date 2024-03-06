import express from "express";
import passport from "passport";
import chatController from "../controllers/chat.controller";
let authenticate = passport.authenticate("jwt", { session: false });

const router = express.Router();
router
  .route("/message")
  .post(authenticate, chatController.sendMessage)
  .get(authenticate, chatController.getPersonalChats);
  
router.get("/group", authenticate, chatController.getGroupChats);

router.post("/upload-media", chatController.uploadMedia);

export default router;

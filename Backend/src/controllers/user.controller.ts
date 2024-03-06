import { Request, Response } from "express";
import userService from "../services/user.service";
const getUsers = async (req: Request, res: Response) => {
  let result = await userService.getUsers(req.user);
  return res.status(result?.statusCode ?? 400).send(result);
};
const updateUserProfile = async (req: Request, res: Response) => {
  let result = await userService.updateUserProfile(
    req.user,
    req.body,
    req.files ? req.files!.profilePic : null
  );
  return res.status(result?.statusCode ?? 400).send(result);
};
export default { getUsers, updateUserProfile };

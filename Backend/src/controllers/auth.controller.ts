import { Request, Response } from "express";
import authService from "../services/auth.service";
const signUp = async (req: Request, res: Response) => {
  let result = await authService.signUp(req.body);
  return res.status(result?.statusCode ?? 400).send(result);
};
const signIn = async (req: Request, res: Response) => {
  let result = await authService.signIn(req.body);
  return res.status(result?.statusCode ?? 400).send(result);
};
export default { signUp, signIn };

import { Request, Response } from "express";
import chatService from "../services/chat.service";
import common from "../common";
import { StatusCodes } from "http-status-codes";
const sendMessage = async (req: Request, res: Response) => {
  let result = await chatService.sendMessage(req.user, req.body);
  return res.status(result.statusCode).send(result);
};

const getPersonalChats = async (req: Request, res: Response) => {
  let result = await chatService.getPersonalChats(req.user, req.query);
  return res.status(result.statusCode).send(result);
};

const getGroupChats = async (req: Request, res: Response) => {
  let result = await chatService.getGroupChats(req.user, req.query);
  return res.status(result.statusCode).send(result);
};

const uploadMedia = async (req: any, res: Response) => {
  let uploadedFile = req.files?.file;
  if (uploadedFile) {
    let result = await chatService.uploadMediaService(uploadedFile);
    return res.status(result.statusCode).send(result);
  } else
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(common.badRequest("file is required to upload!"));
};
export default { sendMessage, getPersonalChats, getGroupChats, uploadMedia };

import { Request, Response } from "express";
import groupService from "../services/group.service";
const createGroup = async (req: Request, res: Response) => {
  let result = await groupService.createGroup(req.user, req.body);
  return res.status(result.statusCode).send(result);
};
const getGroups = async (req: Request, res: Response) => {
  let result = await groupService.getMyGroups(req.user);
  return res.status(result.statusCode).send(result);
};
const addParticipantGroup = async (req: Request, res: Response) => {
  let result = await groupService.addParticipantGroup(req.user, req.body);
  return res.status(result.statusCode).send(result);
};
const getGroupDetails = async (req: Request, res: Response) => {
  let result = await groupService.getGroupDetails(req.user, req.query as any);
  return res.status(result.statusCode).send(result);
};

const removeParticipant = async (req: Request, res: Response) => {
  let result = await groupService.removeParticipantGroup(
    req.user,
    req.body as any
  );
  return res.status(result.statusCode).send(result);
};

const fetchAvailableUsersForGroup = async (req: Request, res: Response) => {
  let result = await groupService.fetchAvailableUsersForGroup(
    req.params as any
  );
  return res.status(result.statusCode).send(result);
};
export default {
  createGroup,
  getGroups,
  addParticipantGroup,
  getGroupDetails,
  removeParticipant,
  fetchAvailableUsersForGroup,
};

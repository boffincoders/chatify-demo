import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import common from "../common";
import { IUserModelDocument } from "../interfaces/user/userModel.interface";
import { UserModel } from "../model/user.model";
const signUp = async (body: any) => {
  let { email, password } = body;
  try {
    let foundUser = await UserModel.findOne({ email });
    if (foundUser) return common.badRequest("Email already exists");
    let generateDynamicName = email.slice(0, 3) + new Date().getTime();
    let hashedPassword = await bcrypt.hash(password, 10);
    let obj = { email, password: hashedPassword, name: generateDynamicName };
    let user: any = await UserModel.create(obj);
    delete user.password;
    return common.successRequest(user);
  } catch (error) {
    return common.internalServerError();
  }
};

const signIn = async (body: IUserModelDocument) => {
  let { email, password } = body;
  try {
    let foundUser = await UserModel.findOne({ email }).lean();
    if (!foundUser) return common.badRequest("Email does not exists");
    let matchPassword = await bcrypt.compare(password, foundUser.password);
    if (!matchPassword) return common.badRequest("Wrong password");
    await UserModel.findByIdAndUpdate(foundUser._id, {
      $set: { last_login: new Date() },
    });
    let user: any = foundUser;
    delete user.password;
    let token = jwt.sign({ _id: user._id }, "chatify-demo-123");
    return common.successRequest({ ...user, token });
  } catch (error) {
    return common.internalServerError();
  }
};
export default { signUp, signIn };

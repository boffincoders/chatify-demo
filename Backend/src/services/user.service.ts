import common from "../common";
import { ChatModel } from "../model/chat.model";
import { UserModel } from "../model/user.model";
const getUsers = async (user: any) => {
  try {
    let users = await UserModel.find({ _id: { $ne: user._id } }).lean();
    let updatedUsers: any[] = [];
    await Promise.all(
      users.map(async (x) => {
        let unreadMessagesCount = await ChatModel.countDocuments({
          sent_to: user._id,
          isReadedBy: {
            $nin: [user._id],
          },
          sent_from: x._id,
        });
        updatedUsers.push({
          ...x,
          profile:
            x.profile &&
            `${process.env.CHATIFY_DEMO_BASE_URL}${
              x?.profile?.startsWith("/") ? x?.profile : "/" + x?.profile
            }`,
          unReadedMessages: unreadMessagesCount,
        });
      })
    );
    if (updatedUsers && updatedUsers.length > 0)
      return common.successRequest(updatedUsers);
  } catch (error) {
    return common.internalServerError();
  }
};
const updateUserProfile = async (
  user: any,
  data: { userName: string },
  file?: any
) => {
  try {
    let { userName } = data;
    let modifiedUserName = new RegExp(userName, "i");
    let nameAlreadyExists = await UserModel.findOne({
      name: modifiedUserName,
      _id: { $ne: user._id },
    });
    if (nameAlreadyExists) return common.badRequest("Name already exists ");
    let imageName: any = null;
    if (file) imageName = await common.uploadImage(file);

    let obj: any = { name: userName };
    if (imageName && file) obj = { ...obj, profile: imageName };
    let updatedUser: any = await UserModel.findByIdAndUpdate(
      user._id,
      {
        $set: obj,
      },
      { new: true }
    );
    delete updatedUser?.password;

    return common.successRequest(updatedUser);
  } catch (error) {
    return common.internalServerError();
  }
};
export default { getUsers, updateUserProfile };

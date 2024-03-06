import { Avatar, Button, Form, Input, Upload, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { HttpStatusCode } from "axios";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader";
import ChatAppServices from "../../services/index";

const AddProfile = () => {
    let loggedInUser = localStorage.getItem("loggedInUser")
        ? JSON.parse(localStorage.getItem("loggedInUser")!)
        : null;
    let [form] = useForm();
    const [profilePicUrl, setProfilePicUrl] = useState<string>("");
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const onFinish = async (values: { username: string; profilePic?: any }) => {
        setButtonLoading(true);
        let data = new FormData();
        data.append("userName", values.username);
        values.profilePic && data.append("profilePic", values.profilePic.fileList[0].originFileObj);
        let response = await ChatAppServices.updateUserProfile(data);
        console.log(response, "respo");
        if (response.statusCode === HttpStatusCode.Ok) {
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify({
                    ...loggedInUser,
                    ...response.data,
                })
            );
            navigate("/dashboard");
        } else message.error(response.message);
        setButtonLoading(false);
    };
    const onFinishFailed = () => { };
    useEffect(() => {
        if (loggedInUser) form.setFieldsValue({ username: loggedInUser.name });
    }, []);
    useEffect(() => {
        if (!loggedInUser) navigate("/login");
        else if (loggedInUser?.last_login) navigate("/dashboard");
    }, []);
    return (
        <>
            {!loggedInUser ? (
                <Loader />
            ) : (
                <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start  ">
                    <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                            Add Profile
                        </h4>
                        <p className="mb-9 ml-1 text-base text-gray-600">
                            Set your username and image to continue chatting!
                        </p>
                        <Form
                            form={form}
                            name="basic"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <div>
                                <p className="text-sm dark:text-white font-medium">Username</p>
                                <Form.Item
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your username!",
                                        },
                                    ]}
                                >
                                    <Input size="large" className="h-12" />
                                </Form.Item>
                            </div>
                            <div>
                                <p className="text-sm dark:text-white font-medium">Profile</p>

                                <Form.Item name="profilePic">
                                    <Upload
                                        maxCount={1}
                                        onChange={(e) =>
                                            setProfilePicUrl(
                                                URL.createObjectURL(e.fileList[0]?.originFileObj as any)
                                            )
                                        }
                                        showUploadList={false}
                                        accept="image/png,image/jpeg,image/svg"
                                    >
                                        <Avatar
                                            className="mb-3"
                                            shape="circle"
                                            src={profilePicUrl}
                                            size={"large"}
                                            style={{ height: "10rem", width: "10rem" }}
                                        />
                                    </Upload>
                                </Form.Item>
                            </div>
                            <Form.Item>
                                <Button loading={buttonLoading}
                                    type="primary"
                                    htmlType="submit"
                                    className="linear h-14 mt-2 w-full rounded-xl bg-[#00A038] py-[12px] text-base font-medium text-white transition duration-200 hover:bg-[#00A038] active:bg-brand-700 dark:bg-[#00A038] dark:text-white dark:hover:bg-[#00A038] dark:activebg-[#00A038]"
                                >
                                    Add Profile
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )}
        </>
    );
};
export default memo(AddProfile);

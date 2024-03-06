import { Button, Checkbox, Form, Input, message } from "antd";
import { HttpStatusCode } from "axios";
import { useContext, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { SocketContext } from "../../../context/socket.context";
import { ILogin } from "../../../interfaces/request/login.interface";
import ChatAppServices from "../../../services/index";
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false)
  const { setSocket } = useContext<any>(SocketContext)
  const onFinish = async (values: ILogin) => {
    setLoading(true)
    let response = await ChatAppServices.login(values);
    if (response.statusCode === HttpStatusCode.Ok) {
      message.success("Logged In Success");
      localStorage.setItem("loggedInUser", JSON.stringify(response.data));
      if (response.data.last_login) {
        setSocket({
          user: response.data,
          mySocket: null
        })
        navigate("/");

      } else navigate("/add-profile");
    } else message.error(response.message);
    setLoading(false)
  };
  const onFinishFailed = () => { };
  useEffect(() => {
    if (localStorage.getItem("loggedInUser")) navigate("/");
  }, []);
  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        {/* <p className="mb-9 ml-1 text-base text-gray-600">
          Register your email and password to sign up!
        </p> */}
        {/* <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800">
          <div className="rounded-full text-xl">
            <FcGoogle />
          </div>
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">
            Sign In with Google
          </h5>
        </div> */}
        <div className="mb-6 flex items-center  gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white">  </p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <div>
            <p className="text-sm mb-1 dark:text-white font-medium">Email</p>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please input your email!",
                },
              ]}
            >
              <Input
                size="large"
                className="h-12"
                placeholder="mail@simmmple.com"
              />
            </Form.Item>
          </div>
          <div>
            <p className="text-sm dark:text-white font-medium">Password</p>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                size="large"
                className="mb-3 h-12"
                placeholder="Min. 8 characters"
              />
            </Form.Item>
          </div>
          <div className="mb-4 flex items-center justify-between px-2">
            <div className="flex items-center">
              <Checkbox />
              <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                Keep me logged In
              </p>
            </div>
            <a
              className="text-sm font-medium text-[#00A038] hover:text-[#00A038] dark:text-white"
              href=" "
            >
              Forgot Password?
            </a>
          </div>{" "}
          <Button loading={loading}
            type="primary"
            htmlType="submit"
            className="linear h-12 mt-2 w-full rounded-xl bg-[#00A038] py-[12px] text-base font-medium text-white transition duration-200 hover:bg-[#00A038] active:bg-brand-700 dark:bg-[#00A038] dark:text-white dark:hover:bg-[#00A038] dark:activebg-[#00A038]"
          >
            Sign In
          </Button>
        </Form>

        {/* <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <Link
            to={"/sign-up"}
            className="ml-1 text-sm font-medium text-[#00A038] hover:text-[#00A038] dark:text-white"
          >
            Create an account
          </Link>
        </div> */}
      </div>
    </div>
  );
};
export default Login;

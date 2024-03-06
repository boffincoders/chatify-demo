import { Button, Form, Input, message } from "antd";
import { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import ChatAppServices from "../../../services/index";
const Register = () => {
  const [loader, setLoader] = useState<boolean>(false)
  const navigate = useNavigate()
  const onFinish = async (values: { email: string, password: any }) => {
    setLoader(true)
    let response = await ChatAppServices.signUp(values)
    if (response.statusCode === HttpStatusCode.Ok) {
      message.success("Signup Success")
      navigate("/login")
    }
    else message.error(response.message)
    setLoader(false)
  };

  const onFinishFailed = (errorInfo: any) => { };
  useEffect(() => {
    if (localStorage.getItem("loggedInUser")) navigate("/")
  }, [])
  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign Up
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>
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
          <p className="text-base text-gray-600 dark:text-white"> or </p>
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
            <p className="text-sm dark:text-white font-medium">Email</p>
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
                type="email"
                size="large"
                className="h-12"
                placeholder="mail@simmmple.com"
              />
            </Form.Item>
          </div>
          <div>
            <p className="text-sm  dark:text-white font-medium">Password</p>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input size="large" className="h-12" />
            </Form.Item>
          </div>

          <p className="text-sm  dark:text-white font-medium">Confirm Password</p>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}

            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The new password that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input size="large" className="h-12" />
          </Form.Item>
          <Form.Item>
            <Button loading={loader}
              type="primary"
              htmlType="submit"
              className="linear h-12 mt-2 w-full rounded-xl bg-[#00A038] py-[12px] text-base font-medium text-white transition duration-200 hover:bg-[#00A038] active:bg-brand-700 dark:bg-[#00A038] dark:text-white dark:hover:bg-[#00A038] dark:activebg-[#00A038]"
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>

        <div>
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Already have an account?
          </span>
          <Link
            className="ml-1 text-sm font-medium text-[#00A038] hover:text-[#00A038] dark:text-white"
            to={"/login"}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Register;

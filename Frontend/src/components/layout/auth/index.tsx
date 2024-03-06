import { useLocation } from "react-router-dom";
import authImg from "../../../assets/images/chatifyauth.jpg";
import AddProfile from "../../../pages/auth/add-profile";
import Login from "../../../pages/auth/login";
import Register from "../../../pages/auth/register";
import FixedPlugin from "../../fixedPlugin";
import AuthFooter from "../footer/authFooter";

const AuthLayout = () => {
  const location = useLocation();
  return (
    <div>
      <div className="relative float-right h-full min-h-screen w-full !bg-white dark:!bg-navy-900">
        <FixedPlugin />
        <main className={`mx-auto min-h-screen`}>
          <div className="relative flex">
            <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%] lg:h-screen lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:h-[100vh] xl:max-w-[1383px] xl:px-0 xl:pl-[70px]">
              <div className="mb-auto flex flex-col pl-5 pr-5 md:pr-0 md:pl-12 lg:max-w-[48%] lg:pl-0 xl:max-w-full">
                {location.pathname === "/login" ? (
                  <Login />
                ) : location.pathname === "/sign-up" ? (
                  <Register />
                ) : (
                  <AddProfile />
                )}

                <div className="absolute right-0 hidden h-full min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]">
                  <div
                    className="absolute flex h-full w-full items-end justify-center bg-cover bg-center lg:rounded-bl-[120px] xl:rounded-bl-[200px]"
                    style={{ backgroundImage: `url(${authImg})` }}
                  />
                </div>
              </div>
              <AuthFooter />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default AuthLayout;

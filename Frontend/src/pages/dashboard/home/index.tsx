import { HiHome } from "react-icons/hi";
import { MdBarChart, MdDashboard, MdEditDocument } from "react-icons/md";
import Loader from "../../../components/loader";
import WeeklyRevenue from "./components/weeklyRevenue";
import Widget from "./components/widget";
import TotalSpent from "./totalSpent";

const Home = () => {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")!)

    return (
        <div>
            {!loggedInUser.last_login || !loggedInUser ? (
                <Loader />
            ) : (
                <div>
                    <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
                        <Widget
                            icon={<MdBarChart className="h-7 w-7" />}
                            title={"Earnings"}
                            subtitle={"$340.5"}
                        />
                        <Widget
                            icon={<MdEditDocument className="h-6 w-6" />}
                            title={"Spend this month"}
                            subtitle={"$642.39"}
                        />
                        <Widget
                            icon={<MdBarChart className="h-7 w-7" />}
                            title={"Sales"}
                            subtitle={"$574.34"}
                        />
                        <Widget
                            icon={<MdDashboard className="h-6 w-6" />}
                            title={"Your Balance"}
                            subtitle={"$1,000"}
                        />
                        <Widget
                            icon={<MdBarChart className="h-7 w-7" />}
                            title={"New Tasks"}
                            subtitle={"145"}
                        />
                        <Widget
                            icon={<HiHome className="h-6 w-6" />}
                            title={"Total Projects"}
                            subtitle={"$2433"}
                        />
                    </div>
                    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                        <TotalSpent />
                        <WeeklyRevenue />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;

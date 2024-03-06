import { Spin } from "antd";

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <Spin size="default" />
        </div>
    );
};

export default Loader;

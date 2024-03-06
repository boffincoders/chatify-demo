import { Button } from "antd";
import { useState } from "react";
import AddUserModal from "./addUserModal";

const NoUserFound = ({ handleAddUser }: { handleAddUser: () => any }) => {
  const [addUser, setAddUser] = useState<boolean>(false);
  return (
    <>
      <div className="flex justify-center items-center h-[50vh]">
        <div>
          <p className="text-2xl ">No User Found</p>
          <div className="flex justify-center items-center mt-3">
            <Button
              onClick={() => setAddUser(true)}
              size="large"
              className=""
              type="primary"
            >
              Add User
            </Button>
          </div>
        </div>
      </div>
      {addUser && (
        <AddUserModal
          handleAddUser={handleAddUser}
          isModalOpen={addUser}
          setIsModalOpen={setAddUser}
        />
      )}
    </>
  );
};

export default NoUserFound;

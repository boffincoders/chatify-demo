import { Button, Input, Modal } from "antd";
interface IAddUserModal {
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => any;
    handleAddUser: () => any;
}
const AddUserModal = ({
    setIsModalOpen,
    isModalOpen,
    handleAddUser,
}: IAddUserModal) => {
    return (
        <>
            <Modal
                footer={null}
                title="Add User"
                open={isModalOpen}
                onOk={handleAddUser}
                onCancel={() => setIsModalOpen(false)}
            >
                <p className="font-medium">Email</p>
                <Input placeholder="Enter email" size="large" />
                <div className="mt-4 flex gap-3">
                    <Button>Cancel</Button>
                    <Button type="primary">Add User</Button>
                </div>
            </Modal>
        </>
    );
};

export default AddUserModal;

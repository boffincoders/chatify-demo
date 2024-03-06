import { Card, Descriptions, Form, Modal, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import React, { useEffect, useState } from "react";
import { IUsersData } from "../../../../interfaces/response/users.Respo.interafce";
import services from "../../../../services";

function AddGroupParticipantsModal({
  open,
  setOpen,
  groupDetails,
  handleSubmit,
  addingParticipants,
}: any) {
  const [form] = useForm();
  const [availableParticipants, setAvailableParticipants] = useState<
    IUsersData[]
  >([]);

  const getAvailableUsers = async () => {
    let response = await services.getAvailableUsersForGroup(groupDetails._id);
    if (response.success) setAvailableParticipants(response.data.users);
  };

  useEffect(() => {
    getAvailableUsers();
    return () => {
      form.resetFields();
    };
  }, []);
  return (
    <Modal
      open={open}
      onCancel={() => {
        setOpen(false);
      }}
      onOk={() => {
        form.submit();
      }}
      title="Add Participants"
      okButtonProps={{
        title: "Submit",
        type: "primary",
        loading: addingParticipants,
        disabled: addingParticipants,
      }}
    >
      <Card>
        <Form form={form} onFinish={handleSubmit} onFinishFailed={() => {}}>
          <div>
            <Descriptions>
              <Descriptions.Item label={"Name"}>
                {groupDetails.title}
              </Descriptions.Item>
            </Descriptions>
            <label>Select Participants</label>
            <FormItem
              name={"participants"}
              rules={[
                {
                  required: true,
                  message: "Select atleast one participant to add!",
                },
              ]}
            >
              <Select mode="multiple">
                {availableParticipants.map((participant) => {
                  return (
                    <Select.Option
                      key={participant._id}
                      value={participant._id}
                    >
                      {participant.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </FormItem>
          </div>
        </Form>
      </Card>
    </Modal>
  );
}

export default AddGroupParticipantsModal;

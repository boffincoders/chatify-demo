import { Card, Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import FormItem from "antd/es/form/FormItem";
import React, { useEffect } from "react";

function CreateGroupModal({ open, setOpen, handleSubmit, creatingGroup }: any) {
  const [form] = useForm();

  useEffect(() => {
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
      title="Create Group"
      okButtonProps={{
        title: "Submit",
        type: "primary",
        loading: creatingGroup,
        disabled: creatingGroup,
      }}
    >
      <Card>
        <Form form={form} onFinish={handleSubmit} onFinishFailed={() => {}}>
          <div>
            <label>Name</label>
            <FormItem
              name={"name"}
              required
              rules={[
                {
                  required: true,
                  message: "Name is required",
                },
              ]}
            >
              <Input />
            </FormItem>
            <label>About</label>
            <FormItem
              name={"about"}
              required
              rules={[
                {
                  required: true,
                  message: "About is required",
                },
              ]}
            >
              <Input />
            </FormItem>
          </div>
        </Form>
      </Card>
    </Modal>
  );
}

export default CreateGroupModal;

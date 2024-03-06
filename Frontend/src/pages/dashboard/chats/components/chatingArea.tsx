import { Card, Col, Row } from "antd";
import React from "react";

const ChatingArea = (props: { sideBarChatChild: any; chatAreaChild: any }) => {
  const { sideBarChatChild, chatAreaChild } = props;
  return (
    <div>
      <Card style={{ height: "75vh" }} className="  dark:!bg-navy-800">
        <Row>
          <Col md={8} xl={8}>
            <div
              style={{ height: "66vh" }}
              className="shadow-2xl overflow-y-auto   rounded-md"
            >
              {sideBarChatChild}
            </div>
          </Col>
          <Col md={16} xl={16} className="p-2 ">
            {chatAreaChild}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ChatingArea;

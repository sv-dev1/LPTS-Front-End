import React, { Component } from 'react'
import { Row, Input, Col, Button, Form, Select, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";

class BasicGrid2 extends React.Component {
  render() {
    return (
      <div>
 
                <Row gutter={(2, [12])} style={{ marginTop: "10px" }}>
                <form>
                  <Col xs={24} md={12} lg={4}>
                    <Form.Item label="Entity Type">
                      <Input placeholder="Enter Entity Type" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={4}>
                    <Form.Item label="First Name">
                      <Input placeholder="Enter Firstname" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={4}>
                    <Form.Item label="Sur Name">
                      <Input placeholder="Enter surname" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={4}>
                    <Form.Item label="Corporate Name">
                      <Input placeholder="Enter Corporate name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={4}>
                    <Form.Item label="Contact Number">
                      <Input placeholder="eg:987654321" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={4}>
                    <Form.Item label="Email Address">
                      <Input placeholder="abc@gmail.com " />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={2}>
                    <Form.Item label="Age">
                      <Input placeholder="eg:24" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={2}>
                    <Form.Item label="Gender">
                      <Input placeholder="Male/Female" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item label="Address 1">
                      <TextArea placeholder="Enter Address" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={8}>
                    <Form.Item label=" Address 2">
                      <TextArea placeholder="Enter Address" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={2}>
                    <Form.Item label="Suburb">
                      <Input placeholder="Enter Suburb" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={2}>
                    <Form.Item label="City">
                      <Input placeholder="Enter City" />
                    </Form.Item>
                  </Col>
                  </form>
                </Row>
                
      </div>
    )
  }
}

export default BasicGrid2;





import * as React from "react";
import { Form, Col, Select, Row, Table, Input } from "antd";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";

const { Option } = Select;

function handleChange(value) {
  console.log(`selected ${value}`);
}

const data = [
  {
    key: "1",
    name: "Mike",
    entity: "Corporate",
    age: 32,
    address: "10 Downing Street",
    email: "Mike@gmail.com",
  },
 
 
  {
    key: "2",
    name: "John",
    entity: "Individual",
    age: 42,
    address: "10 Downing Street",
    email: "John@gmail.com",
  },
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Entity",
    dataIndex: "entity",
    key: "entity",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Action",
    key: "action",
    render: (record) => (
      <div>
        <a>
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="css-i6dzq1"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </a>
      </div>
    ),
  },
];

class LognForm extends React.Component {
  render() {
    return (
      <div>
        <h3
          style={{
            color: "#0C1362",
            fontWeight: "600",
            fontSize: "24px",
          }}
        >
          Customer List
        </h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} lg={4}>
            <Form.Item>
              <Input placeholder="Search by name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={4}>
            <Form.Item>
              <Input placeholder="Search by contact number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={4}>
            <Form.Item>
              <Input placeholder="Search by Age" />
            </Form.Item>
          </Col>
        </Row>
        <Table dataSource={data} columns={columns} />
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: "normal_login" })(LognForm);

export default WrappedNormalLoginForm;

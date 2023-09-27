import * as React from "react";
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
} from "antd";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import "../styles/authPage/register.css";
import logo from "../styles/authPage/images/logo.png";
import LayoutLogin from "../components/LayoutLogin";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

class RegistrationForm extends React.Component {
  constructor() {
    super();

    //  const token = localStorage.getItem('accessToken')
    //     let loggedIn = true
    //     if(token == null){
    //       loggedIn = false
    //     }

    this.state = {
      loggedIn: false,
      api: "http://196.43.100.211:8001/auth/register",
      status: "Active",
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.status = "1";
        const Fullname = values.firstname + " " + values.lastname;
        values.fullname = Fullname;
        this.register(values);
      }
    });
  };

  async register(data) {
    // Data to post to the API
    const postData = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    const response = await fetch(this.state.api, postData);
    if (response.status === 200) {
      toast.success(
        "Data saved successfully",
        { position: toast.POSITION.TOP_CENTER },
        { autoClose: false }
      );
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="container bg-blue">
        <Row>
          <div className="img-wrapper">
            <LayoutLogin />
          </div>
          <Col md={12} sm={12} xs={24}>
            <div>
              <div className="login-aside bg-white flex items-center justify-center ">
                <div className="form-wrapper">
                  <div className="logo-wrapper">
                    <img src={logo} alt="OutRisk logo" />
                  </div>
                  <Row gutter={12}>
                    <Form onSubmit={this.handleSubmit}>
                      <Row
                        gutter={16}
                        style={{ marginLeft: "30px", marginRight: "30px" }}
                      >
                        <Col xs={24} md={12} lg={12}>
                          <Form.Item>
                            {getFieldDecorator("username", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input your Username!",
                                  whitespace: false,
                                },
                              ],
                            })(<Input placeholder="Username" />)}
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12}>
                          <Form.Item>
                            {getFieldDecorator("email", {
                              rules: [
                                {
                                  type: "email",
                                  message: "The input is not valid E-mail!",
                                },
                                {
                                  required: true,
                                  message: "Please input your E-mail!",
                                },
                              ],
                            })(<Input placeholder="E-mail" />)}
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12}>
                          <Form.Item hasFeedback>
                            {getFieldDecorator("password", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input your Password!",
                                },
                              ],
                            })(<Input.Password placeholder="Password" />)}
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12}>
                          <Form.Item>
                            {getFieldDecorator("uuid", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input your Unique id!",
                                },
                              ],
                            })(<Input placeholder="UUID" />)}
                          </Form.Item>
                        </Col>

                        {/* <Col xs={24} md={12} lg={12}>
                        <Form.Item>
                          {getFieldDecorator("fullname", {
                            rules: [
                              {
                                required: true,
                                message: "Please input your Full name!",
                              },
                            ],
                          })(<Input placeholder="Full Name" />)}
                        </Form.Item>
                      </Col> */}
                        <Col xs={24} md={12} lg={12}>
                          <Form.Item>
                            {getFieldDecorator("firstname", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input your First name!",
                                },
                              ],
                            })(<Input placeholder="First name" />)}
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12}>
                          <Form.Item>
                            {getFieldDecorator("lastname", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input your Last name!",
                                },
                              ],
                            })(<Input placeholder="Last name" />)}
                          </Form.Item>
                          <Form.Item>
                            {getFieldDecorator("status")(
                              <Input
                                type="text"
                                value={this.state.status}
                                style={{ display: "none" }}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={24}>
                          <Button
                            type="primary"
                            size="default"
                            className="register-btn"
                            htmlType="submit"
                          >
                            REGISTER
                          </Button>
                          <h6 className="login-h6">
                            Already have an account?{" "}
                            <Link to="/" className="underline-none">
                              Log-in
                            </Link>
                          </h6>
                        </Col>
                      </Row>
                    </Form>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
const WrappedRegistrationForm = Form.create({ name: "registration_form" })(
  RegistrationForm
);

export default WrappedRegistrationForm;

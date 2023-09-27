import React from 'react'
import {  Form,
  Input,
  Row,
  Col,
  Button } from "antd";
import TextArea from "antd/lib/input/TextArea";

class AddCustomer extends React.Component {
	
	 handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
		
      if (!err) {
       alert('asdsadsadsa');
      }
    });
  };
	
  render() {
	  
	  const { getFieldDecorator } = this.props.form;
    return (
      <div>
 <Form onSubmit={this.handleSubmit}>
                <Row gutter={(2, [12])} style={{ marginTop: "10px" }}>
                  <Col xs={24} md={12} lg={4}>
                    <Form.Item label="Entity Type">
                      
					  
					  {getFieldDecorator("Entity", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input your Entity!",
                                  whitespace: false,
                                },
                              ],
					  })(<Input placeholder="Entity Type" />)}
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
				  
				  
				  <Button
                            type="primary"
                            size="default"
                            className="register-btn"
                            htmlType="submit"
                          >
                            Save
                          </Button>
                </Row>
				</Form>
      </div>
    )
  }
}
const WrappedAddCustomerForm = Form.create({ name: "AddCustomer_form" })(
  AddCustomer
);

export default WrappedAddCustomerForm;





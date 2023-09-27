
// import React, { useState, useEffect } from 'react'
// //import Layouts from '../../../components/Layouts'

// import isJwtTokenExpired from 'jwt-check-expiry';

// import { Link, useHistory, useLocation } from "react-router-dom";
// import {
//     Form,
//     Col,
//     Select,
//     Row,
//     Input,
//     Button,
//     Modal,
//     Popconfirm,
//     Table,
//     message,
//     DatePicker

// } from 'antd'
// import {
//     PlusOutlined,
//     EditOutlined,
//     DeleteOutlined,
//     CloseOutlined,
//     EyeOutlined,
// } from '@ant-design/icons'




// const baseUrl = process.env.REACT_APP_BASE_URL

// function RosterDateRange(props) {

//     const intialValues = {
//         schoolId: 0,
//         startDate: "",
//         endDate: "",
//         endOpen: false,
//     }
//     const { getFieldDecorator } = props.form;
//     const { TextArea } = Input;
//     const { Option } = Select;
//     const history = useHistory()
//     const autoclearOn = false;
//     const [inputs, setInputs] = useState(intialValues);
//     var user = JSON.parse(localStorage.getItem('user'));
//     var token = user.token;
//     const schoolID = user.schoolId;
//     if (user) {
//         var isExpired = isJwtTokenExpired(user.token)

//         if (isExpired) {

//            message.error(`${Messages.unHandledErrorMsg}`)
//             history.replace({ pathname: '/', state: { isActive: true } })
//         }
//     } else {

//        message.error(`${Messages.unHandledErrorMsg}`)
//         history.replace({ pathname: '/', state: { isActive: true } })
//     }

//     const disabledStartDate = startValue => {
//         const { endValue } = inputs;
//         if (!startValue || !endValue) {
//             return false;
//         }
//         return startValue.valueOf() > endValue.valueOf();
//     };

//     const disabledEndDate = endValue => {
//         const { startValue } = inputs;
//         if (!endValue || !startValue) {
//             return false;
//         }
//         return endValue.valueOf() <= startValue.valueOf();
//     };

//     const onChange = (field, value) => {
//         value = value._d.toISOString()
//         setInputs({
//             ...inputs,
//             [field]: value,
//         });
//     };

//     const onStartChange = (name, value) => {
//         onChange(name, value);
//     };


//     const handleStartOpenChange = open => {
//         if (!open) {
//             setInputs({ ...inputs, endOpen: true });
//         }
//     };

//     const handleEndOpenChange = open => {
//         setInputs({ ...inputs, endOpen: open });
//     };
//     const handleChangeInputs = (e) => {

//         let { name, value } = e.target;
//         console.log("name", name, value)
//         name === 'isActive' &&
//             (value = !value);
//         setInputs((prevData) => ({ ...prevData, [name]: value }))

//     }


//     const handleSubmit = (e)=>{
//         e.preventDefault()
//         // debugger;
//          props.form.validateFields((err, values) => {
//              if (!err) {
//                 let data = inputs;
//                 data.schoolId = schoolID
//                  const requestMetadata = {
//                      method: 'POST',
//                      headers: {
//                          'Content-Type': 'application/json',
//                          Authorization: `Bearer ${token}`,
//                      },
//                      body: JSON.stringify(data),
//                  }
                 
//                  fetch(`${baseUrl}/RosterDateRanges/Save`, requestMetadata)
//                      .then(res => res.json())
//                      .then(data => {
//                          if (data.statusCode === 200) {
//                              message.success('Date Range is added successfully !!')
//                              console.log("res",data);
//                              console.log('target', data.data)
//                              props.form.resetFields()
//                              props.handleGetAllEvidence();
//                          } else if (data.statusCode === 208) {
//                            console.log("res",data);
//                              message.warning(data.message)
//                          } else {
//                            console.log("res",data);
//                              message.info(data.message)
//                          }
//                      })
//              }
//          })
//     }
  
//     return (
//         <>
//             <label>Setting Screen</label>
//             <Form
//                 name="basic"
//                 labelCol={{ span: 8 }}
//                 wrapperCol={{ span: 16 }}
//                 initialValues={{ remember: true }}

//                 autoComplete="off"
//                 onSubmit={handleSubmit}
//             >

//                 <Form.Item label="Start Date">
//                     {getFieldDecorator('startDate')(
//                         <DatePicker

//                             setFieldsValue={inputs.startDate}
//                             placeholder="Start"
//                             onChange={(value) => onChange("startDate", value)}
//                             allowClear={autoclearOn}
//                         />

//                     )}
//                 </Form.Item>
//                 <Form.Item label="End Date">
//                     {getFieldDecorator('endDate')(
//                         <DatePicker

//                             setFieldsValue={inputs.endDate}
//                             placeholder="End"
//                             onChange={(value) => onChange("endDate", value)}
//                             allowClear={autoclearOn}
//                         />
//                     )}
//                 </Form.Item>

//                 <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
//                     <Button type="primary" htmlType="submit">
//                         Save
//                     </Button>
//                 </Form.Item>



//             </Form>
//         </>
//     )
// }


// export default Form.create()(RosterDateRange)

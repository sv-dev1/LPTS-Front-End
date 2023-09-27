import React, { useState, useEffect } from 'react'


import isJwtTokenExpired from 'jwt-check-expiry';
import Messages from '../../../Message/Message';
import { Link, useHistory, useLocation } from "react-router-dom";
import {
    Form,
    Col,
    Select,
    Row,
    Input,
    Button,
    Modal,
    Popconfirm,
    Table,
    message,
    DatePicker

} from 'antd'
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CloseOutlined,
    EyeOutlined,
} from '@ant-design/icons'




const baseUrl = process.env.REACT_APP_BASE_URL

function CreateDateRange(props) {

    const intialValues = {
        schoolId: 0,
        startDate: "",
        endDate: "",
        endOpen: false,
    }
    const { getFieldDecorator } = props.form;
    const { TextArea } = Input;
    const { Option } = Select;
    const history = useHistory()
    const autoclearOn = false;
    const [dates , setDates] = useState({startDate: '' ,endDate: ''})
    const [inputs, setInputs] = useState(intialValues);
    var user = JSON.parse(localStorage.getItem('user'));
    var token = user.token;
    const schoolID = user.schoolId;
    if (user) {
        var isExpired = isJwtTokenExpired(user.token)

        if (isExpired) {

           message.error(`${Messages.unHandledErrorMsg}`)
            history.replace({ pathname: '/', state: { isActive: true } })
        }
    } else {

       message.error(`${Messages.unHandledErrorMsg}`)
        history.replace({ pathname: '/', state: { isActive: true } })
    }

    const disabledStartDate = startValue => {

        const  endValue  = dates.endDate;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };

    const disabledEndDate = endValue => {
       //debugger;
        const  startValue  = dates.startDate;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    const onChange = (field, value) => {
        //debugger
       // eval('var ' +field + '= ' +value+ ';');
     setDates({...dates , [field] : value})
        value = value._d.toISOString()
        setInputs({
            ...inputs,
            [field]: value,
        });
    };

    const onStartChange = (name, value) => {
        onChange(name, value);
    };


    const handleStartOpenChange = open => {
        if (!open) {
            setInputs({ ...inputs, endOpen: true });
        }
    };

    const handleEndOpenChange = open => {
        setInputs({ ...inputs, endOpen: open });
    };
    const handleChangeInputs = (e) => {

        let { name, value } = e.target;
        console.log("name", name, value)
        name === 'isActive' &&
            (value = !value);
        setInputs((prevData) => ({ ...prevData, [name]: value }))

    }


    const handleSubmit = (e)=>{
        e.preventDefault()
        // debugger;
         props.form.validateFields((err, values) => {
             if (!err) {
                let data = inputs;
                data.schoolId = schoolID
                 const requestMetadata = {
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json',
                         Authorization: `Bearer ${token}`,
                     },
                     body: JSON.stringify(data),
                 }
                 
                 fetch(`${baseUrl}/RosterDateRanges/Save`, requestMetadata)
                     .then(res => res.json())
                     .then(data => {
                         if (data.statusCode === 200) {
                             message.success('Date range is added successfully !!')
                            //  console.log("res",data);
                            //  console.log('target', data.data)
                             props.form.resetFields()
                            props.updateRanges();
                         } else if (data.statusCode === 208) {
                           console.log("res",data);
                             message.warning(data.message)
                         } else {
                           console.log("res",data);
                             message.info(data.message)
                         }
                     })
             }
         })
    }
  
    return (
        <>
        {  /*  <label>Setting Screen</label> */}
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}

                autoComplete="off"
                onSubmit={handleSubmit}
            >

                <Form.Item label="Start Date">
                    {getFieldDecorator('startDate' ,{
                        rules: [
                          {
                            required: true,
                            message: 'Please select start date!',
                          },
                        ],
                      })(
                        <DatePicker
                            disabledDate={disabledStartDate}
                            format="MM-DD-YYYY"
                            setFieldsValue={inputs.startDate}
                            placeholder="Start"
                            onChange={(value) => onChange("startDate", value)}
                            allowClear={autoclearOn}
                        />

                    )}
                </Form.Item>
                <Form.Item label="End Date">
                    {getFieldDecorator('endDate' ,{
                        rules: [
                          {
                            required: true,
                            message: 'Please select end date!',
                          },
                        ],
                      })(
                        <DatePicker
                        disabledDate={disabledEndDate}
                            setFieldsValue={inputs.endDate}
                            format="MM-DD-YYYY"
                            placeholder="End"
                            onChange={(value) => onChange("endDate", value)}
                            allowClear={autoclearOn}
                        />
                    )}
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>



            </Form>
        </>
    )
}





export default Form.create()(CreateDateRange);

// import React from "react"
// import { DatePicker } from 'antd';

// class DateRange extends React.Component {
//   state = {
//     startValue: null,
//     endValue: null,
//     endOpen: false,
//   };

//   disabledStartDate = startValue => {
//      // debugger
//     const { endValue } = this.state;
//     if (!startValue || !endValue) {
//       return false;
//     }
//     return startValue.valueOf() > endValue.valueOf();
//   };

//   disabledEndDate = endValue => {
//     //  debugger
//     const { startValue } = this.state;
//     if (!endValue || !startValue) {
//       return false;
//     }
//     return endValue.valueOf() <= startValue.valueOf();
//   };

//   onChange = (field, value) => {
//     this.setState({
//       [field]: value,
//     });
//   };

//   onStartChange = value => {
//     this.onChange('startValue', value);
//   };

//   onEndChange = value => {
//     this.onChange('endValue', value);
//   };

//   handleStartOpenChange = open => {
//     if (!open) {
//       this.setState({ endOpen: true });
//     }
//   };

//   handleEndOpenChange = open => {
//     this.setState({ endOpen: open });
//   };

//   render() {
//     const { startValue, endValue, endOpen } = this.state;
//     return (
//       <div>
//         <DatePicker
//           disabledDate={this.disabledStartDate}
//           showTime
//           format="YYYY-MM-DD HH:mm:ss"
//           value={startValue}
//           placeholder="Start"
//           onChange={this.onStartChange}
//           onOpenChange={this.handleStartOpenChange}
//         />
//         <DatePicker
//           disabledDate={this.disabledEndDate}
//           showTime
//           format="YYYY-MM-DD HH:mm:ss"
//           value={endValue}
//           placeholder="End"
//           onChange={this.onEndChange}
//           open={endOpen}
//           onOpenChange={this.handleEndOpenChange}
//         />
//       </div>
//     );
//   }
// }
// export default DateRange;
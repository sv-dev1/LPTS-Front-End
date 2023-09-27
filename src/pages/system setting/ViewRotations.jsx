import React, { useState, useEffect } from 'react'


import isJwtTokenExpired from 'jwt-check-expiry';
import * as moment from 'moment';
import Messages from '../../Message/Message';
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

function ViewRotations(props) {
console.log("viewRotation" , props.data)
    // {
    //     "id": 0,
    //     "schoolId": 0,
    //     "sessionId": 0,
    //     "rotationName": "string",
    //     "startDate": "2022-06-28T11:14:40.714Z",
    //     "endDate": "2022-06-28T11:14:40.714Z"
    //   }
    const intialValues = {
        schoolId: 0,
        sessionId:props.data.id,
        rotationName:"",
        startDate: "",
        endDate: "",
        endOpen: false,
    }
    //new Date(props.data.endDate)
    // add one day into end date
    const addOneDayday = new Date(props.data.endDate);
    addOneDayday.setDate(addOneDayday.getDate() + 0);

    let startdate = moment(new Date(props.data.startDate));
    let enddate = moment(new Date(addOneDayday));
    let start = new Date(props.data.startDate).toLocaleString('en-US').split(',')[0];
    let end = new Date(props.data.endDate).toLocaleString('en-US').split(',')[0];
    
    const mergedDate = start.concat("-" ,end)
  
    console.log("dates" ,  startdate , "---,", enddate)
    const { getFieldDecorator } = props.form;
    const { TextArea } = Input;
    const { Option } = Select;
    const history = useHistory()
    const autoclearOn = false;
    const [dates , setDates] = useState({startDate: startdate ,endDate: enddate})
    const [inputs, setInputs] = useState(intialValues);
    const [filterTable, setFilterTable] = useState([]);


 // local storage work
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



    // api calls
    const updateData = async()=>{
        var res;
        try{
          let headers = {"Content-Type": "application/json"};
          const token =  user.token;
          console.log("token" ,token )
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
          res = await fetch(`${baseUrl}/RotationDateRanges/GetAll?sessionId=${parseInt(props.data.id)}&schoolId=${parseInt(schoolID)}`, {headers,})
          let data = await res.json()
         
          setFilterTable([...data.data])
       } catch(err){
        setFilterTable([])
          console.log(err);
       }
      }
    

   

      // useEffects 
      useEffect(()=>{
        props.data.id && updateData();
      },[props.data.id])

// functions and events

    const disabledStartDate = startValue => {

        const  endValue  = dates.endDate;
        if (!startValue || !endValue) {
            return false;
        }
        console.log("Hello1" , startValue.valueOf() > endValue.valueOf())
        return startValue.valueOf() > endValue.valueOf()   ||  dates.startDate.valueOf() > startValue.valueOf();
    };

    const disabledEndDate = endValue => {
       //debugger;
        const  startValue  = dates.startDate;
        if (!endValue || !startValue) {
            return false;
        }
        // current > moment() || current < moment().subtract(3, 'day');
        //endValue.valueOf() < startValue.valueOf()
        console.log("Hello" , )
       // endValue.valueOf() < startValue.valueOf()
        return endValue.valueOf() > dates.endDate.valueOf() || endValue.valueOf() < startValue.valueOf() ;
    };

    const onChange = (field, value) => {
    if(value){
        setDates(prevDate=>({...prevDate , [field] : value}))
        value = value._d.toISOString()
        setInputs({
            ...inputs,
            [field]: value,
        });
    }
   
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
  
const changeDateRangesForAgainSelect = (status , field)=>{
    if(field === "startDate"){
        status && setDates({...dates ,startDate: startdate })
    }else{
        status && setDates({...dates ,endDate: enddate})
    }

   
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
                 
                 fetch(`${baseUrl}/RotationDateRanges/Save`, requestMetadata)
                     .then(res => res.json())
                     .then(data => {
                         if (data.statusCode === 200) {
                             message.success('Rotation is added successfully !!')
                            //  console.log("res",data);
                            //  console.log('target', data.data)
                            setDates({startDate: startdate ,endDate: enddate})
                             props.form.resetFields()
                             updateData();
                         } else if (data.statusCode === 208) {
                            setDates({startDate: startdate ,endDate: enddate})
                           console.log("res",data);
                           updateData();
                             message.warning(data.message)
                         } else {
                           console.log("res",data);
                             message.info(data.message)
                         }
                     })
             }
         })
    }



    // columns
    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: '5%',
            render: (item, record, index) => <>{index + 1}</>,
          },
          {
            title: 'Rotation Name',
            dataIndex: 'rotationName',
            key: 'rotationName',
      
          },
        {
          title: 'Start Date',
          dataIndex: 'startDate',
          key: 'startDate',
        //   sorter: (a, b) =>   a.rosterName.localeCompare(b.rosterName) ,
        render: (id , record) => (
            
            <>
                {new Date(record.startDate).toLocaleString('en-US').split(',')[0]}
            </>
          ),
    
    
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            // sorter: (a, b) =>  a.teacher.localeCompare(b.teacher) ,
            render: (id , record) => (
                <>
                {new Date(record.endDate).toLocaleString('en-US').split(',')[0]}
                  
                </>
              ),
        
            
          },
    
       
      ];
    
  
    return (
        <>
        <div>
        <label className='modal-label'> Session Period : {mergedDate}</label> 
          <p  className='modal-p' style={{margin: "5px 0 20px 0px"}}> Create Rotation</p> 
          </div>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
                initialValues={{ remember: true }}

                autoComplete="off"
                onSubmit={handleSubmit}
            >
            <Form.Item
            label="Rotation Name"
        >
            {getFieldDecorator('rotationName', {
                rules: [
                    {
                        required: true,
                        message: 'Please enter rotation name!',
                    },
                ],
            })(
                <Input name="rotationName" value={inputs.rotationName} onChange={handleChangeInputs} />,
            )}
        </Form.Item>

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
                        style={{width:"100%"}}
                           onOpenChange={(status)=>changeDateRangesForAgainSelect(status , "startDate")}
                           defaultPickerValue={startdate}
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
                          style={{width:"100%"}}
                        disabledDate={disabledEndDate}
                        onOpenChange={(status)=>changeDateRangesForAgainSelect(status , "endDate")}
                        defaultPickerValue={enddate}
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
            <div className="table-grid-bx">
            <Table columns={columns} dataSource={filterTable} rowKey='table'/>
          </div>
        </>
    )
}





export default Form.create()(ViewRotations);


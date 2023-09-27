import { Form, Input, Button, Checkbox, Select, message } from 'antd';
import { addAllSubjects, deleteAllSubjects } from '../../Slicers/subjectSlice'
import { addAllphases, deleteAllphases } from '../../Slicers/phaseSlice'
import { useHistory } from "react-router-dom";
import {
  PlusOutlined
} from '@ant-design/icons';

import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
const baseUrl = process.env.REACT_APP_BASE_URL

const CreateCategory = (props) => {
  const { getFieldDecorator } = props.form
  const history = useHistory();
  const { Option } = Select;
  const initialValues = {
    "subjectId": "",
    "phaseId": "",
    "categoryName": "",
    "isActive": true
  }
  const [inputs, setInputs] = useState(initialValues)
  const [subjectList, setSubjectList] = useState([]);
  var subject = useSelector((state) => state.subject.value)
  const [phaseList, setPhaseList] = useState([]);
  var phase = useSelector((state) => state.phase.value)
  const [PhaseLength , setPhaseLength] = useState(1)
  const dispatch = useDispatch();
 var myAccount = useSelector((state)=> state.myAccount.value)
 const schoolID = myAccount.schoolId;
 let headers = {"Content-Type": "application/json"};
 const token = myAccount.token;
 console.log("token" ,token )
 if (token) {
   headers["Authorization"] = `Bearer ${token}`;
 }
  useEffect(() => {
    (subject.length === 0) &&
      fetch(`${baseUrl}/Subjects/GetAllActive?schoolId=${parseInt(schoolID)}` , {headers,})
        .then((res) => res.json())
        .then((data) => {
          setSubjectList([...data.data])
          dispatch(addAllSubjects(data.data))
          console.log("addAllSubjects", data.data);
        });

    (subject.length > 0) &&
      setSubjectList([...subject])

    //   (phase.length === 0) && 
    // fetch(`${baseUrl}/Phase/GetAll`)
    //               .then((res) => res.json())
    //               .then((data) => {
    //                 setPhaseList([...data.data ])
    //               dispatch(addAllphases(data.data))
    //                  console.log("addAllPhases" ,data.data );
    //               }) ;

    //   (phase.length > 0) &&
    //   setPhaseList([...phase])


  }, [])

  useEffect(() => {
    console.log("subject", inputs.subjectId)
   
    inputs.subjectId &&
      fetch(`${baseUrl}/Phases/GetAllActive?subjectId=${parseInt(inputs.subjectId)}&schoolId=${parseInt(schoolID)}` , {headers,})
        .then((res) => res.json())
        .then((data) => {
          setPhaseList([...data.data])
          let length =  data.data.length ;
          setPhaseLength(parseInt(length))
          
          console.log("addAllPhases", data.data);
        });
    console.log("chek");
  }, [inputs.subjectId])

  // handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        let data = inputs;
      data.schoolId = schoolID;
          const requestMetadata = {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(data),
          }

      inputs.subjectId &&( inputs.subjectId !=="Select") &&
        inputs.phaseId &&
    fetch(`${baseUrl}/Categories/Save`, requestMetadata)
      .then(res => res.json())
      .then(categoryData => {
    
        if(categoryData.statusCode === 200 ){
          message.success('Category name Is added successfully !!')
          props.addNewCategoryInList()
           props.form.resetFields()
          setInputs({
            "subjectId": "",
            "phaseId": "",
            "categoryName": "",
            "isActive": false
          });
          console.log("added new category", categoryData.data)
        }else if(categoryData.statusCode === 208) {
          message.warning(categoryData.message)
        } else{
          message.info(categoryData.message)
        }

       
      })


    console.log("ok");
  }})
  }

  const handleChangeInputs = (e) => {

    let { name, value } = e.target;
    //  console.log("name" , name , value)
    name === 'isActive' &&
      (value = !value);
    setInputs((prevData) => ({ ...prevData, [name]: value }))

  }

  const handleAddPhase = ()=>{
    history.replace({ pathname: '/manage-phase',  state:{isActive: true}});
  }
  console.log("inputs", inputs)

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onSubmit={handleSubmit}
      autoComplete="off"
    >

      <Form.Item
        label="Subject"
        name="subjectId"
      >
        {getFieldDecorator('subjectId', {
          rules: [
              {
                  required: true,
                  message: 'Please select subject!',
              },
          ],
      }) 
        (<Select defaultValue="Select" onChange={(value) => setInputs({ ...inputs, subjectId: value })} name='subjectId' style={{ width: 120 }} >
          {

            subjectList && subjectList.map((subject, key) => (
              <Option key={key} value={subject.id} >{subject.subjectName}</Option>
            ))}
        </Select>)}
      </Form.Item>

      <Form.Item
        label="Phase"
        name="phaseId"
      >
        {getFieldDecorator('phaseId', {
          rules: [
              {
                  required: true,
                  message: 'Please select phase!',
              },
          ],
      }) 
        (<Select defaultValue="Select" onChange={(value) => setInputs({ ...inputs, phaseId: value })} name='phaseId' style={{ width: 120 }} >
          {

            phaseList && phaseList.map((phase, key) => (
              <Option key={key} value={phase.phase.id}>{phase.phase.phaseName}</Option>
            ))}
        </Select>)}
        { PhaseLength > 0 ? "": <Button onClick={handleAddPhase} type="primary" style={{marginLeft:"10px"}} >
                 <PlusOutlined /> Add
                          </Button>
          }
      </Form.Item>
      
      <Form.Item
        label="Category"
        name="categoryName"
      >
        {getFieldDecorator('categoryName', {
        rules: [
            {
                required: true,
                message: 'Please input your category name!',
            },
        ],
    })(
        <Input name="categoryName" value={inputs.categoryName} onChange={handleChangeInputs} />)}
      </Form.Item>

      <Form.Item
        label="Order No."
        name="serialNo"
      >
        {getFieldDecorator('serialNo', {
        rules: [
            
        ],
    })(
        <Input name="serialNo" value={inputs.serialNo} onChange={handleChangeInputs} />)}
      </Form.Item>

      <Form.Item name="status" label="Is Active" valuePropName="checked" wrapperCol={{  span: 16 }}>
        <Checkbox className="input-check" onChange={handleChangeInputs} name="isActive" checked={inputs.isActive} value={inputs.isActive}></Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(CreateCategory);
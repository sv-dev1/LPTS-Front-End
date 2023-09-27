import { Form, Input, Button, Checkbox, Select, message  } from 'antd';
import { addAllSubjects, deleteAllSubjects } from '../../Slicers/subjectSlice'
import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {
  PlusOutlined
} from '@ant-design/icons';
import AddPhase from '../phase/AddPhase'
import AddCategory from '../category/AddCategory'
const baseUrl = process.env.REACT_APP_BASE_URL


const CreateLearningTarget = (props) => {
  const history = useHistory();
  const { TextArea } = Input;

  const { Option } = Select;
  const initialValues = {
    "subjectId": "",
    "phaseId": "",
    "categoryId": "",
    "learningTarget": '',
    "iCanStatement": '',
  }
  const [inputs, setInputs] = useState(initialValues)
  const [subjectList, setSubjectList] = useState([]);
  const [phaseList, setPhaseList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [phaseLength , setPhaseLength] = useState(1);
  const [categoryLength , setcategoryLength] = useState(1);
  const { getFieldDecorator } = props.form
   var myAccount = useSelector((state)=> state.myAccount.value)
  let headers = {"Content-Type": "application/json"};
  const token = myAccount.token;
  const schoolID = myAccount.schoolId
  console.log("token" ,token )
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  var subject = useSelector((state) => state.subject.value)
  const dispatch = useDispatch();

  const getAllPhases = ()=>{
    fetch(`${baseUrl}/Phases/GetAllActive?subjectId=${parseInt(inputs.subjectId)}&schoolId=${parseInt(schoolID)}` , {headers})
    .then((res) => res.json())
    .then((data) => {
      setPhaseList([...data.data])
      let length = data.data.length
      console.log("length" , length)
      setPhaseLength(parseInt(length))
      console.log("addAllPhases", data.data);
    });
  }

 const  getCategoryList=()=>{
  fetch(`${baseUrl}/Categories/GetAllActive?subjectId=${parseInt(inputs.subjectId)}&phaseId=${parseInt(inputs.phaseId)}&schoolId=${parseInt(schoolID)}` , {headers})
  .then((res) => res.json())
  .then((data) => {
    console.log("category", data.data);
    setCategoryList([...data.data])
    let length =  data.data.length ;
    setcategoryLength(parseInt(length))
    
  });
  }

  useEffect(() => {

    // (subject.length === 0) &&
      fetch(`${baseUrl}/Subjects/GetAllActive?schoolId=${parseInt(schoolID)}` , {headers})
        .then((res) => res.json())
        .then((data) => {
          setSubjectList([...data.data])
          dispatch(addAllSubjects(data.data))
          console.log("addAllSubjects", data.data);
        });

    // (subject.length > 0) &&
    //   setSubjectList([...subject])


  }, [])

  useEffect(() => {

  }, [inputs.iCan])

  useEffect(() => {
    
    inputs.subjectId && getAllPhases()
     
  
  }, [inputs.subjectId])


  useEffect(() => {
   
    inputs.subjectId && getCategoryList();

   
  }, [inputs.phaseId])



  // handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        let data = inputs;
        data.schoolId = schoolID
      const requestMetadata = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(data),
      }

      fetch(`${baseUrl}/Progressions/Save`, requestMetadata)
      .then(res => res.json())
      .then(data => {
        debugger
        console.log(data)
        if(data.data == null && data.message == null){
          message.warning('Learning target already exists for this Category, Kindly change Learning Target number and try again');
        }
        else{
          message.success('Learning target is added successfully !!')
        }
         props.updateLearningTargetList();
        setInputs(initialValues);
        props.form.resetFields()
        props.handleOk()
        console.log("target", data.data)
      })
     
    } })
   

  }

  const handleChangeInputs = (e) => {

    let { name, value } = e.target;
    if (name === 'learningTarget'  && (inputs.learningTarget === '')) {
      // var check = isNaN(parseInt(value))
       message.info('This field must be number.')
    }

    setInputs((prevData) => ({ ...prevData, [name]: value }))

  }

  const handleAddPhase = ()=>{
    history.replace({ pathname: '/manage-phase',  state:{isActive: true}});
  }

  const handleAddCategory = ()=>{
    history.replace({ pathname: '/manage-category',  state:{isActive: true}});
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
              <Option key={key} value={subject.id}>{subject.subjectName}</Option>
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

            phaseList && phaseList.map((data, key) => (
              <Option key={key} value={data.phase.id}>{data.phase.phaseName}</Option>
            ))}
        </Select>)}
        { phaseLength > 0 ? "": 
        <AddPhase addNewPhaseInList={getAllPhases} />
          }
      </Form.Item>
    
    
      <Form.Item
        label="category"
        name="categoryId"
      >


{getFieldDecorator('categoryId', {
          rules: [
              {
                  required: true,
                  message: 'Please select category!',
              },
          ],
      }) 
        (<Select defaultValue="Select" onChange={(value) => setInputs({ ...inputs, categoryId: value })} name='categoryId' style={{ width: 120 }} >
          {

            categoryList && categoryList.map((data, key) => (
              <Option key={key} value={data.category.id}>{data.category.categoryName}</Option>
            ))}
        </Select>) }
      { categoryLength > 0 ? "": <AddCategory addNewCategoryInList={getCategoryList} />
          }

      </Form.Item>


      <Form.Item
        label="Learning Target"
        name="learningTarget"
        rules={[{ required: true, message: 'Please Enter Learning Target!' }]}
      >
       {getFieldDecorator('learningTarget', {
        rules: [
            {
                required: true,
                message: 'Please enter learning target!',
            },
        ],
    })
        (<Input type="number" name="learningTarget" value={inputs.learningTarget} onChange={handleChangeInputs} />)}
      </Form.Item>

      <Form.Item
        label="I Can"
        name="iCan"
        rules={[{ required: true, message: 'Please Enter description !' }]}
      >
             {getFieldDecorator('iCan', {
        rules: [
            {
                required: true,
                message: 'Please enter statement!',
            },
        ],
    })
        (  <TextArea rows={4} name="iCanStatement" value={inputs.iCanStatement} onChange={handleChangeInputs} placeholder="Enter your statement"  />)}

       
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};




export default Form.create()(CreateLearningTarget);

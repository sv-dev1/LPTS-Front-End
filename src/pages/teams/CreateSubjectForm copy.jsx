import { Form, Input, Button, Checkbox , message} from 'antd';
import React , {useState} from 'react'
import {useSelector , useDispatch } from 'react-redux';

const baseUrl = 'http://192.168.5.58/api'
const CreateSubjectForm = (props) => {
  const {getFieldDecorator} = props.form
  const initialValues = {
    "subjectName" : "",
     "isActive": false
  }
const [inputs  , setInputs] = useState(initialValues)
   var myAccount = useSelector((state)=> state.myAccount.value)
  let headers = {"Content-Type": "application/json"};
  const token = myAccount.token;
  console.log("token" ,token )
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
 const  handleSubmit= (e)=>{
   e.preventDefault();
   // 'http://192.168.5.58/api/Subjects/Save
   !inputs.subjectName && message.warning('Subject name Is mandatory.');
   const requestMetadata = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
    body: JSON.stringify(inputs),
  }

  inputs.subjectName &&  fetch(`${baseUrl}/Subjects/Save`, requestMetadata)
    .then(res => res.json())
    .then(subjectData => {
      // message.success('Quotation created successfully !!')
      // window.location.href = '/quotationList'
      // this.setState({loading: false})
      message.success('Subject Name Is added successfully !!')
      props.addNewSubjectInList(subjectData.data)
      setInputs({
        "subjectName" : "",
         "isActive": false
      });
      props.handleOk()
     console.log("added new subject" ,subjectData.data)
    })
   
   
  console.log("ok");
 }

const  handleChangeInputs = (e)=>{
 
  let {name , value }= e.target;
  console.log("name" , name , value)
  name === 'isActive' &&
   (value = !value);
  setInputs((prevData)=>({...prevData , [name]: value}))

}

console.log("inputs" ,inputs)
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
        label="Subject Name"
        name="subjectName"
        rules={[{ required: true, message: 'Please input your Subject Name!' }]}
      >
        <Input name="subjectName" onChange={handleChangeInputs}/>
      </Form.Item>

     

      <Form.Item name="isActive" label="Status" valuePropName="checked" wrapperCol={{  span: 16 }}>
        <Checkbox className="input-check" onChange={handleChangeInputs}  name="isActive" value={inputs.status}></Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateSubjectForm;
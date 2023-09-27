import { Form, Input, Button, Checkbox , message} from 'antd';
import React , {useState, useEffect} from 'react'
import {useSelector , useDispatch } from 'react-redux';

const baseUrl = process.env.REACT_APP_BASE_URL
const CreateSubjectForm = (props) => {
  const {getFieldDecorator} = props.form
  const initialValues = {
    "subjectName" : "",
     "isActive": true
  }
const [inputs  , setInputs] = useState(initialValues)
   var myAccount = useSelector((state)=> state.myAccount.value)
   const schoolID = myAccount.schoolId;
  let headers = {"Content-Type": "application/json"};
  const token = myAccount.token;
  console.log("token" ,token )
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  
 const  handleSubmit= (e)=>{
   e.preventDefault();
   props.form.validateFields((err, values) => {
    if (!err){
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
      inputs.subjectName &&  fetch(`${baseUrl}/Subjects/Save?schoolId=${parseInt(schoolID)}`, requestMetadata)
        .then(res => res.json())
        .then(subjectData => {
          if(subjectData.statusCode === 200 ){
            message.success('Subject name Is added successfully !!')
            props.addNewSubjectInList(subjectData.data)
            props.form.resetFields()
            setInputs({
              "subjectName" : "",
            });
            props.handleOk()
          }else if(subjectData.statusCode === 208) {
            message.warning(subjectData.message)
          } else{
            message.info(subjectData.message)
          }       
      })    
    }
  })
 }

const  handleChangeInputs = (e)=>{
 
  let {name , value }= e.target;
  console.log("name" , name , value)
  name === 'isActive' &&
   (value = !value);
  setInputs((prevData)=>({...prevData , [name]: value}))

}

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onSubmit={handleSubmit}
      autoComplete="off"
      id='create-course-form'
    >
      <Form.Item
        label="Subject Name"
        name="subjectName"
      >
      {getFieldDecorator('subjectName', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input subject name!',

                      },
                    ],
                  })(
                    <Input name="subjectName" value={inputs.subjectName} onChange={handleChangeInputs}/>,
                  )}
      </Form.Item>


      <Form.Item name="isActive" label="Is Active" valuePropName="checked" wrapperCol={{  span: 16 }}>
        <Checkbox className="input-check" onChange={handleChangeInputs} checked={inputs.isActive}  name="isActive" value={inputs.isActive}></Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(CreateSubjectForm);
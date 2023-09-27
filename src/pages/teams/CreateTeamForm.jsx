import { Form, Input, Button, Checkbox , message} from 'antd';
import React , {useState} from 'react'
import {useSelector , useDispatch } from 'react-redux';

const baseUrl = process.env.REACT_APP_BASE_URL
const CreateTeamForm = (props) => {
  const {getFieldDecorator} = props.form
  const initialValues = {
    
    "teamName": "string",
    "description": "string",
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
   // 'http://192.168.5.58/api/Subjects/Save
   props.form.validateFields((err, values) => {
    if (!err){
      let data = inputs;
      data.schoolId = schoolID;
   //   console.log("enter valid")
      const requestMetadata = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(data),
      }
    
       fetch(`${baseUrl}/Teams/Save`, requestMetadata)
        .then(res => res.json())
        .then(data => {
        
          if(data.statusCode === 200 ){
            console.log("data" , data)
            message.success('Team name is added successfully !!')
            props.addNewTeamInList(data.data)
            props.form.resetFields()
            setInputs(initialValues);
          }else if(data.statusCode === 208) {
            message.warning(data.message)
          } else{
            message.info(data.message)
          }
      
        
        
        })
       
       
    }
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
        label="Team Name"
        name="teamName"
      >
      {getFieldDecorator('teamName', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input team name!',

                      },
                    ],
                  })(
                    <Input name="teamName" value={inputs.teamName} onChange={handleChangeInputs}/>,
                  )}
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
      >
      {getFieldDecorator('description', {
                    rules: [
                      {
                        required: true,
                        message: 'Please enter description !',

                      },
                    ],
                  })(
                    <Input name="description" value={inputs.description} onChange={handleChangeInputs}/>,
                  )}
      </Form.Item>


      <Form.Item name="isActive" label="Is Active" valuePropName="checked" wrapperCol={{  span: 16 }}>
        <Checkbox className="input-check" onChange={handleChangeInputs}  name="isActive" checked={inputs.isActive} value={inputs.isActive}></Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};


export default Form.create()(CreateTeamForm);
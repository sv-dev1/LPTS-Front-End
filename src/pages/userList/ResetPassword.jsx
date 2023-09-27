
import { Form, Input, Button, Checkbox, Select ,message } from 'antd';
import {addAllSubjects , deleteAllSubjects } from '../../Slicers/subjectSlice'
import React , {useState , useEffect} from 'react'
import {useSelector , useDispatch } from 'react-redux';
import passwordValidator from 'password-validator';
const baseUrl = process.env.REACT_APP_BASE_URL

const ResetPassword = (props) => {
    const { Option } = Select;
    const {getFieldDecorator} = props.form
   const [email , setEmail] = useState(props.email);
   const [isPassconditionTrue , setisPassconditionTrue] = useState(true)
   const [password , setPassword] = useState('');
    var subject = useSelector((state)=> state.subject.value)
    const dispatch = useDispatch();
    var schema = new passwordValidator();

  var myAccount = useSelector((state)=> state.myAccount.value)
  let headers = {"Content-Type": "application/json"};
  const schoolID = myAccount.schoolId
  const token = myAccount.token;
  console.log("token" ,token )
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  
schema
.is().min(8)                                                                 
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                // Must have digits
.has().symbols()   

    // handle Submit
    const  handleSubmit= (e)=>{
      e.preventDefault();
      props.form.validateFields((err, values) => {
        if(schema.validate(password)){
          setisPassconditionTrue(true)
        if (!err){
      const requestMetadata = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
       
     }

          fetch(`${baseUrl}/Auth/ResetPassword?email=${email}&password=${password}&schoolId=${schoolID}`, requestMetadata)
          .then(res => res.json())
          .then(user => {
           
            message.success(' User password updated successfully !!')
            // props.addNewUserInList(user.data)
             props.handleCancel();
            console.log("added new subject" ,user.data)
       })
        }
      }else{
        console.log("2")
        setisPassconditionTrue(false)
      }
      })
      
     console.log("ok");
    }
   
   
   
   

  return (
    <Form
    name="Update Passsword"
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    initialValues={{ remember: true }}
    onSubmit={handleSubmit}
    autoComplete="off"
  >

      <Form.Item
      label="Email"
      name="email"
      rules={[{ required: true, message: 'Please input your  Name!' }]}
      >
      <Input disabled name="email" value={email}  />
    </Form.Item>
    <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your  Password!' }]}
    >
    {getFieldDecorator('password', {
          rules: [
              {
                  required: true,
                  message: 'Please input password!',
              },
          ],
      })
(<Input name="password" type="password" value={password} autoComplete="off" onChange={(e)=>setPassword(e.target.value)} />)}
    </Form.Item>
    <div className='modal-label-text' style={{ marginLeft:"157px", marginBottom:"10px", fontSize:"12px" }}>
    <span style={{ color: isPassconditionTrue? 'black' : 'red' }} >Password must have at least one upper case, <br />lower case, number and special character</span>
    </div>
    <Form.Item>
      <div className="btn-container">
    <Button type="primary" htmlType="submit">
          Reset Passsword
        </Button> 
        </div>
    </Form.Item>
  </Form>
  );
};


export default Form.create()(ResetPassword);
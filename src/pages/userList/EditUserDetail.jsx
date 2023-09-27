
import { Form, Input, Button, Checkbox, Select ,message ,Switch } from 'antd';
import {addAllSubjects , deleteAllSubjects } from '../../Slicers/subjectSlice'
import React , {useState , useEffect} from 'react'
import {useSelector , useDispatch } from 'react-redux';
const baseUrl = process.env.REACT_APP_BASE_URL

const EditUserDetail = (props) => {
  const {getFieldDecorator} = props.form
    const { Option } = Select;
    const initialValues = {
      "id": "",
      "firstName": "",
      "lastName": "",
      "email": "",
      "phoneNumber": "",
      "roleName": "" ,
      "status": "",
      "year":"",
      "teamId":"",
      "studentId": "",
      "schoolId": 0,
    }
    const [inputs  , setInputs] = useState(initialValues)
    const [roleList , setRoleList ] = useState([]);
    const [schoolData, setSchoolData] = useState({})
    var subject = useSelector((state)=> state.subject.value)
    const dispatch = useDispatch();
 
  var myAccount = useSelector((state)=> state.myAccount.value)
  const schoolID = myAccount.schoolId
  let headers = {"Content-Type": "application/json"};
  const token = myAccount.token;
  console.log("token" ,token )
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

    useEffect(()=>{
  
     // (subject.length === 0) && 
      // fetch(`${baseUrl}/Roles/GetAll` , {headers})
      //               .then((res) => res.json())
      //               .then((data) => {
      //                 setRoleList([...data.data ])
      //               // dispatch(addAllSubjects(data.data))
      //                  console.log("Role" ,data.data );
      //               }) ;
                    !inputs.id && fetch(`${baseUrl}/Users/Get?id=${props.user.id}&schoolId=${parseInt(schoolID)}` , {headers})
                    .then((res) => res.json())
                    .then((data) => {
                      console.log(data.data)
                      setInputs({...data.data })
                    // dispatch(addAllSubjects(data.data))
                      //  console.log("Role" ,data.data );
                    }) ;
                    fetch(`${baseUrl}/Schools/Get?id=${parseInt(schoolID)}`, {headers})
                      .then(res => res.json())
                      .then(data => {
                        setSchoolData(data.data)
                        //  dispatch(addAllSubjects(data.data))
                        console.log('addAllSubjects', data.data)
                      })
        // (subject.length > 0) &&
        // setRoleList([...subject])
            
     
    }, [props])

    // handle Submit
    const  handleSubmit= (e)=>{
      e.preventDefault();

      // 'http://192.168.5.58/api/Subjects/Save
      props.form.validateFields((err, values) => {

        if (!err){

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
console.log("save before token" , token)
     
          fetch(`${baseUrl}/Users/UpdateOne`, requestMetadata)
          .then(res => res.json())
          .then(user => {

            if(user.statusCode === 200 ){
              message.success(' User details updated successfully !!')
              props.updateuserList(user.data)
              props.handleCancel();
             setInputs(initialValues);
           //  console.log("added new subject" ,user.data)
            }else if(user.statusCode === 208) {
              message.warning(user.message)
            } else{
              message.info(user.message)
            }
      
       })
        }
      })
      
     console.log("ok");
    }
   
   const handleChangeToggle =  value => {
    setInputs({...inputs , isBlocked: value });
  };
   const  handleChangeInputs = (e)=>{
 
    let {name , value }= e.target;
    //  console.log("name" , name , value)
     name === 'status' &&
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
    label="First Name"
    name="firstName"
    rules={[{ required: true, message: 'Please input your  Name!' }]}
  >
   {getFieldDecorator('firstName', {
          rules: [
              {
                  required: true,
                  message: 'Please input first name!',
              },
          ],
          initialValue: inputs.firstName
      })
    (<Input name="firstName" value={inputs.firstName} onChange={handleChangeInputs}/>)}
  </Form.Item>
      <Form.Item
      label="Last Name"
      name="lastName"
      rules={[{ required: true, message: 'Please input your  Name!' }]}
      >
       {getFieldDecorator('lastName', {
          rules: [
              {
                  required: true,
                  message: 'Please input last name!',
              },
          ],
          initialValue: inputs.lastName
      })
     ( <Input  name="lastName" value={inputs.lastName} onChange={handleChangeInputs} />)}
    </Form.Item>
      <Form.Item
      label="Email"
      name="email"
      rules={[{ required: true, message: 'Please input your  email!' }]}
    >
      <Input    name="email" value={inputs.email} onChange={handleChangeInputs} />
    </Form.Item>
{ (inputs.roleName.toLowerCase() === 'student' || inputs.roleName.toLowerCase() === 'teacher') &&   <Form.Item
      label="ID"
      name="studentId"
     
    >
      <Input  name="studentId"  value={inputs.studentId} onChange={handleChangeInputs} />
    </Form.Item>}

    <Form.Item
    label="Role"
    name="roleName"
  >
  <Select  disabled="true"  value={inputs.roleName}  onChange={(value) => setInputs({...inputs, roleName:value})}  style={{ width: 120 }} >
  {  
    roleList && roleList.map((role , key)=>(
         <Option key={key} value={ role.name}>{role.name}</Option>
      ))}
  </Select>
  </Form.Item>
  {inputs.roleName.toLowerCase() === 'student' ? (<Form.Item
        label="Year"
        name="year"
      >
        {getFieldDecorator('year', {
          rules: [
            {
              required: true,
              message: 'Please select year!',
            },
            {
              type: 'number',
              message: 'Input should be number',
            }
          ],
          initialValue: inputs.year
        })
          (<Select  value={inputs.year} name="roleName" onChange={(value) => setInputs({ ...inputs, year: value })} style={{ width: 120 }} >

          {schoolData &&
                  [...Array(schoolData.studentYears)].map((role, key) => (
                    <Option key={key} value={key + 1}>
                      {key + 1}
                    </Option>
                  ))}

          </Select>)}
      </Form.Item>) :'' }

  <Form.Item name="status" label="Is Active" valuePropName="checked" wrapperCol={{  span: 16 }}>
        <Checkbox className="input-check" onChange={handleChangeInputs}  name="status"  checked={inputs.status} value={inputs.status}></Checkbox>
      </Form.Item>

      {/* <Form.Item name="status" label="Blocked" valuePropName="checked" wrapperCol={{  span: 16 }}>
      <Switch className="input-check" onChange={handleChangeToggle}  name="isBlocked" value={inputs.isBlocked}/>
      </Form.Item> */}
    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
  );
};


export default Form.create()(EditUserDetail);

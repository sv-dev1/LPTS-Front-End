
import { Form, Input, Button, Checkbox, Select, message } from 'antd';
import { addAllSubjects, deleteAllSubjects } from '../../Slicers/subjectSlice'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import passwordValidator from 'password-validator';
const baseUrl = process.env.REACT_APP_BASE_URL

const demoTeam =  {
  "id": 0,
  "teamName": "None",
  "description": "",
}

const CreateUser = (props) => {
  const { getFieldDecorator } = props.form
  const { Option } = Select;
  const initialValues = {
    "firstName": "",
    "lastName": "",
    "email": "",
    "studentId": "",
    "roleName": "",
    "password": "",
    "teamId": 0,
    "status": true,
    "isGoogleAccount":false,
    "year": 0
  }
  const [inputs, setInputs] = useState(initialValues)
  const [roleList, setRoleList] = useState([]);
  const [teamList, setTeamList] = useState([demoTeam]);
  var subject = useSelector((state) => state.subject.value)
  const [schoolData, setSchoolData] = useState({})
  const [isPassconditionTrue, setisPassconditionTrue] = useState(true)
  var schema = new passwordValidator();
  const dispatch = useDispatch();
  var myAccount = useSelector((state) => state.myAccount.value)
  const schoolID = myAccount.schoolId
  let headers = { "Content-Type": "application/json" };
  const token = myAccount.token;
  console.log("token", token)
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }



  // password schema

  schema
    .is().min(8)
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                // Must have digits
    .has().symbols()

  // // Validate against a password string
  // console.log(schema.validate('validPASS123'));


  useEffect(() => {


    //let id = 1
    Promise.all([
      fetch(`${baseUrl}/Roles/GetAll`, { headers }),
      fetch(`${baseUrl}/Schools/Get?id=${parseInt(schoolID)}`, {headers}),
      fetch(`${baseUrl}/Teams/GetAllActive?schoolId=${parseInt(schoolID)}`, {headers})
    ]).then(function (responses) {
      // Get a JSON object from each of the responses
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    }).then(function (data) {
      // Log the data to the console
      // You would do something with both sets of data here
      setRoleList([...data[0].data])
      setSchoolData(data[1].data)
      setTeamList([ ...data[2].data ,demoTeam])
   
    }).catch(function (error) {
      // if there's an error, log it
      console.log(error);
    });

  }, [])

  // handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    //var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");



    props.form.validateFields((err, values) => {
        let data = inputs;
        data.schoolId = schoolID;
      //  console.log("1")
        setisPassconditionTrue(true)
        if (!err) {
          const requestMetadata = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          }
          console.log(inputs)

          fetch(`${baseUrl}/Users/Save`, requestMetadata)
            .then(res => res.json())
            .then(user => {


              if(user.statusCode === 200 ){
                message.success(' User created successfully !!')
                props.addNewUserInList(user.data)
                props.form.resetFields()
                setInputs(initialValues);
                console.log("added new subject", user.data)
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

  const handleChangeInputs = (e) => {

    let { name, value } = e.target;
    //  console.log("name" , name , value)
   ( name === 'status'||  name === 'isGoogleAccount') &&
      (value = !value);
    setInputs((prevData) => ({ ...prevData, [name]: value }))

  }

//   const handleChangeInputsGoogle = (e) => {
// debugger
//     let { name, value } = e.target;
//     //  console.log("name" , name , value)
//     name === 'isGoogleAccount' &&
//       (value = !value);
//     setInputs((prevData) => ({ ...prevData, [name]: value }))

//   }

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
        label="First Name"
        name="firstName"
        rules={[{ required: true, message: 'Please input your  Name!' }]}
      >
        {getFieldDecorator('firstName', {
          rules: [
            {
              required: true,
              message: 'Please input firstName!',
            },
          ],
        })
          (<Input name="firstName" value={inputs.firstName} onChange={handleChangeInputs} />)}
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
              message: 'Please input lastName!',
            },
          ],
        })
          (<Input name="lastName" value={inputs.lastName} onChange={handleChangeInputs} />)}
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your  email!' }]}
      >
        {getFieldDecorator('email', {
          rules: [
            {
              required: true,
              message: 'Please input email!',
            },
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            }
          ],
        })
          (<Input name="email" value={inputs.email} autoComplete="off" onChange={handleChangeInputs} />)}
      </Form.Item>
   
    {inputs.isGoogleAccount == false &&  
      <Form.Item
      label="Password"
      name="password"
    >
      {getFieldDecorator('password', {
        rules: [
          {
            required: true,
            message: 'Please input password!',
          },
        ],
      })
        (<Input name="password" type="password" value={inputs.password} autoComplete="off" onChange={handleChangeInputs} />)}
    </Form.Item>}
    <div className='modal-label-text' style={{ marginLeft:"157px", marginBottom:"10px", fontSize:"12px" }}>
    <span style={{ color: isPassconditionTrue? 'black' : 'red' }} >Password must have at least one upper case, <br />lower case, number and special character</span>
    </div>
      <Form.Item
        label="Role"
        name="roleName"
      >
        {getFieldDecorator('roleName', {
          rules: [
            {
              required: true,
              message: 'Please select role!',
            },
          ],
        })
          (<Select defaultValue="Select" value={inputs.roleName} name="roleName" onChange={(value) => setInputs({ ...inputs, roleName: value })} style={{ width: 120 }} >

            {roleList && roleList.map((role, key) => (
              <Option key={key} value={role.name}>{role.name}</Option>
            ))}

          </Select>)}
      </Form.Item>
     {(inputs.roleName.toLowerCase() === 'student' || inputs.roleName.toLowerCase() === 'teacher') ? (
       <>
     { inputs.roleName.toLowerCase() === 'student' && <Form.Item
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
              message: 'Input should be number.',
            }
          ],
        })
          (<Select defaultValue="Select" value={inputs.year} name="roleName" onChange={(value) => setInputs({ ...inputs, year: value })} style={{ width: 120 }} >

          {schoolData &&
                  [...Array(schoolData.studentYears)].map((role, key) => (
                    <Option key={key} value={key + 1}>
                      {key + 1}
                    </Option>
                  ))}
          </Select>)}
      </Form.Item>}
      <Form.Item
      label="ID"
      name="studentId" 
    >

      <Input name="studentId" value={inputs.studentId} onChange={handleChangeInputs} />
    </Form.Item>
    </>
    ) :'' }

      <Form.Item
        label="Team"
        name="teamId"
      >
        {getFieldDecorator('teamId', {
          rules: [
           
          ],
        })
          (<Select defaultValue="Select" value={inputs.roleName} name="teamId" onChange={(value) => setInputs({ ...inputs, teamId: value })} style={{ width: 120 }} >

            {teamList && teamList.map((team, key) => (
              <Option key={key} value={team.id}>{team.teamName}</Option>
            ))}

          </Select>)}
      </Form.Item>

      <Form.Item name="status" label="Is Active" valuePropName="checked" wrapperCol={{ span: 16 }}>
        <Checkbox className="input-check" onChange={handleChangeInputs} name="status" checked={inputs.status} value={inputs.status}></Checkbox>
      </Form.Item>

      <Form.Item name="isGoogleAccount" label="Google Account" valuePropName="checked" wrapperCol={{ span: 16 }}>
        <Checkbox className="input-check" onChange={handleChangeInputs} name="isGoogleAccount" checked={inputs.isGoogleAccount} value={inputs.isGoogleAccount}></Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(CreateUser);

import {Form,Alert , Input, Button, Checkbox, Row, Col, message} from 'antd'
import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'
import {Label} from 'recharts'
import passwordValidator from 'password-validator';
const baseUrl = process.env.REACT_APP_BASE_URL

const AddSchool = props => {
  const {getFieldDecorator} = props.form
  const initialValues = {
    subjectName: '',
    isActive: true,
  }
  const [inputs, setInputs] = useState(initialValues);
  const [errorsInPassword, setErrorsInPassword] = useState([])
  var myAccount = JSON.parse(localStorage.getItem('user'))
  const schoolID = myAccount.schoolId;
  let headers = {'Content-Type': 'application/json'};
  
  var schema = new passwordValidator();
      // password schema

      schema
      .is().min(8 , 'Password should have a minimum length of 8 characters')
      .has().uppercase(1 , 'Password should have a minimum of 1 uppercase letter' )             // Must have uppercase letters
      .has().lowercase(1 , 'Password should have a minimum of 1 lowercase letter' )                // Must have lowercase letters
      .has().digits(1 , 'Password should have a minimum of 1 digit')                                // Must have digits
      .has().symbols(1 , 'Password should have a minimum of 1 symbol')
  
    // // Validate against a password string
    // console.log(schema.validate('validPASS123'));

  const token = myAccount.token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  console.log('token', token)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const handleSubmit = e => {
    e.preventDefault()
    // console.log(inputs.userPassword)
    // console.log(schema.validate(inputs.userPassword));
    // console.log(schema.validate(inputs.userPassword, { details: true }));

    let checkPasswordErrors =  schema.validate(inputs.userPassword, { details: true })

    props.form.validateFields(async (err, values) => {

      if(checkPasswordErrors.length > 0){
        setErrorsInPassword(checkPasswordErrors);
        return 0;
      }else{
        setErrorsInPassword([]);
      }
      if (!err) {
        console.log(inputs)
        var formData = new FormData()
        formData.append('Id', 0)
        formData.append('IsActive', inputs.isActive)
        formData.append('StudentYears', inputs.studentYears)
        formData.append('SchoolName', inputs.schoolName)
        formData.append('Logo', inputs.logo)
        formData.append('UserFirstName', inputs.userFirstName)
        formData.append('UserLastName', inputs.userLastName)
        formData.append('UserEmail', inputs.userEmail)
        formData.append('UserPassword', inputs.userPassword)
        formData.append(
          'MailingHost',
          inputs.mailingHost ? inputs.mailingHost : '',
        )
        formData.append(
          'MailingPassword',
          inputs.mailingPassword ? inputs.mailingPassword : '',
        )
        formData.append(
          'MailingFromEmail',
          inputs.mailingForEmail ? inputs.mailingForEmail : '',
        )
        formData.append(
          'MailingPort',
          inputs.mailingPort ? inputs.mailingPort : 0,
        )
        formData.append(
          'MailingUsername',
          inputs.mailingUsername ? inputs.mailingUsername : '',
        )
        formData.append('Address', inputs.address ? inputs.address : '')
        formData.append('Website', inputs.website ? inputs.website : '')
        try {
          const res = await axios.post(`${baseUrl}/Schools/Save`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          console.log(res.data)
          if (res.data.statusCode === 208) {
            //   setFilterTable([...res.data.data])
            message.info({info: res.data.message})
            props.updateSchoolList()
          } else if (res.data.statusCode === 200) {
            props.form.resetFields()
            props.updateSchoolList()
            message.success(res.data.message)
          } else {
            message.info(res.data.message)
          }
          //	console.log("dta" ,jsonINData)
        } catch (error) {
          console.log(error)
        }
        console.log(formData)
      }
    })
  }

  useEffect(() => {
    console.log(props.parentToChild)
  }, [])

  const changeHandler = event => {
    if (
      event.target.files[0].type ===
      ('image/png' || 'image/jpeg' || 'image/jpg')
    ) {
      setInputs({...inputs, logo: event.target.files[0]})
    }
  }

  const handleChangeInputs = e => {
    let {name, value} = e.target
    console.log('name', name, value)
    name === 'isActive' && (value = !value)
    setInputs(prevData => ({...prevData, [name]: value}))
  }

  console.log('inputs', inputs)
  return (
    <>
    <Form
      name="basic"
      labelCol={{span: 24}}
      wrapperCol={{span: 24}}
      initialValues={{remember: true}}
      onSubmit={handleSubmit}
      autoComplete="off">
     
      <Row gutter={[16, 16]}>
      <h3 class="fw-bold p-2">School Details :</h3>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="School Name" name="schoolName">
            {getFieldDecorator('schoolName', {
              rules: [
                {
                  required: true,
                  message: 'Please input school name !',
                },
              ],
            })(
              <Input
                name="schoolName"
                value={inputs.schoolName}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="Student Years" name="studentYears">
            {getFieldDecorator('studentYears', {
              rules: [
                {
                  required: true,
                  message: 'Please input student years !',
                },
              ],
            })(
              <Input
                name="studentYears"
                value={inputs.studentYears}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="School Logo" name="logo">
            {getFieldDecorator('schoolLogo', {
              rules: [
                {
                  required: true,
                  message: 'Please input school logo !',
                },
              ],
            })(<Input name="logo" type="file" onChange={changeHandler} />)}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="Address" name="address">
            {getFieldDecorator(
              'address',
              {},
            )(
              <Input
                name="address"
                value={inputs.address}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="Website" name="website">
            {getFieldDecorator(
              'website',
              {},
            )(
              <Input
                name="website"
                value={inputs.website}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
      <h3 class="fw-bold p-2">Mailing Details :</h3>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="Mailing Host" name="mailingHost">
            {getFieldDecorator(
              'mailingHost',
              {},
            )(
              <Input
                name="mailingHost"
                value={inputs.mailingHost}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="Mailing Port" name="mailingPort">
            {getFieldDecorator(
              'mailingPort',
              {},
            )(
              <Input
                name="mailingPort"
                value={inputs.mailingPort}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="Mailing Username" name="mailingUsername">
            {getFieldDecorator(
              'mailingUsername',
              {},
            )(
              <Input
                name="mailingUsername"
                value={inputs.mailingUsername}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="Mailing Password" name="mailingPassword">
            {getFieldDecorator(
              'mailingPassword',
              {},
            )(
              <Input
                name="mailingPassword"
                value={inputs.mailingPassword}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="Mailing From Email" name="mailingForEmail">
            {getFieldDecorator(
              'mailingForEmail',
              {},
            )(
              <Input
                name="mailingForEmail"
                value={inputs.mailingForEmail}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
      <h3 class="fw-bold p-2">User Details :</h3>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="User First Name" name="userFirstName">
            {getFieldDecorator('userFirstName', {
              rules: [
                {
                  required: true,
                  message: 'Please input first name !',
                },
              ],
            })(
              <Input
                name="userFirstName"
                value={inputs.userFirstName}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="User Last Name" name="userLastName">
            {getFieldDecorator('userLastName', {
              rules: [
                {
                  required: true,
                  message: 'Please input last name !',
                },
              ],
            })(
              <Input
                name="userLastName"
                value={inputs.userLastName}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="User Email" name="userEmail">
            {getFieldDecorator('userEmail', {
              rules: [
                {
                  type: 'email',
                  required: true,
                  message: 'Please input valid email !',
                },
              ],
            })(
              <Input
                name="userEmail"
                value={inputs.userEmail}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="User Password" name="userPassword">
            {getFieldDecorator('userPassword', {
              rules: [
                {
                  required: true,
                  message: 'Please input password !',
                },
              ],
            })(
              <Input
                name="userPassword"
                value={inputs.userPassword}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item
            name="isActive"
            label="Is Active"
            valuePropName="checked"
            wrapperCol={{span: 16}}>
            <Checkbox
              className="input-check"
              onChange={handleChangeInputs}
              checked={inputs.isActive}
              name="isActive"
              value={inputs.isActive}></Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item wrapperCol={{offset: 8, span: 16}}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      
    </Form>

    {errorsInPassword.length > 0 && errorsInPassword.map((error)=>(
       <Alert message={`${error.message}`} type="error"  className='alert-bx'/>
))}
</>
  )
}

export default Form.create()(AddSchool)

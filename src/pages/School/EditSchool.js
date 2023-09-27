import {Form, Input, Button, Checkbox, Card, Row, Col, message} from 'antd'
import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'

const baseUrl = process.env.REACT_APP_BASE_URL
const EditSchool = props => {
  const {getFieldDecorator} = props.form
  var myAccount = JSON.parse(localStorage.getItem('user'))
  const schoolID = myAccount.schoolId
  let ID = props.id ? props.id :schoolID ;
  const initialValues = {
    id: ID,
    subjectName: '',
    SchoolName: "",
    StudentYears:"",
    isActive: true,
  }
  const [inputs, setInputs] = useState(initialValues)
  
  let headers = {'Content-Type': 'application/json'}
  const token = myAccount.token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  console.log('token', token)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

const fetchSchoolData =(id)=>{
  let headers = {'Content-Type': 'application/json'}
    const mytoken = myAccount.token
    if (mytoken) {
      headers['Authorization'] = `Bearer ${mytoken}`
    }
    fetch(`${baseUrl}/Schools/Get?id=${parseInt(id)}`, {headers})
      .then(res => res.json())
      .then(data => {
        console.log("data--1" ,data)
        setInputs(data.data)
      })
}

  const handleSubmit = e => {
    e.preventDefault()
    console.log("inputs" ,inputs)
    //console.log(inputs)
    // 'http://192.168.5.58/api/Subjects/Save
    props.form.validateFields(async (err, values) => {
      if (!err) {
        console.log(inputs)
        var formData = new FormData()
        formData.append('Id', inputs.id)
        formData.append('IsActive', inputs.isActive)
        formData.append('StudentYears', inputs.studentYears)
        formData.append('SchoolName', inputs.schoolName)
        formData.append(
          'Logo', inputs.logo,
        )
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
          // props.form.resetFields()
          props?.id &&  props.updateSchoolList()
          } else if (res.data.statusCode === 200) {
            // props.form.resetFields()
            //setInputs(initialValues)
            props?.id && props.updateSchoolList()
            message.success(res.data.message)
            localStorage.setItem('schoolData', JSON.stringify({}))
          } else {
            message.info(res.data.message)
          }
          //	console.log("dta" ,jsonINData)
        } catch (error) {
          console.log(error)
        }
      }
    })
  }

  useEffect(() => {
  //  debugger
   // console.log("id" ,props.id)
     //setInputs(props.parentToChild.data)
     props.form.resetFields()
    fetchSchoolData(ID);
  }, [ID , inputs.SchoolName])

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
    <Form
      name="basic"
      labelCol={{span: 24}}
      wrapperCol={{span: 24}}
      initialValues={{remember: true}}
      onSubmit={handleSubmit}
      autoComplete="off">
      <h3>School Details :</h3>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="School Name" name="schoolName">
            {getFieldDecorator('schoolName', {
              rules: [
                {
                  required: true,
                  message: 'Please input school name !',
                },
              ],
              initialValue: inputs.schoolName,
            })(
              <Input
                name="schoolName"
                value={inputs.schoolName}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={16}>
          <Form.Item label="School Logo" name="logo">
            {getFieldDecorator('schoolLogo', {
              rules: [],
            })(<Input name="logo" type="file" onChange={changeHandler} />)}
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
              initialValue: inputs.studentYears,
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
          <Form.Item label="Address" name="address">
            {getFieldDecorator('address', {
              initialValue: inputs.address,
            })(
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
            {getFieldDecorator('website', {
              initialValue: inputs.website,
            })(
              <Input
                name="website"
                value={inputs.website}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
        <br></br>
        <h3>Mailing Details :</h3>

        <Col xs={24} sm={24} md={24} lg={6}>
          <Form.Item label="Mailing Host" name="mailingHost">
            {getFieldDecorator('mailingHost', {
              initialValue: inputs.mailingHost,
            })(
              <Input
                name="mailingHost"
                value={inputs.mailingHost}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={6}>
          <Form.Item label="Mailing Port" name="mailingPort">
            {getFieldDecorator('mailingPort', {
              initialValue: inputs.mailingPort,
            })(
              <Input
                name="mailingPort"
                value={inputs.mailingPort}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={6}>
          <Form.Item label="Mailing Username" name="mailingUsername">
            {getFieldDecorator('mailingUsername', {
              initialValue: inputs.mailingUsername,
            })(
              <Input
                name="mailingUsername"
                value={inputs.mailingUsername}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={6}>
          <Form.Item label="Mailing Password" name="mailingPassword">
            {getFieldDecorator('mailingPassword', {
              initialValue: inputs.mailingPassword,
            })(
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
            {getFieldDecorator('mailingForEmail', {
              initialValue: inputs.mailingFromEmail,
            })(
              <Input
                name="mailingForEmail"
                value={inputs.mailingForEmail}
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
  )
}

export default Form.create()(EditSchool)

import {Form, Input, Button, Checkbox, Row, Col, message} from 'antd'
import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'

const baseUrl = process.env.REACT_APP_BASE_URL
const SchoolInfo = props => {
  const {getFieldDecorator} = props.form
  const initialValues = {
    subjectName: '',
    isActive: true,
  }
  const [inputs, setInputs] = useState(initialValues)
  var myAccount = JSON.parse(localStorage.getItem('user'))
  const schoolID = myAccount.schoolId
  let headers = {'Content-Type': 'application/json'}
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
    // 'http://192.168.5.58/api/Subjects/Save
    props.form.validateFields(async (err, values) => {
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
          } else if (res.data.statusCode === 200) {
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
    <Form
      name="basic"
      labelCol={{span: 24}}
      wrapperCol={{span: 24}}
      initialValues={{remember: true}}
      onSubmit={handleSubmit}
      autoComplete="off">
      <h3>School Details :</h3>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={6}>
          <Form.Item
            label="School Name"
            name="schoolName"
            ClassName="label_head">
            {getFieldDecorator('schoolName', {
              initialValue: props.parentToChild.data.schoolName,
            })(
              <Input
                name="schoolName"
                value={inputs.schoolName}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6}>
          <Form.Item
            label="Student Years"
            name="studentYears"
            ClassName="label_head">
            {getFieldDecorator('studentYears', {
              initialValue: props.parentToChild.data.studentYears,
            })(
              <Input
                name="studentYears"
                value={inputs.studentYears}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6}>
          <Form.Item label="Website" name="website" ClassName="label_head">
            {getFieldDecorator('website', {
              initialValue: props.parentToChild.data.website,
            })(
              <Input
                name="website"
                value={inputs.website}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6}>
          <Form.Item label="Address" name="address" ClassName="label_head">
            {getFieldDecorator('address', {
              initialValue: props.parentToChild.data.address,
            })(
              <Input
                name="address"
                value={inputs.address}
                onChange={handleChangeInputs}
              />,
            )}
          </Form.Item>
        </Col>

        <h3>Mailing Details :</h3>
        <Col xs={24} sm={24} md={24} lg={8}>
          <Form.Item label="Mailing Host" name="mailingHost">
            {getFieldDecorator('mailingHost', {
              initialValue: props.parentToChild.data.mailingHost,
            })(
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
            {getFieldDecorator('mailingPort', {
              initialValue: props.parentToChild.data.mailingPort,
            })(
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
            {getFieldDecorator('mailingUsername', {
              initialValue: props.parentToChild.data.mailingUsername,
            })(
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
            {getFieldDecorator('mailingPassword', {
              initialValue: props.parentToChild.data.mailingPassword,
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
              initialValue: props.parentToChild.data.mailingFromEmail,
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
    </Form>
  )
}

export default Form.create()(SchoolInfo)

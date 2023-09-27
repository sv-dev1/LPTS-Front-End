import {Form, Input, Button, Checkbox, message} from 'antd'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import axios from 'axios'

const baseUrl = process.env.REACT_APP_BASE_URL
const AddSettingForm = props => {
  const {getFieldDecorator} = props.form
  const initialValues = {
    id: 1,
    isActive: true,
    studentYears: '',
    schoolName: '',
    logo: '',
    address: '',
    website: '',
    host: '',
    port: 0,
    username: '',
    password: '',
    fromEmail: '',
  }

  const [inputs, setInputs] = useState(initialValues)
  var myAccount = JSON.parse(localStorage.getItem('user'))
  let headers = {'Content-Type': 'application/json'}
  const token = myAccount.token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFields(async (err, values) => {
      if (!err) {
        var formData = new FormData()
        formData.append('id', parseInt(inputs.id))
        formData.append('isActive', inputs.isActive)
        formData.append('studentYears', inputs.studentYears)
        formData.append('schoolName', inputs.schoolName)
        formData.append('logo', inputs.logo)
        formData.append('address', inputs.address)
        formData.append('website', inputs.website)
        formData.append('host', inputs.host)
        formData.append('port', inputs.port)
        formData.append('username', inputs.username)
        formData.append('password', inputs.password)
        formData.append('fromEmail', inputs.fromEmail)

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
      }
    })
  }

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
    name === 'isActive' && (value = !value)
    setInputs(prevData => ({...prevData, [name]: value}))
  }

  return (
    <Form
      name="basic"
      labelCol={{span: 2}}
      wrapperCol={{span: 6}}
      initialValues={{remember: true}}
      onSubmit={handleSubmit}
      autoComplete="off">
      <h2 style={{'padding-left': 135}}>Basic Information</h2>
      <Form.Item label="Student Years" name="studentYears">
        {getFieldDecorator('studentYears', {
          rules: [
            {
              required: true,
              message: 'Required student years!',
            },
          ],
        })(<Input name="studentYears" onChange={handleChangeInputs} />)}
      </Form.Item>
      <h2 style={{'padding-left': 135}}>School Information</h2>
      <Form.Item label="School Name" name="schoolName">
        {getFieldDecorator('schoolName', {
          rules: [
            {
              required: true,
              message: 'Required school name!',
            },
          ],
        })(<Input name="schoolName" onChange={handleChangeInputs} />)}
      </Form.Item>
      <Form.Item label="School Logo" name="logo">
        {getFieldDecorator('logo', {
          rules: [
            {
              required: true,
              message: 'Required school logo!',
            },
          ],
        })(
          <input
            style={{lineHeight: '20px', margin: '3px 0'}}
            type="file"
            name="logo"
            onChange={changeHandler}
          />,
        )}
      </Form.Item>
      <Form.Item label="School Address" name="address">
        {getFieldDecorator('address', {
          rules: [
            {
              required: true,
              message: 'Required school address!',
            },
          ],
        })(<Input.TextArea name="address" onChange={handleChangeInputs} />)}
      </Form.Item>
      <Form.Item label="School Website" name="website">
        {getFieldDecorator('website', {
          rules: [
            {
              required: true,
              message: 'Required school website!',
            },
          ],
        })(<Input name="website" onChange={handleChangeInputs} />)}
      </Form.Item>
      <h2 style={{'padding-left': 135}}>Smpt Email Detail</h2>
      <Form.Item label="Smpt Server" name="host">
        {getFieldDecorator('host', {
          rules: [
            {
              required: true,
              message: 'Required smpt server!',
            },
          ],
        })(<Input name="host" onChange={handleChangeInputs} />)}
      </Form.Item>
      <Form.Item label="Port Number" name="port">
        {getFieldDecorator('port', {
          rules: [
            {
              required: true,
              message: 'Required port number!',
            },
          ],
        })(<Input name="port" onChange={handleChangeInputs} />)}
      </Form.Item>
      <Form.Item label="Username" name="username">
        {getFieldDecorator('username', {
          rules: [
            {
              required: true,
              message: 'Required username!',
            },
          ],
        })(<Input name="username" onChange={handleChangeInputs} />)}
      </Form.Item>
      <Form.Item label="Password" name="password">
        {getFieldDecorator('password', {
          rules: [
            {
              required: true,
              message: 'Required password!',
            },
          ],
        })(
          <Input
            name="password"
            type="password"
            onChange={handleChangeInputs}
          />,
        )}
      </Form.Item>
      <Form.Item label="From Email" name="fromEmail">
        {getFieldDecorator('fromEmail', {
          rules: [
            {
              required: true,
              message: 'Required From email!',
            },
          ],
        })(<Input name="fromEmail" onChange={handleChangeInputs} />)}
      </Form.Item>
      <Form.Item
        hidden
        name="isActive"
        label="Status"
        valuePropName="checked"
        wrapperCol={{span: 6}}>
        <Checkbox
          className="input-check"
          onChange={handleChangeInputs}
          name="isActive"
          value={inputs.status}></Checkbox>
      </Form.Item>
      <Form.Item wrapperCol={{offset: 2, span: 6}}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(AddSettingForm)

import {Form, Input, Button, Checkbox, message} from 'antd'
import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
const baseUrl = process.env.REACT_APP_BASE_URL

const EditSubject = props => {
  console.log('props', props.data)
  const {getFieldDecorator} = props.form
  let {id , subjectName , isActive} = props.data
  const initialValues = {
    id,
    subjectName,
    isActive,
  }
  const [inputs, setInputs] = useState(initialValues)
  var myAccount = useSelector(state => state.myAccount.value)
  const schoolID = myAccount.schoolId;
  let headers = {'Content-Type': 'application/json'}
  const token = myAccount.token
  console.log('token', token)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  // useEffect(() => {
  //   // get subject name
  //   // debugger
  //   fetch(`${baseUrl}/Subjects/Get?id=${inputs.id}&schoolId=${parseInt(schoolID)}`, {headers})
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log('data edit subject', data.data)
  //       setInputs({
  //         id: data.data.id,
  //         subjectName: data.data.subjectName,
  //         isActive: data.data.isActive,
  //       })
  //     })
  // }, [])

  const handleSubmit = e => {
    e.preventDefault()
    // 'http://192.168.5.58/api/Subjects/Save
    props.form.validateFields((err, values) => {
      let data = inputs;
      data.schoolId = schoolID;
      if (!err) {
        console.log('enter valid')
        const requestMetadata = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
        inputs.subjectName &&
          fetch(`${baseUrl}/Subjects/Save`, requestMetadata)
            .then(res => res.json())
            .then(subjectData => {
              if (subjectData.statusCode === 200) {
                message.success('Subject name is updated successfully !!')
                props.updateSubjectList()
                props.handleOk()
              } else if (subjectData.statusCode === 208) {
                message.warning(subjectData.message)
              } else {
                message.info(subjectData.message)
              }
            })

        console.log('ok')
      }
    })
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
      labelCol={{span: 8}}
      wrapperCol={{span: 16}}
      initialValues={{remember: true}}
      onSubmit={handleSubmit}
      autoComplete="off">
      <Form.Item label="Subject Name" name="subjectName">
        {getFieldDecorator('subjectName', {
          rules: [
            {
              required: true,
              message: 'Please input subject name!',
            },
          ],
          initialValue: inputs.subjectName,
        })(
          <Input
            name="subjectName"
            value={inputs.subjectName}
            onChange={handleChangeInputs}
          />,
        )}
      </Form.Item>

      <Form.Item
        name="isActive"
        label="Is Active"
        valuePropName="checked"
        wrapperCol={{span: 16}}>
        <Checkbox
          className="input-check"
          onChange={handleChangeInputs}
          name="isActive"
          checked={inputs.isActive}
          value={inputs.isActive}></Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{offset: 8, span: 16}}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(EditSubject)

import {Form, Input, Button, Checkbox, message} from 'antd'
import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
const baseUrl = process.env.REACT_APP_BASE_URL

const EditTeam = props => {
  const {getFieldDecorator} = props.form
  var {id, teamName, description, isActive} = props.teamDetails
  console.log('record', props.teamDetails)
  const initialvalues = {
    id,
    teamName,
    description,
    isActive,
  }
  //console.log(initialvalues)

  const [inputs, setInputs] = useState(initialvalues)
  var myAccount = useSelector(state => state.myAccount.value)
  const schoolID = myAccount.schoolId;
  let headers = {'Content-Type': 'application/json'}
  const token = myAccount.token
  console.log('token', token)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  // useEffect(()=>{

  //       // get subject name

  //       fetch(`${baseUrl}/Team/Get?id=${inputs.id}` ,{headers})
  //           .then((res) => res.json())
  //           .then((data) => {
  //                 console.log("data edit subject" ,data.data );
  //                 var { id ,teamName , description ,isActive  } = data.data;
  //                 console.info("data.data" ,id ,teamName , description ,isActive)
  //                 setInputs({
  //                   id,
  //                   teamName,
  //                   description,
  //                   isActive
  //                   })
  //           }) ;
  //   }, [])

  const handleSubmit = e => {
    e.preventDefault()
    // 'http://192.168.5.58/api/Subjects/Save

    props.form.validateFields((err, values) => {
      if (!err) {
        let data = inputs;
        data.schoolId = schoolID;
        const requestMetadata = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }

        fetch(`${baseUrl}/Teams/Save`, requestMetadata)
          .then(res => res.json())
          .then(data => {
            // debugger
            // message.success('Quotation created successfully !!')
            // window.location.href = '/quotationList'
            // this.setState({loading: false})
            if (data.statusCode === 200) {
              message.success('Team data updated successfully !!')
              props.updateTeamList()
              console.log('added new subject', data.data)
            } else if (data.statusCode === 208) {
              message.warning(data.message)
            } else {
              message.info(data.message)
            }
          })
      }
    })

    console.log('ok')
  }

  const handleChangeInputs = e => {
    let {name, value} = e.target
    //console.log('name', name, value)
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
      <Form.Item label="Team Name" name="teamName">
        {getFieldDecorator('teamName', {
          rules: [
            {
              required: true,
              message: 'Please input team name!',
            },
          ],
          initialValue: teamName,
        })(<Input name="teamName" disabled onChange={handleChangeInputs} />)}
      </Form.Item>
      <Form.Item label="Description" name="description">
        {getFieldDecorator('description', {
          rules: [
            {
              required: true,
              message: 'Please enter description !',
            },
          ],
          initialValue: description,
        })(
          <Input
            name="description"
            setFieldsValue={inputs.description}
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

export default Form.create()(EditTeam)

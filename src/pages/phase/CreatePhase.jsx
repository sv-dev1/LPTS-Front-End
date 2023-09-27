import {Form, Input, Button, Checkbox, Select, message} from 'antd'
import {addAllSubjects, deleteAllSubjects} from '../../Slicers/subjectSlice'
import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {PlusOutlined} from '@ant-design/icons'
import {useHistory} from 'react-router-dom'
const baseUrl = process.env.REACT_APP_BASE_URL
const CreatePhase = props => {
  const {getFieldDecorator} = props.form
  const {Option} = Select
  const history = useHistory()
  const initialValues = {
    subjectId: '',
    phaseName: '',
    orderNo: '',
    isActive: true,
  }
  const [inputs, setInputs] = useState(initialValues)
  const [subjectList, setSubjectList] = useState([])
  const [SubjectLength, SetSubjectLength] = useState(1)
  var subject = useSelector(state => state.subject.value)
  const dispatch = useDispatch()
  var myAccount = JSON.parse(localStorage.getItem('user'))
  let headers = {'Content-Type': 'application/json'}
  const token = myAccount.token
  const schoolID = myAccount.schoolId
  console.log('token', token)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  useEffect(() => {
    fetch(`${baseUrl}/Subjects/GetAllActive?schoolId=${parseInt(schoolID)}`, {
      headers,
    })
      .then(res => res.json())
      .then(data => {
        setSubjectList([...data.data])
        dispatch(addAllSubjects(data.data))
        console.log('addAllSubjects', data.data)
      })

    // (subject.length > 0) &&
    // setSubjectList([...subject])
  }, [])

  useEffect(() => {
    inputs.subjectId &&  
      fetch(`${baseUrl}/Phases/GetLastPhaseOfSubject?SubjectId=${parseInt(inputs.subjectId)}`, {
       headers,
     })
      .then(res => res.json())
      .then(data => {
      //  debugger
        console.log(data)
        setInputs({...inputs , orderNo:data.data.orderNo+1})
      //  setInputs((prev)=>({...prev , orderNo:data.orderNo}))
      })
  }, [inputs.subjectId])

  // handle Submit
  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      if (!err) {
        let data = inputs
        data.schoolId = schoolID
        const requestMetadata = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }

        inputs.subjectId &&
          inputs.subjectId !== 'Select' &&
          inputs.phaseName &&
          fetch(`${baseUrl}/Phases/Save`, requestMetadata)
            .then(res => res.json())
            .then(phaseData => {
              // message.success('Quotation created successfully !!')
              // window.location.href = '/quotationList'
              // this.setState({loading: false})
              if (phaseData.statusCode === 200) {
                message.success('Phase name Is added successfully !!')
                setInputs(prevdata => ({...prevdata, phaseName: ''}))
                props.addNewPhaseInList()
                props.form.resetFields()
                setInputs(initialValues)
                console.log('added new phase', phaseData.data)
              } else if (phaseData.statusCode === 208) {
                message.warning(phaseData.message)
              } else {
                message.info(phaseData.message)
              }
            })

        console.log('ok')
      }
    })
  }

  const handleChangeInputs = e => {
    let {name, value} = e.target
    //  console.log("name" , name , value)
    name === 'isActive' && (value = !value)
    setInputs(prevData => ({...prevData, [name]: value}))
  }

  console.log('inputs', inputs)
  const handleAddSubjects = () => {
    history.replace({pathname: '/manage-Subject', state: {isActive: true}})
  }
  return (
    <Form
      name="basic"
      labelCol={{span: 8}}
      wrapperCol={{span: 16}}
      initialValues={{remember: true}}
      onSubmit={handleSubmit}
      autoComplete="off">
      <Form.Item label="Subject" name="subjectId">
        {getFieldDecorator('subjectId', {
          rules: [
            {
              required: true,
              message: 'Please select subject!',
            },
          ],
        })(
          <Select
            defaultValue="Select"
            value={inputs.subjectId}
            onChange={value => setInputs({...inputs, subjectId: value})}
            name="subjectId"
            style={{width: 120}}>
            {subjectList &&
              subjectList.map((subject, key) => (
                <Option key={key} value={subject.id}>
                  {subject.subjectName}
                </Option>
              ))}
          </Select>,
        )}
      </Form.Item>
      {SubjectLength > 0 ? (
        ''
      ) : (
        <Button
          onClick={handleAddSubjects}
          type="primary"
          style={{marginLeft: '10px'}}>
          <PlusOutlined /> Add
        </Button>
      )}
      <Form.Item label="Phase" name="phaseName">
        {getFieldDecorator('phaseName', {
          rules: [
            {
              required: true,
              message: 'Please input your phase name!',
            },
          ],
        })(
          <Input
            name="phaseName"
            value={inputs.phaseName}
            onChange={handleChangeInputs}
          />,
        )}
      </Form.Item>
      <Form.Item
        label="Order No."
        name="orderNo"
      >
    
        <Input name="orderNo" disabled value={inputs.orderNo} onChange={handleChangeInputs} />
      </Form.Item>


      <Form.Item
        name="status"
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

export default Form.create()(CreatePhase)

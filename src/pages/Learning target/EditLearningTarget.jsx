import {Form, Input, Button, Checkbox, Select, message} from 'antd'
import {addAllSubjects, deleteAllSubjects} from '../../Slicers/subjectSlice'
import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
const baseUrl = process.env.REACT_APP_BASE_URL
const EditLearningTarget = props => {
  const {Option} = Select
  const initialValues = {
    subjectName: props.learningTarget.subjectName,
    phaseName: props.learningTarget.phaseName,
    categoryName: props.learningTarget.categoryName,
    id: props.learningTarget.progression.id,
    categoryId: props.learningTarget.progression.categoryId,
    learningTarget: props.learningTarget.progression.learningTarget,
    iCanStatement: props.learningTarget.progression.iCanStatement,
    phaseId: props.learningTarget.progression.learningTarget,
    subjectId: props.learningTarget.progression.learningTarget,
    isActive:props.learningTarget.progression.isActive
  }
  console.log(props)
  const {TextArea} = Input
  const {getFieldDecorator} = props.form
  const [inputs, setInputs] = useState(initialValues)
  const [subjectList, setSubjectList] = useState([])
  const [phaseList, setPhaseList] = useState([])
  const [categoryList, setCategoryList] = useState([])

  var myAccount = useSelector(state => state.myAccount.value)
  const schoolID = myAccount.schoolId
  let headers = {'Content-Type': 'application/json'}
  const token = myAccount.token
  console.log('token', token)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  var subject = useSelector(state => state.subject.value)
  const dispatch = useDispatch()

  const getCurrentModalData = async () => {
    try {
      const res = await fetch(
        `${baseUrl}/Progressions/GetPhaseIdAndCategoryIdOnBasisOfLearningTargetId?LearningTargetId=${inputs.id}`,
        {headers},
      )
      let data = await res.json();
      let {subjectId , phaseId , categoryId} = data.data
     setInputs(prev=>({...prev ,subjectId , phaseId , categoryId}))
      console.log('data', data)
    } catch (error) {
      console.log('error', error)
    }
  }

  const getSubjects = () => {
    fetch(`${baseUrl}/Subjects/GetAll?schoolId=${parseInt(schoolID)}`, {
      headers,
    })
      .then(res => res.json())
      .then(data => {
        setSubjectList([...data.data])
        //  dispatch(addAllSubjects(data.data))
        console.log('addAllSubjects', data.data)
      })
  }
  const getPhases = () => {
    inputs.subjectId &&
      fetch(
        `${baseUrl}/Phases/GetAll?subjectId=${parseInt(
          inputs.subjectId,
        )}&schoolId=${parseInt(schoolID)}`,
        {headers},
      )
        .then(res => res.json())
        .then(data => {
          setPhaseList([...data.data])
          console.log('addAllPhases', data.data)
        })
        .catch(err => {
          console.log('error')
        })
    console.log('propps', props.reset)
  }

  const getCategories = () => {
    fetch(
      `${baseUrl}/Categories/GetAll?subjectId=${parseInt(
        inputs.subjectId,
      )}&phaseId=${parseInt(inputs.phaseId)}&schoolId=${parseInt(schoolID)}`,
      {headers},
    )
      .then(res => res.json())
      .then(data => {
        setCategoryList([...data.data])
        console.log('addAllPhases', data.data)
      })
      .catch(err => {
        console.log('error')
      })
  }

  useEffect(() => {
    getCurrentModalData()
    getSubjects()
    getPhases()
    getCategories()
  }, [])

  useEffect(() => {}, [inputs.iCan])

  useEffect(() => {
    inputs.subjectId && getPhases()
  }, [inputs.subjectId])

  useEffect(() => {
    inputs.subjectId && inputs.phaseId && getCategories()
  }, [inputs.phaseId])

  // handle Submit
  const handleSubmit = e => {
    e.preventDefault()
    props.form.validateFields((err, values) => {
      debugger
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
        fetch(`${baseUrl}/Progressions/Save`, requestMetadata)
          .then(res => res.json())
          .then(data => {
            message.success('Learning target is updated successfully !!')
            props.updateLearningTargetList()
            props.handleOk()
            console.log('target', data.data)
          })
      }
    })
  }

  const handleChangeInputs = e => {
    let {name, value} = e.target
    if (name === 'learningTarget' && inputs.learningTarget === '') {
      // var check = isNaN(parseInt(value))
      message.info('This field must be number.')
    }
    name === 'isActive' && (value = !value)
    setInputs(prevData => ({...prevData, [name]: value}))
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
        <Select
          defaultValue={inputs.subjectName}
          onChange={value => setInputs({...inputs, subjectId: value})}
          name="subjectId"
          style={{width: 120}}>
          {subjectList &&
            subjectList.map((subject, key) => (
              <Option key={key} value={subject.id}>
                {subject.subjectName}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item label="Phase" name="phaseId">
        <Select
          defaultValue={inputs.phaseName}
          onChange={value => setInputs({...inputs, phaseId: value})}
          name="phaseId"
          style={{width: 120}}>
          {phaseList &&
            phaseList.map((data, key) => (
              <Option key={key} value={data.phase.id}>
                {data.phase.phaseName}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item label="Category" name="categoryId">
        <Select
          defaultValue={inputs.categoryName}
          onChange={value => setInputs({...inputs, categoryId: value})}
          name="categoryId"
          style={{width: 120}}>
          {categoryList &&
            categoryList.map((data, key) => (
              <Option key={key} value={data.category.id}>
                {data.category.categoryName}
              </Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Learning Target"
        name="learningTarget"
        rules={[{required: true, message: 'Please Enter Learning Target!'}]}>
        <Input
          type="number"
          name="learningTarget"
          value={inputs.learningTarget}
          onChange={handleChangeInputs}
        />
      </Form.Item>

      <Form.Item
        label="I Can"
        name="iCan"
        rules={[{required: true, message: 'Please enter description !'}]}>
        {getFieldDecorator('lastName', {
          rules: [
            {
              required: true,
              message: 'Please input last name!',
            },
          ],
          initialValue: inputs.iCanStatement,
        })(
          <TextArea
            rows={4}
            name="iCanStatement"
            value={inputs.iCanStatement}
            onChange={handleChangeInputs}
            placeholder="Enter your statement"
          />,
        )}
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

export default Form.create()(EditLearningTarget)

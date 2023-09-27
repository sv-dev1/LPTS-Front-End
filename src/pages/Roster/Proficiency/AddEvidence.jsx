import React, { useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom";
import Messages from '../../../Message/Message';
import { DatePicker } from 'antd';
import {
  Form,
  Col,
  Select,
  Row,
  Input,
  Tooltip,
  Button,
  Modal,
  Popconfirm,
  Table,
  Tag,
  Checkbox,
  Space,
  message
} from 'antd'
import moment from 'moment';

const baseUrl = process.env.REACT_APP_BASE_URL
var user = JSON.parse(localStorage.getItem('user'));

function AddEvidence(props) {
  console.log(props)
  let myId = () => {
    let myID = 0
    if (user.role.toLowerCase() === 'teacher') {
      myID = user.userId;
    }
    return myID;
  }
  const [dateOnPageLoad, setDateOnPageLoad] = useState(new Date());

  const initialValues = {
    "id": props.evidenceId !== 0 ? props.evidence.data.id : 0,
    "studentId": props.studentId,
    "categoryId": props.categoryId,
    "learningTarget": props.learningTarget,
    "description": props.evidenceId !== 0 ? props.evidence.data.description : '',
    "proficiency": props.evidenceId !== 0 ? props.evidence.data.proficiency : '',
    "date": props.evidenceId !== 0 ? props.evidence.data.addedOn : moment(dateOnPageLoad),
    "grade": props.evidenceId !== 0 ? props.evidence.data.grade : '',
    "notes": props.evidenceId !== 0 ? props.evidence.data.notes : '',
    "rosterId": props.rosterId,
    "teacherId": props.evidenceId !== 0 ? props.evidence.data.teacherId : myId(),
  }

  const { TextArea } = Input;
  const { getFieldDecorator } = props.form
  const { Option } = Select;
  const autoclearOn = false;
  const history = useHistory()
  const [inputs, setInputs] = useState(initialValues);
  const [teachersList, setTeachersList] = useState([]);
  const [teachersName, setTeachersName] = useState();
  const [proficiencyList, setProficiencyList] = useState([1, 2, 3, 'P', "IP"]);

  // var user = JSON.parse(localStorage.getItem('user')) ;
  let headers = { "Content-Type": "application/json" };
  const schoolID = user.schoolId
  const token = user.token;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  useEffect(() => {
    if(props.evidenceId === 0) 
    { ((user.role.toLowerCase() === 'admin') || (user.role.toLowerCase() === 'superadmin')) &&
      fetch(`${baseUrl}/Users/GetAll?schoolId=${schoolID}`, { headers })
        .then(res => res.json())
        .then(data => {
          let users = data.data
          let techers = users.filter(
            obj => obj.roleName.toLowerCase() === 'teacher'||  user.role.toLowerCase() === 'admin'&& user?.userId === obj.id && obj.roleName.toLowerCase() === 'admin',
          )
          setTeachersList([...techers])
          console.log(moment(dateOnPageLoad))
          console.log(dateOnPageLoad)
        }).catch((e) => {
          message.error(`${Messages.unHandledErrorMsg}`)
          history.replace({ pathname: '/', state: { isActive: true } })
        });
      }    
      else{
        fetchTeacherName()
      }  
  }, [props.studentId, props.categoryId, props.learningTarget])

  const fetchTeacherName = async () =>{
    debugger
    await fetch(`${baseUrl}/Users/GetAll?schoolId=1`, { headers })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      let users = data.data
      let techers = users.filter(
        obj => obj.roleName.toLowerCase() === 'teacher'||  user.role.toLowerCase() === 'admin'&& user?.userId === obj.id && obj.roleName.toLowerCase() === 'admin',
      )
      setTeachersList([...techers])
    }).catch((e) => {
      message.error(`${Messages.unHandledErrorMsg}`)
      history.replace({ pathname: '/', state: { isActive: true } })
    });
    var res = await fetch(`${baseUrl}/Users/Get?id=${parseInt(props.evidence.data.teacherId)}&schoolId=1`, {headers},)
    let data = await res.json()
    var fullName = data.data.firstName + ' ' + data.data.lastName;
    setTeachersName(fullName)
    console.log(initialValues.date)
  }

  const handleChangeInputs = e => {
    let { name, value } = e.target;
    setInputs(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    // debugger;
    props.form.validateFields((err, values) => {
      if (!err) {
        const requestMetadata = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(inputs),
        }
        console.log(inputs)
        fetch(`${baseUrl}/LearningTargetEvidences/Save`, requestMetadata)
          .then(res => res.json())
          .then(data => {
            if (data.statusCode === 200) {
              message.success('Evidence is added successfully !!')
              console.log("res", data);
              console.log('target', data.data)
              props.form.resetFields()
              props.handleGetAllEvidence();
            } else if (data.statusCode === 208) {
              console.log("res", data);
              message.warning(data.message)
            } else {
              console.log("res", data);
              message.info(data.message)
            }
          })
      }
    })
    // console.log("inputs",inputs);
  }

  const onDateChange = (field, value) => {
    if (value) {
      value = value._d.toISOString()
      setInputs({
        ...inputs,
        [field]: value,
      });
    }
  };

  return (
    <div>
      <Form
        name="basic"
        labelCol={{span: 8}}
        wrapperCol={{span: 16}}
        initialValues={{remember: true}}
        onSubmit={handleSubmit}
        autoComplete="off">
        <Form.Item label="Description" name="description">
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: 'Please enter your description!',
              },
            ],
            initialValue: inputs.description,
          })(
            <TextArea
              rows={4}
              name="description"
              value={inputs.description}
              onChange={handleChangeInputs}
              placeholder="Enter your Description"
            />,
          )}
        </Form.Item>

        <Form.Item label="Proficiency" name="proficiency">
          {getFieldDecorator('proficiency', {
            rules: [
              {
                required: true,
                message: 'Please select proficiency!',
              },
            ],
            initialValue: inputs.proficiency,
          })(
            <Select
              value="Select"
              onChange={value =>
                setInputs({...inputs, proficiency: value.toString()})
              }
              name="proficiency"
              style={{width: 120}}>
              {proficiencyList &&
                proficiencyList.map((proficiency, key) => (
                  <Option key={key} value={proficiency}>
                    {' '}
                    {proficiency}
                  </Option>
                ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Grade" name="grade">
          {getFieldDecorator('grade', {
            rules: [
              // {
              //   required: true,
              //   message: 'Please input grade!',
              // },
            ],
            initialValue: inputs.grade,
          })(
            <Input
              name="grade"
              value={inputs.grade}
              onChange={handleChangeInputs}
            />,
          )}
        </Form.Item>

        <Form.Item label="Date">
          {getFieldDecorator('date', {
            rules: [
              {
                required: true,
                message: 'Please select  date!',
              },
            ],
            initialValue : moment(initialValues.date)
          })(
            <DatePicker
              format="MM-DD-YYYY"
              value={inputs.date}
              placeholder="Date"
              onChange={value => onDateChange('date', value)}
              allowClear={autoclearOn}
            />,
          )}
        </Form.Item>

        <Form.Item label="Notes" name="notes">
          {getFieldDecorator('notes', {
            rules: [
              // {
              //   required: true,
              //   message: 'Please enter here text!',
              // },
            ],
            initialValue: inputs.notes,
          })(
            <TextArea
              rows={4}
              name="notes"
              value={inputs.notes}
              onChange={handleChangeInputs}
              placeholder="Please enter here text"
            />,
          )}
        </Form.Item>

        {user.role.toLowerCase() === 'teacher' ? (
          <Form.Item label="Teacher Name" name="teacherId">
            {getFieldDecorator('teacherId', {
              rules: [],
              initialValue: user.name,
            })(<Input disabled type="text" name="teacherId" />)}
          </Form.Item>
        ) : (
          <Form.Item label="Teacher Name" name="teacherId">
            {getFieldDecorator('teacherId', {
              rules: [
                {
                  required: true,
                  message: 'Please select teacher name!',
                },
              ],
              initialValue : teachersName
            })(
              <Select
                initialValue="Select"
                onChange={value => setInputs({...inputs, teacherId: value})}
                name="teacherId">
                {teachersList &&
                  teachersList.map((teacher, key) => (
                    <Option key={key} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName}
                    </Option>
                  ))}
              </Select>,
            )}
          </Form.Item>
        )}

        <Form.Item wrapperCol={{offset: 8, span: 16}}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}



export default Form.create()(AddEvidence)

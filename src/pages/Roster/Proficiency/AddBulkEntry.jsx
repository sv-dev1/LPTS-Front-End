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
const baseUrl = process.env.REACT_APP_BASE_URL
var user = JSON.parse(localStorage.getItem('user'));
function AddBulkEntry(props) {
  let myId = () => {
    let myID = 0
    if (user.role.toLowerCase() === 'teacher') {
      myID = user.userId;
    }
    return myID;
  }



  const initialValues = {
    "studentId": props.studentId,
    "categoryId": props.categoryId,
    "learningTarget": props.learningTarget,
    "description": '',
    "proficiency": '',
    "date": '',
    "grade": "",
    "notes": "",
    "rosterId": props.rosterId,
    "teacherId": myId(),
  }
  const { TextArea } = Input;
  const { getFieldDecorator } = props.form
  const { Option } = Select;
  const autoclearOn = false;
  const history = useHistory()
  const [inputs, setInputs] = useState(initialValues);
  const [teachersList, setTeachersList] = useState([]);
  const [proficiencyList, setProficiencyList] = useState(['P', "IP", "Reset to default"]);
  // var user = JSON.parse(localStorage.getItem('user')) ;
  let headers = { "Content-Type": "application/json" };
  const schoolID = user.schoolId
  const token = user.token;
  console.log("token", token)
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  useEffect(() => {
    ((user.role.toLowerCase() === 'admin') || (user.role.toLowerCase() === 'superadmin')) &&
      fetch(`${baseUrl}/Users/GetAll?schoolId=${schoolID}`, { headers })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          let users = data.data
          debugger
          // let techers = users.filter(
          //   obj => obj.roleName.toLowerCase() === 'teacher'||  user.role.toLowerCase() === 'admin'&& user?.userId === obj.id && obj.roleName.toLowerCase() === 'admin',
          // )
          let techers = users.filter(
            obj => obj.roleName.toLowerCase() === 'teacher'||  user.role.toLowerCase() === 'admin'&& user?.userId === obj.id && obj.roleName.toLowerCase() === 'admin',
          )
          //Check to include Logged in admin too here
          setTeachersList([...techers])
          //  dispatch(addAllSubjects(data.data))
          console.log('users', data.data)
        }).catch((e) => {
          message.error(`${Messages.unHandledErrorMsg}`)
          console.log('teachers', e)

          history.replace({ pathname: '/', state: { isActive: true } })
        });

  }, [props.studentId, props.categoryId, props.learningTarget])

  const handleChangeInputs = e => {
    let { name, value } = e.target;

    setInputs(prevData => ({ ...prevData, [name]: value }))
  }


  const handleSubmit = e => {
    e.preventDefault()
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
              message.success('Evidence and status added/updated successfully !!')
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
          fetch(`${baseUrl}/LearningTargets/BulkEntry?rosterId=${inputs.rosterId}&status=${inputs.proficiency}`, requestMetadata)
          .then(res => res.json())
          .then(data => {
          }).catch(e=>{
            console.log(e)        
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
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onSubmit={handleSubmit}
        autoComplete="off"
      >


<Form.Item
          label="Target Proficiency"
          name="proficiency"

        >
          {getFieldDecorator('proficiency', {
            rules: [
              {
                required: true,
                message: 'Please select proficiency!',
              },
            ],

          })
            (<Select

              value="Select"
              onChange={value => setInputs({ ...inputs, proficiency: value.toString() })}
              name='proficiency' style={{ width: 120 }}
            >
              {

                proficiencyList && proficiencyList.map((proficiency, key) => (
                  <Option key={key} value={proficiency}> {proficiency}</Option>
                ))}
            </Select>)}
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: 'Please enter your description!',
              },
            ],
          })
            (<TextArea rows={4} name="description" value={inputs.description}
              onChange={handleChangeInputs} placeholder="Enter your Description" />)}
        </Form.Item>

        <Form.Item
          label="Grade"
          name="grade"
        >
          {getFieldDecorator('grade', {
            rules: [
              // {
              //   required: true,
              //   message: 'Please input grade!',
              // },
            ],
          })(
            <Input name="grade" value={inputs.grade} onChange={handleChangeInputs} />,
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
          })(
            <DatePicker
              format="MM-DD-YYYY"
              setFieldsValue={inputs.date}
              placeholder="Date"
              onChange={(value) => onDateChange("date", value)}
              allowClear={autoclearOn}
            />

          )}
          </Form.Item> 

        <Form.Item
          label="Notes"
          name="notes"
        >
          {getFieldDecorator('notes', {
            rules: [
              // {
              //   required: true,
              //   message: 'Please enter here text!',
              // },
            ],

          })
            (<TextArea rows={4} name="notes" value={inputs.notes} onChange={handleChangeInputs} placeholder="Please enter here text" />)}
        </Form.Item>

        {user.role.toLowerCase() === 'teacher' ? (
          <Form.Item label="Teacher Name" name="teacherId">
            {getFieldDecorator('teacherId', {
              rules: [
              ],
              initialValue: user.name
            })(
              <Input
                disabled
                type="text"
                name="teacherId"

              />,
            )}
          </Form.Item>
        ) : (<Form.Item label="Teacher Name" name="teacherId">
          {getFieldDecorator('teacherId', {
            rules: [
              {
                required: true,
                message: 'Please select teacher name!',
              },
            ],
          })(
            <Select
              initialValue="Select"
              onChange={value => setInputs({ ...inputs, teacherId: value })}
              name="teacherId">
              {teachersList &&
                teachersList.map((teacher, key) => (
                  <Option key={key} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </Option>
                ))}
            </Select>,
          )}
        </Form.Item>)}


        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}



export default Form.create()(AddBulkEntry)

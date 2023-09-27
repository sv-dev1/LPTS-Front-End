import React, { useState, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom";
import Messages from '../../../Message/Message';
import { DatePicker } from 'antd';
import {
  Checkbox,
  Form,
  Select,
  Input,
  Button,
  message,
  Radio
} from 'antd'
import $ from 'jquery';
import MultipleSelect from 'multiple-select'



const baseUrl = process.env.REACT_APP_BASE_URL
var user = JSON.parse(localStorage.getItem('user'));
function AddReport(props) {
  let myId = () => {
    let myID = 0
    if (user.role.toLowerCase() === 'teacher') {
      myID = user.userId;
    }
    return myID;
  }
  const initialValues = {
    "notes": false,
    "rosterId": props.rosterId ? props.rosterId : 212,
    "pacing": false,
    "isNotes": false,
    "createdBy": user.userId,
    "teacherId": myId(),
    "reportName": '',
    "comprehensive": false
  }

  const { TextArea } = Input;
  const { getFieldDecorator } = props.form
  const { Option } = Select;
  const autoclearOn = false;
  const history = useHistory()
  const [inputs, setInputs] = useState(initialValues);
  const [teachersList, setTeachersList] = useState([]);
  const [studentList, setStudentListList] = useState([]);
  const [allStudentsID , setAllStudentsID] = useState([])
  const [subjectList, setSubjectList] = useState([])
  const [allSubjectsID , setAllSubjectsID] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [disableDates, setDisableDates] = useState(false);

  const [dates, setDates] = useState({ startDate: '', endDate: '' })

  // var user = JSON.parse(localStorage.getItem('user')) ;
  let headers = { "Content-Type": "application/json" };
  const schoolID = user.schoolId
  const token = user.token;
  console.log("token", token)
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

const fetchAllSubject = ()=>{
  fetch(`${baseUrl}/Subjects/GetAllActive?schoolId=${parseInt(schoolID)}`, {
    headers,
  })
    .then(res => res.json())
    .then(data => {
      setSubjectList([...data.data])
      let  allIds = data?.data?.map(value =>parseInt( value.id))      
      allIds && setAllSubjectsID(allIds)
    })
}
 
  useEffect(()=>{
  fetchAllSubject();
  },[])

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
            obj => obj.roleName.toLowerCase() === 'teacher' || user.role.toLowerCase() === 'admin' && user?.userId === obj.id && obj.roleName.toLowerCase() === 'admin',
          )
          // let studentsList = users.filter(
          //   obj => obj.roleName.toLowerCase() === 'student',
          // )
        //  console.log("props?.studentsList;" , props?.studentsList)
          let studentsList =  props?.studentsList? props?.studentsList : [];
          setStudentListList(studentsList)
          setAllStudentsID(studentsList?.map(obj=>parseInt(obj.id)))
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
    let { name, value, type } = e.target;
    type === 'checkbox' && (value = !value)
    setInputs(prevData => ({ ...prevData, [name]: value }))
    if(e.target.checked == true && e.target.name == 'comprehensive')
    {
      let date = new Date();
      console.log(date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+'T'+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'.'+date.getMilliseconds()+'Z')
      setDisableDates(true)
      // inputs.startDate = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+'T'+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'.'+date.getMilliseconds()+'Z';
      // inputs.endDate = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+'T'+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'.'+date.getMilliseconds()+'Z';
      inputs.startDate = "0001-01-01T07:08:05.719Z"
      inputs.endDate = "0001-01-01T07:08:05.719Z"
      let allIdList = allSubjectsID
      setSelectedSubjects(allIdList)
    }
    else if(e.target.checked == false && e.target.name == 'comprehensive')
    {
      setDisableDates(false)
      setSelectedSubjects([])
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
   let sendToData =  {
      "studentId": selectedStudents.map(d=> parseInt(d)) ,
      "subjectId":selectedSubjects.map(d=> parseInt(d)),
      "startDate": inputs.startDate,
      "endDate": inputs.endDate,
      "createdBy": inputs.createdBy,
      "teacherId": [
        inputs.teacherId
      ],
      "pacing": inputs.pacing,
      "notes": inputs.isNotes,
      "reportName": inputs.reportName,
      "comprehensive": inputs.comprehensive
    }
    console.log(sendToData)
    props.form.validateFields((err, values) => {
      if (!err) {
        const requestMetadata = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(sendToData),
        }

        fetch(`${baseUrl}/Reports/Save`, requestMetadata)
          .then(res => res.json())
          .then(data => {
            if (data.statusCode === 200) {
              message.success('Report/Reports is/are Created successfully !!')
              props.form.resetFields()
             
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
  } 

  const handleOptionChange = (event) => {
    const{ value ,name}= event.target;
    console.log(event.target)
    let allIdList = name == 'students'?allStudentsID:allSubjectsID
    let selectIdList = name == 'students'?selectedStudents:selectedSubjects
    if (value === "all") {
      if( selectIdList.length < allIdList.length){
        name== 'students'?setSelectedStudents(allIdList):setSelectedSubjects(allIdList) ;      
      }else{
        name== 'students'?setSelectedStudents([]):setSelectedSubjects([]) ;
      }    
    } else {
      const index =  (name== 'students')?selectedStudents.indexOf(parseInt(value)):selectedSubjects.indexOf(parseInt(value));       
      if (index > -1) {
        name== 'students'? setSelectedStudents((prev) =>prev.filter(id => id !== parseInt(value))): setSelectedSubjects((prev) =>prev.filter(id => id !== parseInt(value))) ;
      } else {
        name== 'students'? setSelectedStudents(prev =>[...prev, parseInt(value)]):  setSelectedSubjects(prev =>[...prev, parseInt(value)]);     
      }
    }
  }

  const disabledStartDate = startValue => {
    const endValue = dates.endDate;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  const disabledEndDate = endValue => {
    const startValue = dates.startDate;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  const onChange = (field, value) => {
    if (value) {
      setDates({ ...dates, [field]: value })
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

        <Form.Item label="Report Name" name="reportName">
          {getFieldDecorator('reportName', {
            rules: [
              {
                required: true,
                message: 'Please Enter Report Name!',
              },
            ],
          })(
            <Input
              type="text"
              name="reportName"
              value={inputs.reportName}
              onChange={handleChangeInputs}
            />,
          )}
        </Form.Item>
      
        <Form.Item
          label="Students"
          name="Students"
        >
          {getFieldDecorator('Students', {
            rules: [
              {
                required: true,
                message: 'Please add Students!',
              },
            ], selectedStudents
          })
            (<div id="dropdown-container">
              <select id='multiple-checkboxes' name='students' multiple={true} value={selectedStudents} onChange={handleOptionChange}>
                <option value="all">All</option>
                {studentList.map(student => (
                  <option style={selectedStudents?.includes(student.id)?{color:"blue"}:{}} key={student.id} value={student.id}>
                     {student.firstName} {student.lastName}
                    
                   </option>
                ))}
              </select>
            </div>)}
        </Form.Item>

        <Form.Item
          name="Comprehensive"
          label="Comprehensive"
          valuePropName="checked"
          wrapperCol={{ span: 16 }}>
          <Checkbox
            className="input-check"
            onChange={handleChangeInputs}
            name="comprehensive"
            checked={inputs.comprehensive}
            value={inputs.comprehensive}>              
          </Checkbox>
        </Form.Item>

        <Form.Item label="Start Date">
          {disableDates ? getFieldDecorator('startDate', {
            rules: [
              {
                required: false,
                message: 'Please select start date!',
              },
            ],
          })(
            <DatePicker
              disabledDate={disabledStartDate}
              format="MM-DD-YYYY"
              setFieldsValue={inputs.startDate}
              placeholder="Start"
              onChange={(value) => onChange("startDate", value)}
              allowClear={autoclearOn}
              disabled={disableDates}
            />
          ):getFieldDecorator('startDate', {
            rules: [
              {
                required: true,
                message: 'Please select start date!',
              },
            ],
          })(
            <DatePicker
              disabledDate={disabledStartDate}
              format="MM-DD-YYYY"
              setFieldsValue={inputs.startDate}
              placeholder="Start"
              onChange={(value) => onChange("startDate", value)}
              allowClear={autoclearOn}
              disabled={disableDates}
            />
          )}
        </Form.Item>

        <Form.Item label="End Date">
          {disableDates ? getFieldDecorator('endDate', {
            rules: [
              {
                required: false,
                message: 'Please select end date!',
              },
            ],
          })(
            <DatePicker
              disabledDate={disabledEndDate}
              setFieldsValue={inputs.endDate}
              format="MM-DD-YYYY"
              placeholder="End"
              onChange={(value) => onChange("endDate", value)}
              allowClear={autoclearOn}
              disabled={disableDates}
            />
          ) : getFieldDecorator('endDate', {
            rules: [
              {
                required: true,
                message: 'Please select end date!',
              },
            ],
          })(
            <DatePicker
              disabledDate={disabledEndDate}
              setFieldsValue={inputs.endDate}
              format="MM-DD-YYYY"
              placeholder="End"
              onChange={(value) => onChange("endDate", value)}
              allowClear={autoclearOn}
              disabled={disableDates}
            />
          )}
        </Form.Item>    

        <Form.Item
          name="Pacing"
          label="Pacing"
          valuePropName="checked"
          wrapperCol={{ span: 16 }}>
          <Checkbox
            className="input-check"
            onChange={handleChangeInputs}
            name="pacing"
            checked={inputs.pacing}
            value={inputs.pacing}></Checkbox>
        </Form.Item>

        <Form.Item
          label="Subjects"
          name="Subjects"
        >
          {disableDates ? getFieldDecorator('subjects', {
            rules: [
              {
                required: false,
                message: 'Please select Subjects!',
              },
            ],
          })
            (<div id="dropdown-container">
              <select multiple={true} value={selectedSubjects} onChange={handleOptionChange}>
                <option value="all">All</option>
                {subjectList.map(Sdata => (
                  <option style={selectedSubjects?.includes(Sdata.id)?{color:"blue"}:{}} key={Sdata.id} value={Sdata.id}> {Sdata.subjectName} </option>
                ))}
              </select>
            </div>) : getFieldDecorator('subjects', {
            rules: [
              {
                required: true,
                message: 'Please select Subjects!',
              },
            ],
          })
            (<div id="dropdown-container">
              <select multiple={true} value={selectedSubjects} onChange={handleOptionChange}>
                <option value="all">All</option>
                {subjectList.map(Sdata => (
                  <option style={selectedSubjects?.includes(Sdata.id)?{color:"blue"}:{}} key={Sdata.id} value={Sdata.id}> {Sdata.subjectName} </option>
                ))}
              </select>
            </div>)}
        </Form.Item>
        
        <Form.Item
          label="Notes"
          valuePropName="checked"
          wrapperCol={{ span: 16 }}>
          <Checkbox
            className="input-check"
            onChange={handleChangeInputs}
            name="isNotes"
            checked={inputs.isNotes}
            value={inputs.isNotes}></Checkbox>
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

export default Form.create()(AddReport)

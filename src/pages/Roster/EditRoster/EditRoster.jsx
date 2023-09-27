import {
  Form,
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  Radio,
  Select,
  message,
  Table,
} from 'antd'
import {addAllSubjects, deleteAllSubjects} from '../../Slicers/subjectSlice'
import React, {useState, useEffect} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import isJwtTokenExpired from 'jwt-check-expiry'
import Layouts from '../../components/Layouts'
import {PlusOutlined} from '@ant-design/icons'
import AddPhase from '../phase/AddPhase'
import Messages from '../../Message/Message';
const baseUrl = process.env.REACT_APP_BASE_URL
// var myAccount = JSON.parse(localStorage.getItem('user'))
// const schoolID = myAccount.schoolId

const EditRoster = props => {
  const history = useHistory()
  const location = useLocation()
  var RosterId = 0
  const {TextArea, Search} = Input
  if (props.rosterId) {
    RosterId = props.rosterId
  } else {
    RosterId = location.state.rosterId
  }

  console.log('props', props)
  const {Option} = Select
  const initialValues = {
    id: RosterId,
    rosterName: '',
    teacherId: 0,
    teacher: '',
    rotation: 0,
    block: 0,
    advisory: false,
    teamId: 0,
    team: '',
    subjectId: 0,
    subject: '',
    phaseId: 0,
    phase: '',
    categoryId: 0,
    category: '',
    learningTargetFrom: 0,
    learningTargetTo: 0,
    learningYearFrom: 0,
    learningYearTo: 0,
  }
  const [inputs, setInputs] = useState(initialValues)
  const [subjectList, setSubjectList] = useState([])
  const [phaseList, setPhaseList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [phaseLength, setPhaseLength] = useState(1)
  const [categoryLength, setcategoryLength] = useState(1)
  const [learningTargetList, SetLearningTargetList] = useState([])
  const [learningTargetToList, setLearningTargetToList] = useState([])
  const [teachersList, setTeachersList] = useState([])
  const [studentsList, setstudentList] = useState([])
  const [schoolData, setSchoolData] = useState({})
  const [learningYearTo, setLearningYearTo] = useState(0)
  const [teams, setTeams] = useState([])
  const [filterTable, setFilterTable] = useState([])
  const [studentAddedInRoster, setStudentAddedInRoster] = useState([])
  const [studentremovedFromRoster, setStudentRemovedFromRoster] = useState([])
  const [studentIdCount, setStudentIdCount] = useState(0)
  const [studentIds, setStudentIds] = useState([])
  const [radioFilterValue, setRadioFilterValue] = useState('Enrolled')
  const [rosterDetail, setRosterDetail] = useState(RosterId)
  const [openRadioOption, setOpenRadioOption] = useState(true)
  const [dateRangeList, setDateRangeList] = useState([])
  const [value, setValue] = useState('Enrolled')
  const [number, setNumber] = useState(0)
  const {getFieldDecorator} = props.form
  const [categoryID, setCategoryID] = useState(0)
  var myAccount = JSON.parse(localStorage.getItem('user'))
  const schoolID = myAccount.schoolId

  let showTable = true
  let headers = {'Content-Type': 'application/json'}
  const token = myAccount.token
  if (myAccount) {
    var isExpired = isJwtTokenExpired(myAccount.token)

    if (isExpired) {
     message.error(`${Messages.unHandledErrorMsg}`)
      history.replace({pathname: '/', state: {isActive: true}})
    }
  } else {
   message.error(`${Messages.unHandledErrorMsg}`)
    history.replace({pathname: '/', state: {isActive: true}})
  }
  console.log('token', token)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  //var subject = useSelector(state => state.subject.value)
  const dispatch = useDispatch()
  console.log('StudentsList', studentsList)

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      render: (item, record, index) => <>{index + 1}</>,
    },
    {
      title: 'Student Name',
      dataIndex: 'fullname',
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: 'Learning Year',
      dataIndex: 'year',
      sorter: (a, b) => a.year - b.year,
      render: (text, record) => <span>{record.year} </span>,
    },
    {
      title: 'Last Completed Target',
      dataIndex: 'lastCompletedTarget',
      sorter: (a, b) => a.lastCompletedTarget - b.lastCompletedTarget,
      render: (text, record) => <span>{record.lastCompletedTarget} </span>,
    },

    {
      title: 'Action',
      dataIndex: 'user',
      key: 'action',
      render: (id, record) => (
        <>
          {record.isEnrolled === true ? (
            <Button
              type="danger"
              onClick={() => handleRemoveStudentsInRoster(record.id, value)}>
              Remove
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => handleAddStudentsInRoster(record.id)}>
              Add
            </Button>
          )}
        </>
      ),
    },
  ]

  useEffect(() => {
    // Rosters/Get?id=5
    debugger
    var user = JSON.parse(localStorage.getItem('user'))
    console.log(user.schoolId)
    !isExpired &&
      fetch(
        `${baseUrl}/Rosters/Get?id=${parseInt(inputs.id)}&schoolId=${
          user.schoolId
        }`,
        {headers},
      )
        .then(res => res.json())
        .then(data => {
          console.log('RosterData', data.data)
          setCategoryID(data.data.Roster.categoryId)
          setInputs(data.data.Roster)
          //data.data.Students
          let studentsData = data.data.Students
          setStudentAddedInRoster([...studentsData])
          // let showTable = true;
          //  props.handleTable(studentsData, columns , showTable)
          let length = studentsData.length
          setStudentIdCount(length)
          console.log(' Edit Roster', studentsData)
        })
        .catch(e => {
         message.error(`${Messages.unHandledErrorMsg}`)
          //history.replace({pathname: '/', state: {isActive: true}})
        })
    fetch(`${baseUrl}/Users/GetAll?schoolId=${user.schoolId}`, {headers})
      .then(res => res.json())
      .then(data => {
        console.log(data)
        let users = data.data
        let techers = users.filter(
          obj => obj.roleName.toLowerCase() === 'teacher',
        )
        setTeachersList([...techers])
      })

    fetch(
      `${baseUrl}/RotationDateRanges/GetAll?schoolId=${parseInt(schoolID)}`,
      {headers},
    )
      .then(res => res.json())
      .then(data => {
        let DateRanges = []
        data.data.map(dateRange => {
          let start = new Date(dateRange.startDate)
            .toLocaleString()
            .split(',')[0]
          let end = new Date(dateRange.endDate).toLocaleString().split(',')[0]

          dateRange.mergedDate = start.concat('-', end)
        })
        setDateRangeList([...data.data])
        //  dispatch(addAllSubjects(data.data))
        console.log('DateRanges', data.data)
      })

    !isExpired &&
      fetch(`${baseUrl}/Schools/Get?id=${parseInt(schoolID)}`, {headers})
        .then(res => res.json())
        .then(data => {
          setSchoolData(data.data)
          //  dispatch(addAllSubjects(data.data))
          console.log('SchoolData', data.data)
        })
        .catch(e => {
         message.error(`${Messages.unHandledErrorMsg}`)
          console.log('Schools', e)

          //history.replace({pathname: '/', state: {isActive: true}})
        })
    // fetch(
    //   `${baseUrl}/Progressions/GetAll?categoryId=${
    //     inputs.categoryId
    //   }&schoolId=${parseInt(schoolID)}`,
    //   {
    //     headers,
    //   },
    // )
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log(data)
    //     let targetInAscending = data.data.reverse()
    //     SetLearningTargetList([...targetInAscending])
    //   })

    // fetch(`${baseUrl}/Users/GetAll`, { headers })
    //     .then(res => res.json())
    //     .then(data => {
    //         let users = data.data
    //         let techers = users.filter(
    //             obj => obj.roleName.toLowerCase() === 'teacher',
    //         )
    //         setTeachersList([...techers])
    //         //  dispatch(addAllSubjects(data.data))
    //         console.log('addAllSubjects', data.data)
    //     }).catch((e) => {
    //        message.error(`${Messages.unHandledErrorMsg}`)
    //         history.replace({ pathname: '/', state: { isActive: true } })
    //     })

    // // (subject.length === 0) &&
    // fetch(`${baseUrl}/Subjects/GetAll`, { headers })
    //     .then(res => res.json())
    //     .then(data => {
    //         setSubjectList([...data.data])
    //         //  dispatch(addAllSubjects(data.data))
    //         console.log('addAllSubjects', data.data)
    //     }).catch((e) => {
    //        message.error(`${Messages.unHandledErrorMsg}`)
    //         history.replace({ pathname: '/', state: { isActive: true } })
    //     })

    // // (subject.length > 0) &&
    // //   setSubjectList([...subject])
    // // Schools/Get?id=1
    // let id = 1
    // fetch(`${baseUrl}/Schools/Get?id=${parseInt(id)}`, { headers })
    //     .then(res => res.json())
    //     .then(data => {
    //         setSchoolData(data.data)
    //         //  dispatch(addAllSubjects(data.data))
    //         console.log('addAllSubjects', data.data)
    //     }).catch((e) => {
    //        message.error(`${Messages.unHandledErrorMsg}`)
    //         history.replace({ pathname: '/', state: { isActive: true } })
    //     })

    // fetch(`${baseUrl}/Teams/GetAll`, { headers })
    //     .then(res => res.json())
    //     .then(data => {
    //         setTeams(data.data)
    //         //  dispatch(addAllSubjects(data.data))
    //         console.log('addAllSubjects', data.data)
    //     }).catch((e) => {
    //        message.error(`${Messages.unHandledErrorMsg}`)
    //         history.replace({ pathname: '/', state: { isActive: true } })
    //     })
  }, [])

  console.log(inputs)

  useEffect(() => {
    categoryID &&
      fetch(
        `${baseUrl}/Progressions/GetAll?categoryId=${parseInt(
          categoryID,
        )}&schoolId=${parseInt(schoolID)}`,
        {headers},
      )
        .then(res => res.json())
        .then(data => {
          //    debugger
          console.log('progressions', data.data)
          let targetInAscending = data.data.reverse()
          console.log(targetInAscending)
          SetLearningTargetList([...targetInAscending])
          let length = data.data.length
          //  setcategoryLength(parseInt(length))
        })
        .catch(e => {
         message.error(`${Messages.unHandledErrorMsg}`)
          history.replace({pathname: '/', state: {isActive: true}})
        })
  }, [categoryID])

  // useEffect(() => {
  //   console.log('enter in table')
  //   fetch(
  //     `${baseUrl}/Users/GetStudentByLearningYear?startYear=${parseInt(
  //       inputs.learningYearFrom,
  //     )}&endYear=${parseInt(inputs.learningYearTo)}`,
  //     {headers},
  //   )
  //     .then(res => res.json())
  //     .then(data => {
  //       let students = data.data
  //       students = students.filter(
  //         obj => obj.roleName.toLowerCase() === 'student',
  //       )
  //       setstudentList([...students])
  //       props.handleTable(students, columns)
  //       //  dispatch(addAllSubjects(data.data))
  //       console.log('students', students)
  //     })
  // }, [inputs.learningYearFrom, inputs.learningYearTo])

  // console.log('Year', learningYearTo)

  useEffect(() => {
    console.log('enter in effect', studentAddedInRoster)
    // let showTable = true;
    props.handleTable(studentAddedInRoster, columns, showTable)
  }, [studentIdCount])

  useEffect(() => {
    console.log('number', number)
    inputs.categoryId && handleFilters(radioFilterValue)
  }, [number])

  useEffect(() => {
    debugger
    let length = learningTargetList.length
    //setInputs({...inputs, learningTargetTo: inputs.learningTargetFrom})
    let index = learningTargetList.findIndex(
      data => data.progression.learningTarget === inputs.learningTargetFrom,
    )
    if (index >= 0) {
      let learningTargetTo = learningTargetList.slice(index, length)
      setLearningTargetToList([...learningTargetTo])
    }
  }, [inputs.learningTargetFrom])

  useEffect(() => {
    // debugger
    let length =
      parseInt(schoolData.studentYears) - parseInt(inputs.learningYearFrom) + 1
    setInputs({...inputs, learningYearTo: inputs.learningYearFrom})
    setLearningYearTo(length)
  }, [inputs.learningYearFrom])

  //  addStudentId
  // const addStudentId = (id)=>{
  //   let studentIdList =  inputs.studentIds;
  //   let index = studentIdList.findIndex((element) => element === id);

  //   if(index > -1){
  //     setInputs({...inputs })
  //   } else{
  //     studentIdList.push(id);
  //     setInputs({...inputs , studentIds:studentIdList})
  //     let length = studentIdList.length;
  //     setStudentIdCount(length)
  // props.handleStudentList(studentsList)
  //props.handleCount();
  // }

  //}

  // remove student id from  list
  // const removeStudentId = (id)=>{
  //   let studentIdList =  inputs.studentIds;
  //   studentIdList = studentIdList.filter(element => element !== parseInt(id));

  // console.log("studentIdList" ,studentIdList)
  //     setInputs({...inputs , studentIds:studentIdList})
  //     let length = studentIdList.length;
  //     setStudentIdCount(length)

  // }

  const studentAvailable = id => {
    let studentIdList = studentIds

    let index = studentIdList.findIndex(element => element === id)
    if (parseInt(index) == -1) {
      return false
    } else {
      return true
    }
  }

  const onSearch = value => {
    const searchRes = studentsList.filter(o =>
      Object.keys(o).some(k =>
        String(o[k]).toLowerCase().includes(value.toLowerCase()),
      ),
    )
    console.log(searchRes)
    setFilterTable([...searchRes])
    // setFilterTable([...searchRes])
  }

  // handle Submit
  const handleSubmit = e => {
    inputs.block = parseInt(inputs.block)
    inputs.categoryName = inputs.category
    inputs.subjectName = inputs.subject
    inputs.phaseName = inputs.phase

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
        fetch(`${baseUrl}/Rosters/Save`, requestMetadata)
          .then(res => res.json())
          .then(data => {
            if (data.statusCode === 200) {
              message.success('Roster updated successfully !!')
              console.log('target', data.data)
              let id = data.data.id
              //  setRosterDetail(id)
            } else if (data.statusCode === 208) {
              message.warning(data.message)
            } else {
              message.info(data.message)
            }
          })
      }
    })
  }

  const handleStudents = () => {
    fetch(
      `${baseUrl}/Users/GetStudentForRoster?categoryId=${parseInt(
        inputs.categoryId,
      )}&startLearningTarget=${parseInt(
        inputs.learningTargetFrom,
      )}&endLearningTarget=${parseInt(
        inputs.learningTargetTo,
      )}&startYear=${parseInt(inputs.learningYearFrom)}&endYear=${parseInt(
        inputs.learningYearTo,
      )}`,
      {headers},
    )
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 200) {
          console.log('target', data.data)
          setstudentList([...data.data])
          let students = data.data
          props.handleTable(students, columns)
        } else if (data.statusCode === 208) {
          message.warning(data.message)
        } else {
          message.info(data.message)
        }
      })
  }

  const handleAddStudentsInRoster = id => {
    const requestMetadata = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }

    fetch(
      `${baseUrl}/RosterStudents/Save?rosterId=${parseInt(
        inputs.id,
      )}&studentId=${parseInt(id)}`,
      requestMetadata,
    )
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 200) {
          message.success('Student is added to Roster successfully !!')
          console.log('added student ', data.data)
          let n = number + 1
          setNumber(n)
          // let ids = [...studentIds , id]
          // setStudentIds([...ids])
          // debugger;
          // let foundIndex = studentAddedInRoster.findIndex(student => student.id == id);
          // let updateEnrollmentStatus = studentAddedInRoster[foundIndex]
          // let students = studentAddedInRoster
          // students[foundIndex] = {...updateEnrollmentStatus , isEnrolled: true } ;
          // setStudentAddedInRoster([...students])
          // props.handleTable(students, columns , showTable)
          //  handleFilters(radioFilterValue)
          //   setStudentAddedInRoster([...studentsInRoster])
          // let sudentsInRoster = [...studentAddedInRoster, id]
          // setStudentAddedInRoster(sudentsInRoster);
          // let length = students.length;
          // setStudentIdCount(length)
        } else if (data.statusCode === 208) {
          message.warning(data.message)
        } else {
          message.info(data.message)
        }
      })
  }

  const dateRangeChange = e => {
    fetch(
      `${baseUrl}/RotationDateRanges/Get?id=${e}&schoolId=${parseInt(
        schoolID,
      )}`,
      {headers},
    )
      .then(res => res.json())
      .then(data => {
        let start = new Date(data.data.startDate).toLocaleString().split(',')[0]
        let end = new Date(data.data.endDate).toLocaleString().split(',')[0]
        console.log(start)
        console.log(end)
        inputs.dateRangeId = e
        inputs.dateRange = start + '-' + end
      })
  }

  const handleRemoveStudentsInRoster = (id, radioVal) => {
    console.log(id, radioVal)
    console.log(inputs)
    const requestMetadata = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }

    fetch(
      `${baseUrl}/RosterStudents/Delete?rosterId=${parseInt(
        rosterDetail,
      )}&studentId=${parseInt(id)}`,
      requestMetadata,
    )
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 200) {
          // handleFilters(radioVal)
          message.success('Student is removed from Roster successfully !!')
          // setValue(radioVal)
          let n = number + 1
          setNumber(n)
          //  let ids = studentIds.filter((element)=> element !== id);
          // setStudentIds([...ids])
          //  setStudentAddedInRoster([...studentsInRoster])
          // debugger;
          // let foundIndex = studentAddedInRoster.findIndex(student => student.id == id);
          // let updateEnrollmentStatus = studentAddedInRoster[foundIndex]
          // let students = studentAddedInRoster
          // students[foundIndex] = {...updateEnrollmentStatus , isEnrolled: true } ;
          // setStudentAddedInRoster([...students])
          // props.handleTable(students, columns , showTable)
          // let length = students.length;
          // setStudentIdCount(length)
        } else if (data.statusCode === 208) {
          message.warning(data.message)
        } else {
          message.info(data.message)
        }
      })
  }

  const handleFilters = enrollmentValue => {
    //debugger
    console.log('enrollmentValue', enrollmentValue)
    let enrollment = enrollmentValue
    setValue(enrollmentValue)
    setRadioFilterValue(enrollment)
    let data = {
      schoolId: schoolID,
      rosterId: inputs.id,
      categoryId: inputs.categoryId,
      startLearningTarget: inputs.learningTargetFrom,
      endLearningTarget: inputs.learningTargetTo,
      startYear: inputs.learningYearFrom,
      endYear: inputs.learningYearTo,
      enrollment: enrollment,
    }
    const requestMetadata = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
    console.log('Radio value', enrollment)
    fetch(`${baseUrl}/Users/GetStudentForRoster`, requestMetadata)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.statusCode === 200) {
          // console.log('target',data.data)
          // setstudentList([...data.data])
          let studentsData = data.data
          setStudentAddedInRoster([...studentsData])
          // let showTable = true;
          props.handleTable(studentsData, columns, showTable)
          // let length = studentsData.length;
          // setStudentIdCount(length)
          //  let students = data.data;
          //  let showtable =  true;
          //  props.handleTable(students, columns , showtable)
        } else if (data.statusCode === 208) {
          message.warning(data.message)
        } else {
          message.info(data.message)
        }
      })
  }
  console.log(inputs)
  const handleChangeInputs = e => {
    let {name, value} = e.target
    if (name === 'learningTarget' && inputs.learningTarget === '') {
      // var check = isNaN(parseInt(value))
      message.info('This field must be number.')
    }
    // advisory
    name === 'advisory' && (value = !value)
    setInputs(prevData => ({...prevData, [name]: value}))
  }

  const handleAddPhase = () => {
    history.replace({pathname: '/manage-phase', state: {isActive: true}})
  }

  const handleAddCategory = () => {
    history.replace({pathname: '/manage-category', state: {isActive: true}})
  }
  console.log('inputs', inputs)

  return (
    <>
      <Form
        name="basic"
        labelCol={{span: 24}}
        wrapperCol={{span: 24}}
        initialValues={{remember: true}}
        onSubmit={handleSubmit}
        autoComplete="off">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={24} lg={6}>
            <Form.Item label="Teacher Name" name="teacherId">
              {getFieldDecorator('teacherId', {
                rules: [],
                initialValue: inputs.teacher,
              })(
                <Select
                  value={inputs.teacher ? inputs.teacher : 'select'}
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
          </Col>
          <Col xs={24} sm={12} md={24} lg={6}>
            <Form.Item label="Date Range" name="rotation">
              {getFieldDecorator('rotation', {
                rules: [],
                initialValue: inputs.dateRange,
              })(
                <Select
                  placeholder="Select"
                  onChange={dateRangeChange}
                  name="dateRangeId">
                  {dateRangeList &&
                    dateRangeList.map((range, key) => (
                      <Option key={key} value={range.id}>
                        {range.mergedDate}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={24} lg={6}>
            <Form.Item label="Block" name="block">
              {getFieldDecorator('block', {
                rules: [],
                initialValue: inputs.block,
              })(
                <Input
                  type="number"
                  name="block"
                  value={inputs.rotation}
                  onChange={handleChangeInputs}
                />,
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={24} lg={6}>
            <Form.Item label="Team Name" name="teamId">
              {getFieldDecorator('teamId', {
                rules: [],
                initialValue: inputs.team,
              })(
                <Select
                  defaultValue={inputs.team}
                  onChange={value => setInputs({...inputs, teamId: value})}
                  name="teamId">
                  {teams.length &&
                    teams.map((team, key) => (
                      <Option key={key} value={team.id}>
                        {team.teamName}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={24} lg={6}>
            <Form.Item label="Roster Name" name="rosterName">
              {getFieldDecorator('rosterName', {
                rules: [],
                initialValue: inputs.rosterName,
              })(
                <Input
                  disabled
                  type="text"
                  name="rosterName"
                  value={inputs.rosterName}
                  onChange={handleChangeInputs}
                />,
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={24} lg={6}>
            <Form.Item label="Subject" name="subjectId">
              {getFieldDecorator('subjectId', {
                rules: [],
                initialValue: inputs.subject,
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={24} lg={6}>
            <Form.Item label="Phase" name="phaseId">
              {getFieldDecorator('phaseId', {
                rules: [],
                initialValue: inputs.phase,
              })(<Input disabled />)}
              {phaseLength > 0 ? (
                ''
              ) : (
                <Button
                  onClick={handleAddPhase}
                  type="primary"
                  style={{marginLeft: '10px'}}>
                  <PlusOutlined /> Add
                </Button>
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={24} lg={6}>
            <Form.Item label="Category" name="categoryId">
              {getFieldDecorator('categoryId', {
                rules: [],
                initialValue: inputs.category,
              })(<Input disabled />)}
              {categoryLength > 0 ? (
                ''
              ) : (
                <Button
                  onClick={handleAddCategory}
                  type="primary"
                  style={{marginLeft: '10px'}}>
                  <PlusOutlined /> Add
                </Button>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          {studentAddedInRoster.length == 0 && (
            <Col xs={24} sm={12} md={24} lg={6}>
              <Form.Item
                label="Learning Target From"
                style={{margin: '3px 0 3px'}}>
                {getFieldDecorator('learningTargetFrom', {
                  rules: [],
                  initialValue: inputs.learningTargetFrom,
                })(
                  <Select
                    onChange={value =>
                      setInputs({...inputs, learningTargetFrom: value})
                    }
                    name="learningTargetFrom">
                    {learningTargetList &&
                      learningTargetList.map((learningTargetList, key) => (
                        <Option
                          key={key}
                          value={learningTargetList.progression.learningTarget}>
                          {learningTargetList.progression.learningTarget}
                        </Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          )}
          {studentAddedInRoster.length == 0 && (
            <Col xs={24} sm={12} md={24} lg={6}>
              <Form.Item
                label="Learning Target To"
                style={{margin: '3px 0 3px'}}>
                {getFieldDecorator('learningTargetTo', {
                  initialValue: inputs.learningTargetTo,
                })(
                  <Select
                    onChange={value =>
                      setInputs({...inputs, learningTargetTo: value})
                    }
                    name="learningTargetTo">
                    {learningTargetToList.length > 0 &&
                      learningTargetToList.map((learningTargetTo, key) => (
                        <Option
                          key={key}
                          value={learningTargetTo.progression.learningTarget}>
                          {learningTargetTo.progression.learningTarget}
                        </Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          )}
          {studentAddedInRoster.length != 0 && (
            <Col xs={24} sm={12} md={24} lg={6}>
              <Form.Item
                label="Learning Target From"
                style={{margin: '3px 0 3px'}}>
                {getFieldDecorator('learningTargetFrom', {
                  rules: [],
                  initialValue: inputs.learningTargetFrom,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          )}
          {studentAddedInRoster.length != 0 && (
            <Col xs={24} sm={12} md={24} lg={6}>
              <Form.Item
                label="Learning Target To"
                style={{margin: '3px 0 3px'}}>
                {getFieldDecorator('learningTargetTo', {
                  initialValue: inputs.learningTargetTo,
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          )}
          <Col xs={24} sm={24} md={24} lg={6} className="line-height">
            <Form.Item label="Learning Year From" style={{margin: '3px 0 3px'}}>
              {getFieldDecorator('learningYearFrom', {
                initialValue: inputs.learningYearFrom,
              })(
                <Select
                  placeholder="Select"
                  defaultValue={inputs.learningYearFrom}
                  onChange={value =>
                    setInputs({...inputs, learningYearFrom: value})
                  }
                  name="learningYearFrom">
                  {schoolData &&
                    [...Array(schoolData.studentYears)].map((role, key) => (
                      <Option key={key} value={key + 1}>
                        {key + 1}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={6} className="line-height">
            <Form.Item label="Learning Year To" style={{margin: '3px 0 3px'}}>
              {getFieldDecorator('learningYearTo', {
                initialValue: inputs.learningYearTo,
              })(
                <Select
                  placeholder="Select"
                  defaultValue={inputs.learningYearTo}
                  onChange={value =>
                    setInputs({...inputs, learningYearTo: value})
                  }
                  name="learningYearTo">
                  {learningYearTo &&
                    [...Array(learningYearTo)].map((role, key) => (
                      <Option key={key} value={inputs.learningYearFrom + key}>
                        {inputs.learningYearFrom + key}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Advisory"
          valuePropName="checked"
          wrapperCol={{span: 16}}>
          <Checkbox
            className="input-check"
            onChange={handleChangeInputs}
            name="advisory"
            checked={inputs.advisory}
            value={inputs.advisory}></Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{offset: 6, span: 16}}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>

        {/* {rosterDetail && <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                    <Button type="primary" onClick={handleStudents}>
                        Add Studentds
                    </Button>
                </Form.Item>} */}
      </Form>
      <div
        className="section-top-heading"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        {/* <Search className="search-input" placeholder="input search text" onChange={e => onSearch(e.target.value)} onSearch={onSearch} /> */}
        <strong>Enrollment</strong>
        {openRadioOption && (
          <Radio.Group
            onChange={e => handleFilters(e.target.value)}
            value={value}
            defaultValue={'Enrolled'}>
            <Radio value="All">All</Radio>
            <Radio value="Enrolled">Enrolled</Radio>
            <Radio value="Unenrolled">Unenrolled</Radio>
          </Radio.Group>
        )}
      </div>
    </>
  )
}

export default Form.create()(EditRoster)

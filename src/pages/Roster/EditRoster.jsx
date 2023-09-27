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
  Spin,
  Popconfirm,
} from 'antd'
import {addAllSubjects, deleteAllSubjects} from '../../Slicers/subjectSlice'
import React, {useState, useEffect} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import isJwtTokenExpired from 'jwt-check-expiry'
import Layouts from '../../components/Layouts'
import Messages from '../../Message/Message'
import {PlusOutlined} from '@ant-design/icons'
import AddPhase from '../phase/AddPhase'
const baseUrl = process.env.REACT_APP_BASE_URL
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

  const {Option} = Select
  const intialSelectValue = {
    subjectName: 'Select',
    phaseName: 'Select',
    categoryName: 'Select',
  }
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
  const [selectData, setSelectData] = useState(intialSelectValue)
  const [subjectList, setSubjectList] = useState([])
  const [phaseList, setPhaseList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [phaseLength, setPhaseLength] = useState(1)
  const [categoryLength, setcategoryLength] = useState(1)
  const [learningTargetList, SetLearningTargetList] = useState([])
  const [learningTargetToList, setLearningTargetToList] = useState([])
  const [teachersList, setTeachersList] = useState([])
  const [studentsList, setstudentList] = useState([])
  const [schoolData, setSchoolData] = useState({studentYears: 0})
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
  const [subject, setSubject] = useState()
  const [phase, setPhase] = useState()
  const [category, setCategory] = useState()
  const [role, setRole] = useState()

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
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const dispatch = useDispatch()

  const columns = [
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      render: (item, record, index) => <>{index + 1}</>,
    },
    {
      title: 'Student Name',
      dataIndex: 'fullname',
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
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
      title: 'Enrolled With',
      dataIndex: 'enrolledWith',
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
          ) : record.enrolledWith === null ||
            record.enrolledWith === 'Progress was Back-Filled' ? (
            <Button
              type="primary"
              onClick={() => handleAddStudentsInRoster(record.id)}>
              Add
            </Button>
          ) : (
            <Popconfirm
              title="This student is already enrolled in a roster for this rotation with the same learning criteria. Do you want to add this student to your roster?"
              onConfirm={() => handleAddStudentsInRoster(record.id)}>
              <Button type="primary">Add</Button>
            </Popconfirm>
          )}
        </>
      ),
    },
  ]

  useEffect(() => {
    var user = JSON.parse(localStorage.getItem('user'))
    setRole(user.role)
    !isExpired &&
      fetch(
        `${baseUrl}/Rosters/Get?id=${parseInt(inputs.id)}&schoolId=${
          user.schoolId
        }`,
        {headers},
      )
        .then(res => res.json())
        .then(data => {
          setCategoryID(data.data.Roster.categoryId)
          setInputs(data.data.Roster)
          setSubject(data.data.Roster.subject)
          setPhase(data.data.Roster.phase)
          setCategory(data.data.Roster.category)
          let studentsData = data.data.Students
          setStudentAddedInRoster([...studentsData])
          let length = studentsData.length
          setStudentIdCount(length)
          let n = number + 1
          setNumber(n)
        })
        .catch(e => {
          message.error(`${Messages.unHandledErrorMsg}`)
        })

    user.role.toLowerCase() != 'teacher' &&
      fetch(`${baseUrl}/Users/GetAllActive?schoolId=${user.schoolId}`, {
        headers,
      })
        .then(res => res.json())
        .then(data => {
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
            .toLocaleString('en-US')
            .split(',')[0]
          let end = new Date(dateRange.endDate)
            .toLocaleString('en-US')
            .split(',')[0]
          dateRange.mergedDate = start.concat('-', end)
        })
        setDateRangeList([...data.data])
      })

    !isExpired &&
      fetch(`${baseUrl}/Schools/Get?id=${parseInt(schoolID)}`, {headers})
        .then(res => res.json())
        .then(data => {
          setSchoolData(data.data)
        })
        .catch(e => {
          message.error(`${Messages.unHandledErrorMsg}`)
        })

    !isExpired &&
      fetch(`${baseUrl}/Teams/GetAllActive?schoolId=${parseInt(schoolID)}`, {
        headers,
      })
        .then(res => res.json())
        .then(data => {
          setTeams(data.data)
        })
        .catch(e => {
          message.error(`${Messages.unHandledErrorMsg}`)
        })

    fetch(`${baseUrl}/Subjects/GetAllActive?schoolId=${parseInt(schoolID)}`, {
      headers,
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSubjectList(() => [...data.data])
        }
        data.length > 0 &&
          setInputs(prevData => ({
            ...prevData,
            subjectId: data.data[0].id,
            subjectName: data.data[0].subjectName,
          }))
      })
  }, [])

  useEffect(() => {
    inputs.categoryId &&
      fetch(
        `${baseUrl}/Progressions/GetAll?categoryId=${parseInt(
          inputs.categoryId,
        )}&schoolId=${parseInt(schoolID)}`,
        {headers},
      )
        .then(res => res.json())
        .then(data => {
          let targetInAscending = data.data.reverse()
          SetLearningTargetList([...targetInAscending])
          let length = data.data.length

          if (length && inputs.learningTargetFrom && inputs.learningTargetTo) {
            let index = targetInAscending.findIndex(
              data =>
                data.progression.learningTarget === inputs.learningTargetFrom,
            )
            if (index >= 0) {
              setLearningTargetToList([...targetInAscending])
            }
          }
        })
        .catch(e => {
          message.error(`${Messages.unHandledErrorMsg}`)
          history.replace({pathname: '/', state: {isActive: true}})
        })
  }, [inputs.categoryId])

  useEffect(() => {
    props.handleTable(studentAddedInRoster, columns, showTable)
  }, [studentIdCount])

  useEffect(() => {
    console.log('number', number)
    inputs.categoryId && handleFilters(radioFilterValue)
    !inputs.categoryId && inputs.advisory && handleFilters(radioFilterValue)
  }, [number])

  useEffect(() => {
    let length =
      parseInt(schoolData.studentYears) - parseInt(inputs.learningYearFrom) + 1
    schoolData.studentYears && setLearningYearTo(length)
  }, [schoolData.studentYears])

  useEffect(() => {
    let length = learningTargetList.length
    let index = learningTargetList.findIndex(
      data => data.progression.learningTarget === inputs.learningTargetFrom,
    )
    if (
      inputs.learningTargetTo &&
      inputs.learningTargetTo > inputs.learningTargetFrom
    ) {
    } else {
      setInputs({...inputs, learningTargetTo: inputs.learningTargetFrom})
    }
    if (index >= 0) {
      let learningTargetTo = learningTargetList.slice(index, length)
      setLearningTargetToList([...learningTargetTo])
    }
  }, [inputs.learningTargetFrom])

  useEffect(() => {
    let length =
      parseInt(schoolData.studentYears) - parseInt(inputs.learningYearFrom) + 1
    if (inputs.learningYearTo) {
      if (inputs.learningYearTo < inputs.learningYearFrom) {
        setInputs({...inputs, learningYearTo: inputs.learningYearFrom})
      }
      setLearningYearTo(length)
    } else {
      setInputs({...inputs, learningYearTo: inputs.learningYearFrom})
      setLearningYearTo(length)
    }
  }, [inputs.learningYearFrom])

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
    const searchRes = learningTargetList.filter(
      o =>
        Object.keys(o.progression).some(k =>
          String(o.progression[k]).toLowerCase().includes(value.toLowerCase()),
        ) ||
        Object.keys(o).some(k =>
          String(o[k]).toLowerCase().includes(value.toLowerCase()),
        ),
    )
    console.log(searchRes)
    setFilterTable([...searchRes])
    // setFilterTable([...searchRes])
  }

  const handleSubmit = e => {
    console.log(inputs)
    inputs.block = parseInt(inputs.block)
    inputs.categoryName = category
    inputs.subjectName = subject
    inputs.phaseName = phase

    e.preventDefault()
    if (inputs.subjectName === 'Select') {
      inputs.subjectId = 0
      inputs.subjectName = ''
    }
    if (inputs.phaseName === 'Select') {
      inputs.phaseId = 0
      inputs.phaseName = ''
    }
    if (inputs.categoryName === 'Select') {
      inputs.categoryId = 0
      inputs.categoryName = ''
    }
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
        //  console.log(inputs)
        fetch(`${baseUrl}/Rosters/Save`, requestMetadata)
          .then(res => res.json())
          .then(data => {
            if (data.statusCode === 200) {
              message.success('Roster updated successfully !!')
              console.log('target', data.data)
              //    let id = data.data.id
              //  setRosterDetail(id)
              let n = number + 1
              setNumber(n)
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
      )}&studentId=${parseInt(id)}&schoolId=${parseInt(schoolID)}`,
      requestMetadata,
    )
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 200) {
          message.success('Student is added to roster successfully !!')
          let n = number + 1
          setNumber(n)
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
        let start = new Date(data.data.startDate)
          .toLocaleString('en-US')
          .split(',')[0]
        let end = new Date(data.data.endDate)
          .toLocaleString('en-US')
          .split(',')[0]
        console.log(start)
        console.log(end)
        inputs.dateRangeId = e
        inputs.dateRange = start + '-' + end
      })
  }

  const handleRemoveStudentsInRoster = (id, radioVal) => {
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
      )}&studentId=${parseInt(id)}&schoolId=${parseInt(schoolID)}`,
      requestMetadata,
    )
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 200) {
          message.success('Student is removed from roster successfully !!')
          let n = number + 1
          setNumber(n)
        } else if (data.statusCode === 208) {
          message.warning(data.message)
        } else {
          message.info(data.message)
        }
      })
  }

  const handleFilters = enrollmentValue => {
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
      rotationDateRange: inputs.dateRange,
    }
    const requestMetadata = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
    var rosterUrl = '/Users/GetStudentForRoster'
    if (inputs.advisory) {
      rosterUrl = '/Users/GetStudentForAdvisoryRoster'
    }
    fetch(`${baseUrl + rosterUrl}`, requestMetadata)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.statusCode === 200) {
          let studentsData = data.data
          setStudentAddedInRoster([...studentsData])
          props.handleTable(studentsData, columns, showTable)
        } else if (data.statusCode === 208) {
          message.warning(data.message)
        } else {
          message.info(data.message)
        }
      })
  }

  const handleChangeInputs = e => {
    let {name, value} = e.target
    if (name === 'learningTarget' && inputs.learningTarget === '') {
      message.info('This field must be number.')
    }
    name === 'advisory' && (value = !value)
    setInputs(prevData => ({...prevData, [name]: value}))
  }

  const handleAddPhase = () => {
    history.replace({pathname: '/manage-phase', state: {isActive: true}})
  }

  const handleAddCategory = () => {
    history.replace({pathname: '/manage-category', state: {isActive: true}})
  }

  const subjectChange = e => {
    fetch(
      `${baseUrl}/Subjects/Get?id=${parseInt(e)}&schoolId=${parseInt(
        schoolID,
      )}`,
      {
        headers,
      },
    )
      .then(res => res.json())
      .then(data => {
        console.log(data.data.subjectName)
        inputs.subjectId = data.data.id
        inputs.subjectName = data.data.subjectName
        inputs.phaseId = 0
        inputs.phaseName = 'Select'
        inputs.categoryName = 'Select'
        inputs.categoryId = 0
        inputs.learningTargetFrom = 0
        inputs.learningTargetTo = 0
        setInputs({...inputs})
        setSubject(data.data.subjectName)

        setSelectData(prevData => ({
          subjectName: data.data.subjectName,
          phaseName: 'Select',
          categoryName: 'Select',
          learningTargetFrom: 0,
          learningTargetTo: 0,
        }))
      })
    fetch(
      `${baseUrl}/Phases/GetAll?subjectId=${parseInt(e)}&schoolId=${parseInt(
        schoolID,
      )}`,
      {
        headers,
      },
    )
      .then(res => res.json())
      .then(data => {
        console.log('data----', data)
        setPhaseList([...data.data])
        SetLearningTargetList([])
        data.length > 0 &&
          setInputs(prevData => ({
            ...prevData,
            phaseId: 0,
            phaseName: 'Select',
          }))
        // setSelectData((prevData)=>({...prevData , phaseName:"Select" , categoryName:"Select"}))
      })
    console.log(phaseList)
    setPhase('Select')
    setCategory('Select')
  }

  const phaseChange = e => {
    fetch(
      `${baseUrl}/Phases/Get?id=${parseInt(e)}&schoolId=${parseInt(schoolID)}`,
      {
        headers,
      },
    )
      .then(res => res.json())
      .then(data => {
        inputs.phaseId = data.data.id
        inputs.phaseName = data.data.phaseName
        inputs.categoryId = 0
        inputs.learningTargetFrom = 0
        inputs.learningTargetTo = 0
        setInputs({...inputs})
        setPhase(data.data.phaseName)

        setSelectData(prevData => ({
          ...prevData,
          phaseName: data.data.phaseName,
          categoryName: 'Select',
          learningTargetFrom: 0,
          learningTargetTo: 0,
        }))
      })
    fetch(
      `${baseUrl}/Categories/GetAll?subjectId=${parseInt(
        inputs.subjectId,
      )}&phaseId=${parseInt(e)}&schoolId=${parseInt(schoolID)}`,
      {headers},
    )
      .then(res => res.json())
      .then(data => {
        data.length > 0 &&
          setInputs(prevData => ({
            ...prevData,
            categoryId: 0,
            categoryName: 'Select',
          }))
        setCategoryList([...data.data])
        SetLearningTargetList([])
      })
  }

  const categoryChange = e => {
    fetch(
      `${baseUrl}/Categories/Get?id=${parseInt(
        parseInt(e),
      )}&schoolId=${parseInt(schoolID)}`,
      {
        headers,
      },
    )
      .then(res => res.json())
      .then(data => {
        inputs.categoryId = data.data.id
        inputs.categoryName = data.data.categoryName
        inputs.learningTargetFrom = 0
        inputs.learningTargetTo = 0
        setInputs({...inputs})
        setCategory(data.data.categoryName)
        setSelectData(prevData => ({
          ...prevData,
          categoryName: data.data.categoryName,
        }))
      })

    inputs.categoryId &&
      fetch(
        `${baseUrl}/Progressions/GetAll?categoryId=${parseInt(
          inputs.categoryId,
        )}&schoolId=${parseInt(schoolID)}`,
        {
          headers,
        },
      )
        .then(res => res.json())
        .then(data => {
          let targetInAscending = data.data.reverse()
          SetLearningTargetList([...targetInAscending])
          setLearningTargetToList([])
        })
  }

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
          {role != 'Teacher' && (
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
          )}
          {role == 'Teacher' && (
            <Col xs={24} sm={12} md={24} lg={6}>
              <Form.Item label="Teacher Name" name="teacherId">
                {getFieldDecorator('teacherId', {
                  rules: [],
                  initialValue: inputs.teacher,
                })(<Input value={inputs.teacher} />)}
              </Form.Item>
            </Col>
          )}
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

        <Row gutter={[16, 24]} style={{display: 'inline'}}>
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
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={24} lg={6}>
            <Form.Item label="Roster Name" name="rosterName">
              {getFieldDecorator('rosterName', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter roster name!',
                  },
                ],
                initialValue: inputs.rosterName,
              })(
                <Input
                  type="text"
                  name="rosterName"
                  value={inputs.rosterName}
                  onChange={handleChangeInputs}
                />,
              )}
            </Form.Item>
          </Col>
          {inputs.advisory && (
            <Col xs={24} sm={12} md={24} lg={6}>
              <Form.Item label="Subject" name="subjectId">
                <Select
                  value={subject}
                  onChange={subjectChange}
                  name="subjectId">
                  {subjectList &&
                    subjectList.map((subject, key) => (
                      <Select.Option key={key} value={subject.id}>
                        {subject.subjectName}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          )}
          {!inputs.advisory && (
            <Col xs={24} sm={12} md={24} lg={6}>
              <Form.Item label="Subject" name="subjectId">
                {getFieldDecorator('subjectId', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select subject!',
                    },
                  ],
                  initialValue: inputs.subject,
                })(
                  <Select
                    disabled
                    defaultValue={inputs.subject}
                    onChange={value => setInputs({...inputs, subjectId: value})}
                    name="subjectId">
                    {subjectList &&
                      subjectList.map((subject, key) => (
                        <Option key={key} value={subject.id}>
                          {subject.subjectName}
                        </Option>
                      ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          )}

          {inputs.advisory && (
            <Col xs={24} sm={12} md={24} lg={6}>
              <Form.Item label="Phase" name="phaseId">
                <Select value={phase} onChange={phaseChange} name="phaseId">
                  {phaseList &&
                    phaseList.map((data, key) => (
                      <Select.Option key={key} value={data.phase.id}>
                        {data.phase.phaseName}
                      </Select.Option>
                    ))}
                </Select>
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
          )}
          {!inputs.advisory && (
            <Col xs={24} sm={12} md={24} lg={6}>
              <Form.Item label="Phase" name="phaseId">
                {getFieldDecorator('phaseId', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select phase!',
                    },
                  ],
                  initialValue: inputs.phase,
                })(
                  <Select
                    disabled
                    defaultValue={inputs.phase}
                    onChange={value => setInputs({...inputs, phaseId: value})}
                    name="phaseId">
                    {phaseList &&
                      phaseList.map((data, key) => (
                        <Option key={key} value={data.phase.id}>
                          {data.phase.phaseName}
                        </Option>
                      ))}
                  </Select>,
                )}
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
          )}

          {inputs.advisory && (
            <Col xs={24} sm={12} md={24} lg={6}>
              <Form.Item label="Category" name="categoryId">
                <Select
                  name="categoryId"
                  value={category}
                  onChange={categoryChange}>
                  {categoryList &&
                    categoryList.map((data, key) => (
                      <Option key={key} value={data.category.id}>
                        {data.category.categoryName}
                      </Option>
                    ))}
                </Select>
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
          )}
          {!inputs.advisory && (
            <Col xs={24} sm={12} md={24} lg={6}>
              <Form.Item label="Category" name="categoryId">
                {getFieldDecorator('categoryId', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select category!',
                    },
                  ],
                  initialValue: inputs.category,
                })(
                  <Select disabled name="categoryId">
                    {categoryList &&
                      categoryList.map((data, key) => (
                        <Option key={key} value={data.category.id}>
                          {data.category.categoryName}
                        </Option>
                      ))}
                  </Select>,
                )}
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
          )}
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={24} lg={6}>
            <Form.Item
              label="Learning Target From"
              style={{margin: '3px 0 3px'}}>
              {getFieldDecorator('learningTargetFrom', {
                rules: [],
                initialValue: inputs.learningTargetFrom,
              })(
                <Select
                  defaultValue={inputs.learningTargetFrom}
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
          <Col xs={24} sm={12} md={24} lg={6}>
            <Form.Item label="Learning Target To" style={{margin: '3px 0 3px'}}>
              {getFieldDecorator('learningTargetTo', {
                initialValue: inputs.learningTargetTo,
              })(
                <Select
                  defaultValue={inputs.learningTargetTo}
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
                  {learningYearTo > 0 &&
                    [...Array(parseInt(learningYearTo))].map((role, key) => (
                      <Option key={key} value={inputs.learningYearFrom + key}>
                        {inputs.learningYearFrom + key}
                      </Option>
                    ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item wrapperCol={{offset: 6, span: 16}}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>

      <div
        className="section-top-heading"
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
        <strong style={{marginBottom: '4px'}}>Enrollment</strong>
        {openRadioOption && (
          <Radio.Group
            onChange={e => handleFilters(e.target.value)}
            value={value}
            defaultValue={'Enrolled'}>
            <Radio value="Filter">Filter on Learning Targets</Radio>
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

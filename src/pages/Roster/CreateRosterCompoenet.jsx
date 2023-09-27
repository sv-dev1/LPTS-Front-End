import {
  Alert,
  Form,
  Input,
  Button,
  Row,
  Col,
  Checkbox,
  Radio,
  Select,
  message,
  Table,
  Popconfirm,
  Spin,
} from 'antd'
import {addAllSubjects, deleteAllSubjects} from '../../Slicers/subjectSlice'
import React, {useState, useEffect} from 'react'
import {useHistory, Link} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import isJwtTokenExpired from 'jwt-check-expiry'
import Messages from '../../Message/Message'
import Layouts from '../../components/Layouts'
import {PlusOutlined} from '@ant-design/icons'
import AddPhase from '../phase/AddPhase'
const baseUrl = process.env.REACT_APP_BASE_URL

const CreateRoster = props => {
  const history = useHistory()
  const {TextArea} = Input

  const {Option} = Select
  const intialSelectValue = {
    subjectName: 'Select',
    phaseName: 'Select',
    categoryName: 'Select',
  }
  const initialValues = {
    id: 0,
    rosterName: '',
    teacherId: 0,
    rotation: 0,
    block: 0,
    advisory: true,
    teamId: 0,
    subjectId: 0,
    subjectName: '',
    phaseId: 0,
    phaseName: '',
    categoryId: 0,
    categoryName: '',
    learningTargetFrom: 0,
    learningTargetTo: 0,
    learningYearFrom: 0,
    learningYearTo: 0,
    advisory: false,
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
  const [schoolData, setSchoolData] = useState({})
  const [learningYearTo, setLearningYearTo] = useState(0)
  const [teams, setTeams] = useState([])
  const [filterTable, setFilterTable] = useState([])
  const [studentAddedInRoster, setStudentAddedInRoster] = useState([])
  const [studentIdCount, setStudentIdCount] = useState(0)
  const [rosterDetail, setRosterDetail] = useState('')
  const [radioFilterValue, setRadioFilterValue] = useState('Filter')
  const [showAlert, setShowAlert] = useState(false)
  const [addbtnDisable, setAddbtnDisable] = useState(false)
  const [dateRangeList, setDateRangeList] = useState([])
  const [activeSession, setActiveSession] = useState({id: 0})
  const [number, setNumber] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const {getFieldDecorator} = props.form
  var myAccount = JSON.parse(localStorage.getItem('user'))
  let headers = {'Content-Type': 'application/json'}
  const token = myAccount.token
  const schoolID = myAccount.schoolId
  console.log('token', token)
  if (myAccount) {
    var isExpired = isJwtTokenExpired(myAccount.token)

    if (isExpired) {
      // // debugger
      message.error(`${Messages.unHandledErrorMsg}`)
      history.replace({pathname: '/', state: {isActive: true}})
    }
  } else {
    //// debugger
    message.error(`${Messages.unHandledErrorMsg}`)
    history.replace({pathname: '/', state: {isActive: true}})
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  //var subject = useSelector(state => state.subject.value)
  const dispatch = useDispatch()
  console.log('StudentsList', studentsList)
  console.log('Nothin', props.olderRosterId)

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
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.year - b.year,
      render: (text, record) => <span>{record.year} </span>,
    },
    {
      title: 'Last Completed Target',
      dataIndex: 'lastCompletedTarget',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.lastCompletedTarget - b.lastCompletedTarget,
      render: (text, record) => <span>{record.lastCompletedTarget} </span>,
    },
    {
      title: 'Enrolled With',
      dataIndex: 'enrolledWith',
    },
    // {
    //   title: 'Email',
    //   dataIndex: 'email',
    //   key: 'email',

    // },
    // {
    //   title: 'Phone Number',
    //   dataIndex: 'phoneNumber',
    //   key: 'phoneNumber',
    // },
    // {
    //   title: 'Role',
    //   dataIndex: 'roleName',
    //   key: 'role',
    //    render: role =>  <Tag key={role}>
    //                         {role && role.toUpperCase()}
    //                     </Tag>

    // },
    // {
    //   title: 'Year',
    //   dataIndex: 'year',
    //   key: 'year',
    //   render: year => <p>{year ? year : ''}</p>
    // },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: status => <Tag color={status? "green" : "volcano"} key={status}>
    //                         {status ? "Active" : "Inactive" }
    //                      </Tag>,
    // },
    {
      title: 'Action',
      dataIndex: 'user',
      key: 'action',
      render: (id, record) => (
        //  (studentAvailable(record.id) === true) ||
        <>
          {record.isEnrolled === false ? (
            record.enrolledWith === null ||
            record.enrolledWith === 'Progress was Back-Filled' ? (
              <Button
                type="primary"
                onClick={() => handleAddStudentsInRoster(record.id)}>
                Add
              </Button>
            ) : (
              {
                ...(inputs.advisory ? (
                  <Popconfirm
                    title="This student has already been added in an Advisory roster for this School year. Are you sure you still want to add this student to your Roster ?"
                    onConfirm={() => handleAddStudentsInRoster(record.id)}>
                    <Button type="primary">Add</Button>
                  </Popconfirm>
                ) : (
                  <Popconfirm
                    title="This student has already been enrolled in a roster for this rotation with the same learning criteria. Are you sure you still want to add this student to your roster ?"
                    onConfirm={() => handleAddStudentsInRoster(record.id)}>
                    <Button type="primary">Add</Button>
                  </Popconfirm>
                )),
              }
            )
          ) : (
            'Added'
          )}
        </>
      ),
    },
  ]

  const getRotations = id => {
    !isExpired &&
      fetch(
        `${baseUrl}/RotationDateRanges/GetAll?sessionId=${parseInt(
          id,
        )}&schoolId=${parseInt(schoolID)}`,
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
          //  dispatch(addAllSubjects(data.data))
          console.log('DateRanges', data.data)
        })
        .catch(e => {
          //  // debugger
          message.error(`${Messages.unHandledErrorMsg}`)
          console.log('Teams', e)
          //history.replace({pathname: '/', state: {isActive: true}})
        })
  }

  const messageOnNOStudents = () => {
    return (
      <>
        <p>
          There is no students based on this condition. To add students to this
          roster, first you have to add students, then go to edit roster.
        </p>
        <Link to="/users-list"> Add Students </Link>
      </>
    )
  }

  useEffect(() => {
    !isExpired &&
      (myAccount.role.toLowerCase() === 'admin' ||
        myAccount.role.toLowerCase() === 'superadmin') &&
      fetch(`${baseUrl}/Users/GetAllActive?schoolId=${parseInt(schoolID)}`, {
        headers,
      })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          let users = data.data
          let techers = users.filter(
            obj =>
              obj.roleName.toLowerCase() === 'teacher' ||
              (myAccount.role.toLowerCase() === 'admin' &&
                myAccount?.userId === obj.id &&
                obj.roleName.toLowerCase() === 'admin'),
          )
          setTeachersList([
            ...techers,
            {id: 0, firstName: 'None', lastName: ''},
          ])
          //  dispatch(addAllSubjects(data.data))
          console.log('users', data.data)
        })
        .catch(e => {
          // debugger
          message.error(`${Messages.unHandledErrorMsg}`)
          console.log('teachers', e)

          //history.replace({pathname: '/', state: {isActive: true}})
        })

    // if user is teacher
    //  // debugger
    // (myAccount.role.toLowerCase() === 'teacher') && setInputs({...inputs , teacherId:myAccount.userId})

    // (subject.length === 0) &&
    !isExpired &&
      fetch(`${baseUrl}/Subjects/GetAllActive?schoolId=${parseInt(schoolID)}`, {
        headers,
      })
        .then(res => res.json())
        .then(data => {
          //   debugger
          if (data) {
            setSubjectList(() => [...data.data])
          }

          //  dispatch(addAllSubjects(data.data))
          data.length > 0 &&
            setInputs(prevData => ({
              ...prevData,
              subjectId: data.data[0].id,
              subjectName: data.data[0].subjectName,
            }))
          console.log('addAllSubjects', data.data)
        })
        .catch(e => {
          //   debugger
          message.error(`${Messages.unHandledErrorMsg}`)
          console.log('Subjects', e)
          //history.replace({pathname: '/', state: {isActive: true}})
        })

    // (subject.length > 0) &&
    //   setSubjectList([...subject])
    // Schools/Get?id=1
    // let id = 1;
    !isExpired &&
      fetch(`${baseUrl}/Schools/Get?id=${parseInt(schoolID)}`, {headers})
        .then(res => res.json())
        .then(data => {
          setSchoolData(data.data)
          //  dispatch(addAllSubjects(data.data))
          console.log('SchoolData', data.data)
        })
        .catch(e => {
          // debugger
          message.error(`${Messages.unHandledErrorMsg}`)
          console.log('Schools', e)

          //history.replace({pathname: '/', state: {isActive: true}})
        })

    !isExpired &&
      fetch(`${baseUrl}/Teams/GetAllActive?schoolId=${parseInt(schoolID)}`, {
        headers,
      })
        .then(res => res.json())
        .then(data => {
          setTeams(data.data)
          //  dispatch(addAllSubjects(data.data))
          console.log('addAllSubjects', data.data)
        })
        .catch(e => {
          //   debugger
          message.error(`${Messages.unHandledErrorMsg}`)
          console.log('Teams', e)
          //history.replace({pathname: '/', state: {isActive: true}})
        })
    // // debugger;

    // get active session
    !isExpired &&
      fetch(
        `${baseUrl}/SessionSettings/GetActiveSession?schoolId=${parseInt(
          schoolID,
        )}`,
        {headers},
      )
        .then(res => res.json())
        .then(data => {
          if (data.statusCode === 200) {
            // debugger
            let start = new Date(data.data.startDate)
              .toLocaleString('en-US')
              .split(',')[0]
            let end = new Date(data.data.endDate)
              .toLocaleString('en-US')
              .split(',')[0]

            data.data.mergedDate = start.concat('-', end)
            setActiveSession(data.data)
            getRotations(data.data.id)
          }
          //  dispatch(addAllSubjects(data.data))
          //  console.log('addAllSubjects', data.data)
        })
        .catch(e => {
          // debugger
          message.error(`${Messages.unHandledErrorMsg}`)
          //   console.log('Teams', e)
          //history.replace({pathname: '/', state: {isActive: true}})
        })
  }, [])

  useEffect(() => {
    console.log('inputs___', inputs)
  }, [inputs])

  useEffect(() => {
    //console.log('subjectName', inputs.subjectName)

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
          let length = data.data.length
          console.log('length', length)
          setPhaseLength(parseInt(length))
          setCategoryList([])
          //  setSelectData(prevData=>({...prevData}))
          //    inputs.learningTargetFrom
          data.length > 0 &&
            setInputs(prevData => ({
              ...prevData,
              phaseId: 0,
              phaseName: 'Select',
              categoryId: 0,
              categoryName: 'Select',
              learningTargetFrom: 0,
              learningTargetTo: 0,
            }))
          SetLearningTargetList([])
          console.log('addAllPhases', data.data)
        })
        .catch(e => {
          // debugger
          message.error(`${Messages.unHandledErrorMsg}`)
          history.replace({pathname: '/', state: {isActive: true}})
        })
  }, [inputs.subjectId])

  useEffect(() => {
    //  debugger
    inputs.subjectId &&
      inputs.phaseId &&
      fetch(
        `${baseUrl}/Categories/GetAll?subjectId=${parseInt(
          inputs.subjectId,
        )}&phaseId=${parseInt(inputs.phaseId)}&schoolId=${parseInt(schoolID)}`,
        {headers},
      )
        .then(res => res.json())
        .then(data => {
          console.log('category', data.data)
          setCategoryList([...data.data])
          SetLearningTargetList([])
          data.length > 0 &&
            setInputs(prevData => ({
              ...prevData,
              categoryId: 0,
              categoryName: 'Select',
              learningTargetFrom: 0,
              learningTargetTo: 0,
            }))
          setSelectData(prevData => ({...prevData}))
          let length = data.data.length
          setcategoryLength(parseInt(length))
        })
        .catch(e => {
          // debugger
          message.error(`${Messages.unHandledErrorMsg}`)
          history.replace({pathname: '/', state: {isActive: true}})
        })
  }, [inputs.phaseId])

  useEffect(() => {
    //  // debugger
    inputs.categoryId &&
      fetch(
        `${baseUrl}/Progressions/GetAllActive?categoryId=${parseInt(
          inputs.categoryId,
        )}&schoolId=${parseInt(schoolID)}`,
        {headers},
      )
        .then(res => res.json())
        .then(data => {
          // debugger
          console.log('progressions', data.data)
          let targetInAscending = data.data.reverse()
          console.log(targetInAscending)
          SetLearningTargetList([...targetInAscending])
          let length = data.data.length
          //  setcategoryLength(parseInt(length))
        })
        .catch(e => {
          // debugger
          message.error(`${Messages.unHandledErrorMsg}`)
          history.replace({pathname: '/', state: {isActive: true}})
        })
  }, [inputs.categoryId])

  useEffect(() => {
    // debugger
    let length = learningTargetList.length
    setInputs({...inputs, learningTargetTo: inputs.learningTargetFrom})
    let index = learningTargetList.findIndex(
      data =>
        data.progression.learningTarget === parseInt(inputs.learningTargetFrom),
    )
    if (index >= 0) {
      let learningTargetTo = learningTargetList.slice(index, length)
      setLearningTargetToList([...learningTargetTo])
    }
  }, [inputs.learningTargetFrom])

  useEffect(() => {
    // // debugger
    let length =
      parseInt(schoolData.studentYears) - parseInt(inputs.learningYearFrom) + 1
    setInputs({...inputs, learningYearTo: inputs.learningYearFrom})
    setLearningYearTo(length)
  }, [inputs.learningYearFrom])

  // useEffect(() => {
  //   console.log('enter in table')
  //   fetch(
  //     `${baseUrl}/Users/GetStudentByLearningYear?startYear=${parseInt(
  //       inputs.learningYearFrom,
  //     )}&endYear=${parseInt(inputs.learningYearTo)}&schoolId=${parseInt(schoolID)}`,
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

  console.log('Year', learningYearTo)

  useEffect(() => {
    props.handleTable(studentsList, columns)
  }, [studentIdCount])

  useEffect(() => {
    //console.log("number",number)
    inputs.categoryId && radioFilterValue && handleFilters(radioFilterValue)
    !inputs.categoryId &&
      inputs.advisory &&
      radioFilterValue &&
      handleFilters(radioFilterValue)
  }, [number])

  // on change of advisory checkbox
  useEffect(() => {
    if (inputs.advisory) {
      setInputs(prevData => ({
        ...prevData,
        dateRange: activeSession.mergedDate,
        dateRangeId: 0,
      }))
    }
  }, [inputs.advisory])

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
  const removeStudentId = id => {
    let studentIdList = inputs.studentIds
    studentIdList = studentIdList.filter(element => element !== parseInt(id))

    console.log('studentIdList', studentIdList)
    setInputs({...inputs, studentIds: studentIdList})
    let length = studentIdList.length
    setStudentIdCount(length)
  }

  const studentAvailable = id => {
    let studentIdList = studentAddedInRoster
    //// debugger;
    let index = studentIdList.findIndex(element => element === id)
    if (parseInt(index) == -1) {
      return true
    } else {
      return false
    }
  }

  const getSelectValue = name => {
    // // debugger;
    if (name === 'phase') {
      return inputs.phaseName
    }
  }
  // -------------------------------------------------------------------
  // Add clipboard students in roster

  // const AddClipBoardRoster  = (newRosterId , olderRosterId)=>{
  //   const requestMetadata = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify(allInputs),
  //   }
  //   //    console.log(allInputs)

  //   fetch(`${baseUrl}/Rosters/CopyRoster?CopyFromRosterId=3`, requestMetadata)
  // }

  // handle Submit
  const handleSubmit = e => {
    e.preventDefault()
    // console.log(inputs)
    var allInputs = {...inputs}
    allInputs.schoolId = schoolID
    allInputs.block = parseInt(allInputs.block)

    rosterDetail && (allInputs.id = rosterDetail)

    if (myAccount.role.toLowerCase() === 'teacher') {
      allInputs.teacherId = myAccount.userId
    }
    if (allInputs.subjectName.toLowerCase() === 'select') {
      allInputs.subjectId = 0
      allInputs.subjectName = ''
    }
    if (allInputs.phaseName.toLowerCase() === 'select') {
      allInputs.phaseId = 0
      allInputs.phaseName = ''
    }
    if (allInputs.categoryName.toLowerCase() === 'select') {
      allInputs.categoryId = 0
      allInputs.categoryName = ''
    }
    allInputs.learningYearFrom = allInputs.learningYearFrom
    props.form.validateFields((err, values) => {
      if (!err) {
        const requestMetadata = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(allInputs),
        }
        //    console.log(allInputs)
        let urlForSaveRoster = props.olderRosterId
          ? `Rosters/CopyRoster?CopyFromRosterId=${props.olderRosterId}`
          : 'Rosters/Save'
        fetch(`${baseUrl}/${urlForSaveRoster}`, requestMetadata)
          .then(res => res.json())
          .then(data => {
            if (data.statusCode === 200) {
              //   console.log(data)
              rosterDetail
                ? message.success('Roster Is updated successfully !!')
                : message.success('Roster Is created successfully !!')
              let students = []
              props.handleTable(students, columns)
              setAddbtnDisable(false)
              setShowAlert(false)
              //  props.updateLearningTargetList();
              // setInputs(initialValues)
              //props.form.resetFields()
              // props.handleOk()
              //   console.log('target', data.data)
              let id = data.data.id
              setRosterDetail(id)
              // save clipboard students in new roster
              // props.olderRosterId && AddClipBoardRoster(id , props.olderRosterId) ;
            } else if (data.statusCode === 208) {
              message.warning(data.message)
            } else {
              message.info(data.message)
            }
          })
          .catch(e => {
            console.log(e)
          })
      }
    })
  }

  const handleStudents = () => {
    // working here...
    setIsLoading(true)
    debugger
    let data = {
      rosterId: rosterDetail,
      categoryId: inputs.categoryId,
      startLearningTarget: inputs.learningTargetFrom,
      endLearningTarget: inputs.learningTargetTo,
      enrollment: radioFilterValue,
      startYear: inputs.learningYearFrom,
      endYear: inputs.learningYearTo,
      rotationDateRange: inputs.dateRange,
    }
    data.schoolId = schoolID
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
        if (data.statusCode === 200) {
          console.log('target', data.data)
          setstudentList([...data.data])
          let students = data.data
          props.handleTable(students, columns)
          setAddbtnDisable(true)
          if (students.length === 0) setShowAlert(true)
        } else if (data.statusCode === 208) {
          message.warning(data.message)
        } else {
          message.info(data.message)
        }
      })
    setIsLoading(false)
  }

  // filters based on all , enrolled and unenrolled

  const handleFilters = enrollmentValue => {
    setIsLoading(true)
    if (!enrollmentValue) {
      return ''
    }
    let enrollment = enrollmentValue
    setRadioFilterValue(enrollment)
    let data = {
      rosterId: rosterDetail,
      categoryId: inputs.categoryId,
      startLearningTarget: inputs.learningTargetFrom,
      endLearningTarget: inputs.learningTargetTo,
      startYear: inputs.learningYearFrom,
      endYear: inputs.learningYearTo,
      enrollment: enrollment,
      rotationDateRange: inputs.dateRange,
    }
    data.schoolId = schoolID
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
          setstudentList([...data.data])
          // console.log('target',data.data)
          // setstudentList([...data.data])
          let studentsData = data.data
          setStudentAddedInRoster([...studentsData])
          let showTable = true
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
    setIsLoading(false)
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
        inputs.dateRangeId = e
        inputs.dateRange = start + '-' + end
      })
  }

  const subjectChange = e => {
    //// debugger
    console.log(e)
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
        console.log(data)
        inputs.subjectId = data.data.id
        inputs.subjectName = data.data.subjectName
        inputs.phaseId = 0
        inputs.phaseName = 'Select'
        inputs.categoryName = 'Select'
        inputs.categoryId = 0
        inputs.learningTargetFrom = 0
        inputs.learningTargetTo = 0
        setInputs({...inputs})
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
        data.length > 0 &&
          setInputs(prevData => ({
            ...prevData,
            phaseId: 0,
            phaseName: 'Select',
          }))
        // setSelectData((prevData)=>({...prevData , phaseName:"Select" , categoryName:"Select"}))
      })
  }

  const phaseChange = e => {
    //console.log(e)
    e &&
      fetch(
        `${baseUrl}/Phases/Get?id=${parseInt(e)}&schoolId=${parseInt(
          schoolID,
        )}`,
        {
          headers,
        },
      )
        .then(res => res.json())
        .then(data => {
          console.log(data)
          inputs.phaseId = data.data.id
          inputs.phaseName = data.data.phaseName
          inputs.categoryId = 0
          inputs.learningTargetFrom = 0
          inputs.learningTargetTo = 0
          setInputs({...inputs})
          setSelectData(prevData => ({
            ...prevData,
            phaseName: data.data.phaseName,
            categoryName: 'Select',
            learningTargetFrom: 0,
            learningTargetTo: 0,
          }))
        })
  }

  const categoryChange = e => {
    e &&
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
          console.log(data)
          inputs.categoryId = data.data.id
          inputs.categoryName = data.data.categoryName
          // inputs.categoryId = 0;
          inputs.learningTargetFrom = 0
          inputs.learningTargetTo = 0
          setInputs({...inputs})
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
          console.log(data)
          let targetInAscending = data.data.reverse()
          SetLearningTargetList([...targetInAscending])
          setLearningTargetToList([])
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
        rosterDetail,
      )}&studentId=${parseInt(id)}&schoolID=${schoolID}`,
      requestMetadata,
    )
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 200) {
          message.success('Student is added to roster successfully !!')
          let sudentsInRoster = [...studentAddedInRoster, id]
          setStudentAddedInRoster(sudentsInRoster)
          let length = sudentsInRoster.length
          setStudentIdCount(length)
          let n = number + 1
          setNumber(n)
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
  const handleAddDateRange = () => {
    history.replace({pathname: '/manage-sessions', state: {isActive: true}})
  }

  const handleAddCategory = () => {
    history.replace({pathname: '/manage-category', state: {isActive: true}})
  }
  console.log('inputs', inputs)

  return (
    <>
      {isLoading ? <Spin /> : ''}
      <Form
        style={{margin: '20px 5px'}}
        name="basic"
        labelCol={{span: 24}}
        wrapperCol={{span: 24}}
        initialValues={{remember: true}}
        onSubmit={handleSubmit}
        autoComplete="off">
        <Row gutter={[16, 24]} style={{display: 'inline'}}>
          <Col xs={24} sm={24} md={24} lg={6} className="line-height">
            {myAccount.role.toLowerCase() === 'teacher' ? (
              <Form.Item label="Teacher Name" name="teacherId">
                {getFieldDecorator('teacherId', {
                  rules: [],
                  initialValue: myAccount.name,
                })(<Input disabled type="text" name="teacherId" />)}
              </Form.Item>
            ) : (
              <Form.Item label="Teacher Name" name="teacherId">
                <Select
                  placeholder="Select"
                  onChange={value => setInputs({...inputs, teacherId: value})}
                  name="teacherId">
                  {teachersList &&
                    teachersList.map((teacher, key) => (
                      <Option key={key} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            )}
          </Col>
          <Col xs={24} sm={24} md={24} lg={6} className="line-height">
            {inputs.advisory ? (
              <Form.Item label="Date Range">
                {activeSession.id > 0 &&
                  (myAccount.role.toLowerCase() === 'admin' ||
                    myAccount.role.toLowerCase() === 'superadmin') &&
                  getFieldDecorator('dateRange', {
                    rules: [{}],
                  })(
                    <Select
                      disabled
                      placeholder={
                        activeSession.mergedDate
                          ? activeSession.mergedDate
                          : 'Select'
                      }
                      onChange={dateRangeChange}
                      value={
                        activeSession.id > 0
                          ? activeSession.mergedDate
                          : 'No date range available in active Session'
                      }
                      name="dateRangeId">
                      {activeSession.id > 0 && (
                        <Option key="session" selected value="0">
                          {activeSession.mergedDate}
                        </Option>
                      )}
                    </Select>,
                  )}
                {myAccount.role.toLowerCase() === 'teacher' &&
                  getFieldDecorator('dateRangeId', {
                    rules: [],
                  })(
                    <Select
                      placeholder="Select"
                      onChange={dateRangeChange}
                      value={
                        dateRangeList.length
                          ? 'Select'
                          : 'No date range available in active Session'
                      }
                      name="dateRangeId">
                      {dateRangeList &&
                        dateRangeList.map((range, key) => (
                          <Option key={key} value={range.id}>
                            {range.mergedDate}
                          </Option>
                        ))}
                    </Select>,
                  )}
                {(myAccount.role.toLowerCase() === 'admin' ||
                  myAccount.role.toLowerCase() === 'superadmin') &&
                  !inputs.advisory &&
                  dateRangeList.length === 0 && (
                    <Button
                      className="btn-btn-range"
                      onClick={handleAddDateRange}
                      type="primary">
                      <PlusOutlined /> Add Date Range
                    </Button>
                  )}
              </Form.Item>
            ) : (
              <Form.Item label="Date Range">
                {dateRangeList.length > 0 &&
                  (myAccount.role.toLowerCase() === 'admin' ||
                    myAccount.role.toLowerCase() === 'superadmin') &&
                  getFieldDecorator('dateRangeId', {
                    rules: [],
                  })(
                    <Select
                      placeholder="Select"
                      onChange={dateRangeChange}
                      value={
                        dateRangeList.length
                          ? 'Select'
                          : 'No date range available in active Session'
                      }
                      name="dateRangeId">
                      {dateRangeList &&
                        dateRangeList.map((range, key) => (
                          <Option key={key} value={range.id}>
                            {range.mergedDate}
                          </Option>
                        ))}
                    </Select>,
                  )}
                {myAccount.role.toLowerCase() === 'teacher' &&
                  getFieldDecorator('dateRangeId', {
                    rules: [],
                  })(
                    <Select
                      placeholder="Select"
                      onChange={dateRangeChange}
                      value={
                        dateRangeList.length
                          ? 'Select'
                          : 'No date range available in active Session'
                      }
                      name="dateRangeId">
                      {dateRangeList &&
                        dateRangeList.map((range, key) => (
                          <Option key={key} value={range.id}>
                            {range.mergedDate}
                          </Option>
                        ))}
                    </Select>,
                  )}
                {(myAccount.role.toLowerCase() === 'admin' ||
                  myAccount.role.toLowerCase() === 'superadmin') &&
                  !inputs.advisory &&
                  dateRangeList.length === 0 && (
                    <Button
                      className="btn-btn-range"
                      onClick={handleAddDateRange}
                      type="primary">
                      <PlusOutlined /> Add Date Range
                    </Button>
                  )}
              </Form.Item>
            )}
          </Col>

          <Col xs={24} sm={24} md={24} lg={6} className="line-height">
            <Form.Item label="Block" name="block">
              {getFieldDecorator('block', {
                rules: [],
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
          <Col xs={24} sm={24} md={24} lg={6} className="line-height">
            <Form.Item label="Team Name" name="teamId">
              <Select
                placeholder="Select"
                onChange={value => setInputs({...inputs, teamId: value})}
                name="teamId">
                {teams.length &&
                  teams.map((team, key) => (
                    <Option key={key} value={team.id}>
                      {team.teamName}
                    </Option>
                  ))}
              </Select>
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
        <Row gutter={[16, 24]} style={{display: 'inline'}}>
          <Col xs={24} sm={24} md={24} lg={6} className="line-height">
            <Form.Item label="Roster Name" name="rosterName">
              {getFieldDecorator('rosterName', {
                rules: [
                  {
                    required: true,
                    message: 'Please enter roster name!',
                  },
                ],
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
          <Col xs={24} sm={24} md={24} lg={6} className="line-height">
            <Form.Item label="Subject" name="subjectId">
              {!inputs.advisory &&
                getFieldDecorator('subjectId', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select subject!',
                    },
                  ],
                  initialValue: inputs.subjectName,
                })(
                  <select
                    placeholder="Select"
                    value={inputs.subjectName}
                    onChange={e => subjectChange(e.target.value)}
                    name="subjectId">
                    <option key="0" value="0" selected>
                      Select{' '}
                    </option>
                    {subjectList &&
                      subjectList.map((subject, key) => (
                        <option key={key} value={subject.id}>
                          {subject.subjectName}
                        </option>
                      ))}
                  </select>,
                )}
              {inputs.advisory &&
                getFieldDecorator('subjectId', {
                  initialValue: inputs.subjectName,
                })(
                  <select
                    placeholder="Select"
                    value={inputs.subjectName}
                    onChange={e => subjectChange(e.target.value)}
                    name="subjectId">
                    <option key="0" value="0" selected>
                      Select{' '}
                    </option>
                    {subjectList &&
                      subjectList.map((subject, key) => (
                        <option key={key} value={subject.id}>
                          {subject.subjectName}
                        </option>
                      ))}
                  </select>,
                )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={6} className="line-height">
            <Form.Item label="Phase" name="phaseId">
              {!inputs.advisory &&
                getFieldDecorator('phaseId', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select phase!',
                    },
                  ],
                })(
                  <select
                    placeholder="Select"
                    value={inputs.phaseName}
                    onChange={e => phaseChange(e.target.value)}
                    name="phaseId">
                    <option key="0" value="0" selected>
                      Select{' '}
                    </option>
                    {phaseList &&
                      phaseList.map((data, key) => (
                        <option key={key} value={data.phase.id}>
                          {data.phase.phaseName}
                        </option>
                      ))}
                  </select>,
                )}
              {inputs.advisory &&
                getFieldDecorator(
                  'phaseId',
                  {},
                )(
                  <select
                    placeholder="Select"
                    value={inputs.phaseName}
                    onChange={e => phaseChange(e.target.value)}
                    name="phaseId">
                    <option key="0" value="0" selected>
                      Select{' '}
                    </option>
                    {phaseList &&
                      phaseList.map((data, key) => (
                        <option key={key} value={data.phase.id}>
                          {data.phase.phaseName}
                        </option>
                      ))}
                  </select>,
                )}
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={6} className="line-height">
            <Form.Item label="Category" name="categoryId">
              {!inputs.advisory &&
                getFieldDecorator('categoryId', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select category!',
                    },
                  ],
                })(
                  <select
                    placeholder="Select"
                    value={inputs.categoryName}
                    onChange={e => categoryChange(e.target.value)}
                    name="categoryId">
                    <option key="0" value="0" selected>
                      Select{' '}
                    </option>
                    {categoryList &&
                      categoryList.map((data, key) => (
                        <option key={key + 1} value={data.category.id}>
                          {data.category.categoryName}
                        </option>
                      ))}
                  </select>,
                )}
              {inputs.advisory &&
                getFieldDecorator(
                  'categoryId',
                  {},
                )(
                  <select
                    placeholder="Select"
                    value={inputs.categoryName}
                    onChange={e => categoryChange(e.target.value)}
                    name="categoryId">
                    <option key="0" value="0" selected>
                      Select{' '}
                    </option>
                    {categoryList &&
                      categoryList.map((data, key) => (
                        <option key={key + 1} value={data.category.id}>
                          {data.category.categoryName}
                        </option>
                      ))}
                  </select>,
                )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 24]} style={{display: 'inline'}}>
          <Col xs={24} sm={24} md={24} lg={6} className="line-height">
            <Form.Item
              label="Learning Target From"
              style={{margin: '3px 0 3px'}}>
              {getFieldDecorator(
                'learningTargetFrom',
                {},
              )(
                <select
                  placeholder="Select"
                  value={inputs.learningTargetFrom}
                  onChange={e =>
                    setInputs({...inputs, learningTargetFrom: e.target.value})
                  }
                  name="learningTargetFrom">
                  <option key="0" value="0" defaultSelected>
                    Select
                  </option>
                  {learningTargetList.length > 0 &&
                    learningTargetList.map((targetlist, key) => (
                      <option
                        key={key}
                        value={targetlist.progression.learningTarget}>
                        {targetlist.progression.learningTarget}
                      </option>
                    ))}
                </select>,
              )}
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={6} className="line-height">
            <Form.Item label="Learning Target To" style={{margin: '3px 0 3px'}}>
              <Select
                value={inputs.learningTargetTo}
                placeholder="Select"
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
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={6} className="line-height">
            <Form.Item label="Learning Year From" style={{margin: '3px 0 3px'}}>
              <Select
                placeholder="Select"
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
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={6} className="line-height">
            <Form.Item label="Learning Year To" style={{margin: '3px 0 3px'}}>
              <Select
                value={inputs.learningYearTo}
                placeholder="Select"
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
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {true && (
          <Form.Item wrapperCol={{offset: 6, span: 16}}>
            <Button
              type="primary"
              style={{margin: '30px 0', width: '150px'}}
              htmlType="submit">
              {rosterDetail ? 'Update' : 'Submit'}
            </Button>
          </Form.Item>
        )}

        {rosterDetail && (
          <Form.Item wrapperCol={{offset: 6, span: 16}}>
            <Button
              type="primary"
              disabled={addbtnDisable}
              onClick={handleStudents}>
              Add Students
            </Button>
          </Form.Item>
        )}
      </Form>
      {studentsList.length == 0 && showAlert && (
        <Alert description={messageOnNOStudents()} type="info" showIcon />
      )}

      <div
        className="section-top-heading"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        {addbtnDisable === true && (
          <>
            <Spin spinning={isLoading}>
              <strong>Enrollment</strong>
              <Radio.Group
                onChange={e => handleFilters(e.target.value)}
                value={radioFilterValue}
                defaultValue={'Filter'}>
                <Radio value={'Filter'}>Filter on Learning Targets</Radio>
                <Radio value={'All'}>All</Radio>
                <Radio value={'Enrolled'}>Enrolled</Radio>
                <Radio value={'Unenrolled'}>Unenrolled</Radio>
              </Radio.Group>
            </Spin>
          </>
        )}
      </div>
    </>
  )
}

export default Form.create()(CreateRoster)

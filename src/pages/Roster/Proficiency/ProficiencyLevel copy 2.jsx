import React, {useState, useEffect} from 'react'
import Layouts from '../../../components/Layouts'
import ProficiencyLevelTable from './ProficiencyLevelTabel'
import Messages from '../../../Message/Message'
import {Link, useHistory} from 'react-router-dom'
import isJwtTokenExpired from 'jwt-check-expiry'
import {
  Form,
  Col,
  Select,
  Row,
  Input,
  Button,
  Modal,
  Popconfirm,
  Table,
  message,
  Alert,
} from 'antd'
import Roster from '../ManageRosters'
import { Dropdown } from 'bootstrap'
const baseUrl = process.env.REACT_APP_BASE_URL

function Proficiency(props) {
  var user = JSON.parse(localStorage.getItem('user'))
  const {getFieldDecorator} = props.form

  const history = useHistory()


  const messageOnNOStudents = () => {
    return (
      <>
        <p>No students for this roster.</p>

       {user.role.toLowerCase() === 'teacher' ? "":<Link
          to={{
            pathname: '/CreateRoster',
            state: {
              rosterId: props.location.state.rosterId,
            },
          }}>
          {' '}
          <Button className="Add-btn-top" type="primary">
            Add Students
          </Button>{' '}
        </Link>}
      </>
    )
  }

  const initalSelects = {
    subjectName: 'Select',
    phaseName: 'Select',
    categoryName: 'Select',
  }

  const {Option} = Select
  const [inputs, setInputs] = useState({
    subjectId: 0,
    phaseId: 0,
    categoryId: 0,
  })

  const [dataInitialValue, setDataInitialValue] = useState(initalSelects)
  const [filterTable, setFilterTable] = useState([])
  const [studentsList, setStudentLIst] = useState([])
  const [newRosters, setNewRoster] = useState([])
  const [commonStudentsList, setCommonStudentsLIst] = useState([])
  const [totalLearningTargets, setTotalLearningTargets] = useState([])
  const [learningTargets, setLearningTargets] = useState([])
  const [subjectList, setSubjectList] = useState([])
  const [phaseList, setPhaseList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [selectData, setSelectData] = useState(initalSelects)
  const [submitShow, setSubmitShow] = useState(false)
  const [RosterData, setRosterData] = useState({
    rosterid: props.location.state.rosterId,
    rosterName: '',
    teacherId: 0,
    teacher: '',
    rotation: '',
    block: 0,
    advisory: props.location.state.isAdvisory,
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
  })
  var [learningTargetsBasedCatgry, setLearningTargetsBasedCatgry] = useState([])
  let [learningTargetVal ,setLearningTargetVal ] = useState({
    start:1,
    end:1
  })
  const schoolID = user.schoolId
  if (user) {
    var isExpired = isJwtTokenExpired(user.token)

    if (isExpired) {
     message.error(`${Messages.unHandledErrorMsg}`)
      history.replace({pathname: '/', state: {isActive: true}})
    }
  } else {
   message.error(`${Messages.unHandledErrorMsg}`)
    history.replace({pathname: '/', state: {isActive: true}})
  }

  let headers = {'Content-Type': 'application/json'}
  const token = user.token
  console.log('token', token)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const updateTableValue = (studentsData, roster) => {
    let columnData = []
    let studentProgressionData = []
    for (let i = roster.learningTargetFrom; i <= roster.learningTargetTo; i++) {
      let ProficiencyColumn = {
        title: i,
        dataIndex: i,
        className: 'Ab',
        key: i,
        render: (text, record) => {
          console.log('2')
          return (
            <Link
              className="link-text"
              style={{backgroundColor: text === 'P' ? '#b8fcc5' : '#fff'}}
              to={{
                pathname: '/proficiency',
                state: {
                  studentId: record.id,
                  studentName: record.firstName + record.lastName,
                  subject: roster.subject,
                  phase: roster.phase,
                  categoryId: roster.categoryId,
                  category: roster.category,
                  learningTarget: i,
                },
              }}>
              {text}
            </Link>
          )
        },
        onCell: (record, rowIndex) => {
          return {
            onClick: ev => {
              console.log('1')
              if (record.inProgressTarget) {
                history.push('/proficiency', {
                  studentId: record.id,
                  studentName: record.firstName + record.lastName,
                  subject: roster.subject,
                  phase: roster.phase,
                  categoryId: roster.categoryId,
                  category: roster.category,
                  learningTarget: record.inProgressTarget,
                })
              } else if (record.lastCompletedTarget) {
                if (record.lastCompletedTarget < roster.learningTargetTo) {
                  history.push('/proficiency', {
                    studentId: record.id,
                    studentName: record.firstName + record.lastName,
                    subject: roster.subject,
                    phase: roster.phase,
                    categoryId: roster.categoryId,
                    category: roster.category,
                    learningTarget: record.lastCompletedTarget + 1,
                  })
                } else {
                  message.info(`${record.firstName} has completed all targets.`)
                }
              } else {
                history.push('/proficiency', {
                  studentId: record.id,
                  studentName: record.firstName + record.lastName,
                  subject: roster.subject,
                  phase: roster.phase,
                  categoryId: roster.categoryId,
                  category: roster.category,
                  learningTarget: roster.learningTargetFrom,
                })
              }
            },
          }
        },
      }
      columnData.push(ProficiencyColumn)
    }

    //let length =   studentsData.lastCompletedTarget -roster.learningTargetFrom ;
    const TableData = n => {
      // debugger;
      let jsObj = studentsData[n]
      let length =
        studentsData[n].lastCompletedTarget - roster.learningTargetFrom
      for (var i = 0; i <= length; i++) {
        jsObj[roster.learningTargetFrom + i] = 'P'
      }
      if (studentsData[n].inProgressTarget) {
        jsObj[studentsData[n].inProgressTarget] = 'IP'
      }
      return jsObj
    }

    let column = [
      {
        dataIndex: 'FullName',
        key: 'name',
        width: 100,
        render: (text, record) => (
          <span>
            {record.firstName} {record.lastName}
          </span>
        ),
      },
      {
        title: 'Learning Target',
        children: [...columnData],
      },
    ]

    for (let i = 0; i < studentsData.length; i++) {
      let mergedData = TableData(i)

      studentProgressionData.push(mergedData)
      console.log(mergedData)
    }

   // setColumns([...column])
    setFilterTable(studentProgressionData)
  }

  const getSUbjectList = () => {
    fetch(`${baseUrl}/Subjects/GetAll?schoolId=${parseInt(schoolID)}`, {
      headers,
    })
      .then(res => res.json())
      .then(data => {
        console.log('Subjects', data.data)
        setSubjectList([...data.data])
        //  dispatch(addAllSubjects(data.data))
        let length = data.data.length
        // console.log('length', length)
        //   debugger;
      })
      .catch(e => {
       message.error(`${Messages.unHandledErrorMsg}`)
        //  history.replace({ pathname: '/', state: { isActive: true } })
      })
  }

  // SID - Subject id
  // PID - phase id
  // CID - category id
  const getPhaseListbySID = subjectId => {
    fetch(
      `${baseUrl}/Phases/GetAll?subjectId=${parseInt(
        subjectId,
      )}&schoolId=${parseInt(schoolID)}`,
      {headers},
    )
      .then(res => res.json())
      .then(data => {
        // debugger
        setPhaseList([...data.data])
        let length = data.data.length
        console.log('length', length)
        //   debugger;

        length && setInputs({...inputs, phaseId: data.data[0].phase.id})
        length &&
          setDataInitialValue(prevData => ({
            ...prevData,
            phaseName: data.data[0].phase.phaseName,
          }))
        // setPhaseLength(parseInt(length))
        console.log('addAllPhases', data.data)
      })
      .catch(e => {
       message.error(`${Messages.unHandledErrorMsg}`)
        //  history.replace({ pathname: '/', state: { isActive: true } })
      })
  }
  console.log('inputs --------', inputs, dataInitialValue)
  const getCategoryListbySIDnPID = (subjectId, phaseId) => {
    // debugger
    fetch(
      `${baseUrl}/Categories/GetAll?subjectId=${parseInt(
        subjectId,
      )}&phaseId=${parseInt(phaseId)}&schoolId=${parseInt(schoolID)}`,
      {headers},
    )
      .then(res => res.json())
      .then(data => {
        console.log('category', data.data)
        setCategoryList([...data.data])
        let length = data.data.length
        length && setInputs({...inputs, categoryId: data.data[0].category.id})
        length &&
          setDataInitialValue(prevData => ({
            ...prevData,
            categoryName: data.data[0].category.categoryName,
          }))
        // setcategoryLength(parseInt(length))
      })
      .catch(e => {
       message.error(`${Messages.unHandledErrorMsg}`)
        //  history.replace({pathname: '/', state: {isActive: true}})
      })
  }

  const getLearningTargetByCateID = categoryID => {
    categoryID &&
    fetch(
      `${baseUrl}/Progressions/GetAll?categoryId=${parseInt(
        categoryID,
      )}&schoolId=${parseInt(schoolID)}`,
      {headers},
    )
      .then(res => res.json())
      .then(data => {
        console.log('data', data.data)
        let targetInAscending = data.data.reverse()
        setTotalLearningTargets([...targetInAscending])
      })
      .catch(e => {
       message.error(`${Messages.unHandledErrorMsg}`)
        //  history.replace({pathname: '/', state: {isActive: true}})
      })
  }

  const getLearningTarget = (rosterID, categoryID) => {
    fetch(
      `${baseUrl}/RosterLearningTargets/GetByRosterIdAndCategoryId?rosterId=${parseInt(
        rosterID,
      )}&categoryId=${parseInt(categoryID)}`,
      {headers},
    )
      .then(res => res.json())
      .then(data => {
        // debugger
        console.log('learning target', data.data)
        //   let targetInAscending = data.data.reverse()
        setLearningTargets([...data.data])
      })
      .catch(e => {
       message.error(`${Messages.unHandledErrorMsg}`)
        //  history.replace({pathname: '/', state: {isActive: true}})
      })
  }

  useEffect(() => {
    // Rosters/Get?id=5
    var rosterUrl = "/Rosters/Get";
    var progression = "Progressions/GetAll?categoryId=21&schoolId=1"
    if(RosterData.advisory)
    {
      rosterUrl = "/Rosters/GetAdvisory"
    }
    !isExpired &&
      fetch(
        `${baseUrl + rosterUrl}?id=${parseInt(RosterData.rosterid,)}&schoolId=${schoolID}`,
        {headers},
      )
        .then(res => res.json())
        .then(data => {
          // data.data.Roster
          console.log('data-- Roster', data.data.Students)
          let resRosterdata = data.data.Roster
          setRosterData(resRosterdata)
          //data.data.Students
          //debugger
          //---------------changes-----------------
              let newStudentsList = data.data.Students;
              data.data.Students = [];
             for(let i =0; i< newStudentsList.length ; i++){
              let found = data.data.Students.findIndex((e)=>e.id == newStudentsList[i].id );
              if(found == -1){
                newStudentsList[i].allInProgress = []
                data.data.Students.push(newStudentsList[i]);
               // newStudentsList.splice(i, 1); 
                //newStudentsList.re
              }else{
                data.data.Students[found].allInProgress.push(newStudentsList[i].inProgressTarget)
              }
             }
          //----------------------------------------
          let studentsData = data.data.Students
          setStudentLIst([...studentsData])
          getLearningTarget(RosterData.rosterid, resRosterdata.categoryId)

          // get  Subjects & Phase & category
          getSUbjectList()
          //   debugger
          setInputs(prevdata => ({
            ...initalSelects,
            subjectId: resRosterdata.subjectId,
          }))
          setDataInitialValue(prevdata => ({
            ...prevdata,
            subjectName: resRosterdata.subject,
          }))
          getPhaseListbySID(resRosterdata.subjectId)
          getCategoryListbySIDnPID(
            resRosterdata.subjectId,
            resRosterdata.phaseId,
          )
          getProgressions(data.data.Roster.categoryId);
          //  updateTableValue(studentsData, data.data.Roster)
        })
        .catch(e => {
         message.error(`${Messages.unHandledErrorMsg}`)
          // history.replace({ pathname: '/', state: { isActive: true } })
        })      
  }, [])

  const getProgressions = (categoryId) => {
    fetch(
      `${baseUrl}/Progressions/GetByCategoryId?categoryId=${parseInt(
        categoryId,
      )}`,
      {headers},
    )
      .then(res => res.json())
      .then(data => {
       // console.log("Mayank",data);
        setLearningTargetsBasedCatgry([...data.data])
      })
    }
  console.log(setLearningTargetsBasedCatgry)

  useEffect(() => {
    inputs.subjectId && getPhaseListbySID(inputs.subjectId)
  }, [inputs.subjectId])

  useEffect(() => {
    inputs.subjectId &&
      inputs.phaseId &&
      getCategoryListbySIDnPID(inputs.subjectId, inputs.phaseId)
  }, [inputs.phaseId])

  const handleSubmit = () => {
    !isExpired &&
      fetch(
        `${baseUrl}/Rosters/ProficiencyLevels?rosterId=${parseInt(
          props.location.state.rosterId,
        )}&schoolId=${parseInt(schoolID)}&subjectId=${parseInt(
          inputs.subjectId,
        )}&phaseId=${parseInt(inputs.phaseId)}&categoryId=${parseInt(
          inputs.categoryId,
        )}`,
        {headers},
      )
        .then(res => res.json())
        .then(data => {
          // data.data.Roster
          //  debugger
          console.log('New Roster data', data)
          //   let studentsData =  [].concat.apply([],  data.data.NewRosterStudents);
          getLearningTargetByCateID(inputs.categoryId)
          setStudentLIst([...data.data.Students])
          //  setNewRoster(data.data.NewRoster)
          //  let mergedTarget = [].concat.apply([], data.data.NewLearningTargets);
          // setTotalLearningTargets([...data.data.LearningTargetsOnCategoryId]);
          //    let resRosterdata = data.data.Roster
          // setRosterData(resRosterdata)
          //data.data.Students
          // let studentsData = data.data.Students
          // setStudentLIst([...studentsData])

          // get  Subjects & Phase & category

          //  updateTableValue(studentsData, data.data.Roster)
        })
        .catch(e => {
          //   debugger
         message.error(`${Messages.unHandledErrorMsg}`)
          //  history.replace({ pathname: '/', state: { isActive: true } })
        })
  }
  const subjectChange = e => {
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
    console.log(e)
    fetch(
      `${baseUrl}/Phases/Get?id=${parseInt(e)}&schoolId=${parseInt(schoolID)}`,
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
    fetch(
      `${baseUrl}/Categories/GetAll?subjectId=${parseInt(
        inputs.subjectId,
      )}&phaseId=${parseInt(inputs.phaseId)}&schoolId=${parseInt(schoolID)}`,
      {headers},
    )
      .then(res => res.json())
      .then(data => {
        console.log(data.data)
        data.length > 0 &&
          setInputs(prevData => ({
            ...prevData,
            categoryId: 0,
            categoryName: 'Select',
          }))
        setCategoryList([...data.data])
      })
  }

  // for set learning target value 
  const setLearningTargetValForSearch = (name , value)=>{
   // debugger
   // setLearningTargetVal({ [name]:value})
    setLearningTargetVal(ev => ({
      ...ev,
      [name] : value,
    }))
  }
  console.log("")
  const categoryChange = e => {
    console.log(e)
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
        })
    setSubmitShow(true)
  }
  console.log(inputs.subjectId)
//  console.log("learningTargetsBasedCatgryn" , learningTargetsBasedCatgry)
  return (
    <>
      <Layouts title="assets" className="dashboard">
        <div className="dash-bg-white">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={20}>
              <div className="section-top-heading">
                <h3
                  style={{
                    color: '#0C1362',
                    fontWeight: '600',
                    fontSize: '20px',
                  }}>
                  {' '}
                  Proficiency Level{' '}
                </h3>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={4}>
              <div>
                <Link
                  to={{
                    pathname: '/CreateRoster',
                    state: {
                      rosterId: props.location.state.rosterId,
                    },
                  }}>
                  {' '}
                  <Button className="Add-btn-top" type="primary">
                    Edit Roster
                  </Button>{' '}
                </Link>
              </div>
            </Col>
          </Row>
        </div>

        {studentsList.length !== 0 && (
          <Form
            name="basic"
            initialValues={{remember: true}}
            autoComplete="off">
            {RosterData.teacher !== '' && (
               <Row gutter={[24, 16]}>
              <Col xs={24} sm={12} md={6} lg={6}>
                <Form.Item >
                  <label className="text-form-label">
                    Teacher :<span> {RosterData.teacher}</span>
                  </label>
                </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                <Form.Item>
                 { <label className="text-form-label">
                    Subject :<span> {RosterData.subject}</span>
                  </label>}
                </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                <Form.Item>
                  <label className="text-form-label">
                    Phase :<span> {RosterData.phase}</span>
                  </label>
                </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                <Form.Item>
                  <label className="text-form-label">
                    Category :<span> {RosterData.category}</span>
                  </label>
                </Form.Item>
              </Col>            
              </Row>
              )}
              {/* for non advisory only */}
              {!RosterData.advisory &&   <Form.Item
                  label="Learning Traget From"
                  name="learningTargetStart"
                  className="subject-bx-label">
                
                    <select
                      placeholder={"Learning Target"}
                      //value={"Select"}
                      value={learningTargetVal.start}
                      onChange={e => setLearningTargetValForSearch("start" , e.target.value)}
                      name="Learning Target">
                      {learningTargetsBasedCatgry &&
                        learningTargetsBasedCatgry.map((data, key) => (
                          <option key={key} value={data.learningTarget}>
                            {data.learningTarget}
                          </option>
                        ))}
                    </select>
          
                </Form.Item>}
                {!RosterData.advisory &&   <Form.Item
                  label="Learning Traget To"
                  name="learningTargetEnd"
                  className="subject-bx-label">
                    <select
                      placeholder={"Learning Target end"}
                      //value={"Select"}
                      value={learningTargetVal.end}
                   //   onChange={e => setLearningTargetVal({...learningTargetVal , end:e.target.value})}
                      onChange={e => setLearningTargetValForSearch("end" , e.target.value)
                      }
                      name="Learning Target end">
                      {learningTargetsBasedCatgry &&
                        learningTargetsBasedCatgry.map((data, key) => (
                          <option key={data.learningTarget} value={data.learningTarget}>
                            {data.learningTarget}
                          </option>
                        ))}
                    </select>
                  
                </Form.Item>}
            {/* ---------------------- */}
              {RosterData.teacher === '' && (
                <Row gutter={[6, 0]} style={{display: 'inline'}}>
                  <Col xs={24} sm={12} md={6} lg={6}>
                    <Form.Item>
                      <label className="text-form-label">
                        Teacher :<span>None</span>
                      </label>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={6}>
                    <Form.Item>
                     {RosterData.advisory && <label className="text-form-label">
                        Subject :<span> {RosterData.subject}</span>
                      </label>}
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={6}>
                    <Form.Item>
                      <label className="text-form-label">
                        Phase :<span> {RosterData.phase}</span>
                      </label>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12} md={6} lg={6}>
                    <Form.Item>
                      <label className="text-form-label">
                        Category :<span> {RosterData.category}</span>
                      </label>
                    </Form.Item>
                  </Col>
                </Row>
              )}
           

            <Row gutter={[6, 0]} style={{display: 'inline'}}>
              <Col xs={24} sm={12} md={6} lg={6}>
                {RosterData.advisory ? (
                  <Form.Item
                    label="Subject"
                    name="subjectId"
                    className="subject-bx-label">
                    {getFieldDecorator('subjectId', {
                      rules: [
                        {
                          required: true,
                          message: 'Please select subject!',
                        },
                      ],
                    })(
                      <select
                        placeholder={RosterData.subject}
                        value={RosterData.subject}
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
                ) : (
                  <Form.Item className="d-flex ">
                   {RosterData.advisory && <label className="text-form-label">
                      Subject :<span> {RosterData.subject}</span>
                    </label>}
                  </Form.Item>
                )}
              </Col>
              <Col xs={24} sm={12} md={6} lg={6}>
                {/*   <Form.Item >
             <label className='text-label' >Phase : 
              <span >{RosterData.phase}</span>
              </label>
             </Form.Item>
          */}

             {RosterData.advisory &&   <Form.Item
                  label="Phase"
                  name="phaseId"
                  className="subject-bx-label">
                  {getFieldDecorator('phaseId', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select phase!',
                      },
                    ],
                  })(
                    <select
                      placeholder={RosterData.phase}
                      value={RosterData.phase}
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
                </Form.Item>}
              </Col>
              <Col xs={24} sm={12} md={24} lg={9}>
                {/*           <Form.Item  >
               <label className='text-label' >Category :
                <span > {RosterData.category}</span>
                </label>
                </Form.Item> */}
               { RosterData.advisory &&  <Form.Item
                  label="Category"
                  name="categoryId"
                  className="subject-bx-label">
                  {getFieldDecorator('categoryId', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select category!',
                      },
                    ],
                  })(
                    <select
                      placeholder={RosterData.category}
                      value={RosterData.category}
                      onChange={e => categoryChange(e.target.value)}
                      name="categoryId">
                      <option key="0" value="0" selected>
                        Select{' '}
                      </option>
                      {categoryList &&
                        categoryList.map((data, key) => (
                          <option key={key} value={data.category.id}>
                            {data.category.categoryName}
                          </option>
                        ))}
                    </select>,
                  )}
                </Form.Item>}
              </Col>
              <Col xs={24} sm={12} md={24} lg={3}>
               {RosterData.advisory && <div className="text-right mt-24">
                  <Button
                    type="primary"
                    disabled={submitShow ? false : true}
                    onClick={handleSubmit}>
                    Submit
                  </Button>
                </div>}
              </Col>
            </Row>
          </Form>
        )}

        {studentsList.length === 0 && (
          <Form
            style={{margin: '15px 0'}}
            name="basic"
            initialValues={{remember: true}}
            autoComplete="off">
            <Row className="d-flex flex-wrap" gutter={[6, 0]}>
              {RosterData.teacher !== '' && (
                <Col
                  xs={24}
                  sm={12}
                  md={6}
                  lg={5}
                  className="align-self-center">
                  <Form.Item>
                    <label className="text-label">
                      Teacher :<span> {RosterData.teacher}</span>
                    </label>
                  </Form.Item>
                </Col>
              )}
              {RosterData.teacher === '' && (
                <Col
                  xs={24}
                  sm={12}
                  md={6}
                  lg={5}
                  className="align-self-center">
                  <Form.Item>
                    <label className="text-label">
                      Teacher :<span>None</span>
                    </label>
                  </Form.Item>
                </Col>
              )}

              <Col xs={24} sm={12} md={6} lg={5} className="align-self-center">
                {/*  <Form.Item >
                <label className='text-label' >Subject :
                  <span  > {RosterData.subject}</span>
                </label>
            </Form.Item> */}
                {RosterData.advisory ? (
                  <Form.Item
                    label="Subject"
                    name="subjectId"
                    className="subject-bx-label">
                    {getFieldDecorator('subjectId', {
                      rules: [
                        {
                          required: true,
                          message: 'Please select subject!',
                        },
                      ],
                    })(
                      <select
                        placeholder={RosterData.subject}
                        value={RosterData.subject}
                        onChange={e =>
                          setInputs({...inputs, subjectId: e.target.value})
                        }
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
                ) : ""}
              </Col>

              <Col xs={24} sm={12} md={6} lg={5}>
            {  RosterData.advisory &&   <Form.Item
                  label="Phase"
                  name="phaseId"
                  className="subject-bx-label">
                  {getFieldDecorator('phaseId', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select phase!',
                      },
                    ],
                  })(
                    <select
                      placeholder={RosterData.phase}
                      value={RosterData.phase}
                      onChange={e =>
                        setInputs({...inputs, phaseId: e.target.value})
                      }
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
                </Form.Item>}
              </Col>

              <Col xs={24} sm={12} md={24} lg={6}>
                {/*         <Form.Item  >
                <label className='text-label' >Category :
                  <span > {RosterData.category}</span>
                </label>
            </Form.Item> */}
             { RosterData.advisory &&   <Form.Item
                  label="Category"
                  name="categoryId"
                  className="subject-bx-label">
                  {getFieldDecorator('categoryId', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select category!',
                      },
                    ],
                  })(
                    <select
                      placeholder={RosterData.category}
                      value={RosterData.category}
                      onChange={e =>
                        setInputs({...inputs, categoryId: e.target.value})
                      }
                      name="categoryId">
                      <option key="0" value="0" selected>
                        Select{' '}
                      </option>
                      {categoryList &&
                        categoryList.map((data, key) => (
                          <option key={key} value={data.category.id}>
                            {data.category.categoryName}
                          </option>
                        ))}
                    </select>,
                  )}
                </Form.Item>}
              </Col>
              <Col xs={24} sm={12} md={24} lg={3}>
                {inputs.subjectId != 0 &&
                  inputs.categoryId != 0 &&
                  inputs.phaseId != 0 && RosterData.advisory && (
                    <div className="text-right mt-24">
                      <Button type="primary" onClick={handleSubmit}>
                        Submit
                      </Button>
                    </div>
                  )}
              </Col>
            </Row>
          </Form>
        )}

        {studentsList.length > 0 && (
          <ProficiencyLevelTable
            studentsList={studentsList}
            learningTargets={learningTargets}
            rosterData={RosterData}
            totalLearningTargets={totalLearningTargets}
            NewRoster={newRosters}
            commonStudentsList={commonStudentsList}
          />
        )}
        {studentsList.length === 0 && (
          <Alert description={messageOnNOStudents()} type="info" showIcon />
        )}
      </Layouts>
    </>
  )
}

export default Form.create()(Proficiency)

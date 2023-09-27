import React, {useState, useEffect} from 'react'
import Layouts from '../../../components/Layouts'
import ProficiencyLevelTable from './ProficiencyLevelTabel'
import Messages from '../../../Message/Message'
import ReportPopup from '../Report/ReportPopup'
import {Link, useHistory} from 'react-router-dom'
import isJwtTokenExpired from 'jwt-check-expiry'
import {Form, Col, Select, Row, Button, message, Alert, Spin} from 'antd'
const baseUrl = process.env.REACT_APP_BASE_URL

function Proficiency(props) {
  var user = JSON.parse(localStorage.getItem('user'))
  const {getFieldDecorator} = props.form
  const [visible, setVisible] = React.useState(false)
  const history = useHistory()
  var RosterID = ''
  if (history.location.state && history.location.state.rosterId) {
    RosterID = history.location.state.rosterId
  } else {
    RosterID = props.data.rosterId
  }

  const showModal = () => {
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const messageOnNOStudents = () => {
    return (
      <>
        <p>No students for this roster.</p>
        {user.role.toLowerCase() === 'teacher' ? (
          ''
        ) : (
          <Link
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
          </Link>
        )}
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
  const [filteredLearningTargets, setFilteredLearningTargets] = useState([])
  const [subjectList, setSubjectList] = useState([])
  const [phaseList, setPhaseList] = useState([])
  const [categoryList, setCategoryList] = useState([])
  const [selectData, setSelectData] = useState(initalSelects)
  const [submitShow, setSubmitShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState({
    subject: '',
    phase: '',
    category: '',
  })
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
  let [learningTargetVal, setLearningTargetVal] = useState({
    start: 0,
    end: 0,
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

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const getSUbjectList = () => {
    fetch(`${baseUrl}/Subjects/GetAllActive?schoolId=${parseInt(schoolID)}`, {
      headers,
    })
      .then(res => res.json())
      .then(data => {
        console.log('Subjects', data.data)
        setSubjectList([...data.data])
        //  dispatch(addAllSubjects(data.data))
        let length = data.data.length
      })
      .catch(e => {
        message.error(`${Messages.unHandledErrorMsg}`)
        //  history.replace({ pathname: '/', state: { isActive: true } })
      })
  }

  const getPhaseListbySID = subjectId => {
    ////debugger
    fetch(
      `${baseUrl}/Phases/GetAll?subjectId=${parseInt(
        subjectId,
      )}&schoolId=${parseInt(schoolID)}`,
      {headers},
    )
      .then(res => res.json())
      .then(data => {
        // ////debugger
        setPhaseList([...data.data])
        let length = data.data.length
        console.log('length', length)
        //   ////debugger;

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

  const getCategoryListbySIDnPID = (subjectId, phaseId) => {
    ////debugger
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
    ////debugger
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

  const getLearningTarget = (
    rosterID,
    categoryID,
    largestLearningTagetINStudentProgress,
  ) => {
    fetch(
      `${baseUrl}/RosterLearningTargets/GetByRosterIdAndCategoryId?rosterId=${parseInt(
        rosterID,
      )}&categoryId=${parseInt(categoryID)}`,
      {headers},
    )
      .then(res => res.json())
      .then(data => {
        let toSetLearningTargets = data.data
        console.log(data.data)

        if (data.data?.length > 0 && largestLearningTagetINStudentProgress) {
          let largestLearningInTarget = data.data.reduce(function (max, b) {
            return Math.max(max, b.learningTarget)
          }, -Infinity)
          if (
            largestLearningInTarget > 0 &&
            largestLearningInTarget < largestLearningTagetINStudentProgress
          ) {
            toSetLearningTargets.push({
              id: -1,
              rosterId: 0,
              categoryId: 0,
              learningTarget: largestLearningTagetINStudentProgress,
              iCanStatement: '',
              seprater: true,
            })
          }
        }
        data.data?.length &&
          setLearningTargetVal({
            start: data.data[0].learningTarget,
            end: data.data[data.data.length - 1].learningTarget,
          })
        setLearningTargets([...toSetLearningTargets])
        setFilteredLearningTargets([...toSetLearningTargets])
        return '5'
      })
      .catch(e => {
        message.error(`${Messages.unHandledErrorMsg}`)
      })
  }

  useEffect(() => {
    setLoading(true)
    var rosterUrl = '/Rosters/Get'
    if (RosterData.advisory) {
      rosterUrl = '/Rosters/GetAdvisory'
    }
    ////debugger
    !isExpired &&
      fetch(
        `${baseUrl + rosterUrl}?id=${parseInt(
          RosterData.rosterid,
        )}&schoolId=${schoolID}`,
        {headers},
      )
        .then(res => res.json())
        .then(data => {
          console.log('data-- Roster', data.data.Students)
          let resRosterdata = data.data.Roster
          setRosterData(resRosterdata)
          fetch(
            `${baseUrl}/Rosters/GetInProgress?id=${parseInt(
              RosterData.rosterid,
            )}`,
            {headers},
          )
            .then(nextProgross => nextProgross.json())
            .then(async nextCategoryProgressdata => {
              console.log('nextCategoryProgressdata', nextCategoryProgressdata)
              ////debugger
              getLearningTarget(
                RosterData.rosterid,
                resRosterdata.categoryId,
                nextCategoryProgressdata?.data?.Roster?.length &&
                  nextCategoryProgressdata?.data?.Roster[0]
                  ? nextCategoryProgressdata?.data?.Roster[0].progression
                  : 0,
              )
              let [
                studentsData,
                learningTargetslicedFrom,
                inProgressTargetSlicedTo,
              ] = await getFormatedDataOfRstrStudent(data.data.Students)
              nextCategoryProgressdata &&
                nextCategoryProgressdata?.data?.Roster?.length &&
                studentsData.forEach(student => {
                  let studentProgressInNextPhase =
                    nextCategoryProgressdata?.data?.Roster.find(
                      obj => obj.studentId == student.id,
                    )
                  studentProgressInNextPhase &&
                    student.allInProgress?.length &&
                    student.allInProgress.push({
                      learningTarget: studentProgressInNextPhase.progression,
                      status: studentProgressInNextPhase.progress,
                    })
                })
              setStudentLIst([...studentsData])
              console.log(' data.data?.Students', studentsData)
              getSUbjectList()
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
              getProgressions(data.data.Roster.categoryId)
            })
        })
        .catch(e => {
          message.error(`${Messages.unHandledErrorMsg}`)
        })
  }, [])

  const getProgressions = categoryId => {
    ////debugger
    fetch(
      `${baseUrl}/Progressions/GetByCategoryId?categoryId=${parseInt(
        categoryId,
      )}`,
      {headers},
    )
      .then(res => res.json())
      .then(data => {
        setLearningTargetsBasedCatgry([...data.data])
      })
    setLoading(false)
  }

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
          console.log('New Roster data', data)
          let foundData = categoryList.find(
            obj => obj.category.id == inputs.categoryId,
          )
          ////debugger
          setName({
            subject: foundData.subjectName ? foundData.subjectName : '',
            phase: foundData.phaseName ? foundData.phaseName : '',
            category: foundData?.category?.categoryName
              ? foundData?.category?.categoryName
              : '',
            categoryID: foundData?.category?.id ? foundData?.category?.id : 0,
          })
          getLearningTargetByCateID(inputs.categoryId)
          let [
            studentsData,
            learningTargetslicedFrom,
            inProgressTargetSlicedTo,
          ] = getFormatedDataOfRstrStudent(data.data.Students)
          setStudentLIst([...studentsData])
        })
        .catch(e => {
          message.error(`${Messages.unHandledErrorMsg}`)
        })
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
    ////debugger
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
    ////debugger
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
    ////debugger
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

  const setLearningTargetValForSearch = (name, value) => {
    // ////debugger
    // setLearningTargetVal({ [name]:value})
    setLearningTargetVal(ev => ({
      ...ev,
      [name]: value,
    }))
  }

  const handleShrinkView = () => {
    console.log(learningTargetsBasedCatgry)
    if (learningTargetVal.start == 0 || learningTargetVal.end == 0) {
      message.info(`Please select Learning Targets to Shrink View `)
      return ''
    }
    if (learningTargetVal.start <= learningTargetVal.end) {
      let filteredTarget = learningTargets.filter(
        obj =>
          obj.learningTarget >= learningTargetVal.start &&
          obj.learningTarget <= learningTargetVal.end,
      )
      setFilteredLearningTargets([...filteredTarget])
    } else {
      message.info(
        `Learning Target From(${learningTargetVal.start}) should be less than or equal to Learning Target To(${learningTargetVal.end})`,
      )
    }
  }

  const categoryChange = e => {
    console.log(e)
    ////debugger
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

  const getFormatedDataOfRstrStudent = rstrStudents => {
    //debugger
    let studentsListLength = rstrStudents?.length ? rstrStudents?.length : 0
    let inProgressTargetSlicedTo = studentsListLength
      ? rstrStudents[studentsListLength - 1].progression
      : 0 // // find Maximum "IP" from all students;
    let learningTargetslicedFrom = studentsListLength
      ? rstrStudents[0].progression
      : 0 // find smalleast "P" from all students;
    let newStudentsList = rstrStudents
    rstrStudents = []
    for (let i = 0; i < newStudentsList.length; i++) {
      // serach student is present in list or not
      let found = rstrStudents?.findIndex(
        // findIndex return index, where condition pass first. if not found returns = -1;
        e => e.id == newStudentsList[i].id,
      )
      if (found == -1) {
        newStudentsList[i].allInProgress = [
          {
            learningTarget: newStudentsList[i].progression,
            status: newStudentsList[i].progress,
            imported: newStudentsList[i].imported,
          },
        ]
        rstrStudents.push(newStudentsList[i])
      } else {
        // push progress in all progress(data.data.Students[found].allInProgress) if student is already in list.
        rstrStudents[found].allInProgress.push({
          learningTarget: newStudentsList[i].progression,
          status: newStudentsList[i].progress,
          imported: newStudentsList[i].imported,
        })
      }
    }
    return [rstrStudents, learningTargetslicedFrom, inProgressTargetSlicedTo]
  }

  return (
    <>
      <Spin spinning={loading}>
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
                  <br></br>
                  {(user.role.toLowerCase() === 'superadmin' ||
                    user.role.toLowerCase() === 'admin') &&
                  RosterData.advisory ? (
                    <ReportPopup studentsList={studentsList} />
                  ) : (
                    ''
                  )}
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
                    <Form.Item>
                      <label className="text-form-label">
                        Teacher :<span> {RosterData.teacher}</span>
                      </label>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={6} lg={6}>
                    <Form.Item>
                      {
                        <label className="text-form-label">
                          Subject :<span> {RosterData.subject}</span>
                        </label>
                      }
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
              <Row gutter={[24, 16]}>
                {!RosterData.advisory && (
                  <Col xs={24} sm={12} md={6} lg={6}>
                    <Form.Item
                      label="Learning Target From"
                      name="learningTargetStart"
                      className="subject-bx-label">
                      <select
                        placeholder={'Learning Target'}
                        value={learningTargetVal.start}
                        onChange={e =>
                          setLearningTargetValForSearch('start', e.target.value)
                        }
                        name="Learning Target">
                        {learningTargetsBasedCatgry &&
                          learningTargetsBasedCatgry.map((data, key) => {
                            if (
                              data.learningTarget >=
                                RosterData.learningTargetFrom &&
                              data.learningTarget <= RosterData.learningTargetTo
                            ) {
                              return (
                                <option key={key} value={data.learningTarget}>
                                  {data.learningTarget}
                                </option>
                              )
                            }
                          })}
                      </select>
                    </Form.Item>
                  </Col>
                )}
                {!RosterData.advisory && (
                  <Col xs={24} sm={12} md={6} lg={6}>
                    <Form.Item
                      label="Learning Target To"
                      name="learningTargetEnd"
                      className="subject-bx-label">
                      <select
                        placeholder={'Learning Target end'}
                        //value={"Select"}
                        value={learningTargetVal.end}
                        //   onChange={e => setLearningTargetVal({...learningTargetVal , end:e.target.value})}
                        onChange={e =>
                          setLearningTargetValForSearch('end', e.target.value)
                        }
                        name="Learning Target end">
                        {learningTargetsBasedCatgry &&
                          learningTargetsBasedCatgry.map((data, key) => {
                            if (
                              data.learningTarget >=
                                RosterData.learningTargetFrom &&
                              data.learningTarget <= RosterData.learningTargetTo
                            ) {
                              return (
                                <option
                                  key={data.learningTarget}
                                  value={data.learningTarget}>
                                  {data.learningTarget}
                                </option>
                              )
                            }
                          })}
                      </select>
                    </Form.Item>
                  </Col>
                )}
                <Col xs={24} sm={12} md={6} lg={6}>
                  <button
                    onClick={handleShrinkView}
                    class="btn btn-primary mt-0 mt-md-4"
                    type="primary">
                    Update
                  </button>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}></Col>
              </Row>
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
                      {RosterData.advisory && (
                        <label className="text-form-label">
                          Subject :<span> {RosterData.subject}</span>
                        </label>
                      )}
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
                      {RosterData.advisory && (
                        <label className="text-form-label">
                          Subject :<span> {RosterData.subject}</span>
                        </label>
                      )}
                    </Form.Item>
                  )}
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                  {RosterData.advisory && (
                    <Form.Item
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
                    </Form.Item>
                  )}
                </Col>
                <Col xs={24} sm={12} md={24} lg={9}>
                  {RosterData.advisory && (
                    <Form.Item
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
                    </Form.Item>
                  )}
                </Col>
                <Col xs={24} sm={12} md={24} lg={3}>
                  {RosterData.advisory && (
                    <div className="text-right mt-24">
                      <Button
                        type="primary"
                        disabled={submitShow ? false : true}
                        onClick={handleSubmit}>
                        Submit
                      </Button>
                    </div>
                  )}
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

                <Col
                  xs={24}
                  sm={12}
                  md={6}
                  lg={5}
                  className="align-self-center">
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
                  ) : (
                    ''
                  )}
                </Col>

                <Col xs={24} sm={12} md={6} lg={5}>
                  {RosterData.advisory && (
                    <Form.Item
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
                    </Form.Item>
                  )}
                </Col>

                <Col xs={24} sm={12} md={24} lg={6}>
                  {RosterData.advisory && (
                    <Form.Item
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
                    </Form.Item>
                  )}
                </Col>
                <Col xs={24} sm={12} md={24} lg={3}>
                  {inputs.subjectId != 0 &&
                    inputs.categoryId != 0 &&
                    inputs.phaseId != 0 &&
                    RosterData.advisory && (
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
              learningTargets={filteredLearningTargets}
              rosterData={RosterData}
              totalLearningTargets={totalLearningTargets}
              NewRoster={newRosters}
              commonStudentsList={commonStudentsList}
              names={name}
              isAdvisory={props.location.state.isAdvisory}
            />
          )}
          <br></br>
          <div class="text-right">
            <Link
              to={{
                pathname: '/CreateRoster',
                state: {
                  olderRosterId: props.location.state.rosterId,
                },
              }}>
              {' '}
              <Button class="btn btn-primary mt-5 mb-2" type="primary">
                Copy Roster
              </Button>{' '}
            </Link>
          </div>

          {/* <div class="text-right"><button class="btn btn-primary mt-5 mb-2">Copy Roster</button></div> */}
          {studentsList.length === 0 && (
            <Alert description={messageOnNOStudents()} type="info" showIcon />
          )}
        </Layouts>
      </Spin>
    </>
  )
}

export default Form.create()(Proficiency)

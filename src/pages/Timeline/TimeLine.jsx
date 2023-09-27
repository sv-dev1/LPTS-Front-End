import React, {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useHistory, useLocation} from 'react-router-dom'
import HeaderDiv from '../../Header/HeaderDiv'
import useScript from '../../hooks/custom hooks/UseScript'
import './assets/css/style.css'
import './assets/css/bootstrap.min.css'
import './assets/css/icofont.min.css'
import isJwtTokenExpired from 'jwt-check-expiry'
import ShowProficiency from './ShowProficiency'
import Messages from '../../Message/Message'
import {Alert, Input, message, Popconfirm, Spin} from 'antd'
const baseUrl = process.env.REACT_APP_BASE_URL

const StudentProficiency = props => {
  useScript(
    'https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js',
  )
  useScript('https://code.jquery.com/jquery-1.12.4.min.js')
  useScript('assets/js/bootstrap.bundle.min.js')
  useScript('assets/js/toggleScript.js')

  var myAccount = JSON.parse(localStorage.getItem('user'))
  const location = useLocation()
  if (myAccount.role.toLowerCase() === 'student') {
    var studentId = myAccount.userId
  }
  if (myAccount.role.toLowerCase() !== 'student') {
    if (location.state) {
      var {studentId} = location.state
    } else {
      var {studentId} = props.location.state
    }
  }

  const history = useHistory()
  const {Search} = Input
  const [data, setData] = useState('')
  const [isBackFill, setBackFilled] = useState(false)
  const [sLength, setSLength] = useState(-1)
  const [lastP, setLastP] = useState({
    learningTarget: 0,
  })
  const [proficiencyPageData, setProficencyPageData] = useState({
    studentId: 0,
    studentName: '',
    subject: '',
    phase: '',
    categoryId: '',
    category: '',
    learningTarget: '',
    status: '',
    imported: false,
  })

  const [Length, setLength] = useState({SLength: 0, PLength: 0, CLength: 0})
  const [oldLength, setOldLength] = useState('')
  const [oldProgressions, setOldProgressions] = useState([])
  const [openedAccordance, setOpenedAccordance] = useState([0])
  const [expandProgressions, setExpandProgressions] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  const [filterTable, setFilterTable] = useState([])
  const [isUpdatedData, setIsUpdatedData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [selectedPhase, setSelectedPhase] = useState(0)
  const [color, setColor] = useState('#90EE90')

  const dispatch = useDispatch()
  const searchValue = 'IP'

  var user = JSON.parse(localStorage.getItem('user'))
  const token = user.token
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
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const fetctData = async (SetPhase, isUpdate) => {
    setLoading(true)
    await fetch(
      `${baseUrl}/Timelines/StudentTimeline?studentId=${parseInt(
        studentId,
      )}&schoolId=${parseInt(schoolID)}`,
      {headers},
    )
      .then(res => res.json())
      .then(async data => {
        console.log('StudentTimeline', data)
        if (data.statusCode === 200) {
          setData(data.data)
          let getPhases = async () => {
            let returnedData = await fetctActivetedPhase(
              data.data?.subjects[Length?.SLength]?.subjectId,
            )
            let newPhase = 0
            if (returnedData?.length) {
              newPhase = data.data?.subjects[Length?.SLength].phases.findIndex(
                ele => ele.phaseName == returnedData[0].phaseName,
              )
              setLength(prev => ({...prev, PLength: newPhase}))
            }
          }
          SetPhase && getPhases()
          setProficencyPageData({
            ...proficiencyPageData,
            studentId: studentId,
            studentName: data.data.studentName,
            subject: data.data.subjects[parseInt(Length?.SLength)]?.subjectName,
            phase:
              data.data.subjects[parseInt(Length?.SLength)]?.phases[
                parseInt(Length?.PLength)
              ]?.phaseName,
            categoryId:
              data.data.subjects[parseInt(Length?.SLength)]?.phases[
                parseInt(Length?.PLength)
              ]?.categories[parseInt(Length?.CLength)]?.categoryId,
            category:
              data.data.subjects[parseInt(Length?.SLength)]?.phases[
                parseInt(Length?.PLength)
              ]?.categories[parseInt(Length?.CLength)]?.categoryName,
          })
          if (isUpdate) {
            let returnedUpdatedData =
              await handleExpandButtonForAllProgressionsTargets(true, data.data)
          }
        } else {
          message.error(`${data.message}`)
        }
      })
  }

  const fetctActivetedPhase = async subject_id => {
    setLoading(false)
    if (!subject_id || !studentId) {
      return null
    }
    let res = await fetch(
      `${baseUrl}/Timelines/GetLastActivePhaseForStudent?studentId=${parseInt(
        studentId,
      )}&subjectId=${parseInt(subject_id)}`,
      {headers},
    )
    let jsonData = await res.json()
    if (jsonData.statusCode === 200) {
      return jsonData.data
    } else {
      message.error(`${jsonData.message}`)
    }
  }

  const updateData = () => {
    // debugger
    proficiencyPageData.studentName &&
      data.subjects[parseInt(Length?.SLength)].phases.length > 0 &&
      data.subjects[parseInt(Length?.SLength)].phases[parseInt(Length?.PLength)]
        .categories.length > 0 &&
      setProficencyPageData({
        ...proficiencyPageData,
        subject: data.subjects[parseInt(Length?.SLength)].subjectName,
        phase:
          data.subjects[parseInt(Length?.SLength)].phases[
            parseInt(Length?.PLength)
          ].phaseName,
        categoryId:
          data.subjects[parseInt(Length?.SLength)].phases[
            parseInt(Length?.PLength)
          ].categories[parseInt(Length?.CLength)].categoryId,
        category:
          data.subjects[parseInt(Length?.SLength)].phases[
            parseInt(Length?.PLength)
          ].categories[parseInt(Length?.CLength)].categoryName,
      })
  }

  useEffect(() => {
    fetctData('true')
    data && handleExpandButtonForAllProgressionsTargets(true)
    user.role.toLowerCase() === 'student' &&
      document.body.classList.add('timeline-no-menu')
  }, [])

  useEffect(() => {
    // console.log("*#" ,proficiencyPageData)
    handleLessButton()
    updateData()
    data && handleExpandButtonForAllProgressionsTargets(true)
    setLastP({learningTarget: 0})
    // if(data &&data?.subjects[Length?.SLength]?.phases[Length?.PLength]?.categories[
    //   Length?.CLength
    // ]?.learningTargets?.length <= 3){
    //   setExpandProgressions(true)
    // }
  }, [Length?.CLength, Length?.PLength, Length?.SLength])

  const openAccordance = async key => {
    if (Length !== key) {
      setSLength(key)
      let returnedData = await fetctActivetedPhase(
        data?.subjects[key].subjectId,
      )
      let newPhase = 0
      if (returnedData.length) {
        newPhase = data?.subjects[key].phases.findIndex(
          ele => ele.phaseName == returnedData[0].phaseName,
        )
      }
      setLength({SLength: key, PLength: newPhase, CLength: 0})
    } else {
    }
  }

  const handleChangePhase = (Phasekey, sIndex) => {
    setLength({...Length, PLength: Phasekey, CLength: 0})
  }

  const handleChangeCategories = (key, category) => {
    setSelectedCategory(key)
    setLength({...Length, CLength: key})
  }

  const updateTimeLineData = async () => {
    setIsUpdatedData(true)
    fetctData('', true)
    setLoading(false)
  }

  const handleBackFillData = () => {
    let sentToServerData = {
      studentId: proficiencyPageData.studentId,
      categoryId: proficiencyPageData.categoryId,
    }

    const requestMetadata = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(sentToServerData),
    }

    fetch(`${baseUrl}/LearningTargets/BackFillData`, requestMetadata)
      .then(res => res.json())
      .then(data => {
        setBackFilled(true)
        //fetctData()
        window.location.reload()
      })
      .catch(e => {
        console.log(e)
      })
  }

  const classNameValue = key => {
    if (Length?.PLength === key) {
      return 'nav-link active'
    }
    return 'nav-link'
  }

  const dataExpend = key => {
    //debugger

    if (key === Length?.SLength) {
      return 'true'
    }
    return 'false'
  }

  const dataExpendClass = key => {
    // debugger
    if (Length?.SLength === key) {
      return 'accordion-button'
    }
    return 'accordion-button collapsed'
  }

  const getPhaseId = sIndex => {
    if (Length?.SLength === sIndex) {
      return Length?.PLength
    }
    return 0
  }

  const getCategoryId = sIndex => {
    if (Length?.SLength === sIndex) {
      return Length?.CLength
    }
    return 0
  }

  const dataExpendClassShow = key => {
    // debugger
    // let isValue = openedAccordance.find(element => element === key);
    if (Length?.SLength === key) {
      return 'accordion-collapse collapse show'
    }
    return 'accordion-collapse collapse '
  }

  const handleExpandButtonForAllProgressionsTargets = async (
    isShrink,
    newUpdatedDataAfterUpdate,
  ) => {
    let newData = newUpdatedDataAfterUpdate ? newUpdatedDataAfterUpdate : data
    if (oldLength.SLength > -1) {
      setOldLength('')
    }

    let newUpdatedData = newUpdatedDataAfterUpdate
      ? newUpdatedDataAfterUpdate
      : data
    if (
      !data.subjects?.length ||
      !data.subjects[Length?.SLength].phases?.length ||
      !data.subjects[Length?.SLength].phases[Length?.PLength].categories
    ) {
      return
    }
    let subjectID = data.subjects[Length?.SLength].subjectId
    let phaseID = data.subjects[Length?.SLength].phases[Length?.PLength].phaseId
    let categoryID =
      data.subjects[Length?.SLength].phases[Length?.PLength].categories[
        Length?.CLength
      ].categoryId
    try {
      let res = await fetch(
        `${baseUrl}/Timelines/AllLearningTargets?studentId=${parseInt(
          studentId,
        )}&schoolId=${parseInt(schoolID)}&categoryId=${parseInt(
          categoryID,
        )}&phaseId=${parseInt(phaseID)}&subjectId=${parseInt(subjectID)}`,
        {headers},
      )
      let ProgressionDataOnExpand = await res.json()
      if (ProgressionDataOnExpand.statusCode === 200) {
        setOldLength(Length)
        let oldProgressionsList =
          newUpdatedData.subjects[Length?.SLength].phases[Length?.PLength]
            .categories[Length?.CLength].learningTargets
        let newProgressionsList =
          ProgressionDataOnExpand.data.phases[0].categories[0].learningTargets

        // if data is null assigned as empty array []
        oldProgressionsList == null && (oldProgressionsList = [])
        newProgressionsList == null && (newProgressionsList = [])
        // combined list with old progression of student data and new all learning target
        var allProgressionsList = []
        newProgressionsList.forEach(NEWDATA => {
          let aviableData = oldProgressionsList.find(
            OLDDATA => OLDDATA.learningTarget === NEWDATA.learningTarget,
          )
          if (aviableData) {
            allProgressionsList.push(aviableData)
          } else {
            allProgressionsList.push(NEWDATA)
          }
        })
        setOldProgressions(oldProgressionsList)
        newData.subjects[Length?.SLength].phases[Length?.PLength].categories[
          Length?.CLength
        ].learningTargets = allProgressionsList
        newData.subjects[Length?.SLength].phases[Length?.PLength].categories[
          Length?.CLength
        ].currentProgressLearningTargets = allProgressionsList
        !isShrink && setExpandProgressions(true)
        if (newData.subjects?.length) {
          let lastProficiency = null
          for (let i = allProgressionsList.length - 1; i >= 0; i--) {
            if (allProgressionsList[i].proficiency !== null) {
              lastProficiency = allProgressionsList[i].learningTarget
              break
            }
          }
          lastProficiency &&
            setLastP({
              learningTarget: lastProficiency,
            })
        }
        if (
          newUpdatedData &&
          newUpdatedData?.subjects[Length?.SLength]?.phases[Length?.PLength]
            ?.categories[Length?.CLength]?.learningTargets?.length <= 3
        ) {
          setExpandProgressions(true)
        }
        updateData()
        return newData
      } else {
        message.error(`${data.message}`)
        return ''
      }
    } catch (error) {
      message.error(`${Messages.unHandledErrorMsg}`)
      return ''
    }
  }

  let updatedataClone = () => {
    proficiencyPageData.studentName &&
      data.subjects[parseInt(Length?.SLength)].phases.length > 0 &&
      data.subjects[parseInt(Length?.SLength)].phases[parseInt(Length?.PLength)]
        .categories.length > 0 &&
      setProficencyPageData({
        ...proficiencyPageData,
        subject: data.subjects[parseInt(Length?.SLength)].subjectName,
        phase:
          data.subjects[parseInt(Length?.SLength)].phases[
            parseInt(Length?.PLength)
          ].phaseName,
        categoryId:
          data.subjects[parseInt(Length?.SLength)].phases[
            parseInt(Length?.PLength)
          ].categories[parseInt(Length?.CLength)].categoryId,
        category:
          data.subjects[parseInt(Length?.SLength)].phases[
            parseInt(Length?.PLength)
          ].categories[parseInt(Length?.CLength)].categoryName,
      })
    isUpdatedData && data && handleExpandButtonForAllProgressionsTargets(true)
    // isUpdatedData && data && handleExpandButtonForAllProgressionsTargets(true)
    setIsUpdatedData(false)
  }

  const handleLessButton = async () => {
    if (isBackFill) {
      setBackFilled(false)
      let newData = data
      setExpandProgressions(false)
      setData(newData)
      setOldLength('')
      updateData()
    } else {
      let newData = data
      if (oldLength.SLength > -1) {
        setExpandProgressions(false)
        setData(newData)
        setOldLength('')
        updatedataClone()
      }
    }
  }

  const getLearningTargetsColor = d => {
    console.log(d)
    if (d.imported === true) {
      return '#056608'
    } else {
      return '#28a745'
    }
  }

  return (
    <>
      <Spin spinning={loading}>
        <div className="timeline-page">
          {user.role.toLowerCase() === 'student' ? <HeaderDiv /> : ''}
          <div className=" py-4">
            <div className="bg-white border shadow-sm rounded mt-3 overflow-hidden p-1">
              <div className="student-block-details position-relative ps-5">
                <span className="student-icon">
                  <i className="icofont-ui-user"></i>
                </span>
                <div className="p-2">
                  <h5>Student Name: {data && data.studentName}</h5>
                </div>
              </div>
            </div>

            <div className="student-data-section mt-4">
              <div className="accordion" id="accordionExample">
                {data &&
                  data.subjects &&
                  data.subjects.map((d, index) => (
                    <div key={index} className="accordion-item shadow-sm">
                      <h2 className="accordion-header" id="headingOne">
                        <button
                          className={dataExpendClass(index)}
                          onClick={e => openAccordance(index)}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={index}
                          aria-expanded={dataExpend(index)}
                          aria-controls="collapseOne">
                          Subject Name: {d.subjectName}{' '}
                        </button>
                      </h2>
                      <div
                        id={index}
                        className={dataExpendClassShow(index)}
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                          <div className="dash-tabs-box">
                            <nav>
                              <div
                                className="nav nav-tabs"
                                id="nav-tab"
                                role="tablist">
                                {data &&
                                  data.subjects[index].phases.length > 0 &&
                                  data.subjects[index].phases.map((d, key) => (
                                    <button
                                      style={{
                                        backgroundColor: d.color,
                                        borderRadius: '5px',
                                      }}
                                      onClick={e =>
                                        handleChangePhase(key, index)
                                      }
                                      key={key}
                                      class={classNameValue(key)}
                                      id="nav-home-tab"
                                      data-bs-toggle="tab"
                                      data-bs-target="#nav-home"
                                      type="button"
                                      role="tab"
                                      aria-controls="nav-home"
                                      aria-selected="true">
                                      {d.phaseName}
                                    </button>
                                  ))}
                              </div>
                            </nav>
                            <div className="tab-content" id="nav-tabContent">
                              <div
                                className="tab-pane fade show active"
                                id="nav-home"
                                role="tabpanel"
                                aria-labelledby="nav-home-tab">
                                <div className="subject-list mb-3">
                                  <ul className="list-inline">
                                    {data &&
                                      data.subjects[index].phases.length > 0 &&
                                      data.subjects[index].phases[
                                        getPhaseId(index)
                                      ].categories.length > 0 &&
                                      Length?.SLength > -1 &&
                                      data.subjects[index].phases[
                                        getPhaseId(index)
                                      ].categories.map((d, i) => (
                                        <button
                                          onClick={e =>
                                            handleChangeCategories(i, d)
                                          }
                                          style={{
                                            backgroundColor: d.color,
                                            padding: '10px',
                                            borderRadius: '5px',
                                            borderWidth:
                                              i === selectedCategory
                                                ? '1px'
                                                : '0px',
                                          }}
                                          key={i}
                                          className="list-inline-item me-1 me-md-4"
                                          id="nav-home-tab"
                                          data-bs-toggle="tab"
                                          data-bs-target="#nav-home"
                                          type="primary"
                                          role="tab"
                                          aria-controls="nav-home"
                                          aria-selected="true">
                                          {d.categoryName}
                                        </button>
                                      ))}
                                  </ul>
                                  <div class="text-right">
                                    <Popconfirm
                                      placement="topRight"
                                      title="Sure to back fill data in all learning targets in this phase?"
                                      onConfirm={() => handleBackFillData()}>
                                      <div class="">
                                        <button class="btn btn-primary mt-5 mb-2">
                                          Backfill Data
                                        </button>
                                      </div>
                                    </Popconfirm>
                                  </div>
                                </div>
                                <div id="ReadinessIDSection">
                                  <div className="row">
                                    {data &&
                                      Length?.SLength > -1 &&
                                      data.subjects[index].phases.length > 0 &&
                                      data.subjects[index].phases[
                                        getPhaseId(index)
                                      ].categories.length > 0 &&
                                      (expandProgressions
                                        ? data.subjects[index].phases[
                                            getPhaseId(index)
                                          ].categories[getCategoryId(index)]
                                            .learningTargets?.length > 0
                                        : data.subjects[index].phases[
                                            getPhaseId(index)
                                          ].categories[getCategoryId(index)]
                                            .currentProgressLearningTargets
                                            ?.length) &&
                                      data.subjects[index].phases[
                                        getPhaseId(index)
                                      ].categories[getCategoryId(index)][
                                        'learningTargets'
                                      ].map((d, k, arr) => {
                                        console.log('arrr', arr, k, d)
                                        if (!expandProgressions) {
                                          let lastIPforSliceArray = arr?.find(
                                            mydata =>
                                              mydata?.proficiency == 'ip',
                                          )
                                          if (
                                            lastIPforSliceArray === undefined
                                          ) {
                                          }
                                          if (
                                            lastIPforSliceArray === undefined
                                          ) {
                                            let lastPforSliceArray = arr?.find(
                                              mydata =>
                                                mydata?.proficiency == 'p',
                                            )
                                            if (
                                              lastPforSliceArray === undefined
                                            ) {
                                              if (k >= 3) return false
                                            } else if (
                                              !(
                                                lastPforSliceArray !==
                                                  undefined &&
                                                d.learningTarget >=
                                                  lastPforSliceArray?.learningTarget -
                                                    1 &&
                                                d.learningTarget <=
                                                  lastPforSliceArray?.learningTarget +
                                                    1
                                              )
                                            ) {
                                              return false
                                            }
                                          } else if (
                                            !(
                                              lastIPforSliceArray.learningTarget -
                                                1 ==
                                                d.learningTarget ||
                                              lastIPforSliceArray.learningTarget ==
                                                d.learningTarget ||
                                              lastIPforSliceArray.learningTarget +
                                                1 ==
                                                d.learningTarget
                                            )
                                          ) {
                                            return false
                                          }
                                        } else {
                                          let findLastPInArray = arr
                                            .map(
                                              el =>
                                                el.proficiency == 'P' ||
                                                el.proficiency == 'IP',
                                            )
                                            .lastIndexOf('P')
                                          if (
                                            typeof findLastPInArray !==
                                              'undefined' &&
                                            findLastPInArray !== -1
                                          ) {
                                            lastP.learningTarget =
                                              arr[
                                                findLastPInArray
                                              ].learningTarget
                                          }
                                        }
                                        let isProficiency = d.proficiency
                                        return (
                                          <>
                                            {!!!d.backFilled ? (
                                              isProficiency?.toLowerCase() ===
                                              'ip' ? (
                                                <div className="col-lg-3">
                                                  <div className="card-bx mt-5 position-relative border-0">
                                                    <ul className="process mb-3">
                                                      <li className="process-status2 new me-2">
                                                        <i className="icofont-spinner pe-2"></i>
                                                      </li>
                                                    </ul>
                                                    <ul className="process justify-content-end d-flex">
                                                      <li className="process-status status_ip me-2">
                                                        IP
                                                      </li>
                                                      <ShowProficiency
                                                        proficiencyData={
                                                          proficiencyPageData
                                                        }
                                                        updateTimeLineData={
                                                          updateTimeLineData
                                                        }
                                                        learningTarget={
                                                          d.learningTarget
                                                        }
                                                        rosterId={'0'}
                                                        status="IP"
                                                        expandProgressions={
                                                          expandProgressions
                                                        }
                                                      />
                                                    </ul>
                                                    <div className="card-body processed pi rounded">
                                                      <p className="card-text">
                                                        {d.iCanStatement}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              ) : isProficiency?.toLowerCase() ==
                                                'p' ? (
                                                <div className="col-lg-3">
                                                  <div className="card-bx mt-5 position-relative border-0">
                                                    <ul className="process mb-3">
                                                      <li className="process-status2 me-2">
                                                        <i className="icofont-thumbs-up pe-2"></i>
                                                      </li>
                                                    </ul>
                                                    <ul className="process justify-content-end d-flex">
                                                      <li
                                                        className="process-status me-2"
                                                        style={{
                                                          backgroundColor:
                                                            getLearningTargetsColor(
                                                              d,
                                                            ),
                                                        }}>
                                                        P
                                                      </li>
                                                      <ShowProficiency
                                                        proficiencyData={
                                                          proficiencyPageData
                                                        }
                                                        updateTimeLineData={
                                                          updateTimeLineData
                                                        }
                                                        learningTarget={
                                                          d.learningTarget
                                                        }
                                                        rosterId={'0'}
                                                        status="P"
                                                        expandProgressions={
                                                          expandProgressions
                                                        }
                                                      />
                                                    </ul>
                                                    <div className="card-body processed rounded">
                                                      <p className="card-text">
                                                        {d.iCanStatement}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              ) : (
                                                <div className="col-lg-3">
                                                  <div className="card-bx mt-5 position-relative border-0">
                                                    <ul className="process justify-content-end d-flex">
                                                      {myAccount.role.toLowerCase() ===
                                                      'teacher' ? (
                                                        <ShowProficiency
                                                          updateTimeLineData={
                                                            updateTimeLineData
                                                          }
                                                          proficiencyData={
                                                            proficiencyPageData
                                                          }
                                                          learningTarget={
                                                            d.learningTarget
                                                          }
                                                          rosterId={'0'}
                                                          status=""
                                                          expandProgressions={
                                                            expandProgressions
                                                          }
                                                        />
                                                      ) : myAccount.role.toLowerCase() ===
                                                        'admin' ? (
                                                        <ShowProficiency
                                                          updateTimeLineData={
                                                            updateTimeLineData
                                                          }
                                                          proficiencyData={
                                                            proficiencyPageData
                                                          }
                                                          learningTarget={
                                                            d.learningTarget
                                                          }
                                                          rosterId={'0'}
                                                          status=""
                                                          expandProgressions={
                                                            expandProgressions
                                                          }
                                                        />
                                                      ) : myAccount.role.toLowerCase() ===
                                                        'superadmin' ? (
                                                        <ShowProficiency
                                                          updateTimeLineData={
                                                            updateTimeLineData
                                                          }
                                                          proficiencyData={
                                                            proficiencyPageData
                                                          }
                                                          learningTarget={
                                                            d.learningTarget
                                                          }
                                                          rosterId={'0'}
                                                          status=""
                                                          expandProgressions={
                                                            expandProgressions
                                                          }
                                                        />
                                                      ) : (
                                                        <li className="process-count">
                                                          {d.learningTarget}
                                                        </li>
                                                      )}
                                                    </ul>
                                                    <div className="card-body processed rounded">
                                                      <p className="card-text">
                                                        {d.iCanStatement}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              )
                                            ) : (
                                              <BackFilledComponent
                                                proficiencyPageData={
                                                  proficiencyPageData
                                                }
                                                updateTimeLineData={
                                                  updateTimeLineData
                                                }
                                                d={d}
                                                expandProgressions={
                                                  expandProgressions
                                                }
                                                isProficiency={isProficiency}
                                              />
                                            )}
                                          </>
                                        )
                                      })}
                                  </div>
                                  {data &&
                                    data?.subjects[Length?.SLength]?.phases[
                                      Length?.PLength
                                    ]?.categories[Length?.CLength]
                                      .learningTargets?.length > 3 && (
                                      <div className="text-right">
                                        <button
                                          className="btn btn-outline-expand-secondary"
                                          onClick={() => {
                                            expandProgressions
                                              ? handleLessButton()
                                              : handleExpandButtonForAllProgressionsTargets()
                                          }}>
                                          {expandProgressions
                                            ? 'Shrink'
                                            : 'Expand'}
                                        </button>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {data && data.subjects.length === 0 && (
            <Alert description="No Data" type="info" showIcon />
          )}
        </div>
      </Spin>
    </>
  )
}

export default StudentProficiency
const BackFilledComponent = ({
  proficiencyPageData,
  updateTimeLineData,
  d,
  expandProgressions,
  isProficiency,
}) => {
  return (
    <>
      <div className="col-lg-3">
        <div className="card-bx mt-5 position-relative border-0">
          <ul className="process mb-3">
            <li className="process-status2">B</li>
          </ul>
          <ul className="process justify-content-end d-flex">
            <li
              className="process-status me-2"
              style={{
                backgroundColor:
                  d.imported != null && d.imported && d.proficiency == 'P'
                    ? '#056608'
                    : d.proficiency == 'IP'
                    ? '#868686'
                    : '#28a745',
              }}>
              {isProficiency}
            </li>
            <ShowProficiency
              proficiencyData={proficiencyPageData}
              updateTimeLineData={updateTimeLineData}
              learningTarget={d.learningTarget}
              rosterId={'0'}
              status="P"
              expandProgressions={expandProgressions}
            />
          </ul>
          <div className="card-body processed rounded">
            <p className="card-text">{d.iCanStatement}</p>
          </div>
        </div>
      </div>
    </>
  )
}

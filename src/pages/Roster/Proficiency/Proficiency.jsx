import React, {useState, useEffect} from 'react'
import Layouts from '../../../components/Layouts'
//import LayoutWithoutSideBar from '../../../components/LayoutWithoutSideBars'
import AddEvidence from './AddEvidence'
import isJwtTokenExpired from 'jwt-check-expiry'
import Messages from '../../../Message/Message'
import {Link, useHistory, useLocation} from 'react-router-dom'
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
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  EyeOutlined,
  DeleteRowOutlined,
} from '@ant-design/icons'

const baseUrl = process.env.REACT_APP_BASE_URL
function ProficiencyLevel(props) {
  console.log(props)
  var user = JSON.parse(localStorage.getItem('user'))
  let headers = {'Content-Type': 'application/json'}
  const token = user.token

  var RosterID = ''
  var isAdvisory = false;
  const location = useLocation()
  const history = useHistory()
  const [updateTimeLine, setUpdateTimeLine] = useState('')
  const [evidenceId, setEvidenceId] = useState(0)
  const [evidence, setEvidence] = useState({})
  const [currentDate, setCurrentDate] = useState(new Date());
  const [disable, setDisable] = useState(false)


  if (history.location.state && history.location.state.rosterId) {
    RosterID = history.location.state.rosterId;
    isAdvisory=history.location.state.isAdvisory
  } else {
    RosterID = props.data.rosterId
  }
  //RosterID = 10;
  if (props.data) {
    var {    
      studentId,
      studentName,
      subject,
      phase,
      categoryId,
      category,
      learningTarget,
      status,
    } = props.data
  } else if (location.state) {
    var {     
      studentId,
      studentName,
      subject,
      phase,
      categoryId,
      category,
      learningTarget,
      status,
    } = location.state
  } else {
    var {     
      studentId,
      studentName,
      subject,
      phase,
      categoryId,
      category,
      learningTarget,
    } = props.location.state
  }

  var initialValues = {
    isAdvisory :isAdvisory?isAdvisory:false,
    studentId: studentId,
    studentName: studentName,
    subjectName: subject,
    phaseName: phase,
    categoryId: categoryId,
    categoryName: category,
    learningTarget: learningTarget,
    iCanStatement: '',
    description: 'string',
    proficiency: 0,
    grade: 'string',
    notes: 'string',
    teacherId: 0,
    status: status,
    showContent:true,
  }
  console.log("props", props)
  const {getFieldDecorator} = props.form
  const {TextArea} = Input
  const {Option} = Select

  var isHeader = true
  const [inputs, setInputs] = useState(initialValues)
  const [modalContent, setModalContent] = useState({
    modalName: '',
    modalData: '',
  })
  const [visible, setVisible] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [filterTable, setFilterTable] = useState([])
  const [proficiencyStatusList, setProficiencyStatusList] = useState([
    'P',
    'IP',
    ' ',
  ])
  var user = JSON.parse(localStorage.getItem('user'))

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
  const modalData = (modalName, modalData) => {
    setModalContent({modalName, modalData})
  }

  const columns = [
    {
      title: 'Evidence',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      render: (item, record, index) => <>{index + 1}</>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (text, record) => (
        <>
          <span>
            {record.description ? (
              record.description.length < 90 ? (
                record.description
              ) : (
                <>
                  {record.description.substring(0, 89)} ...{' '}
                  <button
                    onClick={() => modalData('Description', record.description)}
                    class="btn btn-outline-link"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal">
                    Read more
                  </button>
                </>
              )
            ) : (
              ''
            )}
          </span>
        </>
      ),
    },
    {
      title: 'Proficiency',
      dataIndex: 'proficiency',
      render: (text, record) => <span>{record.proficiency} </span>,
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      render: (text, record) => <span>{record.grade} </span>,
    },
    {
      title: 'Date',
      dataIndex: 'addedOn',
      render: (text, record) => (
        <span>
          {new Date(record.addedOn).toLocaleString('en-US').split(',')[0]}{' '}
        </span>
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      render: (text, record) => (
        <>
          <span>
            {record.notes ? (
              record.notes.length < 90 ? (
                record.notes
              ) : (
                <>
                  {record.notes.substring(0, 89)} ...{' '}
                  <button
                    onClick={() => modalData('Notes', record.notes)}
                    class="btn btn-outline-link"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal">
                    Read more
                  </button>
                </>
              )
            ) : (
              ''
            )}
          </span>
        </>
      ),
    },
    {
      title: 'Teacher',
      dataIndex: 'teacherName',
      render: (text, record) => <span>{record.teacherName} </span>,
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'action',
      render: (id, record) => (
        <>
          {user.role === 'SuperAdmin' || user.role === 'Admin' ? <Button type="primary" onClick={() => editEvidence(id)}>
            <EditOutlined />
          </Button> : ''}
          {user.role === 'Teacher' && record.addedOn.slice(0,10) == currentDate.slice(0,10)? <Button type="primary" onClick={() => editEvidence(id)}>
            <EditOutlined />
          </Button> : ''}
         { user.role === 'SuperAdmin' || user.role === 'Admin' ?  
         <Popconfirm
                title="Are you sure you want to delete this evidence ?"
                onConfirm={() => deleteEvidence(id)}>
                <button className="delete_btn">
                <DeleteOutlined />
                </button>
          </Popconfirm> : ''
         }
        </>
      ),
    },
  ]

  const editEvidence = async (id) =>{
    setEvidenceId(id)
    let headers = {'Content-Type': 'application/json'}
    const token = user.token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    var res = await fetch(`${baseUrl}/LearningTargetEvidences/Get?id=${parseInt(id)}`, {headers},)
    let data = await res.json()
    console.log(data) 
    setEvidence(data)
    showModal()
    getAllEvidence()
  }

  const deleteEvidence = async (id) =>{
    let headers = { 'Content-Type': 'application/json' }
    const res = await fetch(`${baseUrl}/LearningTargetEvidences/Delete?id=${id}`,{ method: 'POST' , headers })
    getAllEvidence()
    }

  const showModal = () => {
    setVisible(true)
  }

  const handleCancel = () => {
    console.log('Clicked cancel button')
    setEvidenceId(0)
    setVisible(false)
  }

  const fetchICanStatement = async () => {
    var res
    try {
      let headers = {'Content-Type': 'application/json'}
      const token = user.token
      console.log('token', token)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      res = await fetch(
        `${baseUrl}/RosterLearningTargets/GetIcanStatement?categoryId=${parseInt(inputs.categoryId)}&learningTarget=${parseInt(inputs.learningTarget)}&studentId=${parseInt(inputs.studentId)}`,
        {headers},
      )
      let data = await res.json()
      console.log('data1', data)
      setInputs({...inputs, iCanStatement: data.data})
    } catch (err) {
      console.log(err)
    }
  }

  const fetchData = async () => {    
    var res
    try {
      let headers = {'Content-Type': 'application/json'}
      const token = user.token
      console.log('token', token)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      res = await fetch(
        `${baseUrl}/RosterLearningTargets/GetByRosterIdAndLearningTarget?rosterId=${parseInt(
          RosterID,
        )}&learningTarget=${inputs.learningTarget}`,
        {headers},
      )
      let data = await res.json()
      console.log('data1', data)
      setInputs({...inputs, iCanStatement: data.data.iCanStatement})
    } catch (err) {
      console.log(err)
    }
  }

  const getAllEvidence = async () => {
    var res
    try {
      var currentDate = new Date()
      var month = currentDate.getMonth()+1;
      var cDdate = currentDate.getFullYear() + '-' + ('0' + month).slice(-2) + '-' + ('0' + currentDate.getDate()).slice(-2) + 'T' + currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds() + '.' + currentDate.getMilliseconds();
      setCurrentDate(cDdate);
      let headers = {'Content-Type': 'application/json'}
      const token = user.token
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      res = await fetch(
        `${baseUrl}/LearningTargetEvidences/GetAll?studentId=${parseInt(
          inputs.studentId,
        )}&rosterId=${parseInt(RosterID)}&categoryId=${parseInt(
          inputs.categoryId,
        )}&learningTarget=${parseInt(inputs.learningTarget)}`,
        {headers},
      )
      let data = await res.json()
      console.log('data', data.data)
      setFilterTable([...data.data])      
      } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => { 
    headers['Authorization'] = `Bearer ${token}`  
    fetch(`${process.env.REACT_APP_BASE_URL}/RosterLearningTargets/GetIcanStatement?categoryId=${inputs.categoryId}&learningTarget=${inputs.learningTarget}&studentId=1`)
    .then(res => res.json())
    .then(data =>{
      if(data.data !== null){
      setInputs({...inputs, iCanStatement: data.data})
      }
    })
    !isExpired && inputs.categoryId && (inputs.isAdvisory || !(parseInt(RosterID))) && fetchICanStatement()
    inputs.categoryId &&  getAllEvidence()
    if (props.data) {
      setUpdateTimeLine(1)
    }

    fetch(`${baseUrl}/LearningTargets/GetByCategoryIdLearningTargetStudentId?studentId=${parseInt(location.state.studentId)}&categoryId=${parseInt(location.state.categoryId != null ? location.state.categoryId : props.data.categoryId)}&learningTarget=${parseInt(location.state.learningTarget != null ? location.state.learningTarget : props.data.learningTarget)}`, {
      headers,
    })
      .then(res => res.json())
      .then(data =>{
          console.log(data)
          if(data.data.imported === true && data.data.progress === 'P'){
            setDisable(true)
          }
        })
  }, [])

  const handleGetAllEvidence = () => {
    getAllEvidence()
  }

  const handleSubmitUpdate = e => {
    e.preventDefault()
    let headers = {'Content-Type': 'application/json'}
    const token = user.token
    const schoolID = user.schoolId
    console.log(inputs)
    props.form.validateFields((err, values) => {
      if (!err) {
        let data = {
          studentId: inputs.studentId,
          categoryId: inputs.categoryId,
          learningTarget: inputs.learningTarget,
          status: inputs.status,
          rosterId: RosterID,
        }
        const requestMetadata = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
        console.log(data)
        fetch(`${baseUrl}/LearningTargets/SaveProficiency`, requestMetadata)
          .then(res => res.json())
          .then(data => {
            if (data.data === null) {
              message.warning('Proficiency cannot be changed as it was set in previous Session.')
            }
            if (data.statusCode === 200 && data.data != null) {
              message.success('Status is updated successfully !!')
              updateTimeLine && props.updateTimeLineData()
              console.log('data3', data)             
              //props.form.resetFields()
            } else if (data.statusCode === 208) {
              //message.warning(data.message)
            } else {
              updateTimeLine && props.updateTimeLineData()
             // message.info(Messages.unHandledErrorMsg)
            }
          })
      }
    })
  }

  const isVisible = () => {
    if (
      user.role.toLowerCase() === 'superadmin' ||
      user.role.toLowerCase() === 'admin' ||
      user.role.toLowerCase() === 'teacher'
    ) {
      return true
    }
    return false
  }

  const isVisibleAdminsOnly = () => {
    if (
      user.role.toLowerCase() === 'superadmin' ||
      user.role.toLowerCase() === 'admin'
    ) {
      return true
    }
    return false
  }


  return (
    <>
      <ModalContent modal={modalContent} />
      <div className="dash-bg-white">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={16} lg={8}>
            <div className="section-top-heading">
              <h3
                style={{
                  color: '#0C1362',
                  fontWeight: '600',
                  fontSize: '20px',
                }}>
                {' '}
                Proficiency{' '}
              </h3>
            </div>
          </Col>
          <Col xs={24} sm={24} md={8} lg={6}>
            <Form.Item>
              <div
                style={{
                  textAlign: 'center',
                  padding: '8px',
                  borderRadius: '4px',
                  backgroundColor: '#faad14',
                }}>
                <label style={{color: '#fff', fontWeight: '500'}}>
                  Learning Target :
                  <span style={{color: '#fff', fontWeight: '500'}}>
                    {' '}
                    {inputs.learningTarget}
                  </span>
                </label>
              </div>
            </Form.Item>
          </Col>
          {/*<Col xs={24} sm={24} md={24} lg={2}></Col> */}
         {inputs.showContent ? <Col xs={24} sm={24} md={24} lg={10}>
            <Row gutter={[16, 16]}>
              <div className="d-flex status-label-row ">
                {(status !== 'P' && isVisible()) ||
                (status == 'P' && isVisibleAdminsOnly()) ? (
                  <Form.Item
                    label="Status"
                    name="status"
                    className="status-label  ">
                    {getFieldDecorator('status', {
                      rules: [
                        {
                          required: true,
                          message: 'Please select status!',
                        },
                      ],
                      initialValue: status,
                    })(
                      <Select
                        value="Select"
                        onChange={value =>
                          setInputs({...inputs, status: value})
                        }
                        name="status"
                        style={{width: '100%'}}
                        disabled = {disable}
                        >
                        {proficiencyStatusList &&
                          proficiencyStatusList.map((status, key) => (
                            <Option
                              key={key}
                              value={status}
                              className="proficiency-dropdown-select">
                              {' '}
                              {status}
                            </Option>
                          ))}
                      </Select>,
                    )}
                  </Form.Item>
                ) : (
                  <Form.Item>
                    <label className="text-label">
                      Status :
                      <span style={{lineHeight: 'normal'}}>{status}</span>
                    </label>
                  </Form.Item>
                )}
                {(status !== 'P' && isVisible()) ||
                (status == 'P' && isVisibleAdminsOnly()) ? (
                  <Button
                    type="primary"
                    onClick={handleSubmitUpdate}
                    htmlType="submit">
                    Update
                  </Button>
                ) : (
                  ''
                )}
              </div>
            </Row>
          </Col> :""}
        </Row>
      </div>

      <Form
        style={{margin: '15px 0'}}
        name="basic"
        initialValues={{remember: true}}
        autoComplete="off">
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Form.Item>
              <label className="text-label">
                Student :<span> {inputs.studentName}</span>
              </label>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6} lg={6}>
            <Form.Item>
              <label className="text-label">
                Subject :<span> {inputs.subjectName}</span>
              </label>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6} lg={6}>
            <Form.Item>
              <label className="text-label">
                Phase :<span> {inputs.phaseName}</span>
              </label>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={6} lg={6}>
            <Form.Item>
              <label className="text-label">Category :</label>
              <span
                style={{
                  lineHeight: 'normal',
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                {inputs.categoryName}
              </span>
            </Form.Item>
          </Col>

        </Row>
        <Row>
          <Col xs={24} sm={12} md={18} lg={24}>
            <Form.Item>
              <div style={{width:"100%",display:"flex",margin: "10px 0"}}>
                <label className="text-label" style={{width: '160px'}}>
                  I Can Statement :
                </label>
                <span
                  style={{
                    lineHeight: 'normal',
                    color: '#333',
                    fontSize: '14px',
                    fontWeight: '600',
                    padding:"0 35px 0 0"
                    
                  }}>
                  {inputs.iCanStatement}
                </span>
              </div>
            </Form.Item>
          </Col>
          </Row>
      </Form>

      <Row style={{margin: '25px 0'}}>
        <Form>
          <Col sm={12} md={12} lg={12}></Col>
          {isVisible() ? (
            <Col sm={12} md={12} lg={12}>
              <div className="btn-level " style={{textAlign: 'right'}}>
                <Button
                  className="Add-btn-top"
                  type="primary"
                  onClick={showModal}>
                  <PlusOutlined />
                  Add Evidence
                </Button>

                {evidenceId === 0 && <Modal
                  title="Add Evidence"
                  visible={visible}
                  footer={null}
                  onCancel={handleCancel}>
                  <AddEvidence
                    studentId={inputs.studentId}
                    categoryId={inputs.categoryId}
                    learningTarget={inputs.learningTarget}
                    rosterId={RosterID}
                    evidenceId={evidenceId}
                    handleGetAllEvidence={handleGetAllEvidence}
                  />
                </Modal>}

                {evidenceId !== 0 && <Modal
                  title="Edit Evidence"
                  visible={visible}
                  footer={null}
                  onCancel={handleCancel}>
                  <AddEvidence
                    evidence={evidence} 
                    evidenceId={evidenceId} 
                    studentId={inputs.studentId}
                    categoryId={inputs.categoryId}
                    learningTarget={inputs.learningTarget}
                    rosterId={RosterID}                 
                    handleGetAllEvidence={handleGetAllEvidence}
                  />
                </Modal>}
              </div>
            </Col>
          ) : (
            ''
          )}
        </Form>
      </Row>

      {filterTable.length > 0 && (
        <div className="table-grid-bx">
          <Table columns={columns} dataSource={filterTable} />
        </div>
      )}
    </>
  )
}

const ModalContent = props => {
  return (
    <>
      <div
        class="modal fade "
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                {' '}
                {props.modal.modalName}{' '}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div class="modal-body modal-text ">{props.modal.modalData}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Form.create()(ProficiencyLevel)

import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import AddDateRange from './AddDateRange'
import {Link, useHistory} from 'react-router-dom'
import isJwtTokenExpired from 'jwt-check-expiry'
import Layouts from '../../components/Layouts'
import ViewRotations from './ViewRotations'
import Messages from '../../Message/Message'
import {
  Form,
  Col,
  Select,
  Row,
  Icon,
  Input,
  Tooltip,
  Button,
  Modal,
  Popconfirm,
  Table,
  Tag,
  Checkbox,
  Space,
  message,
  Spin,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  EyeOutlined,
} from '@ant-design/icons'
// import {updateMyAccount , deleteMyAccount  } from '../../Slicers/myAccountSlice'

const baseUrl = process.env.REACT_APP_BASE_URL

// "id": 3,
// "schoolId": 1,
// "sessionName": "S 3",
// "startDate": "2022-09-01T08:25:43.123",
// "endDate": "2022-12-31T08:25:43.123",
// "isActive": true,
// "addedOn": "2022-07-04T08:29:38.2544446",
// "addedBy": 2,
// "modifyOn": "2022-07-04T08:29:38.2544447",
// "modifyBy": 2
const SystemSetting = props => {
  const {Search} = Input
  const history = useHistory()
  const [rosterDateRangeList, setRosterDateRangeList] = useState([])
  const [filterTable, setFilterTable] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [idForVisibleModel, setIdForVisibleModel] = useState(0);
  const [idForVisibleModelForStatus, setIdForVisibleModelForStatus] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // var category = useSelector((state) => state.category.value)
  const dispatch = useDispatch()
  //var myAccount = useSelector((state)=> state.myAccount.value)
  const text = 'Are you sure to delete this Date Range?'
  var width = 700

  var user = JSON.parse(localStorage.getItem('user'))
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
  const fetchSessions = async () => {
    var res
    try {
      let headers = {'Content-Type': 'application/json'}
      const token = user.token
      console.log('token', token)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      res = await fetch(
        `${baseUrl}/SessionSettings/GetAll?schoolId=${parseInt(schoolID)}`,
        {headers},
      )
      let data = await res.json()
      console.log('data', data)
      setRosterDateRangeList([...data.data])
    } catch (err) {
      setRosterDateRangeList([])
      console.log(err)
    }
  }

  const SetActiveSession = async sessionID => {
    var res
    setIsLoading(true)
    try {
      let headers = {'Content-Type': 'application/json'}
      const token = user.token
      console.log('token', token)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const requestMetadata = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      res = await fetch(
        `${baseUrl}/SessionSettings/SetActiveSession?id=${parseInt(
          sessionID,
        )}&schoolId=${parseInt(schoolID)}`,
        requestMetadata,
      )
      let data = await res.json()
      console.log('data', data)
      if (data.statusCode === 200) {
        message.success('Successfully updated active session!')
        setRosterDateRangeList([...data.data])
      } else {
        // debugger
        message.info(data.message)
      }
    } catch (err) {
      setRosterDateRangeList([])
      console.log(err)
    }
    setIsLoading(false)
    history.push("/learning-targets")
  }

  useEffect(() => {
    !isExpired && fetchSessions()
    //dispatch(updateMyAccount(user));
  }, [])

  useEffect(() => {
    setFilterTable([...rosterDateRangeList])
  }, [rosterDateRangeList])

  // update Roster list

  const addNewRosterInList = () => {
    fetchSessions()
  }

  const showModal = id => {
    setIsModalVisible(true)
    setIdForVisibleModel(id)
    console.log('id', id)
  }

  const handleOk = () => {
    setIsModalVisible(false);
    setIdForVisibleModel(0)

  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setIdForVisibleModel(0)

  }



  const showModalForUpdateStatus = id => {
    setIsModalVisible(true)
    setIdForVisibleModelForStatus(id)
    console.log('id', id)
  }

  const handleOkForUpdateStatus = (id) => {
    idForVisibleModelForStatus &&  HandleChangeActiveSession(idForVisibleModelForStatus)
    setIsModalVisible(false);
    setIdForVisibleModelForStatus(0)
  }

  const handleCancelForUpdateStatus = () => {
    // debugger
    setIdForVisibleModelForStatus(0)
    setIsModalVisible(false)
  }

  const onSearch = value => {
    const searchRes = rosterDateRangeList.filter(o =>
      Object.keys(o).some(k =>
        String(o[k]).toLowerCase().includes(value.toLowerCase()),
      ),
    )
    console.log(searchRes)
    setFilterTable([...searchRes])
    // setFilterTable([...searchRes])
  }

  const handleDelete = id => {
    // Rosters/Delete?id=3
  }

  const HandleChangeActiveSession = id => {
    // SessionSettings/SetActiveSession?id=1&schoolId=1
    SetActiveSession(id)
  }

  function onChange(e) {
    //alert("Hii")
  }

  const DeleteDateRange = id => {
    // RosterDateRanges/Delete?id=1&schoolId=1
    //   e.preventDefault()
    // debugger;
    // props.form.validateFields((err, values) => {
    //     if (!err) {
    const token = user.token
    const requestMetadata = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }

    fetch(
      `${baseUrl}/RosterDateRanges/Delete?id=${id}&schoolId=${schoolID}`,
      requestMetadata,
    )
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 200) {
          message.success('Date range is removed successfully !!')
          console.log('res', data)
          // console.log('target', data.data)
          //  props.form.resetFields()
          fetchSessions()
        } else if (data.statusCode === 208) {
          //  console.log("res",data);
          message.warning(data.message)
        } else {
          //  console.log("res",data);
          message.info(data.message)
        }
      })
    //     }
    // })
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      render: (item, record, index) => <>{index + 1}</>,
    },
    {
      title: 'School Years',
      dataIndex: 'sessionName',
      key: 'startDate',
      //   sorter: (a, b) =>   a.rosterName.localeCompare(b.rosterName) ,
    },

    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      //   sorter: (a, b) =>   a.rosterName.localeCompare(b.rosterName) ,
      render: (id, record) => (
        <>{new Date(record.startDate).toLocaleString('en-US').split(',')[0]}</>
      ),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      // sorter: (a, b) =>  a.teacher.localeCompare(b.teacher) ,
      render: (id, record) => (
        <>{new Date(record.endDate).toLocaleString('en-US').split(',')[0]}</>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      // sorter: (a, b) =>  a.teacher.localeCompare(b.teacher) ,
      render: (id, record) => (
        <>
          <Checkbox
            className="input-check"
            onChange={e => showModalForUpdateStatus(record.id)}
            name="isActive"
            checked={record.isActive}
            value={record.isActive}></Checkbox>
          <Modal
            title="Change School Year"
            //footer={null}
            width={parseInt(width)}
            visible={idForVisibleModelForStatus === record.id ? isModalVisible : false}
            onOk={handleOkForUpdateStatus}
            onCancel={handleCancelForUpdateStatus}>
              <h3>Verbiage can be subject to change !!</h3>
          </Modal>
        </>
      ),
    },

    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (id, record) => (
        <>
          <Button type="primary" onClick={() => showModal(record.id)}>
            View Rotations
          </Button>
          <Modal
            title="Rotations"
            footer={null}
            width={parseInt(width)}
            visible={idForVisibleModel === record.id ? isModalVisible : false}
            onOk={handleOk}
            onCancel={handleCancel}>
            <ViewRotations key={record.id} data={record} />
          </Modal>
        </>
      ),
    },
  ]

  return (
    <>
    <Spin spinning={isLoading}>
      <Layouts title="assets" className="dashboard">
        <div className="dash-bg-white">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={24} md={24} lg={6}>
              <div className="section-top-heading">
                <h3
                  style={{
                    color: '#0C1362',
                    fontWeight: '600',
                    fontSize: '20px',
                  }}>
                  {' '}
                  Manage School Years{' '}
                </h3>
              </div>
            </Col>
            <Col xs={10} sm={24} md={24} lg={18}>
              <Row gutter={[16, 16]}>
                <Col xs={10} sm={24} md={24} lg={20}>
                  <div className="section-top-heading">
                    <Search
                      placeholder="input search text"
                      onChange={e => onSearch(e.target.value)}
                      onSearch={onSearch}
                    />
                  </div>
                </Col>
                <Col xs={10} sm={20} md={24} lg={4}>
                  <AddDateRange updateRanges={fetchSessions} />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className="table-grid-bx">
          <Table columns={columns} dataSource={filterTable} rowKey="id" />
        </div>
      </Layouts>
      </Spin>
    </>
  )
}

export default SystemSetting

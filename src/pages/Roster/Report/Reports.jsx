import Layouts from '../../../components/Layouts'
import React, {useState, useEffect} from 'react'
import Messages from '../../../Message/Message'
import isJwtTokenExpired from 'jwt-check-expiry'
import ViewReport from './ViewReport'
import {
  Col,
  Row,
  Input,
  message,
  Table,
  Button,
  Modal,
} from 'antd'

const baseUrl = process.env.REACT_APP_BASE_URL

const Report = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const {Search} = Input
  const [ReportsList, setreportsList] = useState([])
  const [dataToView, setDataToView] = useState()
  const [filteredData, setFilteredData] = useState([])
  const intialValues = {
    ReportName: '',
    Student: '',
    Teacher: '',
    Subject: '',
    DateRange: '',
  }

  var user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    var isExpired = isJwtTokenExpired(user.token)

    if (isExpired) {
      message.error(`${Messages.unHandledErrorMsg}`)
    }
  } else {
    message.error(`${Messages.unHandledErrorMsg}`)
  }

  let headers = {'Content-Type': 'application/json'}
  const token = user.token

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const handlePrint = async id => {
    try {
      console.log(id)
      await fetch(`${baseUrl}/Reports/GetByReportId?reportId=${id}`, {
        method: 'GET',
        headers,
      })
        .then(res => res.json())
        .then(data => {
          setDataToView(data)
          let newWindow = window.open('/View-Reports')
          newWindow.my_special_setting = id
        })
    } catch (e) {
      console.log(e)
    }
  }

  const handleDelete = async (id, schoolID) => {
    try {
      await fetch(`${baseUrl}/Rosters/Delete?id=${id}&schoolId=${schoolID}`, {
        method: 'POST',
        headers,
      })
    } catch (e) {
      console.log(e)
    }
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  useEffect(() => {
    !isExpired &&
      fetch(`${baseUrl}/Reports/GetAll?id=0`, {headers})
        .then(res => res.json())
        .then(data => {
          if (data.statusCode === 200) {
            console.log(data.data)
            setreportsList([...data.data])
          }
        })
        .catch(e => {
          message.error(`${Messages.unHandledErrorMsg}`)
        })
  }, [])

  useEffect(() => {
    setFilteredData([...ReportsList])
  }, [ReportsList])

  const onSearch = value => {
    const filteredData = ReportsList.filter(x =>
      x.reportName.toLowerCase().includes(value.toLowerCase()),
    )
    setFilteredData(filteredData)
  }

  const columns = [
    {
      title: 'Report Name',
      dataIndex: 'reportName',
      key: 'reportName',
      sorter: (a, b) => a.reportName.localeCompare(b.reportName),
      render(text, record) {
        return {
          children: <div>{record.reportName}</div>,
        }
      },
    },
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
      render(text, record) {
        return {
          children: <div>{record.student}</div>,
        }
      },
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher',
      key: 'teacher',
      render(text, record) {
        return {
          children: <div>{record.teacher}</div>,
        }
      },
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render(text, record) {
        return {
          children: <div>{record.subject}</div>,
        }
      },
    },
    {
      title: 'Date-Range',
      dataIndex: 'dateRange',
      key: 'dateRange',
      sorter: (a, b) => a.dateRange.localeCompare(b.dateRange),
      render(text, record) {
        return {
          children: (
            <div>
              {record.dateRange !== '01/01/0001-01/01/0001'
                ? record.dateRange
                : ''}
            </div>
          ),
        }
      },
    },
    {
      title: 'Added On',
      dataIndex: 'addedOn',
      key: 'addedOn',
      sorter: (a, b) => a.addedOn.localeCompare(b.addedOn),
      render(text, record) {
        return {
          children: <div>{record.addedOn.slice(0, 10)}</div>,
        }
      },
    },
    {
      title: 'Action',
      dataIndex: 'category',
      key: 'action',
      fixed: 'right',
      width: 150,
      render(text, record) {
        return {
          props: {
            style: {background: record.advisory ? '#a6caeb' : ''},
          },
          children: (
            <>
              <Button
                style={{margin: '4px 0 0'}}
                type="primary"
                onClick={() => {
                  handlePrint(record.reportId)
                }}>
                View
              </Button>
              <Modal
                title="Report"
                footer={null}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}>
                <ViewReport dataParentToChild={dataToView} />
              </Modal>
              {/* {user.role === 'Admin' &&
          <Popconfirm
          title="Sure to delete this report ?"
          onConfirm={() =>{handleDelete(record.id,record.schoolId)}}>
          <Button style={{  backgroundColor: "#ff1919",
  margin: "4px 0 0"}}
            type="primary">
            Delete
          </Button>
          </Popconfirm>}   
          {user.role === 'SuperAdmin' &&
          <Popconfirm
          title="Sure to delete this report ?"
          onConfirm={() =>{handleDelete(record.id,record.schoolId)}}>
          <Button style={{  backgroundColor: "#ff1919",
  margin: "4px 0 0"}}
            type="primary">
            Delete
          </Button>         
          </Popconfirm>}      */}
            </>
          ),
        }
      },
    },
  ]

  return (
    <>
      <Layouts title="assets" className="dashboard">
        <div className="dash-bg-white">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={6}>
              <div className="section-top-heading">
                <h3
                  style={{
                    color: '#0C1362',
                    fontWeight: '600',
                    fontSize: '20px',
                  }}>
                  {' '}
                  Manage Reports{' '}
                </h3>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={18}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <div className="section-top-heading">
                    <Search
                      placeholder="Input search text"
                      onChange={e => onSearch(e.target.value)}
                    />
                  </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={3}>
                  {' '}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className="table-grid-bx">
          <Table columns={columns} dataSource={filteredData} pagination={{pageSize: 50}}/>
        </div>
      </Layouts>
    </>
  )
}

export default Report

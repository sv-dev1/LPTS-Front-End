import Layouts from '../../components/Layouts'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CreateRoster from './CreateRoster'
import Messages from '../../Message/Message'
import { Link, useHistory } from 'react-router-dom'
import isJwtTokenExpired from 'jwt-check-expiry'
import {
  Form,
  Col,
  Select,
  Row,
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

// {
//     "id": 1,
//     "rosterName": "Fist Roster",
//     "teacher": "Teacher1 User",
//     "rotation": 0,
//     "block": 0,
//     "advisory": true,
//     "team": "Test Team",
//     "subject": "Math",
//     "phase": "Readiness",
//     "category": "Numbers and Operations",
//     "learningTargetFrom": 100,
//     "learningTargetTo": 110,
//     "learningYearFrom": 100,
//     "learningYearTo": 110,
//     "addedOn": "2022-05-26T07:38:55.8513929",
//     "addedBy": 1,
//     "modifyOn": "2022-05-26T07:38:55.8514672",
//     "modifyBy": 1
//   },
const Roster = () => {
  const { Search } = Input
  const history = useHistory()

  const [RosterList, setRosterList] = useState([])
  const [expiredRosterList, setexpiredRosterList] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [activeSession, setActiveSession] = useState({id: 0})
  const [idForVisibleModel, setIdForVisibleModel] = useState(0)
  const [filterTable, setFilterTable] = useState([])
  const [expiredRosterCheckbox , setExpiredRosterCheckbox] = useState(false);
  // var category = useSelector((state) => state.category.value)
  const dispatch = useDispatch()
  //var myAccount = useSelector((state)=> state.myAccount.value)

  var user = JSON.parse(localStorage.getItem('user'))
  const schoolID = user.schoolId
  if (user) {
    var isExpired = isJwtTokenExpired(user.token)

    if (isExpired) {
     message.error(`${Messages.unHandledErrorMsg}`)
      history.replace({ pathname: '/', state: { isActive: true } })
    }
  } else {
   message.error(`${Messages.unHandledErrorMsg}`)
    history.replace({ pathname: '/', state: { isActive: true } })
  }

  let headers = { 'Content-Type': 'application/json' }
      const token = user.token
      console.log('token', token)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

  const fetchRoster = async (sessionID) => {
    //debugger
    var res
    try {      
      res = await fetch(
        `${baseUrl}/Rosters/GetAllSessionRosters?sessionId=${parseInt(sessionID)}&schoolId=${parseInt(schoolID)}`,
        { headers },
      )
      let data = await res.json()
      console.log('data', data)
      setRosterList([...data.data])
     // setFilterTable([...data.data])
    } catch (err) {
      setRosterList([])
      console.log(err)
    }
  }

  const fetchExpiredRoster = async (sessionID) => {
  //  debugger
    var res
    try {
      
      res = await fetch(
     //   Rosters/GetAllSessionExpiredRosters?schoolId=2&sessionId=2
        `${baseUrl}/Rosters/GetAllSessionExpiredRosters?sessionId=${parseInt(sessionID)}&schoolId=${parseInt(schoolID)}`,
        { headers },
      )
      let data = await res.json()
      console.log('dataExpired', data)
      setexpiredRosterList([...data.data])
    } catch (err) {
      setexpiredRosterList([])
      console.log(err)
    }
  }

  useEffect(() => {
    !isExpired &&  fetch(
      `${baseUrl}/SessionSettings/GetActiveSession?schoolId=${parseInt(
        schoolID,
      )}`,
      {headers},
    ).then(res => res.json())
      .then(data => {
        if (data.statusCode === 200) {
          fetchRoster(data.data.id)
          fetchExpiredRoster(data.data.id)
          setActiveSession(data.data)
        }
      })
      .catch(e => {
        // debugger
       message.error(`${Messages.unHandledErrorMsg}`)
      }) 
      console.log(user)
  }, [])

  useEffect(() => {
    console.log("RosterList?.length" , RosterList , RosterList.length);
  //  debugger
    let arrayForFilter = expiredRosterCheckbox ? expiredRosterList :RosterList 
    setFilterTable([...arrayForFilter])
  }, [RosterList, RosterList?.length])

  // update Roster list
  const updateRosterList = data => {
    // console.log("updatedphase" , data);
    // console.log("phasesLIst" , phasesLIst);
    // const index = phasesLIst.findIndex(Phase => Phase.phase.id === data.phase.id);
    // index &&( phasesLIst[index] = data);
    // setPhasesList([...phasesLIst])
    activeSession.id && fetchRoster(activeSession.id)
  }

  const addNewRosterInList = () => {
    activeSession.id && fetchRoster(activeSession.id)
  }

  const showModal = id => {
    setIsModalVisible(true)
    setIdForVisibleModel(id)
    console.log('id', id)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const onSearch = value => {
    debugger
    let arrayForFilter = expiredRosterCheckbox ? expiredRosterList :RosterList ;
    const searchRes = arrayForFilter.filter(o =>
      Object.keys(o).some(k =>
        String(o[k]).toLowerCase().includes(value.toLowerCase()),
      ),
    )
 //   console.log(searchRes)
    setFilterTable([...searchRes])
    // setFilterTable([...searchRes])
  }

  // const handleDelete = id => {
  //   // Rosters/Delete?id=3
  // }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  function onChange(e) {
    //alert("Hii")
  }

  const handleEdit = id => {
    console.log('id', id)
    history.push('/CreateRoster', { rosterId: id })
  }

  const handleDelete = async(id,schoolID) => {
    //console.log("headers" , headers) 
    try{
      await fetch(`${baseUrl}/Rosters/Delete?id=${id}&schoolId=${schoolID}`,{ method: 'POST' , headers })
      activeSession.id &&     
       expiredRosterCheckbox ? fetchExpiredRoster(activeSession.id) :fetchRoster(activeSession.id) 
    } catch(e){
          console.log(e)
    }  
       
  }
  const handleView =( id , isAdvisory )=> {
    console.log('id', id)
    history.push('/proficiency-level', { rosterId: id  , isAdvisory:isAdvisory })
  }

  // "id": 1,
  // "subjectId": 3,
  // "phaseName": "Test Phase 1",
  // "isActive": true,
  // "addedOn": "2022-05-09T07:06:54.6669059",
  // "addedBy": 1,
  // "modifyOn": "2022-05-09T07:06:54.6670291",
  // "modifyBy": 1
  const columns = [
    {
      title: 'Roster Name',
      dataIndex: 'rosterName',
      key: 'Roster Name',
      sorter: (a, b) => a.rosterName.localeCompare(b.rosterName),
      render(text, record) {

        return {
          props: {
            style: { background: record.advisory ? " #a6caeb" : "" }
          },
          children: <div>{record.rosterName}</div>
        };
      },
    },
    {
      title: 'Teacher Name',
      dataIndex: 'teacher',
      key: 'teacher',
      sorter: (a, b) => a.teacher.localeCompare(b.teacher),
      render(text, record) {

        return {
          props: {
            style: { background: record.advisory ? "#a6caeb" : "" }
          },
          children: <div>{record.teacher}</div>
        };
      },
    },
   
    {
      title: 'Team',
      dataIndex: 'team',
      key: 'team',
      sorter: (a, b) => a.team.localeCompare(b.team),
      render(text, record) {

        return {
          props: {
            style: { background: record.advisory ? "#a6caeb" : "" }
          },
          children: <Tag key={text} color={record.team ? "#40a9ff" : record.advisory ? "#a6caeb" :"#f5f5f5"} >
                           {record.team}
                     </Tag>
        };
      },
    },
    {
      title: 'Date range',
      dataIndex: 'dateRange',
      key: 'dateRange',
      //  sorter: (a, b) => a.dateRange - b.dateRange,
      render(text, record) {

        return {
          props: {
            style: { background: record.advisory ? "#a6caeb" : "" }
          },
          children: <div>{record.dateRange}</div>
        };
      },
    },
    {
      title: 'Block',
      dataIndex: 'block',
      key: 'block',
      sorter: (a, b) => a.block - b.block,
      render(text, record) {

        return {
          props: {
            style: { background: record.advisory ? "#a6caeb" : "" }
          },
          children: <div>{record.block}</div>
        };
      },
    },

    {
      title: 'Subject Name',
      dataIndex: 'subject',
      key: 'subject',
      sorter: (a, b) => a.subject.localeCompare(b.subject),
      render(text, record) {

        return {
          props: {
            style: { background: record.advisory ? "#a6caeb" : "" }
          },
          children: <div>{record.subject}</div>
        };
      },
    },
    {
      title: 'Phase Name',
      dataIndex: 'phase',
      key: 'phase',
      sorter: (a, b) => a.phase.localeCompare(b.phase),
      render(text, record) {

        return {
          props: {
            style: { background: record.advisory ? "#a6caeb" : "" }
          },
          children: <div>{record.phase}</div>
        };
      },
    },
    {
      title: 'Category Name',
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
      render(text, record) {

        return {
          props: {
            style: { background: record.advisory ? " #a6caeb" : "" }
          },
          children: <div>{record.category}</div>
        };
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
            style: { background: record.advisory ? " #a6caeb" : "" }
          },
          children:  <>
          <Button
            type="success"
            onClick={() => {
              handleView(record.id , record.advisory )
            }}>
            View
          </Button>
          <Button
            type="primary"
            onClick={() => {
              handleEdit(record.id)
            }}>
            Edit
          </Button>
          {user.role === 'Admin' &&
          <Popconfirm
          title="Sure to delete this roster ?"
          onConfirm={() =>{handleDelete(record.id,record.schoolId)}}>
          <Button style={{  backgroundColor: "#ff1919",
  margin: "4px 0 0"}}
            type="primary">
            Delete
          </Button>
          </Popconfirm>}   
          {user.role === 'SuperAdmin' &&
          <Popconfirm
          title="Sure to delete this roster ?"
          onConfirm={() =>{handleDelete(record.id,record.schoolId)}}>
          <Button style={{  backgroundColor: "#ff1919",
  margin: "4px 0 0"}}
            type="primary">
            Delete
          </Button>
          </Popconfirm>}     
        </>
        };
      },
    },
    
    // {
    //   title: 'Created BY',
    //   dataIndex: 'CreatedBY',
    //   key: 'CreatedBY',
    // },
    // {
    //   title: 'Tags',
    //   key: 'tags',
    //   dataIndex: 'tags',
    //   render: tags => (
    //     <>
    //       {tags.map(tag => {
    //         let color = tag.length > 5 ? 'geekblue' : ' #a6caeb';
    //         if (tag === 'loser') {
    //           color = 'volcano';
    //         }
    //         return (
    //           <Tag color={color} key={tag}>
    //             {tag.toUpperCase()}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (text, record) => (
    //    <div>
    //    <a>Invite {record.phaseName}</a>
    //    <a>Delete</a>
    //    </div>

    //   ),
    // },
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
                  Manage Roster{' '}
                </h3>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={18}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={18}>
                  <div className="section-top-heading">
                    <Search
                      placeholder="Input search text"
                      onChange={e => onSearch(e.target.value)}
                      onSearch={onSearch}
                    />
                  </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={3}>
                  <Link to="/CreateRoster">
                    {' '}
                    <Button
                      className="Add-btn-top"
                      type="primary"
                      onClick={showModal}>
                      <PlusOutlined />
                      Add
                    </Button>{' '}
                  </Link>
                </Col>
                <Col xs={24} sm={24} md={24} lg={3}>
                    {' '}
                    <Button
                      className="Add-btn-top"
                      type="primary"
                      onClick={()=>{setExpiredRosterCheckbox(!expiredRosterCheckbox)}}>
                     
                     { expiredRosterCheckbox? "Show Unexpired":"Show Expired"}
                    </Button>{' '}
                
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className="table-grid-bx">
        <Table 
           columns={columns}
           dataSource={expiredRosterCheckbox? expiredRosterList: filterTable} 
           onRow={(record, rowIndex) => {
            return {
             
              onDoubleClick: event => { handleView(record.id , record.advisory );}, // double click row

            };
          }}
         />
      </div>

 {/*     <div className="table-grid-bx">
      <Table 
         columns={columns}
         dataSource={filterTable} 
         onRow={(record, rowIndex) => {
          return {
            onClick: event => {console.log("1")}, // click row
            onDoubleClick: event => {console.log("2")}, // double click row
            onContextMenu: event => {console.log("3")}, // right button click row
            onMouseEnter: event => {console.log("4")}, // mouse enter row
            onMouseLeave: event => {console.log("5")}, // mouse leave row
          };
        }}
       />
      </div> */}
      </Layouts>
    </>
  )
}

export default Roster

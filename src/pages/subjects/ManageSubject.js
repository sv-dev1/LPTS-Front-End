// export default customer
import Layouts from '../../components/Layouts'
import React, {useState, useEffect} from 'react'
import isJwtTokenExpired from 'jwt-check-expiry'
import AddSubject from './AddSubject'
import {useSelector, useDispatch} from 'react-redux'
import {addAllSubjects, deleteAllSubjects} from '../../Slicers/subjectSlice'
import {updateMyAccount, deleteMyAccount} from '../../Slicers/myAccountSlice'
import {Link, useHistory} from 'react-router-dom'
import CreateSubjectFormfrom from './CreateSubjectForm'
import EditSubject from './EditSubject'
import Messages from '../../Message/Message'
import {
  EditOutlined,
} from '@ant-design/icons'
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
  message,
} from 'antd'
import ActiveData from '../../helpers/ActiveData';
const baseUrl = process.env.REACT_APP_BASE_URL

// const data = [
//   {
//     key: '1',
//     subjectName: 'Maths',
//     Status: true,
//     CreatedBY: 'jhon',

//   },
//   {
//     key: '2',
//     subjectName: 'English',
//     Status: true,
//     CreatedBY: 'Shan',

//   },
//   {
//     key: '3',
//     subjectName: 'Science',
//     Status: false,
//     CreatedBY: 'Joe',
//   },
// ];

const ManageSubject = () => {
  const {Search} = Input
  const history = useHistory()
  const [allDataLIst, setallDataList] = useState([]);
  const [activate ,setActivate] =useState(true)
  const [subjectLIst, setSubjectList] = useState([])
  const [idForVisibleModel, setIdForVisibleModel] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [filterTable, setFilterTable] = useState([])
  var myAccount = useSelector(state => state.myAccount.value)
  var subject = useSelector(state => state.subject.value)
  const dispatch = useDispatch()
  var user = JSON.parse(localStorage.getItem('user'))
  const schoolID = user.schoolId
  let headers = {'Content-Type': 'application/json'}
  const token = myAccount.token ? myAccount.token : user.token
  //console.log("token" ,token )
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
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const fetchSubjects = () => {
    fetch(`${baseUrl}/Subjects/GetAll?schoolId=${parseInt(schoolID)}`, {
      headers,
    })
      .then(res => res.json())
      .then(subjects => {
        debugger
        setallDataList(subjects.data)
       // setSubjectList([...subjects.data])
        !myAccount.token && dispatch(updateMyAccount(user))
        dispatch(addAllSubjects(subjects.data))
      })
  }

  useEffect(() => {
    // (subject.length === 0) &&
    fetchSubjects()

    // (subject.length > 0) &&
    // setSubjectList([...subject])
  }, [])

  useEffect(() => {
    setFilterTable([...subjectLIst])
  }, [subjectLIst])

  useEffect(()=>{
    let filterfor = 'subjects'
    let activeDataOnly = ActiveData(allDataLIst , activate  ,filterfor) ;
    setSubjectList([...activeDataOnly])
  }, [allDataLIst , activate])


  const addNewSubjectInList = newSubject => {
    // console.log('welcome Ad 1', newSubject)
    // setSubjectList([newSubject, ...subjectLIst])
    fetchSubjects()
  }

  // update Phase list
  const updateSubjectList = () => {
    fetchSubjects()
  }

  const showModal = id => {
    setIsModalVisible(true)
    setIdForVisibleModel(id)
    console.log('id', id)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onSearch = value => {
    const searchRes = subjectLIst.filter(o =>
      Object.keys(o).some(k =>
        String(o[k]).toLowerCase().includes(value.toLowerCase()),
      ),
    )
    console.log(searchRes)
    setFilterTable([...searchRes])
    // setFilterTable([...searchRes])
  }

  const columns = [
    {
      title: 'Subject Name',
      dataIndex: 'subjectName',
      key: 'subjectName',
      sorter: (a, b) => a.subjectName.localeCompare(b.subjectName),
      render: text => <h3>{text}</h3>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'Status',
      render: status => (
        <Tag color={status ? 'green' : 'volcano'} key={status}>
          {status ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    // {
    //   title: 'Created BY',
    //   dataIndex: 'addedBy',
    //   key: 'CreatedBY',
    // },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'action',
      render: (id, data) => (
        <>
          <Button type="primary" onClick={() => showModal(id)}>
            <EditOutlined />
          </Button>
          <Modal
            title="Update Subject"
            footer={null}
            visible={idForVisibleModel === id ? isModalVisible : false}
            onOk={handleOk}
            onCancel={handleCancel}>
            <EditSubject
              key={id}
              data={data}
              handleOk={handleOk}
              updateSubjectList={updateSubjectList}
            />
          </Modal>
        </>
      ),
    },
    // {
    //   title: 'Tags',
    //   key: 'tags',
    //   dataIndex: 'tags',
    //   render: tags => (
    //     <>
    //       {tags.map(tag => {
    //         let color = tag.length > 5 ? 'geekblue' : 'green';
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
    //    <a>Invite {record.subjectName}</a>
    //    <a>Delete</a>
    //    </div>

    //   ),
    // },
  ]

  return (
    <>
      <Layouts title="assets" className="dashboard">
        <div className="dash-bg-white bg-blue-light">
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
                  Manage Subjects{' '}
                </h3>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={18}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={20}>
                  <div className="section-top-heading">
                    <Search
                      placeholder="Input search text"
                      onChange={e => onSearch(e.target.value)}
                      onSearch={onSearch}
                    />
                  </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={4}>
                  <AddSubject addNewSubjectInList={addNewSubjectInList} />
                </Col>
              </Row>
            </Col>

          </Row>
          <Row>
          <Col xs={24} sm={24} md={24} lg={24}>
          <div className="text-right">
          <Checkbox className="input-check" onChange={()=>{setActivate(!activate)}}  name="isActive"     value={!(activate)}  checked={!(activate)} >Show Inactive</Checkbox>
          </div>
          </Col>
          </Row>
        </div>
        <div className="table-grid-bx">
          <Table columns={columns} dataSource={filterTable} />
        </div>
      </Layouts>
    </>
  )
}

export default ManageSubject

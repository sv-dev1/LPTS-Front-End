// export default customer
import Layouts from '../../components/Layouts'
import React, {useState, useEffect} from 'react'
import isJwtTokenExpired from 'jwt-check-expiry'
import AddTutorials from './AddTutorials'
import {useSelector, useDispatch} from 'react-redux'
import {Link, useHistory} from 'react-router-dom'
import EditTutorials from './EditTutorials'
import Messages from '../../Message/Message'
import {
  EditOutlined,
} from '@ant-design/icons'
import {
  Col,
  Row,
  Input,
  Button,
  Modal,
  Table,
  Tag,
  Checkbox,
  message,
} from 'antd'
import ActiveData from '../../helpers/ActiveData';
const baseUrl = process.env.REACT_APP_BASE_URL

const ManageTutorials = () => {
  const {Search} = Input
  const history = useHistory()
  const [allDataLIst, setallDataList] = useState([]);
  const [activate ,setActivate] =useState(true)
  const [tutorialLIst, setTutorialList] = useState([])
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
  const fetchTutorials = () => {
    fetch(`${baseUrl}/Tutorials/GetAll?schoolId=${parseInt(schoolID)}`, {
      headers,
    })
      .then(res => res.json())
      .then(data => {
        // setallDataList(data.data)
        // console.log("data---" , data)
         data.data && setTutorialList([...data.data])
      })
  }

  useEffect(() => {
    // (subject.length === 0) &&
    fetchTutorials()

    // (subject.length > 0) &&
    // setTutorialList([...subject])
  }, [])

  useEffect(() => {
    setFilterTable([...tutorialLIst])
  }, [tutorialLIst])

  // useEffect(()=>{
  //   let filterfor = 'subjects'
  // //  let activeDataOnly = ActiveData(allDataLIst , activate  ,filterfor) ;
  //   setTutorialList([...activeDataOnly])
  // }, [allDataLIst , activate])


  // const addNewTutorialsInList = newSubject => {
  //   // console.log('welcome Ad 1', newSubject)
  //   // setTutorialList([newSubject, ...tutorialLIst])
  //   fetchTutorials()
  // }

  // update Phase list
  const updateTutorials = () => {
    fetchTutorials()
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
    const searchRes = tutorialLIst.filter(o =>
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
      title: 'Tutorial Name',
      dataIndex: 'name',
      key: "tutorialName",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text , data) => <h3>{data.name}</h3>,
    },
    {
      title: 'Tutorial Video',
      dataIndex: 'url',
      key: 'tutorialVideo',
      sorter: (a, b) => a.url.localeCompare(b.url),
      render: (text , data) => <h3>{data.url}</h3>,
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'isActive',
    //   key: 'Status',
    //   render: status => (
    //     <Tag color={status ? 'green' : 'volcano'} key={status}>
    //       {status ? 'Active' : 'Inactive'}
    //     </Tag>
    //   ),
    // },
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
            title="Update Tutorial Details"
            footer={null}
            visible={idForVisibleModel === id ? isModalVisible : false}
            onOk={handleOk}
            onCancel={handleCancel}>
            <EditTutorials
              key={id}
              data={data}
              handleOk={handleOk}
              updateTutorials={updateTutorials}
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
                  Manage Tutorials{' '}
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
                  <AddTutorials updateTutorials={updateTutorials} />
                </Col>
              </Row>
            </Col>

          </Row>
        {/*  <Row>
          <Col xs={24} sm={24} md={24} lg={24}>
          <div className="text-right">
          <Checkbox className="input-check" onChange={()=>{setActivate(!activate)}}  name="isActive"     value={!(activate)}  checked={!(activate)} >Show Inactive</Checkbox>
          </div>
          </Col>
        </Row> */}
        </div>
        <div className="table-grid-bx">
          <Table columns={columns} dataSource={filterTable} rowKey={obj => obj.id} />
        </div>
      </Layouts>
    </>
  )
}

export default ManageTutorials ;

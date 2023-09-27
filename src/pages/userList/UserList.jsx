

import Layouts from '../../components/Layouts'
import React , {useState ,useEffect} from 'react'
import isJwtTokenExpired from 'jwt-check-expiry';
import {useSelector , useDispatch } from 'react-redux';
import {addAllSubjects , deleteAllSubjects } from '../../Slicers/subjectSlice'
import {addAllphases , deletephase } from '../../Slicers/phaseSlice'
import { Link, useHistory } from "react-router-dom";
import AddUser from './AddUser'
import {updateMyAccount , deleteMyAccount  } from '../../Slicers/myAccountSlice'
import ResetPassword from './ResetPassword';
import EditUserDetail from './EditUserDetail';
import UploadUsers from './UploadUsers'
import Messages from '../../Message/Message';
import {
  Col,
  Checkbox,
  Row,
  Input,
  Button,
  Modal,
  Table,
  Tag,
  message
} from 'antd'
import {
  EditOutlined,
} from '@ant-design/icons'

import ActiveData from '../../helpers/ActiveData';
const baseUrl = process.env.REACT_APP_BASE_URL



const  UserList = () => {
const history = useHistory()
  const { Search } = Input;
  const [allDataLIst, setallDataList] = useState([]);
  const [activate ,setActivate] =useState(true)
  const [userList , setUserList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idForVisibleModel , setIdForVisibleModel] = useState(0);
  const [searchKey , setSearchKey] = useState('')
  const [filterTable , setFilterTable] = useState([]);
  var myAccount = useSelector((state)=> state.myAccount.value)
  //console.log("myAccount" , myAccount)
  const dispatch = useDispatch();
  var user = JSON.parse(localStorage.getItem('user')) ;
  const schoolID = user.schoolId
  if(user){
    var isExpired = isJwtTokenExpired(user.token)
   
    if(isExpired){
    
     message.error(`${Messages.unHandledErrorMsg}`)
      history.replace({ pathname: '/', state: { isActive: true } })
    }
  }else{
    
   message.error(`${Messages.unHandledErrorMsg}`)
    history.replace({ pathname: '/', state: { isActive: true } })
  }

const fetchUsers = ()=>{
 // var myAccount = useSelector((state)=> state.myAccount.value)
  let headers = {"Content-Type": "application/json"};
  const token = myAccount.token ? myAccount.token : user.token;
  !myAccount.token &&  dispatch(updateMyAccount(user))
  // console.log("token" ,token )
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
    fetch(`${baseUrl}/Users/GetAll?query=${searchKey}&schoolId=${parseInt(schoolID)}` ,{headers,})
    .then((res) => res.json())
    .then((data) => {
      if (data.statusCode === 200) {
     //   debugger
        let usersList = data.data.filter(userData => userData.email != user.email );
        setallDataList(usersList)
        //setUserList([...usersList ])
      } else {
        message.error(`${data.message}`)
      }
   
      //  console.log("userList" ,data );
    }) ;
  }

  const lowercaseKeys = obj =>
  Object.keys(obj).reduce((acc, key) => {
    acc[key.toLowerCase()] = obj[key];
    return acc;
  }, {});

// const myObj = { Name: 'Adam', sUrnAME: 'Smith' };
// const myObjLower = lowercaseKeys(myObj); // {name: 'Adam', surname: 'Smith'}
useEffect(()=>{
   fetchUsers();
}, [])


useEffect(()=>{
  setFilterTable([...userList]);
}, [userList])

useEffect(()=>{
  let filterfor = 'users'
  let activeDataOnly = ActiveData(allDataLIst , activate  ,filterfor) ;
  setUserList([...activeDataOnly])
}, [allDataLIst , activate])

// update user list
const updateuserList =(data)=>{
  // console.log("updateduser" , data);
  // console.log("userList" , userList);
  // const index = userList.findIndex(user => user.user.id === data.user.id);
  // index &&( userList[index] = data);
  // setUserList([...userList])
    fetchUsers();
}

const addNewUserInList = (newuser)=>{
  // console.log("welcome Ad 1"  , newuser);
 // setUserList([...userList , newuser])
 fetchUsers();
 
}


const showModal = (id) => {
  // console.log("id" , id)
  setIsModalVisible(true);
  setIdForVisibleModel(id)
  // console.log("id" , id)
};

const handleOk = () => {
  setIsModalVisible(false);
};

const handleCancel = () => {
  setIsModalVisible(false);
};
  
const ClosePopUP = () => {
  setIsModalVisible(false);
};
const onSearch = value => {
  const searchRes = userList.filter(o =>
    Object.keys(o).some(k =>
      String(o[k]).toLowerCase().includes(value.toLowerCase()),
    ),
  )
  // console.log(searchRes)
  setFilterTable([...searchRes]);
 // setFilterTable([...searchRes])
}

// "id": 2,
// "identityUserId": "edb02e1b-983e-4fdb-b43e-c67b6181f79d",
// "firstName": "Student",
// "lastName": "User",
// "isBlocked": false,
// "status": true,
// "addedOn": "2022-05-10T07:53:45.46782",
// "addedBy": 1,
// "modifyOn": "2022-05-10T07:53:45.4678202",
// "modifyBy": 1,
// "email": "student@gmail.com",
// "phoneNumber": "9876543210",
// "roleName": "Student"
//},
  const columns = [
    {
      title: 'Name',
      dataIndex: "fullname",
      sorter: (a, b) =>  a.firstName.localeCompare(b.firstName),
      render: (text, record) => (
           <span>{record.firstName} {record.lastName}</span>
    )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) =>  a.email.localeCompare(b.email),
      
    },
    {
      title: 'Team',
      dataIndex: 'teams',
      sorter: (a, b) =>  a.teamName.localeCompare(b.teamName),
       render: (text, record) => record.teamName && <Tag key={text} color="#40a9ff">
                             {record.teamName}
                        </Tag>
        
    },
    {
      title: 'ID',
      dataIndex: 'studentId',
      sorter: (a, b) =>  a.studentId - b.studentId,
    },
    {
      title: 'Role',
      dataIndex: 'roleName',
      sorter: (a, b) =>  a.roleName.localeCompare(b.roleName),
       render: role =>  <Tag key={role}>
                            {role && role.toUpperCase()}
                        </Tag>
        
    },
    {
      title: 'Year',
      dataIndex: 'year',
      sorter: (a, b) =>  a.year - b.year,
      render: year => <p>{year ? year : ''}</p>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a, b) =>  a.status - b.status ,
      render: status => <Tag color={status? "green" : "volcano"} key={status}>
                            {status ? "Active" : "Inactive" }
                         </Tag>,
    },
    {
      title: 'Action',
      dataIndex: 'user',
   
      render:  (id, record) => (
    
        <>

              <Button type="primary" onClick={()=>showModal(record.id)}>
              <EditOutlined />
            </Button>
            <Button type="primary" onClick={()=>showModal("A"+record.id)}>
            <i className="fa fa-key" aria-hidden="true"></i>
            </Button>
            <Modal title="Update User Details" footer={null} visible={idForVisibleModel === record.id ? isModalVisible : false} onOk={handleOk} onCancel={handleCancel}>
                  <EditUserDetail handleCancel={handleCancel} user={record} updateuserList={updateuserList} />
            </Modal>
            <Modal title="Reset Password" footer={null} visible={idForVisibleModel === "A"+record.id ? isModalVisible : false}  onOk={handleOk} onCancel={handleCancel}>
                  <ResetPassword handleCancel={handleCancel} email={record.email} />
                
            </Modal>
          
        </>
      ),
    
    },
    
  ];

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
                  {' '} Manage Users{' '}
                </h3>
              </div>             
            </Col>
            <Col xs={24} sm={24} md={24} lg={18}>
            <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={20}>
              <div className="section-top-heading">
               
                <Search placeholder="input search text" onChange={e=>onSearch(e.target.value)} onSearch={onSearch} />
              </div>             
            </Col>
            <Col xs={24} sm={24} md={24} lg={4}>
            <AddUser addNewUserInList={addNewUserInList} />
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
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={24} >
             <UploadUsers updateData={fetchUsers} ClosePopUp={()=> ClosePopUP()}  /> 
            </Col>  
            </Row>  

        </div>
    <div className="table-grid-bx">
    <Table columns={columns} dataSource={filterTable}  rowKey="id"/>
    </div>
    </Layouts>
   
    </>
  )
}

export default UserList; 

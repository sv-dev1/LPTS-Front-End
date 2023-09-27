
import Layouts from '../../components/Layouts'
import React , {useState ,useEffect} from 'react'
import {useSelector , useDispatch } from 'react-redux';
import Messages from '../../Message/Message';
import {addAllSubjects , deleteAllSubjects } from '../../Slicers/subjectSlice'
import {updateMyAccount , deleteMyAccount  } from '../../Slicers/myAccountSlice'
import AddLearningTarget from './AddLearningTarget'
import EditLearningTarget from './EditLearningTarget'
import SplitLearningTarget from './SplitLearningTarget';
import UploadLearningTarget from './UploadLearningTarget'
import isJwtTokenExpired from 'jwt-check-expiry';
import {useHistory} from 'react-router-dom';
import * as FileSaver from 'file-saver'
import XLSX from 'sheetjs-style';
import ActiveData from '../../helpers/ActiveData';
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
  Checkbox ,
  Space ,
  message
} from 'antd'
import {
  EditOutlined
} from '@ant-design/icons'

const baseUrl = process.env.REACT_APP_BASE_URL



const  LearningTarget = () => {

  const history = useHistory()
  const { Search } = Input;
  const [learningTargetList , setLearningTargetList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idForVisibleModel , setIdForVisibleModel] = useState(0);
  const [searchKey , setSearchKey] = useState('')
  const [filterTable , setFilterTable] = useState([]);
  const [activate ,setActivate] =useState(true)
  const [sortingData,setSortingData]=useState({});

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
  console.log("redux data" , user.token)

  const fetchLearningTarget = async()=>{
    var res;
   
    try{
      let headers = {"Content-Type": "application/json"};
      
    var token = user.token;
    console.info("token" , token)
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      res = await fetch(`${baseUrl}/Progressions/GetAll?schoolId=${parseInt(schoolID)}` , {headers,})
      let data = await res.json()
      console.log("data" , data)
      setLearningTargetList([...data.data])
      console.log("data" ,data.Data)
   } catch(err){
     
    setLearningTargetList([])
    message.error(`${Messages.unHandledErrorMsg}`)
    history.replace({pathname: '/', state: {isActive: true}})
   }
  
  }

useEffect(()=>{
   fetchLearningTarget();
   dispatch(updateMyAccount(user))
}, [])


useEffect(()=>{
  setFilterTable([...learningTargetList]);
}, [learningTargetList])

// useEffect(()=>{
//   let filterfor = 'learningTarget'
//   let activeDataOnly = ActiveData(learningTargetList , activate  ,filterfor) ;
//   setLearningTargetList([...activeDataOnly])
// }, [learningTargetList , activate])

// update  list
const updateLearningTargetList =()=>{
    fetchLearningTarget();
}

// const addNewUserInList = (newuser)=>{
//   console.log("welcome Ad 1"  , newuser);
//   setUserList([...learningTargetList , newuser])
 
// }


const showModal = async(id) => {
  setIsModalVisible(true);
  setIdForVisibleModel(id)  
};

const ExportLearningTargets = async() =>{
  var res;
  let headers = {"Content-Type": "application/json"};      
  var token = user.token;
  console.info("token" , token)
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }    
    res = await fetch(`${baseUrl}/Progressions/ExportLearningTargets2` , {headers,})
    let data = await res.json();
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx';
  const ws = XLSX.utils.json_to_sheet(data.rosterLearningTargets) ;
  const wb = {Sheets: {'data' : ws}, SheetNames : ['data']};
  const excelBuffer = XLSX.write(wb, {bookType:'xlsx', type: 'array'});
  const data1 = new Blob([excelBuffer], {type: fileType});
  FileSaver.saveAs(data1, data.fileName)
}

const handleOk = () => {
  setIsModalVisible(false);
};
const ClosePopUP = () => {
  setIsModalVisible(false);
};

const handleCancel = () => {
  setIsModalVisible(false);
};
  
const onSearch = value => {
  const searchRes = learningTargetList.filter(o =>
    Object.keys(o.progression).some(k =>
      String(o.progression[k]).toLowerCase().includes(value.toLowerCase()),
    ) ||  Object.keys(o).some(k =>
      String(o[k]).toLowerCase().includes(value.toLowerCase()),
    ) ,
  )
  console.log(searchRes)
  setFilterTable([...searchRes]);
 // setFilterTable([...searchRes])
}

// "progression": {
//   "id": 1,
//   "schoolId": 1,
//   "categoryId": 1,
//   "learningTarget": 100,
//   "iCanStatement": "I know the number names and the count sequence to 20",
//   "addedOn": "2022-05-13T10:02:03.010743",
//   "addedBy": 1,
//   "modifyOn": "2022-05-13T10:02:03.0108549",
//   "modifyBy": 1
// },
// "categoryName": "Numbers and Operations",
// "subjectName": "Math",
// "phaseName": "Readiness"

  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      sorter: (a, b) =>   a.subjectName.localeCompare(b.subjectName),
      render: (text, record) => (
        <span>{record.subjectName} </span>
  )
  
    },
    {
      title: 'Phase',
      dataIndex: 'phase',
      key: 'phase',
      sorter: (a, b) =>   a.phaseName.localeCompare(b.phaseName),
      render: (text, record) => (
        <span>{record.phaseName} </span>
  )
    },
    {
      title: 'Category',
      dataIndex: "category",
      key: 'category',
      sorter: (a, b) =>  a.categoryName.localeCompare(b.categoryName),
      render: (text, record) => (
           <span>{record.categoryName} </span>
     )
    },
    {
      title: 'Learning Target',
      dataIndex: 'learningTarget',
      key: 'learningTarget',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.progression.learningTarget - b.progression.learningTarget,  
      render: (text, record) => (
        <span>{record.progression.learningTarget} </span>
  )
        
    },
    {
      title: 'Status',
      dataIndex: 'category',
      key: 'isActive',
      render:(text, record) => <Tag color={record.progression.isActive ? "green" : "volcano"} key={record.progression.isActive}>
        {record.progression.isActive? "Active" : "Inactive"}
      </Tag>,
    },
    {
      title: 'I Can Statement',
      dataIndex: 'ican',
      key: 'ican',
      width: 350,
      render: (text, record) => (
        <span>{record.progression.iCanStatement} </span>
  )     
    },
    {
      title: 'Action',
      dataIndex: 'user',
      key: 'action',
      render:  (text, record) => (
        <>
              <Button type="primary" onClick={()=>showModal(record.progression.id)}>
              <EditOutlined />
            </Button>            
            <Modal title="Update Learning Target" footer={null} visible={idForVisibleModel === record.progression.id ? isModalVisible : false} onOk={handleOk} onCancel={handleCancel}>
                  <EditLearningTarget key={record.progression.id} updateLearningTargetList={updateLearningTargetList} handleOk={handleOk} learningTarget={record} />
            </Modal>
            {/* <Button type="primary" onClick={()=>showModal(record.progression.id)}>
              <>Split Learning Target</>
            </Button>
            <Modal title="Split Learning Target" footer={null} visible={idForVisibleModel === record.progression.id ? isModalVisible : false} onOk={handleOk} onCancel={handleCancel}>
                  <SplitLearningTarget key={record.progression.id} updateLearningTargetList={updateLearningTargetList} handleOk={handleOk} learningTarget={record} />
            </Modal>           */}
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
                  {' '} Manage Learning Target{' '}
                </h3>
              </div>             
            </Col>
            <Col xs={24} sm={24} md={24} lg={18}>
            <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={20}>
              <div className="section-top-heading">
               
                <Search placeholder="Input search text" onChange={e=>onSearch(e.target.value)} onSearch={onSearch} />
              </div>             
            </Col> 
            <Col xs={24} sm={24} md={24} lg={4}>
            <AddLearningTarget handleOk={handleOk}  updateLearningTargetList={updateLearningTargetList}  />
            </Col>
            </Row>
            <Row >           
            <Col xs={24} sm={24} md={24} lg={23}>
              <div className="btn-group d-flex justify-content-end learning-target-btn align-items-center mt-3">
              <Button type="primary" onClick={()=>ExportLearningTargets()} >
              <>Export</>
            </Button>
            <UploadLearningTarget ClosePopUp={()=> ClosePopUP()}  updateLearningTargetList={updateLearningTargetList}  />
              </div>     
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
    <Table columns={columns} dataSource={filterTable.filter(d => d.progression.isActive === activate)}  />
    </div>
    </Layouts>
   
    </>
  )
}

export default LearningTarget; 

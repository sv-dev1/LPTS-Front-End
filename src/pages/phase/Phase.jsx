import Layouts from '../../components/Layouts'
import React , {useState ,useEffect} from 'react'
import AddPhase from './AddPhase'
import {useSelector , useDispatch } from 'react-redux';
import {addAllSubjects , deleteAllSubjects } from '../../Slicers/subjectSlice'
import {updateMyAccount , deleteMyAccount  } from '../../Slicers/myAccountSlice'
import isJwtTokenExpired from 'jwt-check-expiry';
import { Link, useHistory } from "react-router-dom";
import {addAllphases , deletephase } from '../../Slicers/phaseSlice'
import EditPhase from './EditPhase'
import Messages from '../../Message/Message';
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
  Space ,message
} from 'antd'
import {
  EditOutlined,
} from '@ant-design/icons'
import ActiveData from '../../helpers/ActiveData';
const baseUrl = process.env.REACT_APP_BASE_URL

const  Phase = () => {

const history = useHistory()
  const { Search } = Input;
  const [allDataLIst, setallDataList] = useState([]);
  const [phasesLIst , setPhasesList] = useState([]);
  const [activate ,setActivate] =useState(true)
const [isModalVisible, setIsModalVisible] = useState(false);
const [idForVisibleModel , setIdForVisibleModel] = useState(0);
const [filterTable , setFilterTable] = useState([]);
  var phase = useSelector((state)=> state.phase.value)
   var myAccount = useSelector((state)=> state.myAccount.value)
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

const fetchPhases = ()=>{
 
    let headers = {"Content-Type": "application/json"};
    const token = myAccount.token ? myAccount.token : user.token;
    console.log("token" ,token )
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  fetch(`${baseUrl}/Phases/GetAll?schoolId=${parseInt(schoolID)}` , {headers,})
      .then((res) => res.json())
      .then((data) => {
        setallDataList(data.data)
     // setPhasesList([...data.data ])
      dispatch(addAllphases(data.data))
        console.log("phasesLIst" ,data.data );
      }) ;
}

useEffect(()=>{
  
  // (phase.length === 0) &&
  (!isExpired) && fetchPhases();
  !myAccount.token &&  dispatch(updateMyAccount(user));
    // (phase.length > 0) &&
    //     setPhasesList([...phase])
}, [])


useEffect(()=>{
  setFilterTable([...phasesLIst]);
}, [phasesLIst])

useEffect(()=>{
  let filterfor = 'phases'
  let activeDataOnly = ActiveData(allDataLIst , activate  ,filterfor) ;
  setPhasesList([...activeDataOnly])
}, [allDataLIst , activate])


// update Phase list
const updatePhaseList =(data)=>{
  fetchPhases();
}

const addNewPhaseInList = ()=>{
  fetchPhases();
}


const showModal = (id) => {
  setIsModalVisible(true);
  setIdForVisibleModel(id)
  console.log("id" , id)
};

const handleOk = () => {
  setIsModalVisible(false);
};

const handleCancel = () => {
  setIsModalVisible(false);
};
  
const onSearch = value => {
  const searchRes = phasesLIst.filter(o =>
    Object.keys(o.phase).some(k =>
      String(o.phase[k]).toLowerCase().includes(value.toLowerCase()),
    ) ||  Object.keys(o).some(k =>
      String(o[k]).toLowerCase().includes(value.toLowerCase()),
    ) ,
  )
  console.log(searchRes)
  setFilterTable([...searchRes]);
}

  const columns = [
    {
      title: 'Subject Name',
      dataIndex: 'subjectName',
      key: 'subjectName',
      sorter: (a, b) => a.subjectName.localeCompare(b.subjectName),
      render: subjectName => subjectName,
    },
    {
      title: 'Phase Name',
      dataIndex: 'phase',
      key: 'phaseName',
      sorter: (a, b) => a.phase.phaseName.localeCompare(b.phase.phaseName),
      render: phase => phase.phaseName,
    },
    {
      title: 'Order',
      dataIndex: 'phase',
      key: 'orderNo',
      // sorter: (a, b) => a.category.categoryName.localeCompare(b.category.categoryName),
      render: phase => <h3>{phase.orderNo}</h3>,
    },
    {
      title: 'Status',
      dataIndex: 'phase',
      key: 'isActive',
      render: phase =>   <Tag color={phase.isActive? "green" : "volcano"} key={phase.isActive}>
                            {phase.isActive ? "Active" : "Inactive" }
                         </Tag>,
    },
    {
      title: 'Action',
      dataIndex: 'phase',
      key: 'action',
      render: phase => (
        <>
            <Button type="primary" onClick={()=>showModal(phase.id)}>
              <EditOutlined />
            </Button>
            <Modal title="Update Phase" footer={null} visible={idForVisibleModel === phase.id ? isModalVisible : false} onOk={handleOk} onCancel={handleCancel}>
                <EditPhase key={phase.id} phase={phase} updatePhaseList={updatePhaseList} />
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
                  {' '} Manage Phase{' '}
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
            <AddPhase addNewPhaseInList={addNewPhaseInList} />
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

export default Phase; 

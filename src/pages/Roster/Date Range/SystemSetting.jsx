
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import AddDateRange from './AddDateRange'
import { Link, useHistory } from "react-router-dom";
import isJwtTokenExpired from 'jwt-check-expiry';
import Layouts from '../../components/Layouts';
import Messages from '../../Message/Message';
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
  Space,message
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



const SystemSetting = (props) => {

  const { Search } = Input;
  const history = useHistory();

  const [rosterDateRangeList, setRosterDateRangeList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idForVisibleModel, setIdForVisibleModel] = useState(0);
  const [filterTable, setFilterTable] = useState([]);
 // var category = useSelector((state) => state.category.value)
  const dispatch = useDispatch();
 //var myAccount = useSelector((state)=> state.myAccount.value)
 const text = 'Are you sure to delete this date range?';

 
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
  const fetchRosterDateRanges = async()=>{
    var res;
    try{
      let headers = {"Content-Type": "application/json"};
      const token =  user.token;
      console.log("token" ,token )
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      res = await fetch(`${baseUrl}/RosterDateRanges/GetAll?schoolId=${parseInt(schoolID)}`, {headers,})
      let data = await res.json()
      console.log("data" ,data)
      setRosterDateRangeList([...data.data])
   } catch(err){
    setRosterDateRangeList([])
      console.log(err);
   }
  }


  useEffect(() => {
  
  ( !isExpired) && fetchRosterDateRanges();
   //dispatch(updateMyAccount(user));
  
  
  }, [])


  useEffect(() => {
    setFilterTable([...rosterDateRangeList]);
  }, [rosterDateRangeList])

  // update Roster list
  

  const addNewRosterInList = () => {
    fetchRosterDateRanges();
  }


  const showModal = (id) => {
    setIsModalVisible(true);
    setIdForVisibleModel(id)
    console.log("id", id)
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const onSearch = value => {
    const searchRes = rosterDateRangeList.filter(o =>
        Object.keys(o).some(k =>
            String(o[k]).toLowerCase().includes(value.toLowerCase()),
          ),
    )
    console.log(searchRes)
    setFilterTable([...searchRes]);
    // setFilterTable([...searchRes])
  }

  const handleDelete = (id)=>{
      // Rosters/Delete?id=3
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function onChange(e) {
    //alert("Hii")
  }

  const DeleteDateRange =(id)=> {
   // RosterDateRanges/Delete?id=1&schoolId=1
//   e.preventDefault()
   // debugger;
    // props.form.validateFields((err, values) => {
    //     if (!err) {
            const token =  user.token;
            const requestMetadata = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
               
            }
            
            fetch(`${baseUrl}/RosterDateRanges/Delete?id=${id}&schoolId=${schoolID}`, requestMetadata)
                .then(res => res.json())
                .then(data => {
                    if (data.statusCode === 200) {
                        message.success('Date range is removed successfully !!')
                        console.log("res",data);
                        // console.log('target', data.data)
                      //  props.form.resetFields()
                        fetchRosterDateRanges();
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
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    //   sorter: (a, b) =>   a.rosterName.localeCompare(b.rosterName) ,
    render: (id , record) => (
        
        <>
            {new Date(record.startDate).toLocaleString().split(',')[0]}
        </>
      ),


    },
    {
        title: 'End Date',
        dataIndex: 'endDate',
        key: 'endDate',
        // sorter: (a, b) =>  a.teacher.localeCompare(b.teacher) ,
        render: (id , record) => { 
           
            return(
           
            <>
            {new Date(record.endDate).toLocaleString().split(',')[0]}
              
            </>
          )},
    
        
      },

   {
      title: 'Action',
      dataIndex: 'category',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (id , record) => (
        <>
        <Popconfirm placement="topLeft" title={text} onConfirm={()=>DeleteDateRange(record.id)} okText="Yes" cancelText="No">
        <Button type="danger" ><Icon type="delete" /></Button>
      </Popconfirm>
          
        </>
      ),

    },
   
  ];

  return (
    <>

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
                  {' '} System Setting{' '}
                </h3>
              </div>
            </Col>
            <Col xs={10} sm={24} md={24} lg={18}>
              <Row gutter={[16, 16]}>
                <Col xs={10} sm={24} md={24} lg={20}>
                  <div className="section-top-heading">

                    <Search placeholder="input search text" onChange={e => onSearch(e.target.value)} onSearch={onSearch} />
                  </div>
                </Col>
                <Col xs={10} sm={20} md={24} lg={4}>
                <AddDateRange updateRanges={fetchRosterDateRanges}/>
                </Col>
              </Row>

            </Col>
          </Row>
        </div>
        <div className="table-grid-bx">
          <Table columns={columns} dataSource={filterTable} rowKey='table'/>
        </div>
      </Layouts>
    </>
  )
}

export default SystemSetting; 

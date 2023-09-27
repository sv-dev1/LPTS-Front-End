import Layouts from '../../components/Layouts'
import React, { useState, useEffect } from 'react'
import AddCategory from './AddCategory'
import { useSelector, useDispatch } from 'react-redux';
import { addAllSubjects, deleteAllSubjects } from '../../Slicers/subjectSlice'
import { addAllphases, deletephase } from '../../Slicers/phaseSlice'
import {useHistory} from 'react-router-dom'
import { addAllcategory, deletecategory } from '../../Slicers/categorySlice'
import EditCategory from './EditCategory'
import isJwtTokenExpired from 'jwt-check-expiry';
//import useVerifyJwtToken from '../../hooks/custom hooks/VerifyJwtToken';
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
import {updateMyAccount   } from '../../Slicers/myAccountSlice'
import ActiveData from '../../helpers/ActiveData';
const baseUrl = process.env.REACT_APP_BASE_URL
const Category = () => {
  const { Search } = Input;
  const history = useHistory()
  const [allDataLIst, setallDataList] = useState([]);
  const [categoryLIst, setCategoryList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idForVisibleModel, setIdForVisibleModel] = useState(0);
  const [filterTable, setFilterTable] = useState([]);
  const [activate ,setActivate] =useState(true)
  var category = useSelector((state) => state.category.value)
  const dispatch = useDispatch();
 var myAccount = useSelector((state)=> state.myAccount.value)
 var user = JSON.parse(localStorage.getItem('user')) ;
 const schoolID = user.schoolId
  if(user){
    var isExpired = isJwtTokenExpired(user.token)   
    if(isExpired){    
     message.error(`${Messages.unHandledErrorMsg}`)
      history.replace({ pathname: '/', state: { isActive: true } })
    }
  }

  const fetchCategory = async()=>{
    var res;
    try{
      let headers = {"Content-Type": "application/json"};
      const token = myAccount.token ? myAccount.token : user.token;
      console.log("token" ,token )
     
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      res = await fetch(`${baseUrl}/Categories/GetAll?schoolId=${parseInt(schoolID)}`, {headers,})
      let data = await res.json()     
      setallDataList(data.data)
      dispatch(addAllcategory(data.data))      
   } catch(err){
    setCategoryList([])
   message.error(`${Messages.unHandledErrorMsg}`)
    history.replace({pathname: '/', state: {isActive: true}})
      console.log(err);
   }
  }

  useEffect(() => {
 (!isExpired) && fetchCategory();
   !myAccount.token &&  dispatch(updateMyAccount(user));
   (category.length > 0) &&
   setCategoryList([...category])  
  }, [])

  useEffect(()=>{
    let filterfor = 'categories'
    let activeDataOnly = ActiveData(allDataLIst , activate  ,filterfor) ;
   setCategoryList([...activeDataOnly])
  }, [allDataLIst , activate])

  useEffect(() => {
    setFilterTable([...categoryLIst]);
  }, [categoryLIst])

  const updateCategoryList = (data) => {
    fetchCategory();
  }

  const addNewCategoryInList = (newCategory) => {
    fetchCategory();
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
    const searchRes = categoryLIst.filter(o =>
      Object.keys(o.category).some(k =>
        String(o.category[k]).toLowerCase().includes(value.toLowerCase()),
      ) || Object.keys(o).some(k =>
        String(o[k]).toLowerCase().includes(value.toLowerCase()),
      ) ,
    )
    console.log(searchRes)
    setFilterTable([...searchRes]);
    // setFilterTable([...searchRes])
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function onChange(e) {
    //alert("Hii")
  }

  const columns = [
    {
      title: 'Subject Name',
      dataIndex: 'subjectName',
      key: 'subjectName',
      sorter: (a, b) => a.subjectName.localeCompare(b.subjectName),
      render: subjectName => <h3>{subjectName}</h3>,
    },
    {
      title: 'Phase Name',
      dataIndex: 'phaseName',
      key: 'phaseName',
      sorter: (a, b) =>a.phaseName.localeCompare(b.phaseName),
      render: phaseName => <h3>{phaseName}</h3>,
    },
    {
      title: 'Category Name',
      dataIndex: 'category',
      key: 'categoryName',
      sorter: (a, b) => a.category.categoryName.localeCompare(b.category.categoryName),
      render: category => <h3>{category.categoryName}</h3>,
    },
    // {
    //   title: 'Order',
    //   dataIndex: 'category',
    //   key: 'serialNo',
    //   // sorter: (a, b) => a.category.categoryName.localeCompare(b.category.categoryName),
    //   render: category => <h3>{category.serialNo}</h3>,
    // },
    {
      title: 'Status',
      dataIndex: 'category',
      key: 'isActive',
      render: category => <Tag color={category.isActive ? "green" : "volcano"} key={category.isActive}>
        {category.isActive ? "Active" : "Inactive"}
      </Tag>,
    },
    {
      title: 'Action',
      dataIndex: 'category',
      key: 'action',
      render: category => (
        <>
          <Button type="primary" onClick={() => showModal(category.id)}>
            <EditOutlined />
          </Button>
          <Modal title="Update Category" footer={null} visible={idForVisibleModel === category.id ? isModalVisible : false} onOk={handleOk} onCancel={handleCancel}>
            <EditCategory key={category.id} category={category} updateCategoryList={updateCategoryList} />
          </Modal>

        </>
      ),

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
    //    <a>Invite {record.phaseName}</a>
    //    <a>Delete</a>
    //    </div>


    //   ),
    // },
  ];

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
                  {' '} Manage Category{' '}
                </h3>
              </div>
            </Col>

            <Col xs={24} sm={24} md={24} lg={18}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={24} lg={20}>
                  <div className="section-top-heading">
                    <Search placeholder="Input search text" onChange={e => onSearch(e.target.value)} onSearch={onSearch} />
                  </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={4}>
                  <AddCategory addNewCategoryInList={addNewCategoryInList} />
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

export default Category; 

import React, { useState, useEffect } from 'react'
import Layouts from '../../../components/Layouts'
//import LayoutWithoutSideBar from '../../../components/LayoutWithoutSideBars'
import AddEvidence from './AddEvidence';
import isJwtTokenExpired from 'jwt-check-expiry';

import { Link, useHistory, useLocation } from "react-router-dom";
import {
  Form,
  Col,
  Select,
  Row,
  Input,
  Button,
  Modal,
  Popconfirm,
  Table,
  message

} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  EyeOutlined,
} from '@ant-design/icons'




const baseUrl = process.env.REACT_APP_BASE_URL
function ProficiencyLevel(props) {
debugger;
//console.log(props.location.state)
  const location = useLocation()
  if(props.data){
    var { studentId, studentName, subject, phase , categoryId, category, learningTarget , status} = props.data;
  }else if(location.state){
    var { studentId, studentName, subject, phase , categoryId, category, learningTarget , status} = location.state;
  } else {
    var { studentId, studentName, subject, phase , categoryId, category, learningTarget } = props.location.state;
  }
  

  var initialValues = {
    "studentId": studentId,
    "studentName": studentName,
    "subjectName": subject,
    "phaseName":phase,
    "categoryId": categoryId,
    "categoryName": category,
    "learningTarget": learningTarget,
    "iCanStatement": "",
    "description": "string",
    "proficiency": 0,
    "grade": "string",
    "notes": "string",
    "teacherId": 0,
    "status": status
  }
  const { getFieldDecorator } = props.form
  const { TextArea } = Input;
  const { Option } = Select;
  const history = useHistory()
var isHeader = true;
  const [inputs, setInputs] = useState(initialValues);
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [filterTable, setFilterTable] = useState([])
  const [proficiencyStatusList, setProficiencyStatusList] = useState(['P', "IP"]);
  var user = JSON.parse(localStorage.getItem('user'));

  if(user){
    var isExpired = isJwtTokenExpired(user.token)
   
    if(isExpired){
    
      message.info('Your session is expired .Please Login again.')
      history.replace({ pathname: '/', state: { isActive: true } })
    }
  }else{
    
    message.info('Your session is expired .Please Login again.')
    history.replace({ pathname: '/', state: { isActive: true } })
  }

  const columns = [
    {
      title: 'Evidence',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      render: (item, record, index) => <>{index + 1}</>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (text, record) => (
        <span>
          {record.description}
        </span>
      ),
    },
    {
      title: 'Proficiency',
      dataIndex: 'proficiency',
      render: (text, record) => <span>{record.proficiency} </span>,
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      render: (text, record) => <span>{record.grade} </span>,
    },
    {
      title: 'Date',
      dataIndex: 'addedOn',
      render: (text, record) => <span>{new Date(record.addedOn).toLocaleString().split(',')[0]} </span>,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      render: (text, record) => <span>{record.notes} </span>,
    },
    {
      title: 'Teacher',
      dataIndex: 'teacherName',
      render: (text, record) => <span>{record.teacherName} </span>,
    },

    //     {
    //       title: 'Action',
    //       dataIndex: 'user',
    //       key: 'action',
    //       render:  (id, record) => (

    //         <>

    // {studentAvailable(record.id) === true ?( <Button type="primary" onClick={()=>handleAddStudentsInRoster(record.id)} >
    //                    Add
    //              </Button>) : "Added"
    //           }


    //         </>
    //       ),

    //     },
  ]



  const showModal = () => {
    setVisible(true);
  };

  // const handleOk = () => {
  //   setModalText("this");
  //   setConfirmLoading(true);
  //   setTimeout(() => {
  //     setVisible(false);
  //     setConfirmLoading(false);
  //   }, 5000);
  // };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };

  const fetchData = async () => {
    var res;
    try {
      let headers = { "Content-Type": "application/json" };
      const token = user.token;
      console.log("token", token)
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      res = await fetch(`${baseUrl}/RosterLearningTargets/GetByRosterIdAndLearningTarget?rosterId=${history.location.state.rosterId}&learningTarget=${inputs.learningTarget}`, { headers, })
      let data = await res.json()
      console.log("data", data)
      setInputs({ ...inputs, iCanStatement: data.data.iCanStatement })
    } catch (err) {

      console.log(err);
    }
  }

  const getAllEvidence = async () => {
    var res;
    try {
      let headers = { "Content-Type": "application/json" };
      const token = user.token;
      //console.log("token", token)
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      res = await fetch(`${baseUrl}/LearningTargetEvidences/GetAll?studentId=${parseInt(inputs.studentId)}&rosterId=${history.location.state.rosterId}&categoryId=${parseInt(inputs.categoryId)}&learningTarget=${parseInt(inputs.learningTarget)}`, { headers, })
      console.log("res", res)
      let data = await res.json()
      console.log("data", data)
      setFilterTable([...data.data])
    } catch (err) {

      console.log(err);
    }
  }


  useEffect(() => {
    // get learning Statement
  ( !isExpired)  && fetchData();
    inputs.categoryId && getAllEvidence();
  }, [])
  console.log(history.location.state)
  const handleGetAllEvidence = () => {
    getAllEvidence();
  }


  const handleSubmitUpdate = e => {
    e.preventDefault()
    let headers = { "Content-Type": "application/json" };
    const token = user.token;
    const schoolID = user.schoolId
    // debugger;
    props.form.validateFields((err, values) => {
      if (!err) {
        let data = {
          "studentId": inputs.studentId,
          "categoryId": inputs.categoryId,
          "learningTarget": inputs.learningTarget,
          "status": inputs.status,
          "rosterId":history.location.state.rosterId
        }
        const requestMetadata = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
        console.log(data)
        fetch(`${baseUrl}/LearningTargets/Save`, requestMetadata)
          .then(res => res.json())
          .then(data => {
            if (data.statusCode === 200) {
              message.success('Status is Updated successfully !!')

              console.log('target', data.data)
              //props.form.resetFields()

            } else if (data.statusCode === 208) {
              message.warning(data.message)
            } else {
              message.info(data.message)
            }
          })
      }
    })
  }
  return (
    <>

      < Layouts  title="assets" className="dashboard">
        <div className="dash-bg-white">

          <Row gutter={[16, 16]}>
            <Col xs={12} sm={24} md={24} lg={12}>
              <div className="section-top-heading">
                <h3
                  style={{
                    color: '#0C1362',
                    fontWeight: '600',
                    fontSize: '20px',
                  }}>
                  {' '} Proficiency {' '}
                </h3>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6} lg={4}>
              <Form.Item  >
                <div style={{textAlign:"center", padding:"5%", borderRadius:"4px", backgroundColor:"#faad14"}}>
                <label style={{color:"#fff",fontWeight:"500"}} >Learnig Target :
                  <span style={{color:"#fff",fontWeight:"500"}}> {inputs.learningTarget}</span>     
                </label>
                </div>
                
              </Form.Item>
            </Col>
            <Col xs={12} sm={24} md={24} lg={2}></Col>
            <Col xs={10} sm={24} md={24} lg={6}>
              <Row gutter={[16, 16]}>
              <div className="d-flex status-label-row">
              { status !=="P" ? <Form.Item
                label="Status"
                name="status"
                className='status-label'

              >
                {getFieldDecorator('status', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select status!',
                    },
                  ],
                  initialValue:status,
                })
                  (<Select

                    value="Select"
                    onChange={value => setInputs({ ...inputs, status: value })}
                    name='status' style={{ width: 120 }}
                  >
                    {

                      proficiencyStatusList && proficiencyStatusList.map((status, key) => (
                        <Option key={key} value={status}> {status}</Option>
                      ))}
                  </Select>)}
              </Form.Item> :        
                  (   <Form.Item  >
              <label className='text-label'>Status :
                <span style={{ lineHeight: "normal" }}>{status}</span>
              </label>
            </Form.Item> )

          }
          {( status !=="P") && 
              
              <Button type="primary" onClick={handleSubmitUpdate} htmlType="submit">
                Update 
              </Button>
          }
              </div>

              </Row>

            </Col>
          </Row>
        </div>

        <Form
          style={{ margin: "15px 0" }}
          name="basic"
          initialValues={{ remember: true }}
          autoComplete="off">



          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item >
                <label className='text-label' >Student :<span > {inputs.studentName}</span></label>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item >
                <label className='text-label' >Subject :
                  <span> {inputs.subjectName}</span>
                </label>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item >
                <label className='text-label' >Phase :
                  <span  > {inputs.phaseName}</span>
                </label>
              </Form.Item>
            </Col>


            <Col xs={24} sm={12} md={6} lg={6}>
              <Form.Item >   
               
                <label className='text-label'  >Category :
                </label>
                <span style={{ lineHeight: "normal",color: "#333",fontSize: "14px",fontWeight: "600"}} >{inputs.categoryName}</span>
           
              </Form.Item>
            </Col>

           
            <Col xs={24} sm={12} md={18} lg={18}>
              <Form.Item  >
               < div style={{display:"flex"}}>
                <label className='text-label' style={{width: "202px"}}>i Can Statement :
                </label>
                  <span style={{ lineHeight: "normal",color: "#333",fontSize: "14px",fontWeight: "600"}}>{inputs.iCanStatement}</span>
                  </div>
              </Form.Item>

            </Col>

          </Row>
        </Form>


        <Row style={{ margin: "25px 0" }}>
          <Form
            //onSubmit={handleSubmit}
          >
            <Col sm={12} md={12} lg={12}>
          
            </Col>
            <Col sm={12} md={12} lg={12}>
            <div className='btn-level ' style={{textAlign:"right"}}>
              <Button className="Add-btn-top" type="primary" onClick={showModal}>
                <PlusOutlined />Add Evidence
              </Button>

              <Modal
                title="Add Evidence"
                visible={visible}
                footer={null}
                onCancel={handleCancel}
              >
                <AddEvidence
                  studentId={inputs.studentId}
                  categoryId={inputs.categoryId}
                  learningTarget={inputs.learningTarget}
                  rosterId={history.location.state.rosterId}
                  handleGetAllEvidence={handleGetAllEvidence}
                />
              </Modal>
            </div>
          </Col>
            

           
          </Form>
          

        </Row>



        {(filterTable.length > 0) &&
          (<div className="table-grid-bx">
            <Table columns={columns} dataSource={filterTable} />
          </div>)}
    </Layouts>
    </>
  )
}

export default Form.create()(ProficiencyLevel)

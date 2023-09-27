import React, { useState, useEffect } from 'react'
import Layouts from '../../../components/Layouts'
import AddEvidence from './AddEvidence';


import { Link, useHistory , useLocation } from "react-router-dom";
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

  var initialValues = {
    "studentId": 1,
    "studentName": "Mary",
    "subjectName": "Math",
    "phaseName": "Phase1",
    "categoryId": 18,
    "categoryName": "Category1",
    "learningTarget": 519,
    "iCanStatement": "i can",
    "description": "string",
    "proficiency": 0,
    "grade": "string",
    "notes": "string",
    "teacherId": 0,
    "status": ""
  }
  const { getFieldDecorator } = props.form
  const { TextArea } = Input;
  const { Option } = Select;
  const location = useLocation()
  const { fromNotifications } = location.state
  console.log("fromNotifications" , fromNotifications)
  const [inputs, setInputs] = useState(initialValues);
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [filterTable, setFilterTable] = useState([])
  const [proficiencyStatusList, setProficiencyStatusList] = useState(['P', "IP"]);
  var user = JSON.parse(localStorage.getItem('user'));



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
      res = await fetch(`${baseUrl}/Progressions/GetByCategoryAndLearningTarget?categoryId=${inputs.categoryId}&learningTarget=${inputs.learningTarget}`, { headers, })
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
      res = await fetch(`${baseUrl}/LearningTargetEvidences/GetAll?studentId=${parseInt(inputs.studentId)}&categoryId=${parseInt(inputs.categoryId)}&learningTarget=${parseInt(inputs.learningTarget)}`, { headers, })
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
    fetchData();
    inputs.categoryId && getAllEvidence();
  }, [])

  const handleGetAllEvidence = () => {
    getAllEvidence();
  }


  const handleSubmit = e => {
    e.preventDefault()
    let headers = { "Content-Type": "application/json" };
    const token = user.token;
    // debugger;
    props.form.validateFields((err, values) => {
      if (!err) {
        let data = {
          "studentId": inputs.studentId,
          "categoryId": inputs.categoryId,
          "learningTarget": inputs.learningTarget,
          "status": inputs.status
        }
        const requestMetadata = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }

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

      <Layouts title="assets" className="dashboard">
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
                  {' '} Proficiency Level{' '}
                </h3>
              </div>
            </Col>
            <Col xs={10} sm={24} md={24} lg={12}>
              <Row gutter={[16, 16]}>


              </Row>

            </Col>
          </Row>
        </div>

        <Form
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          >



          <Row gutter={16}>
            <Col xs={24} sm={12} md={24} lg={12}>



              <div className='d-inline block'>

                <label className='text-label' >Student :<p className='text-para16'> {inputs.studentName}</p></label>
              </div>
            </Col>

            <Col xs={24} sm={12} md={24} lg={12}>
              <Form.Item  >
                <label className='text-label' >Subject :</label>
                <h4  >  {inputs.subjectName}</h4>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={24} lg={12}>
              <Form.Item >
                <label className='text-label' >Phase :</label>
                <h4  > {inputs.phaseName}</h4>
              </Form.Item>
            </Col>


            <Col xs={24} sm={12} md={24} lg={12}>
              <Form.Item >
                <label >Category : </label>
                <h4 >{inputs.categoryName}</h4>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={24} lg={12}>
              <Form.Item  >
                <label className='text-label' >Learnig Target ::</label>
                <h4 > {inputs.learningTarget}</h4>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={24} lg={12}>
              <Form.Item  >
                <label className='text-label' >i Can Statement :</label>
                <h4  > {inputs.iCanStatement}</h4>
              </Form.Item>

            </Col>

          </Row>
          <Form.Item
            label="Status"
            name="status"

          >
            {getFieldDecorator('status', {
              rules: [
                {
                  required: true,
                  message: 'Please select status!',
                },
              ],

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
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit">
              Update Status
          </Button>
      </Form.Item>

        </Form>
        <div>
          <Button className="Add-btn-top" type="primary" onClick={showModal}>
            <PlusOutlined />Add Proficiency
          </Button>
          <Modal
            title="Add Evidence "
            visible={visible}
            footer={null}
            onCancel={handleCancel}
          >
            <AddEvidence
              studentId={inputs.studentId}
              categoryId={inputs.categoryId}
              learningTarget={inputs.learningTarget}
              handleGetAllEvidence={handleGetAllEvidence}
            />
          </Modal>
        </div>

        {(filterTable.length > 0) &&
          (<div className="table-grid-bx">
            <Table columns={columns} dataSource={filterTable} />
          </div>)}
      </Layouts>
    </>
  )
}


export default Form.create()(ProficiencyLevel)
import * as React from 'react'
import Layouts from '../components/Layouts'
import sale from '../static/images/home-icon1.png'
import order from '../static/images/icon-order.png'
import user from '../static/images/icon-user.png'
import visitor from '../static/images/icon-visitor.png'
import Stats from '../components/home/Stats'
import ProgressBar from '../components/home/ProgressBar'
import GradientProgess from '../components/home/GradientProgess'
import Barchart from '../components/home/Barchart'
import TodoList from '../components/home/TodoList'
import TimeLine from '../components/home/TimeLine'
import Testimonial from '../components/home/Testimonial'
import TableSelect from '../components/home/TableSelect'
import {Row, Col, Card, Button, Tabs} from 'antd'
import user1 from '../static/images/user1.png'
import user2 from '../static/images/user2.png'
import {
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import {Form, Select, Table, Tooltip, Popconfirm, Modal} from 'antd'
import moment from 'moment'

const {TabPane} = Tabs
function callback() {}

class Dashboard extends React.Component {
  constructor() {
    super()
    this.state = {
     
      columns: [
        {
          key: '1',
          title: 'Customer Name',
          dataIndex: 'customername',
        },
        {
          key: '2',
          title: 'Quotation Number',
          dataIndex: 'quotationnumber',
        },
        {
          key: '3',
          title: ' Policy Start Date',
          dataIndex: 'policystartdate',
        },
        {
          key: '4',
          title: ' Policy End Date',
          dataIndex: 'policyexpirytdate',
        },
        {
          key: '5',
          title: 'Premiumm',
          dataIndex: 'proratatotaltermpremium',
        },

        {
          title: 'Actions',
          render: record => (
            <>
              <Tooltip title="Edit">
                <button
                  className="edit_btn"
                  onClick={() => this.EditRecord(record.id)}>
                  <EditOutlined />
                </button>
              </Tooltip>
              <Popconfirm
                className="delete_btn"
                title="Are you sure to delete this record?"
                onConfirm={() => this.deleteRecord(record.id)}>
                <Tooltip title="Delete">
                  <button>
                    <CloseOutlined />
                  </button>
                </Tooltip>
              </Popconfirm>
              &nbsp; &nbsp;
              <Tooltip title="view">
                <Button
                  type="primary"
                  className="view_btn"
                  onClick={() => this.handleView(record.id)}>
                  <EyeOutlined />
                </Button>
              </Tooltip>
            </>
          ),
        },
      ],
      columns3: [
        {
          key: '1',
          title: 'Policy number',
          dataIndex: 'policynumber',
        },
        {
          key: '2',
          title: 'Expiry Date',
          dataIndex: 'policyexpirytdate',
        },
        {
          title: 'Actions',
          render: record => (
            <>
              <Tooltip title="Renew">
                <button
                  className="edit_btn"
                  onClick={() => this.Renew(record.policyid)}>
                  Renew
                </button>
              </Tooltip>
            </>
          ),
        },
      ],
      columns2: [
        {
          key: '1',
          title: 'Customer Name',
          dataIndex: 'customername',
        },
        {
          key: '2',
          title: 'Policy Number',
          dataIndex: 'policynumber',
        },
        {
          key: '3',
          title: '  Start Date',
          dataIndex: 'policystartdate',
        },
        {
          key: '4',
          title: '  End Date',
          dataIndex: 'policyexpirytdate',
        },
        // {
        //   key: '5',
        //   title: 'Annual Premium',
        //   dataIndex: 'grandtotalannualpremium',
        // },
        {
          key: '6',
          title: 'Premium',
          dataIndex: 'proratatotaltermpremium',
        },
        {
          key: '7',
          title: 'Status',
          dataIndex: 'policystatus',
        },
        {
          key: '8',
          title: 'Created Date',
          dataIndex: 'createddate',
          render: createddate => moment(createddate).format('YYYY-MM-DD'),
        },
        {
          title: 'Action',
          dataIndex: 'operation',
          render: (_, record) =>
            record.policystatus == 'New Business' ||
            record.policystatus == 'Endorsed' ? (
              <span>
                <Popconfirm
                  title="Do you want to cancel the policy?"
                  onConfirm={() => this.handleCancel(record.policyid)}>
                  <Tooltip title="cancel">
                    <Button type="danger">
                      <CloseOutlined />
                    </Button>
                  </Tooltip>
                </Popconfirm>
                &nbsp;&nbsp;&nbsp;
                <Tooltip title="View">
                  <Button
                    type="primary"
                    className="view_btn"
                    onClick={() => this.handleView2(record.policyid)}>
                    <EyeOutlined />
                  </Button>
                </Tooltip>
                <Tooltip title="Edit">
                  <Button
                    type="primary"
                    className="edit_btn"
                    onClick={() => this.handleEditPolicy(record.policyid)}>
                    <EditOutlined />
                  </Button>
                </Tooltip>
              </span>
            ) : record.policystatus == 'Cancelled' ? (
              <span>
                <Tooltip title="credit note">
                  <Button
                    type="primary"
                    className="CreditNote_btn"
                    onClick={() => this.handleCreditNote(record.policyid)}>
                    Credit Note
                  </Button>
                </Tooltip>
                &nbsp;&nbsp;{' '}
                <Tooltip title="View">
                  <Button
                    type="primary"
                    className="view_btn"
                    onClick={() => this.handleView2(record.policyid)}>
                    <EyeOutlined />
                  </Button>
                </Tooltip>{' '}
                &nbsp;&nbsp;
              </span>
            ) : (
              <Tooltip title="renew">
                <Button type="primary" className="Renew_btn" success>
                  Renew
                </Button>
              </Tooltip>
            ),
        },
        //  {
        //     title: 'Action',
        //     dataIndex: 'operation',
        //     render: (_, record) =>
        //     record.policystatus != "Expired" ? (

        //       <span>
        //         <Popconfirm title="Do you want to cancel the policy?" onConfirm={() => this.handleCancel(record.policyid)}>
        //        <Button type="danger" >
        //       Cancel
        //     </Button></Popconfirm>
        //     &nbsp;&nbsp; <Button type="primary" onClick={() => this.handleView(record.policyid)} success>View</Button>
        //      </span>) :
        //           // <button onClick={(e) => { this.handleDelete(record.key, e); }}><DeleteOutlined/></button>
        //         <Button type="primary" success>Renew</Button>,
        //   },
      ],
    }
    this.setVisibleFalse2 = this.setVisibleFalse2.bind(this)
    this.setVisibleFalse = this.setVisibleFalse.bind(this)
    this.setVisibleFalse3 = this.setVisibleFalse3.bind(this)
  }

  Renew(val) {
    localStorage.setItem('clientId', val)
    window.location.href = '/endorsedpolicy'
  }

  componentDidMount() {
    // const userRoles = JSON.parse(localStorage.getItem('roles'))
    // fetch(
    //   process.env.REACT_APP_BASE_URL +
    //     '/quotation/GetQuotaions/' +
    //     '10,' +
    //     this.state.productId,
    // )
    //   .then(res => res.json())
    //   .then(data => {
    //     this.setState({
    //       quotations: data.result,
    //     })
    //   })
    // fetch(
    //   process.env.REACT_APP_BASE_URL +
    //     '/Policy/GetPolicies/' +
    //     '10,' +
    //     this.state.productId,
    // )
    //   .then(res => res.json())
    //   .then(data => {
    //     this.setState({
    //       quotations: data.result,
    //     })
    //   })
    // fetch(
    //   process.env.REACT_APP_BASE_URL +
    //     '/Policy/GetPolicies/' +
    //     '10,' +
    //     this.state.productId,
    // )
    //   .then(res => res.json())
    //   .then(data => {
    //     this.setState({
    //       policies: data,
    //     })
    //   })
    // fetch(process.env.REACT_APP_BASE_URL + '/Policy/GetExpiringpolicy/')
    //   .then(res => res.json())
    //   .then(data => {
    //     this.setState({policiesExpiring: data})
    //     console.log(this.state.policiesExpiring)
    //   })
    // if (userRoles == null) {
    //   window.location.href = '/'
    // }
    // // for (let i = 0; i < userRoles.length; i++) {
    // if (this.state.productName === 'Asset All Risk') {
    //   this.setState({assetsRisk: true})
    // } else if (this.state.productName === 'Home Insurance') {
    //   this.setState({homeInsurance: true})
    // }
    // if (userRoles[i].module_name === 'FUNERAL_INSURANCE') {
    //   this.setState({funeralInsurance: true})
    // }
    // if (userRoles[i].module_name === 'LEGAL_INSURANCE') {
    //   this.setState({legalInsurance: true})
    // }
    // if (userRoles[i].module_name === 'HOSPITAL_INSURANCE') {
    //   this.setState({hospitalInsurance: true})
    // }
    // if (userRoles[i].module_name === 'CLAIM_PROCESSING') {
    //   this.setState({claimProcessing: true})
    // }
    // }
  }

  EditRecord(val) {
    localStorage.setItem('clientId', val)
    window.location.href = '/layout/editquotation'
  }

  deleteRecord(val) {
    console.log(val)
    fetch(
      process.env.REACT_APP_BASE_URL + '/quotation/DeleteQuotation/' + val,
      {method: 'DELETE'},
    )
    window.location.reload(false)
  }

  handleView(val) {
    localStorage.setItem('quotationId', val)
    this.setVisible2()
  }

  setVisible2() {
    this.setState({viewQuotation: true})
  }
  setVisibleFalse2() {
    this.setState({viewQuotation: false})
    localStorage.removeItem('quotationId')
    window.location.reload(false)
  }

  handleCancel(val) {
    localStorage.setItem('PolicyID', val)
    window.location.href = '/cancelPolicy'
  }
  handleEditPolicy(val) {
    localStorage.setItem('clientId', val)
    window.location.href = '/endorsedpolicy'
  }

  handleView2(val) {
    localStorage.setItem('PolicyID', val)
    this.setVisible()
  }

  setVisible() {
    this.setState({ViewPolicy: true})
  }

  setVisibleFalse() {
    this.setState({ViewPolicy: false})
    localStorage.removeItem('PolicyID')
    window.location.reload(false)
  }

  handleCreditNote(val) {
    localStorage.setItem('PolicyID', val)
    this.setState({creditNote: true})
  }

  setVisibleFalse3() {
    this.setState({creditNote: false})
    localStorage.removeItem('PolicyID')
    window.location.reload()
  }

  render() {
    var user = JSON.parse(localStorage.getItem('user'))
    console.log("users" , user)
    var role = user && user.role;
    return (
      {
        role === "Admin"? <AdminRouting /> : role === "Teacher" ? <TeacherRouting /> :  role === "Parent" ? <ParentRouting /> : role === "Student" ? <StudentRouting />:<CommonRouting />
      }
      <Layouts title="assets" classname="dashboard">
        <div className="dashboard-heading-top">
          <h1>Dashboard </h1>
        </div>

     
      </Layouts>
    )
  }
}

export default Dashboard

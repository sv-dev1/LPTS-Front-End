import React, {useEffect, useState} from 'react'
import {
  Row,
  Input,
  Col,
  Button,
  Form,
  Select,
  Modal,
  Table,
  DatePicker,
  Popconfirm,
  Layout,
  message,
} from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import AddCustomer from './AddCustomer'
import {CloseOutlined, DeleteOutlined} from '@ant-design/icons'
import {relativeTimeThreshold} from 'moment'
import moment from 'moment'
import {Spin} from 'antd'

const {Option} = Select

function roundvalue(value) {
  if (value > 0) {
    return parseFloat(value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0])
  }
}
const {confirm} = Modal

class HomeInsurancePolicy extends React.Component {
  constructor() {
    super()
    this.state = {
      isCorprate: 'false',
      isTableViible: 'false',
      searchBox: null,
      gotData: false,
      visible: false,
      visibleSearch: false,
      access: '',
      a: false,
      riskCover: '',
      riskItem: '',
      coverType: '',
      data: [],
      riskCoverDrop: [],
      riskItemList: [],
      riskVar: '',
      ratePercentage: '',
      rate: '',
      riskcoverfortable: '',
      riskitemfortable: '',
      newProduct: {},
      addressifNotBuilding: '',
      productid: 0,
      prorataPremiumTotal: 0,
      annualPremiumTotal: 0,
      termPremiumTotal: 0,
      tempAddress: '',
      policyStartDate: new Date(),
      policyEndDate: new Date(),
      riskitemid: '',
      paymentterm: '',
      policyriskcover: '',
      clientfirstname: '',
      clientsurname: '',
      clientcorporatename: '',
      clientcontactnumber: '',
      clientemailaddress: '',
      clientage: '',
      clientgender: '',
      clientaddress1: '',
      clientaddress2: '',
      customerid: 0,
      suburb: '',
      city: '',
      record: '',
      count: 0,
      entitytype: '',
      res: [],
      dateFormat: 'YYYY-MM-DD',
      stampDuty: '',
      riskItemStartDate: new Date(),
      currentDate: new Date(),
      currency: '',
      currencyList: [],
      reinsuranceLimit: '',
      loading: false,
      loggedInId: parseInt(localStorage.getItem('loggedInUserID')),
      cellphone: false,
      coverType: '',
      customerData: '',
      productId: parseInt(localStorage.getItem('productId')),
      productName: localStorage.getItem('productName'),
      columns: [
        {
          key: 'riskitem',
          title: 'Risk Item',
          dataIndex: 'riskitemname',
        },
        {
          key: 'address',
          title: 'Address/Details',
          dataIndex: 'address',
        },

        {
          key: 'suminsured',
          title: 'Sum Insured',
          dataIndex: 'suminsured',
        },
        {
          key: 'rate',
          title: 'Rate(%)',
          dataIndex: 'rate',
        },
        {
          key: 'Proratapremium',
          title: 'Prorata Premium',
          dataIndex: 'prorata',
        },
        {
          key: 'annualpremium',
          title: 'Annual Premium',
          dataIndex: 'annualpremium',
        },
        {
          key: 'termpremium',
          title: 'Term Premium',
          dataIndex: 'termpremium',
        },
        {
          key: 'itempstartdate',
          title: 'Start Date',
          dataIndex: 'itempstartdate',
        },
        {
          title: 'Action',
          dataIndex: 'operation',
          render: (_, record) =>
            this.state.data.length >= 1 ? (
              <Popconfirm
                title="Do you want to remove this Item ?"
                onConfirm={() => this.handleDelete(record.key)}>
                <button className="delete_btn">
                  <CloseOutlined />
                </button>
              </Popconfirm>
            ) : // <button onClick={(e) => { this.handleDelete(record.key, e); }}><DeleteOutlined/></button>

            null,
        },
      ],
    }
    this.updateInput = this.updateInput.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.ShowHideCorporateName = this.ShowHideCorporateName.bind(this)
    this.setVisible = this.setVisible.bind(this)
    this.setVisibleFalse = this.setVisibleFalse.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.setVisibleSearch = this.setVisibleSearch.bind(this)
    this.riskitem = this.riskitem.bind(this)
    this.startdateChange = this.startdateChange.bind(this)
    this.enddateChange = this.enddateChange.bind(this)
    this.paymenttermChange = this.paymenttermChange.bind(this)
    this.riskcoverChange = this.riskcoverChange.bind(this)
    this.findDayDifference = this.findDayDifference.bind(this)
    this.startdateChangeRiskItem = this.startdateChangeRiskItem.bind(this)
    this.CoverTypeChange = this.CoverTypeChange.bind(this)
    this.currencyChange = this.currencyChange.bind(this)
  }

  handleDelete = key => {
    const dataSource = [...this.state.data]
    const filterdata = dataSource.filter(item => item.key !== key)
    this.setState({
      data: dataSource.filter(item => item.key !== key),
    })

    let termPremium_Total = 0
    let annualPremium_Total = 0
    let prorataPremium_Total = 0
    for (let i = 0; i < filterdata.length; i++) {
      this.state.isTableViible = 'hidden'
      termPremium_Total += filterdata[i].termpremium
      annualPremium_Total += filterdata[i].annualpremium
      prorataPremium_Total += filterdata[i].prorata
    }
    this.setState({termPremiumTotal: termPremium_Total})
    this.setState({annualPremiumTotal: annualPremium_Total})
    this.setState({prorataPremiumTotal: prorataPremium_Total})
  }
  componentDidMount() {
    var datestring = this.state.policyStartDate
    var year = new Date(datestring).getFullYear()
    var month = new Date(datestring).getMonth()
    var day = new Date(datestring).getDate()
    var Newdate = new Date(year + 1, month, day)
    this.setState({policyEndDate: Newdate}, this.printenddate)

    fetch(process.env.REACT_APP_BASE_URL + '/Product/GetGloabalList/'+this.state.productId)
      .then(res => res.json())
      .then(data => {
        this.setState({
          stampDuty: data.result.mastersetting[0].stampduty,
          riskItemList: data.result.riskitemlist,
          riskCoverDrop: data.result.riskcoverlist,
          reinsuranceLimit: data.result.mastersetting[0].reinsurancelimit,
          currencyList: data.result.currencylist,
        })
      })
   
   
  }

  submitpolicy = e => {
    e.preventDefault()
    this.setState({loading: true})
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let apiurl = ''
        apiurl =
          process.env.REACT_APP_BASE_URL + '/quotation/AddClientwithQuotation'
        e.preventDefault()
        const customerDetails = {
          entitytype: this.state.entitytype,
          nationalid: values.uuid,
          clientfirstname: values.firstName,
          clientsurname: values.surName,
          clientcorporatename: values.corporateName,
          clientemailaddress: values.emailAddress,
          clientage: parseInt(values.age),
          clientgender: values.gender,
          clientaddress1: values.address1,
          clientaddress2: '', //values.address2,
          suburb: values.suburb,
          city: values.city,
          clientcontactnumber: values.contactNumber,
          createdby: this.state.loggedInId,
        }
        const productDetails = {
          totalannualpremium: roundvalue(this.state.annualPremiumTotal),
          totaltermpremium: roundvalue(this.state.termPremiumTotal),
          stampdutyannualpremium: roundvalue(
            (this.state.annualPremiumTotal / 100) * this.state.stampDuty,
          ),
          stampdutytermpremium: roundvalue(
            (this.state.termPremiumTotal / 100) * this.state.stampDuty,
          ),
          grandtotalannualpremium: roundvalue(this.state.annualPremiumTotal),
          grandtotaltermpremium: roundvalue(this.state.termPremiumTotal),
          proratatotaltermpremium: roundvalue(this.state.prorataPremiumTotal),
          clientid: this.state.loggedInId, // need to change after few days
          createdby: 1, // need to change after few days
          customername: values.firstName + ' ' + values.surName,
          modifiedby: 1, // need to change after few days
          nationalid: values.uuid,
          isactive: true,
          isdeleted: false,
          policyriskcover: this.state.policyriskcover,
          riskitemList: this.state.data,
          policystartdate: this.state.policyStartDate,
          policyexpirytdate: this.state.policyEndDate,
          currency: this.state.currency,
          paymentterms: this.state.paymentterm,
          customerid: this.state.customerid,
          productname: this.state.productName,
          productid: parseInt(this.state.productId),
        }
        var totalData = {
          clientdetail: customerDetails,
          pquotationdetail: productDetails,
        }
        console.log(totalData)
        const requestMetadata = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(totalData),
        }

        fetch(apiurl, requestMetadata)
          .then(res => res.json())
          .then(recipes => {
            message.success('Quotation created successfully !!')
            window.location.href = '/quotationList'
            this.setState({loading: false})
          })
      }
    })
  }
  // Functions for search functionality (if data not found)
  // Hide function to hide the modal after user clicked on cancel button
  hideModal() {
    this.setState({
      visibleSearch: false,
    })
  }

  CoverTypeChange(value) {
    //  select paymentterm john
    this.setState({coverType: value})
  }

  // Redirecting to another model where client can add customer to the database
  setVisibleSearch() {
    this.setState({
      visibleSearch: false,
    })
    this.setState({visible: true})
  }

  // Functions for Modal functioanlity to add customers
  setVisible() {
    this.setState({visible: true})
  }
  setVisibleFalse() {
    this.setState({visible: false})
  }

  // Function for search functionality
  handleChange({target}) {
    this.setState({
      searchBox: target.value,
    })
    console.log(this.state.searchBox)
  }

  ShowHideCorporateName(value) {
    this.setState({entitytype: value})
  }

  updateInput() {
    var val = this.state.searchBox
    const current = []
    fetch('http://196.43.100.211:5000/api/v1/customer/' + val)
      .then(res => res.json())
      .then(data => {
        this.setState({
          clientfirstname: data.client_name,
          clientsurname: data.client_surname,
          clientcorporatename: data.client_coprorate_name,
          clientcontactnumber: data.client_mobile,
          clientemailaddress: data.client_email,
          clientgender: data.client_gender,
          clientage: data.client_age,
          clientaddress1: data.client_address,
          customerid: data.id,
          nationalid: data.client_id_number,
          suburb: data.client_suburb,
          city: data.client_city,
          entitytype: data.client_entity,
        })
      })
  }
  riskitem(value) {
    this.setState({cellphone: false})
    this.state.addressifNotBuilding = '--'
    for (let i = 0; i < this.state.riskItemList.length; i++) {
      if (value === this.state.riskItemList[i].riskitemid) {
        this.setState({riskitemid: this.state.riskItemList[i].riskitemid})
        this.setState({rate: this.state.riskItemList[i].ratepercentage})
        this.setState({
          riskitemfortable: this.state.riskItemList[i].riskitemname,
        })
        if (this.state.riskItemList[i].riskitemname === 'Cellphone') {
          this.setState({cellphone: true})
        }
        if (
          this.state.riskItemList[i].riskitemname === 'Jewellery' ||
          this.state.riskItemList[i].riskitemname === 'Art'
        ) {
          this.state.coverType = 'Agreed Value'
        } else {
          this.state.coverType = 'Sum Insured'
        }
      }
    }
  }

  findDayDifference(date1, date2) {
    // always round down
    return Math.floor(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))
  }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      let term_premium = '0.0'
      let prorata = '0.0'
      let annual_premium = (values.sumInsured / 100) * this.state.rate
      var Noofdays = this.findDayDifference(
        new Date(this.state.riskItemStartDate),
        new Date(this.state.policyEndDate),
      )
      Noofdays = Noofdays + 1
      prorata = ((values.sumInsured / 100) * this.state.rate * Noofdays) / 365
      term_premium = ((values.sumInsured / 100) * this.state.rate) / 3
      const count = 0
      if (!err) {
        var riskstartdate = new Date(this.state.riskItemStartDate)
        var riskenddate = new Date(this.state.policyEndDate)
        this.state.newProduct = {
          key: this.state.count, // john 24-03-2022
          riskitemid: this.state.riskitemid.toString(),
          riskcover: this.state.riskcoverfortable,
          riskitemname: this.state.riskitemfortable,
          covertype: this.state.coverType,
          address: values.address,
          suminsured: roundvalue(values.sumInsured),
          rate: this.state.rate,
          prorata: roundvalue(prorata),
          annualpremium: roundvalue(annual_premium),
          termpremium: roundvalue(term_premium),
          itempstartdate:
            riskstartdate.getFullYear() +
            '-' +
            (riskstartdate.getMonth() + 1) +
            '-' +
            riskstartdate.getDate(), // this.state.riskItemStartDate
          itempexpirydate:
            riskenddate.getFullYear() +
            '-' +
            (riskenddate.getMonth() + 1) +
            '-' +
            riskenddate.getDate(), // this.state.riskItemStartDate
        }
        // Converting object into array to be used in table as dataSource
        this.state.data.push(this.state.newProduct)

        this.setState({count: this.state.count + 1}) //john 24-03-2022

        for (let i = 0; i < this.state.data.length; i++) {
          this.state.isTableViible = 'hidden'
          this.setState({
            prorataPremiumTotal:
              this.state.data[i].prorata + this.state.prorataPremiumTotal,
          })
          this.setState({
            termPremiumTotal:
              this.state.data[i].termpremium + this.state.termPremiumTotal,
          })
          this.setState({
            annualPremiumTotal:
              this.state.annualPremiumTotal + this.state.data[i].annualpremium,
          })
        }
      }
      // values.address = null;
      // values.sumInsured = null;
    })
  }

  convertDateToString() {}

  //function to get riskcover multiple selection
  riskcoverChange(value) {
    // john 23 March 2022
    this.setState({policyriskcover: value.toString()})
  }

  startdateChangeRiskItem(date, datestring) {
    if (datestring === '') {
      message.warning('Risk item start date cannot be null')
    } else {
      if (new Date(this.state.policyEndDate) < new Date(datestring)) {
        message.error('Invalid Date')
      } else {
        this.setState({riskItemStartDate: new Date(datestring)})
      }
    }
  }

  startdateChange(date, datestring) {
    if (datestring === '') {
      message.warning('Start date cannot be empty')
    } else if (new Date(datestring) >= new Date(this.state.currentDate)) {
      this.setState({policyStartDate: new Date(datestring)})
      var year = new Date(datestring).getFullYear()
      var month = new Date(datestring).getMonth()
      var day = new Date(datestring).getDate()
      var Newdate = new Date(year + 1, month, day)
      this.setState({policyEndDate: Newdate})
      const dataRecords = this.state.data

      if (dataRecords.length > 0) {
        this.SetRisKItemDataByStartDate(datestring)
      }
    } else {
      message.warning('Start date cannot be smaller than Current Date')
    }
  }

  enddateChange(date, datestring) {
    let end_date = new Date(datestring)
    if (datestring === '') {
      message.warning('End date cannot be empty')
    } else {
      if (end_date > this.state.policyStartDate) {
        this.setState({policyEndDate: datestring})
      } else {
        message.error('Invalid Duration ')
      }
    }

    // this.state.policyEndDate = datestring

    // const dataRecords = this.state.data;
    //  if (dataRecords.length>0 && Date(this.state.policyEndDate) < Date(this.state.policyStartDate))
    //  {
    //   this.SetRisKItemDataByEndDate(datestring);
    //  }
    //  else(
    //    alert("Policy duration not applicable")
    //  )
  }

  validateDate() {
    if (Date(this.state.policyEndDate) < Date(this.state.policyStartDate)) {
    }
  }

  SetRisKItemDataByStartDate(datestring) {
    let term_premium = '0.0'
    let prorata = '0.0'

    var Noofdays = this.findDayDifference(
      new Date(datestring),
      new Date(this.state.policyEndDate),
    )
    Noofdays = Noofdays + 1

    let ctprorataPremiumTotal = 0
    let cttermPremiumTotal = 0
    let ctannualPremiumTotal = 0

    for (let i = 0; i < this.state.data.length; i++) {
      this.state.data[i].annualpremium = roundvalue(
        (this.state.data[i].rate / 100) * this.state.data[i].suminsured,
      )
      this.state.data[i].termpremium = roundvalue(
        ((this.state.data[i].rate / 100) * this.state.data[i].suminsured) / 3,
      )

      this.state.data[i].prorata = roundvalue(
        (((this.state.data[i].suminsured * this.state.data[i].rate) / 100) *
          Noofdays) /
          365,
      )
    }

    for (let i = 0; i < this.state.data.length; i++) {
      ctprorataPremiumTotal = this.state.data[i].prorata + ctprorataPremiumTotal
      cttermPremiumTotal = this.state.data[i].termpremium + cttermPremiumTotal
      ctannualPremiumTotal =
        this.state.data[i].annualpremium + ctannualPremiumTotal
    }

    this.setState({prorataPremiumTotal: ctprorataPremiumTotal})
    this.setState({termPremiumTotal: cttermPremiumTotal})
    this.setState({annualPremiumTotal: ctannualPremiumTotal})
  }

  SetRisKItemDataByEndDate(datestring) {
    let term_premium = '0.0'
    let prorata = '0.0'

    var Noofdays = this.findDayDifference(
      new Date(this.state.policyStartDate),
      new Date(datestring),
    )
    Noofdays = Noofdays + 1

    let ctprorataPremiumTotal = 0
    let cttermPremiumTotal = 0
    let ctannualPremiumTotal = 0

    const dataRecords = this.state.data

    this.setState({policyEndDate: datestring})

    for (let i = 0; i < this.state.data.length; i++) {
      this.state.data[i].annualpremium = roundvalue(
        (this.state.data[i].rate / 100) * this.state.data[i].suminsured,
      )
      this.state.data[i].termpremium = roundvalue(
        ((this.state.data[i].rate / 100) * this.state.data[i].suminsured) / 3,
      )

      this.state.data[i].prorata = roundvalue(
        (((this.state.data[i].suminsured * this.state.data[i].rate) / 100) *
          Noofdays) /
          365,
      )
    }

    for (let i = 0; i < this.state.data.length; i++) {
      ctprorataPremiumTotal = this.state.data[i].prorata + ctprorataPremiumTotal
      cttermPremiumTotal = this.state.data[i].termpremium + cttermPremiumTotal
      ctannualPremiumTotal =
        this.state.data[i].annualpremium + ctannualPremiumTotal
    }

    this.setState({prorataPremiumTotal: ctprorataPremiumTotal})
    this.setState({termPremiumTotal: cttermPremiumTotal})
    this.setState({annualPremiumTotal: ctannualPremiumTotal})
  }
  currencyChange(value) {
    this.setState({currency: value})
  }
  paymenttermChange(value) {
    //  select paymentterm john
    this.setState({paymentterm: value})
  }

  render() {
    const {getFieldDecorator} = this.props.form

    let customerData =
      this.state.customerData.length > 0 &&
      this.state.customerData.map(d => (
        <Option key={d.value}>{d.client_id_number}</Option>
      ))

    let riskCoverList =
      this.state.riskCoverDrop.length > 0 &&
      this.state.riskCoverDrop.map((item, i) => {
        return (
          //<Select.Option   key={i} value={item.riskcoverid}>{item.riskname}</Select.Option>
          <Select.Option key={i} value={item.riskname}>
            {item.riskname}
          </Select.Option>
        )
      }, this)

    let riskNameList =
      this.state.riskItemList.length > 0 &&
      this.state.riskItemList.map((item, i) => {
        return (
          <Select.Option key={i} value={item.riskitemid}>
            {item.riskitemname}
          </Select.Option>
        )
      }, this)
    let currencyList =
      this.state.currencyList.length > 0 &&
      this.state.currencyList.map((item, i) => {
        return (
          <Select.Option key={i} value={item.currencycode}>
            {item.currencyname + '-' + item.currencycode}
          </Select.Option>
        )
      }, this)

    return (
      <Layout className="dashboard">
        <Spin
          className="loader-icon-fixed"
          spinning={this.state.loading}
          size="large"></Spin>
        <div className=" dash-bg-white">
          <Row gutter={4}>
            <Col xs={12} sm={24} md={12} lg={24}>
              <h5
                style={{
                  color: '#F15A2B',
                  fontWeight: '500',
                  fontSize: '20px',
                  marginBottom: '0',
                }}>
                <strong>
                  Product Name :{' '}
                  <label
                    style={{
                      color: '#F15A2B',
                      fontWeight: '700',
                      fontSize: '20px',
                    }}>
                    {this.state.productName}
                  </label>
                </strong>
              </h5>
              {/* <Button
                size="medium"
                value={"update"}
                onClick={this.submitpolicy}
                style={{
                  marginLeft: "auto",
                  color: "#fd7e14",
                  borderColor: "#fd7e14",                 
                }}>
                  
                Finalise
              </Button> */}
            </Col>
          </Row>
        </div>
        <div className="dash-bg-white ">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={24} md={24} lg={12}>
              <div className="section-top-heading">
                <h3
                  style={{
                    color: '#F15A2B',
                    fontWeight: '700',
                    fontSize: '20px',
                    margin: '0',
                    marginBottom: '20px',
                  }}>
                  {' '}
                  Basic Customer Details{' '}
                </h3>
              </div>
            </Col>
            <Col xs={12} sm={24} md={24} lg={8}>
              <div className="item-search">
                <Form.Item>
                  {' '}
                  <Input
                    className="item-search"
                    placeholder="Search "
                    name="searchBox"
                    value={this.state.searchBox}
                    onChange={this.handleChange}
                  />{' '}
                </Form.Item>
              </div>
            </Col>
            <Col xs={12} sm={24} md={24} lg={4}>
              <div className="create-quotation">
                <Button
                  className="search-btn-group"
                  size="medium"
                  onClick={this.updateInput}>
                  Search
                </Button>
              </div>
            </Col>
          </Row>

          <div className="basic-customer-details">
            <Form onSubmit={this.handleSubmit}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12} lg={4}>
                  <Form.Item label="Entity Type">
                    <Select
                      value={this.state.entitytype}
                      name="Entity type"
                      style={{width: '100%'}}
                      onChange={this.ShowHideCorporateName}>
                      <Option Selected value="">
                        --Select--
                      </Option>
                      <Option value="Business">Business</Option>
                      <Option value="Individual">Individual</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12} lg={4}>
                  <Form.Item label="First Name">
                    {getFieldDecorator('firstName', {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter Firstname!',
                          whitespace: false,
                        },
                      ],
                      initialValue: this.state.clientfirstname,
                    })(<Input placeholder="Enter Firstname" />)}
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={4}>
                  <Form.Item label="Sur Name">
                    {getFieldDecorator('surName', {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter Surname!',
                          whitespace: false,
                        },
                      ],
                      initialValue: this.state.clientsurname,
                    })(<Input placeholder="Enter Surname" />)}
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={4}>
                  <Form.Item label="Corporate Name">
                    {getFieldDecorator('corporateName', {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter Corporate Name!',
                          whitespace: false,
                        },
                      ],
                      initialValue: this.state.clientcorporatename,
                    })(<Input placeholder="Enter Corporate Name" />)}
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={4}>
                  <Form.Item label="Contact Number">
                    {getFieldDecorator('contactNumber', {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter Contact Number!',
                          whitespace: false,
                        },
                      ],
                      initialValue: this.state.clientcontactnumber,
                    })(<Input placeholder="Enter Contact Number" />)}
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={4}>
                  <Form.Item label="Email Address">
                    {getFieldDecorator('emailAddress', {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter Email Address!',
                          whitespace: false,
                        },
                      ],
                      initialValue: this.state.clientemailaddress,
                    })(<Input placeholder="Enter Email Address" />)}
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={4}>
                  <Form.Item label="Age">
                    {getFieldDecorator('age', {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter Age',
                        },
                      ],
                      initialValue: this.state.clientage,
                    })(<Input placeholder="Enter Age" />)}
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={4}>
                  <Form.Item label="National Id">
                    {getFieldDecorator('uuid', {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter National Id!',
                          whitespace: false,
                        },
                      ],
                      initialValue: this.state.nationalid,
                    })(<Input placeholder="Enter National Id" />)}
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={4}>
                  <Form.Item label="Gender">
                    {getFieldDecorator('gender', {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter Gender!',
                          whitespace: false,
                        },
                      ],
                      initialValue: this.state.clientgender,
                    })(<Input placeholder="Enter Gender" />)}
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={4}>
                  <Form.Item label="Address">
                    {getFieldDecorator('address1', {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter Address !',
                          whitespace: false,
                        },
                      ],
                      initialValue: this.state.clientaddress1,
                    })(<Input placeholder="Enter Address " />)}
                  </Form.Item>
                </Col>

                <Col xs={24} md={12} lg={4}>
                  <Form.Item label="Suburb">
                    {getFieldDecorator('suburb', {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter Suburb !',
                          whitespace: false,
                        },
                      ],
                      initialValue: this.state.suburb,
                    })(<Input placeholder="Enter Suburb " />)}
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={4}>
                  <Form.Item label="City">
                    {getFieldDecorator('city', {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter City !',
                          whitespace: false,
                        },
                      ],
                      initialValue: this.state.city,
                    })(<Input placeholder="Enter City" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="dash-bg-white">
          <h3
            style={{
              color: '#F15A2B',
              fontWeight: '700',
              fontSize: '18px',
              marginBottom: '20px',
            }}>
            Policy Details
          </h3>
          <Row gutter={[16, 24]}>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Policy Start Date">
                <DatePicker
                  style={{width: '100%'}}
                  placeholder="Policy Start Date"
                  value={moment(
                    this.state.policyStartDate,
                    this.state.dateFormat,
                  )}
                  onChange={this.startdateChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Policy End Date">
                <DatePicker
                  style={{width: '100%'}}
                  placeholder="Policy End Date"
                  value={moment(
                    this.state.policyEndDate,
                    this.state.dateFormat,
                  )}
                  onChange={this.enddateChange}
                />
              </Form.Item>
            </Col>
            <Col xs={20} md={12} lg={5}>
              <Form.Item label="Risk Cover">
                <Select
                  placeholder="Select option"
                  mode="multiple"
                  onChange={this.riskcoverChange}
                  style={{display: 'inline'}}>
                  {riskCoverList}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={20} md={12} lg={3}>
              <Form.Item label="Currency">
                <Select
                  placeholder="Select option"
                  onChange={this.currencyChange}
                  style={{display: 'inline'}}>
                  {currencyList}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={20} md={12} lg={4}>
              <Form.Item label="Payment Term">
                <Select
                  defaultValue="--Select option--"
                  onChange={this.paymenttermChange}
                  style={{display: 'inline'}}>
                  <Option value="Annually">Annually</Option>
                  <Option value="Quarterly">Quarterly</Option>
                  <Option value="Monthly">Monthly</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={20} md={12} lg={4}>
              <Form.Item label="Risk Insurance Limit">
                <Input value={this.state.reinsuranceLimit} disabled />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="dash-bg-white">
          <h3
            style={{
              color: '#F15A2B',
              fontWeight: '700',
              fontSize: '18px',
              marginBottom: '20px',
            }}>
            Product Details
          </h3>

          <Form onSubmit={this.handleSubmit}>
            <Row gutter={[16, 24]}>
              <Col xs={24} md={12} lg={4}>
                <Form.Item label="Risk Item">
                  <Select
                    defaultValue="Risk Item"
                    onChange={this.riskitem}
                    style={{display: 'inline'}}>
                    {riskNameList}
                  </Select>
                </Form.Item>
              </Col>

              {this.state.cellphone === true && (
                <Col xs={24} md={12} lg={4}>
                  <Form.Item label="Model">
                    {/* <Input  onc  placeholder="Address"/> */}
                    {getFieldDecorator('address', {
                      rules: [
                        {
                          required: true,
                          message: 'Please Enter Cellphone model!',
                          whitespace: false,
                        },
                      ],
                    })(<Input placeholder="Cellphone Model" />)}
                  </Form.Item>
                </Col>
              )}

              {this.state.cellphone === false && (
                <Col xs={24} md={12} lg={4}>
                  <Form.Item label="Address/Item Details">
                    {/* <Input  onc  placeholder="Address"/> */}
                    {getFieldDecorator('address', {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter Address!',
                          whitespace: false,
                        },
                      ],
                    })(<Input placeholder="Address/Item Details" />)}
                  </Form.Item>
                </Col>
              )}

              <Col xs={24} md={12} lg={4}>
                <Form.Item label="Cover type">
                  <Input
                    placeholder="Cover Type"
                    value={this.state.coverType}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12} lg={4}>
                <Form.Item label="Sum Insured">
                  {getFieldDecorator('sumInsured', {
                    rules: [
                      {
                        required: true,
                        message: 'Please enter Amount!',
                        whitespace: false,
                      },
                    ],
                  })(<Input placeholder="Amount" />)}
                </Form.Item>
              </Col>

              <Col xs={24} md={12} lg={2}>
                <Form.Item label="Rate(%)">
                  <Input placeholder="Rate(%)" value={this.state.rate} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12} lg={4}>
                <Form.Item label="Start Date">
                  <DatePicker
                    value={moment(
                      this.state.riskItemStartDate,
                      this.state.dateFormat,
                    )}
                    onChange={this.startdateChangeRiskItem}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12} lg={2}>
                <div className="add-button">
                  <Button
                    htmlType="submit"
                    size="default"
                    className="add-secondary">
                    Add
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="dash-bg-white no-padding">
          <div className="table-grid-bx width-11">
            <Table
              className="table-scroll-auto"
              columns={this.state.columns}
              dataSource={this.state.data}
              pagination={false}
            />
            <div className="grand-total-bx " style={{textAlign: 'left'}}>
              <table width="100%">
                <tbody>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>

                    <td style={{textAlign: 'left'}}>
                      <b>Total</b>
                    </td>
                    <td style={{textAlign: 'left'}}>
                      {roundvalue(this.state.prorataPremiumTotal)}
                    </td>
                    <td style={{textAlign: 'left'}}>
                      {roundvalue(this.state.annualPremiumTotal)}
                    </td>
                    <td style={{textAlign: 'left'}}>
                      {roundvalue(this.state.termPremiumTotal)}
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>

                    <td style={{textAlign: 'left'}}>
                      <b>Stamp Duty</b>
                    </td>
                    <td style={{textAlign: 'left'}}>
                      {roundvalue(
                        (this.state.prorataPremiumTotal / 100) *
                          this.state.stampDuty,
                      )}
                    </td>
                    <td style={{textAlign: 'left'}}>
                      {roundvalue(
                        (this.state.annualPremiumTotal / 100) *
                          this.state.stampDuty,
                      )}
                    </td>
                    <td style={{textAlign: 'left'}}>
                      {roundvalue(
                        (this.state.termPremiumTotal / 100) *
                          this.state.stampDuty,
                      )}
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>

                    <td></td>
                    <td style={{textAlign: 'left'}}>
                      <b>Grand Total</b>
                    </td>
                    <td style={{textAlign: 'left'}}>
                      {roundvalue(
                        (this.state.prorataPremiumTotal / 100) *
                          this.state.stampDuty +
                          this.state.prorataPremiumTotal,
                      )}
                    </td>
                    <td style={{textAlign: 'left'}}>
                      {roundvalue(
                        (this.state.annualPremiumTotal / 100) *
                          this.state.stampDuty +
                          this.state.annualPremiumTotal,
                      )}
                    </td>
                    <td style={{textAlign: 'left'}}>
                      {roundvalue(
                        (this.state.termPremiumTotal / 100) *
                          this.state.stampDuty +
                          this.state.termPremiumTotal,
                      )}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {this.state.data !== null && (
            <div className="btn-group-success">
              <Button
                size="medium"
                value={'submit'}
                className="btn-success"
                onClick={this.submitpolicy}>
                Submit
              </Button>
            </div>
          )}
        </div>
      </Layout>
    )
  }
}

const WrappedHomeInsurancePolicy = Form.create({name: 'Homeinsurance_list'})(
  HomeInsurancePolicy,
)

export default WrappedHomeInsurancePolicy

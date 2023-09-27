import React, {useEffect, useState} from 'react'
import {
  Row,
  message,
  Input,
  Col,
  Button,
  Form,
  Select,
  Modal,
  Table,
  DatePicker,
  Popconfirm,
  Result,
  Layout,
} from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import AddCustomer from './AddCustomer'
import {CloseOutlined, DeleteOutlined} from '@ant-design/icons'
import queryString from 'query-string'
import axios from 'axios'
import moment from 'moment'
import {Spin} from 'antd'

const {Option} = Select

function roundvalue(value) {
  // for round the vlaues john 24 march 2022
  if (value > 0) {
    return parseFloat(value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0])
  }
}
class EditQuotation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isCorprate: false,
      isTableViible: 'false',
      searchBox: null,
      gotData: false,
      visible: false,
      visibleSearch: false,
      api: 'https://localhost:7279/GetClientDetailsbyid/1',
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
      annualPremiumTotal: 0,
      termPremiumTotal: 0,
      prorataPremiumTotal: 0, //johh 30-03-2022
      tempAddress: '',
      policyStartDate: '',
      policyEndDate: '',
      paymentterm: '', //john 24-03-2022
      policyriskcover: '', //john 24-03-2022
      record: '', //john 24-03-2022
      clientfirstname: '',
      clientsurname: '',
      clientcorporatename: '',
      clientcontactnumber: '',
      clientemailaddress: '',
      clientage: '',
      clientgender: '',
      clientaddress1: '',
      clientaddress2: '',
      nationalid: '',
      customerid: '',
      suburb: '',
      city: '',
      riskItemStartDate: new Date(),
      currentDate: new Date(),
      stampDuty: '',
      reinsuranceLimit: '',
      loading: false,
      cellphone: false,
      currency: '',
      currencyList: [],

      currencyFromApi: '',
      corporateType: '',
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
          key: 'actions',
          title: 'Actions',
          render: (_, record, index) =>
            this.state.data.length >= 1 ? (
              <Popconfirm
                title="Do you want to remove this Item?"
                onConfirm={() => this.handleDelete(index)}>
                <button className="delete_btn">
                  <CloseOutlined />
                </button>
              </Popconfirm>
            ) : null,
        },
      ],
      // Variables for fetching user info
      res: [],
      clientName: '',
      quotationId: '',
      startDateFromApi: '',
      endDateFromApi: '',
      riskCoverFromApi: [],
      riskItemFromApi: '',
      clientId: parseInt(localStorage.getItem('clientId')),
      termPremiumTotalForEdit: 0,
      annualPremiumTotalForEdit: 0,
      prorataPremiumTotalForEdit: 0,
      riskitemid: '',
      dateFormat: 'YYYY-MM-DD',
      productId: localStorage.getItem('productId'),
      productName: localStorage.getItem('productName'),
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
    // this.handleSubmitWithId = this.handleSubmitWithId(this);
    this.paymenttermChange = this.paymenttermChange.bind(this) //john 24-03-2022
    this.riskcoverChange = this.riskcoverChange.bind(this) //john 24-03-2022
    this.submitpolicy = this.submitpolicy.bind(this)
    this.onInputchange = this.onInputchange.bind(this)
    this.startdateChangeRiskItem = this.startdateChangeRiskItem.bind(this)
    this.state.handleSubmit = this.handleSubmit.bind(this)
    this.currencyChange = this.currencyChange.bind(this)
  }
  // delete record from the grid and perform the calculation  john 24-03-2022
  handleDelete = key => {
    let annual_premium = 0
    let term_premium = 0
    let pro_rata = 0
    this.state.res[0].riskitemlist.splice(key, 1)
    this.state.data = []
    this.state.data.push(this.state.res[0].riskitemlist)

    for (let i = 0; i < this.state.data[0].length; i++) {
      pro_rata = this.state.data[0][i].prorata + pro_rata
      annual_premium = this.state.data[0][i].annualpremium + annual_premium
      term_premium = this.state.data[0][i].termpremium + term_premium
    }
    this.setState({prorataPremiumTotalForEdit: roundvalue(pro_rata)})
    this.setState({annualPremiumTotalForEdit: roundvalue(annual_premium)})
    this.setState({termPremiumTotalForEdit: roundvalue(term_premium)})
  }

  setLoading() {
    this.setState({loading: true})
  }

  setLoadingFalse() {
    this.setState({loading: false})
  }

  componentDidMount() {
    this.setState({loading: true})
    const parsed = queryString.parse(window.location.search)
    if (this.state.clientId !== null) {
      axios
        .get(
          process.env.REACT_APP_BASE_URL +
            '/quotation/GetQuotaionDetailsbyid/' +
            this.state.clientId,
        )
        .then(response => {
          console.log(response)
          this.setState({
            clientfirstname: response.data.clientdetail.clientfirstname,
            clientsurname: response.data.clientdetail.clientsurname,
            clientcontactnumber: response.data.clientdetail.clientcontactnumber,
            clientage: response.data.clientdetail.clientage,
            clientaddress1: response.data.clientdetail.clientaddress1,
            clientId: response.data.clientdetail.id,
            nationalid: response.data.clientdetail.nationalid,
            clientcorporatename: response.data.clientdetail.clientcorporatename,
            clientemailaddress: response.data.clientdetail.clientemailaddress,
            clientgender: response.data.clientdetail.clientgender,
            suburb: response.data.clientdetail.suburb,
            city: response.data.clientdetail.city,
            entitytype: response.data.clientdetail.entitytype,
            currency: response.data.pquotationdetail.currency,
          })

          this.state.res.push(response.data.pquotationdetail)

          this.setState({paymentterm: this.state.res[0].paymentterms})
          this.setState({quotationId: this.state.res[0].quotationnumber})

          this.setState({
            riskCoverFromApi:
              this.state.res[0].policyriskcover.includes(',') == true
                ? this.state.res[0].policyriskcover.split(',')
                : this.state.res[0].policyriskcover,
          })
          // this.setState({currencyFromApi:})
          this.setState({clientName: this.state.res[0].customername})
          this.setState({
            riskItemFromApi: this.state.res[0].riskbuildingmaterial,
          })
          this.setState({
            annualPremiumTotal: this.state.res[0].totalannualpremium,
          })
          this.setState({
            termPremiumTotal: this.state.res[0].totaltermpremium,
          })
          this.setState({policynumber: this.state.res[0].quotationnumber})
          this.setState({
            policyStartDate: this.state.res[0].policystartdate,
          })
          this.setState({
            policyexpirytdate: this.state.res[0].policyexpirytdate,
          })
          this.setState({clientId: this.state.res[0].clientid})
          this.setState({
            policyriskcover: this.state.res[0].policyriskcover,
          })
          //  this.setState({startDateFromApi : this.state.res[0].createddate});
          this.setState({newProduct: this.state.res[0].riskitemlist})
          this.state.data.push(this.state.newProduct)
          if (this.state.newProduct != null) {
            for (let i = 0; i < this.state.newProduct.length; i++) {
              this.setState({
                prorataPremiumTotalForEdit:
                  this.state.newProduct[i].prorata +
                  this.state.prorataPremiumTotalForEdit,
              })
              this.setState({
                annualPremiumTotalForEdit:
                  this.state.newProduct[i].annualpremium +
                  this.state.annualPremiumTotalForEdit,
              })
              this.setState({
                termPremiumTotalForEdit:
                  this.state.newProduct[i].termpremium +
                  this.state.termPremiumTotalForEdit,
              })
              this.setState({loading: false})
            }
          }
        })
      fetch(process.env.REACT_APP_BASE_URL + '/Product/GetGloabalList/2')
        .then(res => res.json())
        .then(data => {
          console.log(data)
          this.setState({
            stampDuty: data.result.mastersetting[0].stampduty,
            riskItemList: data.result.riskitemlist,
            riskCoverDrop: data.result.riskcoverlist,
            reinsuranceLimit: data.result.mastersetting[0].reinsurancelimit,
            currencyList: data.result.currencylist,
            // productId:
            // productName:
          })
        })
    }
  }

  currencyChange(value) {
    this.setState({currency: value})
  }
  componentWillUnmount() {
    localStorage.removeItem('clientId')
  }

  hideModal() {
    this.setState({
      visibleSearch: false,
    })
  }

  onInputchange(event) {
    this.setState({clientName: event.target.value})
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
      [target.name]: target.value,
    })
  }

  ShowHideCorporateName(event) {
    if (event != 'Corporate') {
      this.setState({
        corporate: true,
      })
    } else {
      this.setState({
        isCorprate: false,
      })
    }
  }
  // function for submit add policy 22 march 22 john

  submitpolicy(e) {
    let apiurl = ''
    let btnvalue = e.target.value
    if (btnvalue === 'Finalised') {
      this.setState({loading: true})
      apiurl = process.env.REACT_APP_BASE_URL + '/Policy/Addpolicy'
      axios
        .get(
          'http://196.43.100.211:5000/api/v1/customer/' + this.state.nationalid,
        )
        .then(data => {
          console.log(data.data)
          if (data.data === '') {
            var customerdetail = {
              client_name: this.state.clientfirstname.trim(),
              client_surname: this.state.clientsurname.trim(),
              client_mobile: this.state.clientcontactnumber.trim(),
              client_address: this.state.clientaddress1.trim(),
              client_id_number: this.state.nationalid.trim(),
              client_age: parseInt(this.state.clientage),
              client_entity: this.state.entitytype,
              client_gender: this.state.clientgender,
              client_city: this.state.city,
              client_suburb: this.state.suburb,
              client_email: this.state.clientemailaddress,
              client_coprorate_name: this.state.clientcorporatename,
            }
            console.log(customerdetail)
            axios.post(
              'http://196.43.100.211:5000/api/v1/customer/',
              customerdetail,
            )
          }
        })
    } else {
      apiurl = process.env.REACT_APP_BASE_URL + '/quotation/Addupdatequotation/'
    }
    e.preventDefault()
    this.state.res[0].policyriskcover = this.state.policyriskcover
    this.state.res[0].policyStartDate = this.state.policyStartDate
    this.state.res[0].policyexpirytdate = this.state.policyexpirytdate
    this.state.res[0].paymentterms = this.state.paymentterm
    this.state.res[0].grandtotalannualpremium =
      this.state.annualPremiumTotalForEdit
    this.state.res[0].grandtotaltermpremium = this.state.termPremiumTotalForEdit
    this.state.res[0].productid = parseInt(this.state.productId)
    this.state.res[0].productname = this.state.productName
    this.state.res[0].nationalid = this.state.nationalid
    this.state.res[0].proratatotaltermpremium = roundvalue(
      this.state.prorataPremiumTotalForEdit,
    )
    console.log(this.state.res[0])
    const requestMetadata = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.res[0]),
    }

   
    fetch(apiurl, requestMetadata)
      .then(res => res.json())
      .then(recipes => {
        this.setState({loading: false})
        if (btnvalue === 'Finalised') {
          message.success('Policy created successfully')
          window.location.href = '/policies'
        } else {
          message.success('Quotation created successfully')
          window.location.href = '/quotationList'
        }
      })
  }

  updateInput() {
    const current = []
    // fetch('https://localhost:7279/GetClientDetailsbyid/1')
    //     .then((response) => response.json())
    //     .then((data) => current.push(data.result));
    // const userRoles = JSON.parse(localStorage.getItem("roles"));
  }

  riskitem(value) {
    this.setState({cellphone: false})
    this.setState({riskitemid: value})
    for (let i = 0; i < this.state.riskItemList.length; i++) {
      if (value === this.state.riskItemList[i].riskitemid) {
        this.setState({rate: this.state.riskItemList[i].ratepercentage})
        this.state.riskitemfortable = this.state.riskItemList[i].riskitemname

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

  handleSubmit = e => {
    e.preventDefault()
    let lastIndex =
      this.state.res[0].riskitemlist !== null &&
      this.state.res[0].riskitemlist.length > 0
        ? this.state.res[0].riskitemlist.length - 1
        : 0
    let lastIndexId =
      this.state.res[0].riskitemlist !== null &&
      this.state.res[0].riskitemlist.length > 0
        ? this.state.res[0].riskitemlist[lastIndex].id
        : 0
    let annual_premium = 0
    let term_premium = 0
    let pro_rata = 0
    this.props.form.validateFields((err, values) => {
      let start_date = this.state.riskItemStartDate
      let end_date = this.state.policyexpirytdate
      var Noofdays = this.findDayDifference(
        new Date(start_date),
        new Date(end_date),
      )
      if (!err) {
        var riskstartdate = new Date(this.state.riskItemStartDate)
        var riskenddate = new Date(this.state.policyexpirytdate)

        this.state.newProduct = {
          id: lastIndexId + 1,
          address: values.address,
          suminsured: values.sumInsured,
          rate: this.state.rate,
          annualpremium: roundvalue(
            (values.sumInsured / 100) * this.state.rate,
          ),
          termpremium: roundvalue(
            ((values.sumInsured / 100) * this.state.rate) / 3,
          ),
          policynumber: this.state.quotationId,
          riskitemid: this.state.riskitemid.toString(),
          riskitemname: this.state.riskitemfortable,
          policyquotatonid: this.state.res[0].id,
          prorata: roundvalue(
            (values.sumInsured / 100) * this.state.rate * (Noofdays / 365),
          ),
          itempstartdate:
            riskstartdate.getFullYear() +
            '-' +
            (riskstartdate.getMonth() + 1) +
            '-' +
            riskstartdate.getDate(),
          itempenddate:
            riskenddate.getFullYear() +
            '-' +
            (riskenddate.getMonth() + 1) +
            '-' +
            riskenddate.getDate(),
        }

        this.state.res[0].riskitemlist.push(this.state.newProduct)

        if (
          this.state.res[0].riskitemlist != null &&
          this.state.res[0].riskitemlist.length > 0
        ) {
          for (let i = 0; i < this.state.res[0].riskitemlist.length; i++) {
            pro_rata = this.state.res[0].riskitemlist[i].prorata + pro_rata
            annual_premium =
              this.state.res[0].riskitemlist[i].annualpremium + annual_premium
            term_premium =
              this.state.res[0].riskitemlist[i].termpremium + term_premium
          }
        }
      }
      this.state.prorataPremiumTotalForEdit = pro_rata
      this.state.annualPremiumTotalForEdit = annual_premium
      this.state.termPremiumTotalForEdit = term_premium
    })
  }

  findDayDifference(date1, date2) {
    // always round down
    return Math.floor(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))
  }
  startdateChangeRiskItem(date, datestring) {
    if (datestring === '') {
      message.warning('Risk item start date cannot be null')
    } else {
      if (new Date(this.state.policyexpirytdate) < new Date(datestring)) {
        message.error('Invalid Date')
      } else {
        this.setState({riskItemStartDate: datestring})
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
      this.setState({policyexpirytdate: Newdate})
    } else {
      message.warning('Start date cannot be smaller than Current Date')
    }
  }

  enddateChange(date, datestring) {
    if (datestring === '') {
      message.warning('End date cannot be empty.')
    } else {
      if (new Date(this.state.policyStartDate) < new Date(datestring)) {
        this.setState({policyexpirytdate: new Date(datestring)})
      } else {
        message.error('Invalid Duration ')
      }
    }
  }

  //function to get riskcover multiple selection
  riskcoverChange(value) {
    // john 23 March 2022

    this.setState({
      policyriskcover: value.toString(),
      riskCoverFromApi: value.toString(),
    })
  }

  paymenttermChange(value) {
    //  select paymentterm john
    this.setState({paymentterm: value})
  }
  render() {
    const {getFieldDecorator} = this.props.form

    let riskCoverList =
      this.state.riskCoverDrop.length > 0 &&
      this.state.riskCoverDrop.map((item, i) => {
        return (
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
          <Row gutter={[16, 24]}>
            <Col xs={12} sm={24} md={12} lg={12}>
              <div className="flex justify-between">
                <h5
                  style={{
                    color: '#F15A2B',
                    fontWeight: '500',
                    fontSize: '20px',
                    marginBottom: '0',
                  }}>
                  <b>
                    Product Name :{' '}
                    <label
                      style={{
                        color: '#F15A2B',
                        fontWeight: '700',
                        fontSize: '20px',
                      }}>
                      Home Insurance
                    </label>
                  </b>
                </h5>
              </div>
            </Col>
            <Col xs={12} sm={24} md={12} lg={12}>
              <div className="right-text">
                {this.state.clientId !== null && (
                  <label>
                    <b>Quotation Number : {this.state.quotationId}</b>
                  </label>
                )}
              </div>
            </Col>
          </Row>
        </div>
        <div className=" dash-bg-white">
          <div className="d-inline-block">
            <Row gutter={[16, 24]}>
              <Col xs={12} sm={24} md={12} lg={12}>
                <h3
                  style={{
                    color: '#F15A2B',
                    fontWeight: '700',
                    fontSize: '20px',
                    margin: '0',
                  }}>
                  Basic Customer Details
                </h3>
              </Col>
              <Col xs={12} sm={24} md={12} lg={12}>
                <div className="align-right">
                  <Button
                    size="default"
                    value={'Finalised'}
                    onClick={this.submitpolicy}
                    style={{
                      marginLeft: 'auto',
                      color: '#fd7e14',
                      borderColor: '#fd7e14',
                    }}>
                    Finalise
                  </Button>
                </div>
              </Col>
            </Row>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Entity Type">
                <Select
                  defaultValue="Business"
                  style={{width: 120}}
                  onChange={this.ShowHideCorporateName}>
                  <Option value="Business">Business</Option>
                  <Option value="Individual">Individual</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="First Name">
                <Input
                  placeholder="Enter Firstname"
                  onChange={this.onInputchange}
                  value={this.state.clientfirstname}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Sur Name">
                <Input
                  placeholder="Enter surname"
                  value={this.state.clientsurname}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Corporate Name">
                <Input
                  disabled={this.state.isCorprate}
                  value={this.state.clientcorporatename}
                  placeholder="Corporate name"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Contact Number">
                <Input
                  placeholder="eg:987654321"
                  value={this.state.clientcontactnumber}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Email Address">
                <Input
                  placeholder="abc@gmail.com "
                  value={this.state.clientemailaddress}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Age">
                <Input placeholder="eg:24" value={this.state.clientage} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="National Id">
                <Input
                  placeholder="National Id"
                  value={this.state.nationalid}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Address">
                <TextArea
                  placeholder="Enter Address"
                  value={this.state.clientaddress1}
                />
              </Form.Item>
            </Col>
            {/* <Col xs={24} md={12} lg={8}>
            <Form.Item label=" Address 2">
              <TextArea placeholder="Enter Address" value={this.state.clientaddress2} />
            </Form.Item>
          </Col> */}
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Suburb">
                <Input placeholder="Enter Suburb" value={this.state.suburb} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="City">
                <Input placeholder="Enter City" value={this.state.city} />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div className=" dash-bg-white">
          <h3
            style={{
              color: '#F15A2B',
              fontWeight: '700',
              fontSize: '20px',
              margin: '0',
              marginBottom: '20px',
            }}>
            Policy Details
          </h3>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Policy Start Date">
                <DatePicker
                  value={moment(
                    this.state.policyStartDate,
                    this.state.dateFormat,
                  )}
                  style={{width: '100%'}}
                  placeholder="Policy Start Date"
                  onChange={this.startdateChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Policy End Date">
                <DatePicker
                  value={moment(
                    this.state.policyexpirytdate,
                    this.state.dateFormat,
                  )}
                  style={{width: '100%'}}
                  placeholder="Policy End Date"
                  onChange={this.enddateChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Risk cover">
                <Select
                  placeholder="Risk Cover"
                  mode="multiple"
                  value={this.state.riskCoverFromApi}
                  onChange={this.riskcoverChange}
                  style={{display: 'inline'}}>
                  {riskCoverList}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={20} md={12} lg={4}>
              <Form.Item label="Currency">
                <Select
                  placeholder="Select option"
                  value={this.state.currency}
                  onChange={this.currencyChange}
                  style={{display: 'inline'}}>
                  {currencyList}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Payment Term">
                <Select
                  value={this.state.paymentterm}
                  onChange={this.paymenttermChange}
                  defaultValue="Payment Term"
                  style={{display: 'inline'}}>
                  <Option value="Annually">Annually</Option>
                  <Option value="Quarterly">Quarterly</Option>
                  <Option value="Monthly">Monthly</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Insurance Limit">
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
              fontSize: '20px',
              margin: '0',
              marginBottom: '20px',
            }}>
            Product Details
          </h3>
          <Form onSubmit={this.handleSubmit} id="my-form">
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

              <Col xs={24} md={12} lg={4}>
                <Form.Item label="Address/Item Details">
                  {getFieldDecorator('address', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input Address!',
                        whitespace: false,
                      },
                    ],
                  })(<Input placeholder="Address/Item Details" />)}
                </Form.Item>
              </Col>

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
                        message: 'Please input Amount!',
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
                    placeholder="Risk item quotation start date"
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
              rowKey={this.state.id}
              className="table-scroll-auto"
              columns={this.state.columns}
              dataSource={this.state.data[0]}
              pagination={false}
            />
            <div className="grand-total-bx" style={{textAlign: 'left'}}>
              <table width="100%">
                <tbody>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{textAlign: 'left'}}>
                      <b>Total</b>
                    </td>
                    {this.state.clientId === null && (
                      <>
                        <td style={{textAlign: 'left'}}>
                          {roundvalue(this.state.annualPremiumTotal)}
                        </td>
                        <td style={{textAlign: 'left'}}>
                          {roundvalue(this.state.termPremiumTotal)}
                        </td>
                      </>
                    )}
                    {this.state.clientId !== null && (
                      <>
                        <td style={{textAlign: 'left'}}>
                          {roundvalue(this.state.prorataPremiumTotalForEdit)}
                        </td>
                        <td style={{textAlign: 'left'}}>
                          {roundvalue(this.state.annualPremiumTotalForEdit)}
                        </td>
                        <td style={{textAlign: 'left'}}>
                          {roundvalue(this.state.termPremiumTotalForEdit)}
                        </td>
                      </>
                    )}

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
                    {this.state.clientId === null && (
                      <>
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
                      </>
                    )}
                    {this.state.clientId !== null && (
                      <>
                        <td style={{textAlign: 'left'}}>
                          {roundvalue(
                            (this.state.prorataPremiumTotalForEdit / 100) *
                              this.state.stampDuty +
                              this.state.prorataPremiumTotalForEdit,
                          )}
                        </td>
                        <td style={{textAlign: 'left'}}>
                          {roundvalue(
                            (this.state.annualPremiumTotalForEdit / 100) *
                              this.state.stampDuty +
                              this.state.annualPremiumTotalForEdit,
                          )}
                        </td>
                        <td style={{textAlign: 'left'}}>
                          {roundvalue(
                            (this.state.termPremiumTotalForEdit / 100) *
                              this.state.stampDuty +
                              this.state.termPremiumTotalForEdit,
                          )}
                        </td>
                      </>
                    )}

                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="btn-group-success">
            <Button
              className="btn-success"
              size="default"
              value={'submit'}
              onClick={this.submitpolicy}>
              Submit
            </Button>
          </div>
        </div>
      </Layout>
    )
  }
}

const WrappedEditQuotation = Form.create({name: 'Homeinsurance_list'})(
  EditQuotation,
)

export default WrappedEditQuotation

import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {
  Row,
  Input,
  Col,
  message,
  Button,
  Form,
  Select,
  Modal,
  Table,
  DatePicker,
  Popconfirm,
  Layout,
  Result,
} from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import AddCustomer from './AddCustomer'
import {CloseOutlined, DeleteOutlined} from '@ant-design/icons'
import queryString from 'query-string'
import moment from 'moment'
import {Spin} from 'antd'

const {Option} = Select

const {confirm} = Modal
function roundvalue(value) {
  // for round the vlaues john 24 march 2022
  if (value > 0) {
    return parseFloat(value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0])
  }
}
class EndoresePolicy extends React.Component {
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
      parentpolicyid: parseInt(localStorage.getItem('clientId')),
      policyStartDate: '',
      policyEndDate: '',
      paymentterm: '', //john 24-03-2022
      policyriskcover: '', //john 24-03-2022
      record: '', //john 24-03-2022
      entitytype: '', //john 04 April 2022
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
      suburb: '',
      city: '',
      riskItemStartDate: new Date(),
      currentDate: new Date(),
      stampDuty: '',
      reinsuranceLimit: '',
      loading: false,
      cellphone: false,
      noOfDaysForRenewal: '',
      noOfDaysForRenewalForSubmit: '',
      currency: '',
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
          key: 'action',
          title: 'Action',
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
      policyStatus: '',
      productId: 0,
      productName: '',
    }
    this.updateInput = this.updateInput.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.ShowHideCorporateName = this.ShowHideCorporateName.bind(this)
    this.setVisible = this.setVisible.bind(this)
    this.setVisibleFalse = this.setVisibleFalse.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.setVisibleSearch = this.setVisibleSearch.bind(this)
    this.riskitem = this.riskitem.bind(this)
    this.covertype = this.covertype.bind(this)
    this.startdateChange = this.startdateChange.bind(this)
    this.enddateChange = this.enddateChange.bind(this)
    // this.handleSubmitWithId = this.handleSubmitWithId(this);
    this.paymenttermChange = this.paymenttermChange.bind(this) //john 24-03-2022
    this.riskcoverChange = this.riskcoverChange.bind(this) //john 24-03-2022
    this.submitpolicy = this.submitpolicy.bind(this)
    this.onInputchange = this.onInputchange.bind(this)
    this.startdateChangeRiskItem = this.startdateChangeRiskItem.bind(this)
  }
  // delete record from the grid and perform the calculation  john 24-03-2022
  handleDelete = key => {
    let annual_premium = 0
    let term_premium = 0
    let pro_rata = 0
    this.state.res[0].riskitemdetails.splice(key, 1)
    this.state.data = []
    this.state.data.push(this.state.res[0].riskitemdetails)
    for (let i = 0; i < this.state.data[0].length; i++) {
      pro_rata = this.state.data[0][i].prorata + pro_rata
      annual_premium = this.state.data[0][i].annualpremium + annual_premium
      term_premium = this.state.data[0][i].termpremium + term_premium
    }
    this.setState({prorataPremiumTotalForEdit: roundvalue(pro_rata)})
    this.setState({annualPremiumTotalForEdit: roundvalue(annual_premium)})
    this.setState({termPremiumTotalForEdit: roundvalue(term_premium)})
  }

  componentDidMount() {
    this.setState({loading: true})
    const parsed = queryString.parse(window.location.search)
    Promise.all([
      fetch(process.env.REACT_APP_BASE_URL + '/Product/GetRiskItembyId/2'),
      fetch(process.env.REACT_APP_BASE_URL + '/Product/GetRiskCoverbyId/2'),
    ])
      .then(([res1, res2]) => {
        return Promise.all([res1.json(), res2.json()])
      })
      .then(([res1, res2]) => {
        this.setState({riskItemList: res1.result})
        this.setState({riskCoverDrop: res2.result})
      })
    if (this.state.clientId !== null) {
      axios
        .get(
          process.env.REACT_APP_BASE_URL +
            '/Policy/GetPolicybyid/' +
            this.state.clientId,
        )
        .then(response => {
        
          let nationalid = response.data.policydetail.nationalid
          this.state.res.push(response.data.policydetail)
          console.log(response.data.policydetail)
          this.setState({
            clientfirstname: response.data.customerdetail.clientfirstname,
            clientsurname: response.data.customerdetail.clientsurname,
            clientcontactnumber:
              response.data.customerdetail.clientcontactnumber,
            clientage: response.data.customerdetail.clientage,
            clientaddress1: response.data.customerdetail.clientaddress1,
            clientId: response.data.customerdetail.id,
            nationalid: response.data.customerdetail.nationalid,
            clientcorporatename:response.data.customerdetail.clientcorporatename,
            clientemailaddress: response.data.customerdetail.clientemailaddress,
            clientgender: response.data.customerdetail.clientgender,
            suburb: response.data.customerdetail.suburb,
            city: response.data.customerdetail.city,
            entitytype: response.data.customerdetail.entitytype,
            riskCoverFromApi: response.data.policydetail.policyriskcover,
            paymentterm: response.data.policydetail.paymentterms,
            policynumber: response.data.policydetail.policynumber,
            policyStatus: response.data.policydetail.policystatus,
            policyStartDate: response.data.policydetail.createddate,
            policyexpirytdate: response.data.policydetail.policyexpirytdate,
            currency: response.data.policydetail.currency,
            productId:response.data.policydetail.productid,
            productName:response.data.policydetail.productname,
            policyriskcover:response.data.policydetail.policyriskcover
           
          })

          this.state.noOfDaysForRenewal =
            this.findDayDifference(
              new Date(response.data.policydetail.policyexpirytdate),
              new Date(this.state.currentDate),
            ) + 1
          console.log(this.state.noOfDaysForRenewal)
          if (this.state.noOfDaysForRenewal < 30) {
            this.setState({
              policyStartDate: response.data.policydetail.policyexpirytdate,
            })
            var year = new Date(this.state.policyStartDate).getFullYear()
            var month = new Date(this.state.policyStartDate).getMonth()
            var day = new Date(this.state.policyStartDate).getDate()
            var Newdate = new Date(year + 1, month, day)
            this.setState({policyexpirytdate: Newdate})
          }

          this.setState({
            newProduct: response.data.policydetail.riskitemdetails,
          })
          this.state.data.push(this.state.newProduct)
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
          // axios
          //   .get('http://196.43.100.211:5000/api/v1/customer/' + nationalid)
          //   .then(
          //     response => {
          //       this.setState({paymentterm: this.state.res[0].paymentterms})
          //       this.setState({quotationId: this.state.res[0].policynumber})
          //       this.setState({riskCoverFromApi: this.state.res[0].policyriskcover.includes(',') == true ? this.state.res[0].policyriskcover.split(',') : this.state.res[0].policyriskcover})
          //       this.setState({clientName: this.state.res[0].clientname})
          //       this.setState({riskItemFromApi: this.state.res[0].riskbuildingmaterial})
          //       this.setState({annualPremiumTotal: this.state.res[0].totalannualpremium})
          //       this.setState({termPremiumTotal: this.state.res[0].totaltermpremium})
          //       this.setState({policynumber: this.state.res[0].policynumber})
          //       this.setState({policyStartDate: this.state.res[0].policystartdate})
          //       this.setState({policyexpirytdate: this.state.res[0].policyexpirytdate})
          //       this.setState({clientId: this.state.res[0].clientid})
          //       this.setState({policyriskcover: this.state.res[0].policyriskcover})
          //       //  this.setState({startDateFromApi : this.state.res[0].createddate});
          //       this.setState({newProduct: this.state.res[0].riskitemdetails})
          //       this.state.data.push(this.state.newProduct)
          //       for (let i = 0; i < this.state.newProduct.length; i++) {
          //         this.setState({prorataPremiumTotalForEdit: this.state.newProduct[i].prorata + this.state.prorataPremiumTotalForEdit})
          //         this.setState({annualPremiumTotalForEdit: this.state.newProduct[i].annualpremium + this.state.annualPremiumTotalForEdit})
          //         this.setState({termPremiumTotalForEdit: this.state.newProduct[i].termpremium + this.state.termPremiumTotalForEdit})
          //         this.setState({
          //           clientfirstname: response.data.client_name,
          //           clientsurname: response.data.client_surname,
          //           clientcontactnumber: response.data.client_mobile,
          //           clientaddress1: response.data.client_address,
          //           clientage: response.data.client_age,
          //           nationalid: response.data.client_id_number,
          //           clientId: response.data.id,
          //         })
          //       }
          //     },
          //     error => {
          //       console.log(error)
          //     },
          //   )
        })
    }
    fetch(process.env.REACT_APP_BASE_URL + '/Client/MasterSetting')
      .then(res => res.json())
      .then(data => {
        this.setState({stampDuty: data[0].stampduty})
        this.setState({reinsuranceLimit: data[0].reinsurancelimit})
      })
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

  ShowHideCorporateName(value) {
    this.setState({entitytype: value})
    // if (event != 'Corporate')
    // {
    //     this.setState({
    //       isCorprate: true
    //     });

    // }else
    // { this.setState({
    //       isCorprate: false
    //     })

    // }
  }
  // function for submit add policy 22 march 22 john

  submitpolicy(e) {
    let apiurl
  
    e.preventDefault()
    var Days = this.findDayDifference(
      new Date(this.state.policyStartDate),
      new Date(this.state.policyexpirytdate),
    )
    if (Days <= 30) {
      apiurl = process.env.REACT_APP_BASE_URL + '/Policy/renewPolicy'
      let totalannualpremium = roundvalue(this.state.annualPremiumTotal)
      if (
        new Date(this.state.policyexpirytdate) >
        new Date(this.state.currentDate + 1)
      ) {
        this.state.res[0].policyriskcover = this.state.policyriskcover
        this.state.res[0].policyStartDate = this.state.policyStartDate
        this.state.res[0].policyexpirytdate = this.state.policyexpirytdate
        this.state.res[0].paymentterms = this.state.paymentterm
        this.state.res[0].parentpolicyid = this.state.parentpolicyid
        this.state.res[0].createddate = new Date()
        this.state.res[0].modifieddate = new Date()
        this.state.res[0].grandtotalannualpremium =
          this.state.annualPremiumTotalForEdit
        this.state.res[0].grandtotaltermpremium =
          this.state.termPremiumTotalForEdit
        this.state.res[0].proratatotaltermpremium = roundvalue(this.state.prorataPremiumTotalForEdit)
        this.state.res[0].nationalid = this.state.nationalid
        
        
        const requestMetadata = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.state.res[0]),
        }
        console.log(this.state.res[0])
        //fetch(apiurl, requestMetadata).then(res => res.json())
        message.success('Policy renewed successfully !!')
        window.location.href = '/policies'
      } else {
        message.warning('Policy end date should be greater tha current date')
      }
    } else {
      apiurl = process.env.REACT_APP_BASE_URL + '/Policy/endorsepolicy'
      let totalannualpremium = roundvalue(this.state.annualPremiumTotal)
      this.state.res[0].policyriskcover = this.state.policyriskcover
      this.state.res[0].policyStartDate = this.state.policyStartDate
      this.state.res[0].policyexpirytdate = this.state.policyexpirytdate
      this.state.res[0].paymentterms = this.state.paymentterm
      this.state.res[0].parentpolicyid = this.state.parentpolicyid
      this.state.res[0].createddate = new Date()
      this.state.res[0].modifieddate = new Date()
      this.state.res[0].grandtotalannualpremium =
        this.state.annualPremiumTotalForEdit
      this.state.res[0].grandtotaltermpremium =
        this.state.termPremiumTotalForEdit
      this.state.res[0].proratatotaltermpremium = roundvalue(this.state.prorataPremiumTotalForEdit)
    
      const requestMetadata = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state.res[0]),
      }
     
      
      fetch(apiurl, requestMetadata).then(res => res.json())
      message.success('Policy updated successfully !!')
    }
  }

  updateInput() {
    const current = []
    fetch('https://localhost:7279/GetClientDetailsbyid/1')
      .then(response => response.json())
      .then(data => current.push(data.result))
    const userRoles = JSON.parse(localStorage.getItem('roles'))
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
  covertype(value) {
    this.state.coverType = value
  }

  findDayDifference(date1, date2) {
    // always round down
    return Math.floor(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24))
  }
  handleSubmitWithId = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var count = this.state.data[0].length - 1
        let term_premium = '0.0'
        let prorata = '0.0'
        let annual_premium = '0.0'
        var Noofdays = this.findDayDifference(
          new Date(this.state.riskItemStartDate),
          new Date(this.state.policyexpirytdate),
        )
        Noofdays = Noofdays + 1
        prorata = (values.sumInsured / 100) * this.state.rate * (Noofdays / 365)
        term_premium = ((values.sumInsured / 100) * this.state.rate) / 3
        annual_premium = (this.state.rate * values.sumInsured) / 100

        var riskstartdate = new Date(this.state.riskItemStartDate)
        var riskenddate = new Date(this.state.policyexpirytdate)

        this.state.newProduct = {
          policyriskitemid: 0,
          riskitemname: this.state.riskitemfortable,
          //covertype : this.state.coverType,
          address: values.address,
          suminsured: roundvalue(values.sumInsured),
          rate: this.state.rate,
          prorata: roundvalue(prorata),
          annualpremium: roundvalue(annual_premium),
          termpremium: roundvalue(term_premium),
          policynumber: this.state.quotationId,
          itempstartdate:
            riskstartdate.getFullYear() +
            '-' +
            (riskstartdate.getMonth() + 1) +
            '-' +
            riskstartdate.getDate(),
          itempexpirydate:
            riskenddate.getFullYear() +
            '-' +
            (riskenddate.getMonth() + 1) +
            '-' +
            riskenddate.getDate(),
        }
        // Converting object into array to be used in table as dataSource
        this.state.res[0].riskitemdetails.push(this.state.newProduct)

        // Calculating total term premium and annual t    erm premium

        this.state.res[0].riskitemdetails.forEach(el => {
          el.id = 0
          this.setState({
            prorataPremiumTotalForEdit:
              el.prorata + this.state.prorataPremiumTotalForEdit,
          })
          this.setState({
            termPremiumTotalForEdit:
              el.termpremium + this.state.termPremiumTotalForEdit,
          })
          this.setState({
            annualPremiumTotalForEdit:
              el.annualpremium + this.state.annualPremiumTotalForEdit,
          })
        })

        // for(let i=0;i<this.state.res[0].riskitemlist.length;i++){
        //   this.setState({termPremiumTotalForEdit : this.state.data[0][i].termpremium + this.state.termPremiumTotalForEdit})
        //   this.setState({annualPremiumTotalForEdit : this.state.data[0][i].annualpremium + this.state.annualPremiumTotalForEdit})
        // }
      }
    })
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
      message.warning('End date cannot be null')
    } else {
      if (new Date(this.state.policyStartDate) < new Date(datestring)) {
        this.setState({policyexpirytdate: new Date(datestring)})
      } else {
        message.error('Invalid Duration ')
      }
    }
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

  SetRisKItemDataByStartDate(datestring) {
    let term_premium = '0.0'
    let prorata = '0.0'
    var date = this.state.policyEndDate

    var Noofdays = this.findDayDifference(
      new Date(datestring),
      new Date(this.state.policyexpirytdate),
    )
    Noofdays = Noofdays + 1

    let ctprorataPremiumTotal = 0
    let cttermPremiumTotal = 0
    let ctannualPremiumTotal = 0

    for (let i = 0; i < this.state.data[0].length; i++) {
      this.state.data[0][i].annualpremium = roundvalue(
        (this.state.data[0][i].rate / 100) * this.state.data[0][i].suminsured,
      )
      this.state.data[0][i].termpremium = roundvalue(
        ((this.state.data[0][i].rate / 100) *
          this.state.data[0][i].suminsured) /
          3,
      )

      this.state.data[0][i].prorata = roundvalue(
        (((this.state.data[0][i].suminsured * this.state.data[0][i].rate) /
          100) *
          Noofdays) /
          365,
      )
    }

    for (let i = 0; i < this.state.data[0].length; i++) {
      ctprorataPremiumTotal =
        this.state.data[0][i].prorata + ctprorataPremiumTotal
      cttermPremiumTotal =
        this.state.data[0][i].termpremium + cttermPremiumTotal
      ctannualPremiumTotal =
        this.state.data[0][i].annualpremium + ctannualPremiumTotal
    }

    this.setState({prorataPremiumTotalForEdit: ctprorataPremiumTotal})
    this.setState({termPremiumTotalForEdit: cttermPremiumTotal})
    this.setState({annualPremiumTotalForEdit: ctannualPremiumTotal})
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

    for (let i = 0; i < this.state.data[0].length; i++) {
      this.state.data[0][i].annualpremium = roundvalue(
        (this.state.data[0][i].rate / 100) * this.state.data[0][i].suminsured,
      )
      this.state.data[0][i].termpremium = roundvalue(
        ((this.state.data[0][i].rate / 100) *
          this.state.data[0][i].suminsured) /
          3,
      )

      this.state.data[0][i].prorata = roundvalue(
        (((this.state.data[0][i].suminsured * this.state.data[0][i].rate) /
          100) *
          Noofdays) /
          365,
      )
    }

    for (let i = 0; i < this.state.data[0].length; i++) {
      ctprorataPremiumTotal =
        this.state.data[0][i].prorata + ctprorataPremiumTotal
      cttermPremiumTotal =
        this.state.data[0][i].termpremium + cttermPremiumTotal
      ctannualPremiumTotal =
        this.state.data[0][i].annualpremium + ctannualPremiumTotal
    }

    this.setState({prorataPremiumTotalForEdit: ctprorataPremiumTotal})
    this.setState({termPremiumTotalForEdit: cttermPremiumTotal})
    this.setState({annualPremiumTotalForEdit: ctannualPremiumTotal})
  }

  //function to get riskcover multiple selection
  riskcoverChange(value) {
    // john 23 March 2022

    this.setState({riskCoverFromApi: value.toString()})
    this.setState({policyriskcover: value.toString()})
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
                    <b>Policy Number : {this.state.policynumber}</b>
                  </label>
                )}
              </div>
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
            Basic Customer Details
          </h3>
          <Row gutter={12}>
            <Col xs={12} sm={24} md={24} lg={24}>
              <div
                className="form-item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '5px',
                }}></div>
            </Col>
          </Row>
          <Row gutter={(2, [12])} style={{marginTop: '10px'}}>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Entity Type">
                <Select
                  value={this.state.entitytype}
                  defaultValue="Domestic"
                  onChange={this.ShowHideCorporateName}>
                  <Option value="Domestic">Domestic</Option>
                  <Option value="Corporate">Corporate</Option>
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
            {/* {this.state.entitytype === 'Corporate' && ( */}
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Corporate Name">
                <Input
                  disabled={this.state.isCorprate}
                  value={this.state.clientcorporatename}
                  placeholder="Corporate name"
                />
              </Form.Item>
            </Col>
            {/* )} */}
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
                  placeholder="Enter national id"
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
          <Row gutter={[16, 24]}>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Policy Start Date">
                <DatePicker
                  style={{width: '100%'}}
                  value={moment(
                    this.state.policyStartDate,
                    this.state.dateFormat,
                  )}
                  placeholder="Policy Start Date"
                  onChange={this.startdateChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Policy End Date">
                <DatePicker
                  style={{width: '100%'}}
                  value={moment(
                    this.state.policyexpirytdate,
                    this.state.dateFormat,
                  )}
                  placeholder="Policy End Date"
                  onChange={this.enddateChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Risk Cover">
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
              <Form.Item label="Currency">
                <Input value={this.state.currency} disabled />
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={4}>
              <Form.Item label="Risk Insurance Limit">
                <Input value={this.state.reinsuranceLimit} disabled />
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
            Product Details
          </h3>

          <Form onSubmit={this.handleSubmitWithId} id="my-form">
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
                    {getFieldDecorator('address', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input Cellphone model!',
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
                    {getFieldDecorator('address', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input Address!',
                          whitespace: false,
                        },
                      ],
                    })(<Input placeholder="Type Address" />)}
                  </Form.Item>
                </Col>
              )}

              <Col xs={24} md={12} lg={4}>
                <Form.Item label="Cover type">
                  <Input
                    value={this.state.coverType}
                    placeholder="Cover Type"
                    disabled
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
                  <Input
                    placeholder="Rate(%)"
                    value={this.state.rate}
                    disabled
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12} lg={4}>
                <Form.Item label="Start date">
                  <DatePicker
                    placeholder="Item quotation start date"
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
              dataSource={
                this.state.clientId !== null
                  ? this.state.data[0]
                  : this.state.data
              }
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
                      <b>Stamp Duty</b>
                    </td>
                    {this.state.clientId === null && (
                      <>
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
                      </>
                    )}
                    {this.state.clientId !== null && (
                      <>
                        <td style={{textAlign: 'left'}}>
                          {roundvalue(
                            (this.state.prorataPremiumTotalForEdit / 100) *
                              this.state.stampDuty,
                          )}
                        </td>
                        <td style={{textAlign: 'left'}}>
                          {roundvalue(
                            (this.state.annualPremiumTotalForEdit / 100) *
                              this.state.stampDuty,
                          )}
                        </td>
                        <td style={{textAlign: 'left'}}>
                          {roundvalue(
                            (this.state.termPremiumTotalForEdit / 100) *
                              this.state.stampDuty,
                          )}
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

const WrappedEndoresePolicy = Form.create({name: 'Homeinsurance_list'})(
  EndoresePolicy,
)

export default WrappedEndoresePolicy

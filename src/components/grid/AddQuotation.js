import React, { useEffect, useState } from "react";
import { Row, Input, Col, Button, Form, Select, Modal, Table, DatePicker,Popconfirm,Result} from "antd";
import TextArea from "antd/lib/input/TextArea";
import AddCustomer from "./AddCustomer";
import {DeleteOutlined} from '@ant-design/icons';
import queryString from 'query-string';
import { Redirect } from "react-router";
import quotationList from "../../pages/quotationList";



const { Option } = Select;



const { confirm } = Modal;
function roundvalue(value) {// for round the vlaues jaswinder singh 24 march 2022
  if(value>0){
    return  parseFloat( value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);
  }
  
}
class AddQuotation extends React.Component {

  constructor(props){
    super(props);
    this.state={
      isCorprate: false,
      isTableViible:'false',
      searchBox:null,
      gotData:false,
      visible: false,
      visibleSearch: false,
      api:"http://112.196.3.218:8091/GetClientDetailsbyid/1",
      access:'',
      a:false,
      riskCover:'',
      riskItem:'',
      coverType:'',
      data:[],
      riskCoverDrop:[],
      riskItemList:[],
      riskVar:'',
      ratePercentage:'',
      rate:'',
      riskcoverfortable:'',
      riskitemfortable:'',
      newProduct:{},
      annualPremiumTotal:0,
      termPremiumTotal:0,
      tempAddress:'',
      policyStartDate:'',
      policyEndDate:'',
      paymentterm:'',//jaswinder singh 24-03-2022
      policyriskcover:'',//jaswinder singh 24-03-2022
      record:'',//jaswinder singh 24-03-2022
      columns : [
{
  key:'riskitem',
  title: 'Risk Item',
  dataIndex: 'riskitemname',
},
{
  key:'address',
  title: 'Address',
  dataIndex: 'address',
},

{
  key:'suminsured',
  title: 'Sum Insured',
  dataIndex: 'suminsured',
},
{
  key:'rate',
  title: 'Rate(%)',
  dataIndex: 'rate',
},
{
  key:'annualpremium',
  title: 'Annual Premium',
  dataIndex: 'annualpremium',
},
{
  key:'termpremium',
  title: 'Term Premium',
  dataIndex: 'termpremium',
},

{
  key:'actions',
  title: 'Actions',
  render: (_, record) =>
    this.state.data.length >= 1 ? (
      <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)}>
      <button><DeleteOutlined/></button>
      </Popconfirm>
    ) : null,
}],
// Variables for fetching user info
 res:[],
 clientName:'',
 quotationId:'',
 startDateFromApi:'',
 endDateFromApi:'',
 riskCoverFromApi:[],
 riskItemFromApi:'',
 clientId:localStorage.getItem("clientId"),
 termPremiumTotalForEdit:0,
 annualPremiumTotalForEdit:0,
 riskitemid:""
}
  this.updateInput = this.updateInput.bind(this);
  this.handleChange = this.handleChange.bind(this);
  this.ShowHideCorporateName = this.ShowHideCorporateName.bind(this);
  this.setVisible = this.setVisible.bind(this);
  this.setVisibleFalse = this.setVisibleFalse.bind(this);
  this.hideModal = this.hideModal.bind(this);
  this.setVisibleSearch = this.setVisibleSearch.bind(this);
  this.riskitem = this.riskitem.bind(this);
  this.covertype = this.covertype.bind(this);
  this.startdateChange = this.startdateChange.bind(this);
  this.enddateChange = this.enddateChange.bind(this);
  // this.handleSubmitWithId = this.handleSubmitWithId(this);
  this.paymenttermChange = this.paymenttermChange.bind(this); //jaswinder singh 24-03-2022
  this.riskcoverChange = this.riskcoverChange.bind(this);//jaswinder singh 24-03-2022
  this.submitpolicy = this.submitpolicy.bind(this);
  this.addnewpolicy=this.addnewpolicy.bind(this);
  }; 
// delete record from the grid and perform the calculation  jaswinder singh 24-03-2022
  handleDelete = (key) => {
    let termPremiumTotalForEdit = 0;
    let annualPremiumTotalForEdit = 0;
    fetch(process.env.REACT_APP_BASE_URL+"/Policy/Deleteproductdetail/"+key,{ method: 'DELETE' })
    window.location.reload(false);
        fetch(process.env.REACT_APP_BASE_URL+"/Policy/GetQuotaionDetailsbyid/"+this.state.clientId)
    .then(res => res.json())
    .then(data => {
    this.state.newProduct = data[0].riskitemlist;
    for(let i=0;i<this.state.newProduct.length;i++){
      this.setState({annualPremiumTotalForEdit : this.state.newProduct[i].annualpremium + this.state.annualPremiumTotalForEdit})  
      this.setState({termPremiumTotalForEdit : this.state.newProduct[i].termpremium + this.state.termPremiumTotalForEdit})
    }
    })
  };
  componentDidMount(){
     const parsed = queryString.parse(window.location.search);
    Promise.all([fetch(process.env.REACT_APP_BASE_URL+'/Product/GetRiskItembyId/0'),fetch(process.env.REACT_APP_BASE_URL+'/Product/GetRiskCoverbyId/3')])
    .then(([res1,res2]) => {
      return Promise.all([res1.json(),res2.json()])
    })
    .then(([res1,res2]) => {
      this.setState({riskItemList: res1})
      this.setState({riskCoverDrop: res2})
    })
    if(this.state.clientId !== null){
    fetch(process.env.REACT_APP_BASE_URL+"/Product/GetQuotaionDetailsbyid/"+this.state.clientId)
    .then(res => res.json())
    .then(data => {
      //this.state.res = data
      
  
  this.state.res.push(data[0]); 

    this.setState({quotationId : this.state.res[0].quotationnumber});
     this.setState({riskCoverFromApi : this.state.res[0].policyriskcover.split(',')});
     this.setState({clientName : this.state.res[0].clientname});
     this.setState({riskItemFromApi : this.state.res[0].riskbuildingmaterial}); 
     this.setState({annualPremiumTotal : this.state.res[0].totalannualpremium}); 
     this.setState({termPremiumTotal : this.state.res[0].totaltermpremium});
     this.setState({policynumber : this.state.res[0].quotationnumber});
    //  this.setState({startDateFromApi : this.state.res[0].createddate});
     this.setState({newProduct : this.state.res[0].riskitemlist});
     this.state.data.push(this.state.newProduct);  
      for(let i=0;i<this.state.newProduct.length;i++){
      this.setState({annualPremiumTotalForEdit : this.state.newProduct[i].annualpremium + this.state.annualPremiumTotalForEdit})  
      this.setState({termPremiumTotalForEdit : this.state.newProduct[i].termpremium + this.state.termPremiumTotalForEdit})
    }
    })
  }
  }    
    componentWillUnmount(){
      localStorage.removeItem("clientId")
    }  
    
  hideModal() {
    this.setState({
      visibleSearch: false,
    });
  };
 
  // Redirecting to another model where client can add customer to the database
  setVisibleSearch() {
       this.setState({
      visibleSearch: false,
    });
    this.setState({ visible: true });
  }

  // Functions for Modal functioanlity to add customers
  setVisible() {
    this.setState({ visible: true });
  }
  setVisibleFalse() {
    this.setState({ visible: false });
  }

  // Function for search functionality 
   handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });    
  }
  
  ShowHideCorporateName(event)
  {
 
    if (event != 'Corporate')
    {
        this.setState({
          isCorprate: true
        });
      
    }else
    { this.setState({
          isCorprate: false
        })
          
    }
  
  
  }
// function for submit add policy 22 march 22 jaswinder singh 

submitpolicy(e){
  
  let apiurl="";
  if(e.target.value=="Finalised"){
     apiurl = process.env.REACT_APP_BASE_URL+'/Policy/Addpolicy';
  }
  else{
    apiurl = process.env.REACT_APP_BASE_URL+'/Policy/AddUpdateQuotation';
  }
  e.preventDefault();
  
    const requestMetadata = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.res[0])
    };

    fetch(apiurl, requestMetadata)
        .then(res => res.json());
        alert("Quotation created successfully.");
        window.location.href="/quotationList";         
}



  updateInput(){
  const current=[];
  fetch('http://112.196.3.218:8091/GetClientDetailsbyid/1')
      .then((response) => response.json())
      .then((data) => current.push(data.result));
  const userRoles = JSON.parse(localStorage.getItem("roles"));
 
  }

  riskitem(value){ 
    this.setState({riskitemid:value})
    for(let i=0;i<this.state.riskItemList.length;i++){
      if(value === this.state.riskItemList[i].riskitemid){
        this.setState({rate : this.state.riskItemList[i].ratepercentage}) 
        this.state.riskitemfortable = this.state.riskItemList[i].riskitemname;
      }
    }
  }
  covertype(value){
    this.state.coverType = value;
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let annual_premium=this.state.rate * values.sumInsured;
      let term_premium=values.sumInsured * this.state.rate/3;
      if (!err) {
        const count=0;
        this.state.newProduct = {
          key:this.state.count,
          riskitemname : this.state.riskitemfortable,
          covertype : this.state.coverType,
          address : values.address,
          suminsured : roundvalue(values.sumInsured),
          rate : this.state.rate,
          annualpremium :roundvalue(annual_premium),
          termpremium : roundvalue(term_premium)
        };
        // Converting object into array to be used in table as dataSource
        this.state.data.push(this.state.newProduct) ;
        }
        this.setState({count:this.state.count+1});
           
        for(let i=0;i<this.state.data.length;i++){ 
        this.state.isTableViible='hidden';   
        this.setState({termPremiumTotal:this.state.data[i].termpremium + this.state.termPremiumTotal});
        this.setState({annualPremiumTotal:this.state.annualPremiumTotal + this.state.data[i].annualpremium});     
    }  
    });
  }

  handleSubmitWithId = (e) => {
   e.preventDefault();
   this.props.form.validateFields((err, values) => {
      let annual_premium=this.state.rate * values.sumInsured;
      let term_premium=values.sumInsured * this.state.rate/3;
     if(!err){
     var count=this.state.data[0].length-1;
     this.state.newProduct = {
          id:this.state.data[0][count].id + 1,
          riskitemname : this.state.riskitemfortable,
          riskitemid:this.state.riskitemid.toString(),
          //covertype : this.state.coverType,
          address : values.address,
          suminsured : roundvalue(values.sumInsured),
          rate : this.state.rate,
          annualpremium :roundvalue(annual_premium),
          termpremium : roundvalue(term_premium),
          policynumber : this.state.quotationId,
        };  
        // Converting object into array to be used in table as dataSource
        this.state.res[0].riskitemlist.push(this.state.newProduct) ; 
        // Calculating total term premium and annual term premium

this.state.res[0].riskitemlist.forEach((el)=>{
    el.id=0;
    this.setState({termPremiumTotalForEdit : el.termpremium + this.state.termPremiumTotalForEdit})
     this.setState({annualPremiumTotalForEdit : el.annualpremium + this.state.annualPremiumTotalForEdit})

});
      }
    });
  }

  startdateChange(date,datestring){
   
    this.setState({policyStartDate:datestring})
    
  }

  enddateChange(date,datestring){
     this.setState({policyEndDate:datestring});
     
  }

//function to get riskcover multiple selection
riskcoverChange(value){// jaswinder singh 23 March 2022
}

paymenttermChange(value){//  select paymentterm jaswinder singh 
  this.setState({paymentterm:value})
  
}
  render() {
    const { getFieldDecorator } = this.props.form;

    

    let riskCoverList = this.state.riskCoverDrop.length > 0 &&
    this.state.riskCoverDrop.map((item,i) => {
      return (
        <Select.Option key={i} value={item.riskcoverid}>{item.riskname}</Select.Option>
      )
    },this)

    let riskNameList = this.state.riskItemList.length > 0 &&
    this.state.riskItemList.map((item,i) => {
      return (
        <Select.Option key={i} value={item.riskitemid}>{item.riskitemname}</Select.Option>
      )
    },this)

    return (
      <div>
    <Row gutter={4}>
          <Col xs={12} sm={24} md={12} lg={24}>
      <div className="flex justify-between">
        <h5
          style={{
            color: "#0C1362",
            fontWeight: "300",
            fontSize: "16px",
            marginTop: "0",
          }}
        >
         <b>Product Name : <label>Home Insurance</label>
        </b></h5>
       
               </div>
              </Col>
              </Row>
        <h3
          style={{
            color: "#0C1362",
            fontWeight: "600",
            fontSize: "24px",
            marginTop: "0",
          }}
        >
          Basic Customer Details
        </h3>
        <Row gutter={12}>
          <Col xs={12} sm={24} md={24} lg={24}>
            <div
              className="form-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
    { this.state.clientId === null &&
            <div className="flex">
                <Input placeholder="Search by UUID" name="searchBox" value={this.state.searchBox} onChange={this.handleChange}/>
                <Button
                  size="default"
                  style={{ backgroundColor: "#096dd9", color: "#fff" }} 
                  onClick={this.updateInput}>
                  Search
                </Button>
                 <Modal title="No data found !!" visible={this.state.visibleSearch} onOk={this.setVisibleSearch} onCancel={this.hideModal} okText="Add" cancelText="Cancel">
                <h3>Do you want to add new customer ?</h3>
                 </Modal>
          </div>    }
          {this.state.clientId !== null &&
        <label><b>Quotation Id : {this.state.quotationId}</b></label>
        } 
              
  {this.state.clientId === null &&
          <div><Button
                size="default"
                style={{
                  marginLeft: "auto",
                  color: "#fd7e14",
                  borderColor: "#fd7e14",                 
                }}
               onClick={this.setVisible}>
                Add Customer
              </Button>
              <Modal title="Add Customer" centered visible={this.state.visible} onOk={this.setVisibleFalse} onCancel={this.setVisibleFalse} width={1000}>
           <AddCustomer/>
              </Modal>
          </div>}
              { this.state.clientId !== null &&
                <div><Button
                size="default"
                style={{
                  marginLeft: "auto",
                  color: "#fd7e14",
                  borderColor: "#fd7e14",                 
                }}>
                Finalise    
                </Button>
              </div>}
            </div>
          </Col>
        </Row>
        <Row gutter={(2, [12])} style={{ marginTop: "10px" }}>
          <Col xs={24} md={12} lg={4}>
            <Form.Item label="Entity Type">
            <Select defaultValue="Domestic" style={{ width: 120 }} onChange={this.ShowHideCorporateName}>
               <Option value="Domestic">Domestic</Option>
               <Option value="Corporate">Corporate</Option>
              </Select>
              {/* <Input placeholder="Enter Entity Type" value={this.state.access} disabled/> */}
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={4}>
            <Form.Item label="First Name">
              <Input placeholder="Enter Firstname" onChange={this.changeFirstName} value={this.state.clientName}/>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={4}>
            <Form.Item label="Sur Name">
              <Input placeholder="Enter surname" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={4}>
            <Form.Item label="Corporate Name">
              <Input disabled={this.state.isCorprate} placeholder="Corporate name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={4}>
            <Form.Item label="Contact Number">
              <Input placeholder="eg:987654321" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={4}>
            <Form.Item label="Email Address">
              <Input placeholder="abc@gmail.com " />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={2}>
            <Form.Item label="Age">
              <Input placeholder="eg:24" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={2}>
            <Form.Item label="Gender">
              <Input placeholder="Male/Female" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Address 1">
              <TextArea placeholder="Enter Address" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label=" Address 2">
              <TextArea placeholder="Enter Address" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={2}>
            <Form.Item label="Suburb">
              <Input placeholder="Enter Suburb" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={2}>
            <Form.Item label="City">
              <Input placeholder="Enter City" />
            </Form.Item>
          </Col>
        </Row>

          <div>
          <h3 style={{color: "#0C1362",fontWeight: "600",fontSize: "24px",marginTop: "0px", marginBottom:"0",}}>          
            Policy Details
          </h3>       
          <Row gutter={[8, 8]} style={{ marginTop: "0" }}>
               <Col xs={24} md={12} lg={4}>
              <Form.Item>   
                  <DatePicker placeholder="Policy start date" onChange={this.startdateChange}/> 
              </Form.Item>
               </Col>
                     <Col xs={24} md={12} lg={4}>
              <Form.Item>   
                  <DatePicker placeholder="Policy end date" onChange={this.enddateChange}/> 
              </Form.Item>
               </Col>
              <Col xs={24} md={12} lg={5}>
              <Form.Item>
              <Select defaultValue="Risk Cover" mode="multiple" onChange={this.riskcoverChange} style={{ display: "inline" }}>
              {riskCoverList}
              </Select>
              </Form.Item>           
            </Col>
            <Col xs={24} md={12} lg={5}>
            <Form.Item>
              <Select defaultValue="Payment Term" style={{ display: "inline" }}>
              <Option value="Annually">Annually</Option>
              <Option value="Quarterly">Quarterly</Option>
              <Option value="Monthly">Monthly</Option>
              </Select>
            </Form.Item> 
            </Col>
            <Col xs={24} md={12} lg={5}>
            <Input value="Risk Insurance Limit : 100000" disabled/>
            </Col>
          </Row>
          </div>

        <div style={{display:"inline-block", width:"100%",}}>
          <h3
            style={{
              color: "#0C1362",
              fontWeight: "600",
              fontSize: "24px",
              marginTop: "0",
              marginBottom:"0"
            }}
          >          
            Product Details
          </h3>
       
          <Form onSubmit={this.state.clientId!==null?this.handleSubmitWithId:this.handleSubmit} id="my-form">
          <Row gutter={[8, 8]} style={{ marginTop: "0" }}>
          
            
            <Col xs={24} md={12} lg={4}>
            <Form.Item>
              <Select defaultValue="Risk Item" onChange={this.riskitem} style={{ display: "inline" }}>
              {riskNameList}
              </Select>
            </Form.Item>  
            </Col>

            <Col xs={24} md={12} lg={4}>
              <Form.Item>
               {getFieldDecorator("address", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input Address!",
                                  whitespace: false,
                                },
                              ],
                            })(<Input placeholder="Address"/>)}
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={4}>
              <Select defaultValue="Cover Type" onChange={this.covertype} style={{ display: "inline" }}>
                <Option value="Sum Assured">Sum Assured</Option>
                <Option value="Agreed Value">Agreed Value</Option>
              </Select>
            </Col>

            <Col xs={24} md={12} lg={4}>
              <Form.Item>
               {getFieldDecorator("sumInsured", {
                              rules: [
                                {
                                  required: true,
                                  message: "Please input Sum Insured!",
                                  whitespace: false,
                                },
                              ],
                            })(<Input placeholder="Sum insured"/>)}
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={2}>
              <Form.Item>
             <Input placeholder="Rate(%)" value={this.state.rate}/>           
              </Form.Item>
            </Col>

            <Col xs={24} md={12} lg={2}>
              <Button type="dashed" htmlType="submit" size="default" style={{color: "#fd7e14",borderColor: "#fd7e14",}}>
                Add
              </Button>
            </Col>
          </Row>
          </Form>
        </div>

        
        <div>
        <Table rowKey={this.state.id} className="table-scroll-auto" columns={this.state.columns} dataSource={this.state.clientId !== null?this.state.data[0]:this.state.data} pagination={false} />
           <div className="grand-total-bx" style={{ textAlign: "left" }}>
            <table width="100%">
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td style={{ textAlign: "left" }}>
                    <b>Total</b>
                  </td>
                  {this.state.clientId === null &&
                    <div>
                  <td style={{ textAlign: "left" }}>
                    {roundvalue(this.state.annualPremiumTotal)}
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {roundvalue(this.state.termPremiumTotal)}
                  </td>
                  </div>
                  }
                  {this.state.clientId !== null &&
                    <div>
                  <td style={{ textAlign: "left" }}>
                    {roundvalue(this.state.annualPremiumTotalForEdit)}
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {roundvalue(this.state.termPremiumTotalForEdit)}
                  </td>
                  </div>
                  }
               
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>

                  <td style={{ textAlign: "left" }}>
                    <b>Stamp Duty</b>
                  </td>
                 {this.state.clientId === null &&
                <div>
                 <td style={{ textAlign: "left" }}>
                    {roundvalue((this.state.annualPremiumTotal / 100) * 5)}
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {roundvalue((this.state.termPremiumTotal / 100) * 5)}
                  </td>
                </div>
                 }
                {this.state.clientId !== null &&
                    <div>
                 <td style={{ textAlign: "left" }}>
                    {roundvalue((this.state.annualPremiumTotalForEdit / 100) * 5)}
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {roundvalue((this.state.termPremiumTotalForEdit / 100) * 5)}
                  </td>
                </div>
                }
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>

                  <td style={{ textAlign: "left" }}>
                    <b>Grand Total</b>
                  </td>
{                 this.state.clientId === null &&
  <div>
   <td style={{ textAlign: "left" }}>
                    {roundvalue((this.state.annualPremiumTotal / 100) * 5 +
                      this.state.annualPremiumTotal)}
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {roundvalue((this.state.termPremiumTotal / 100) * 5 +this.state.termPremiumTotal)}
                  </td>
  </div>
}           
{                 this.state.clientId !== null &&
  <div>
   <td style={{ textAlign: "left" }}>
                    {roundvalue((this.state.annualPremiumTotalForEdit / 100) * 5 +
                      this.state.annualPremiumTotalForEdit)}
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {roundvalue((this.state.termPremiumTotalForEdit / 100) * 5 +this.state.termPremiumTotalForEdit)}
                  </td>
  </div>
}

<td></td>
                </tr>
              </tbody>
            </table>
             <Button
                size="default"
                value={"submit"}
                onClick={ this.state.clientId!=null?this.submitpolicy:this.addnewpolicy}
                style={{
                  marginLeft: "auto",
                  color: "#fd7e14",
                  borderColor: "#fd7e14", 
                  float:"right",                                
                }}>                  
                Submit
              </Button>
          </div>
        </div>
      </div>
    );
  }
}

const WrappedHomeInsurancePolicy = Form.create({ name: "Homeinsurance_list" })(
    AddQuotation
);

export default WrappedHomeInsurancePolicy;

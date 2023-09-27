import * as React from "react";
import { Row, Input, Col, Button, Form, Select, Modal, Table } from "antd";
import TextArea from "antd/lib/input/TextArea";
import BasicGrid2 from "./BasicGrid2";
import {DeleteOutlined} from '@ant-design/icons';
import { relativeTimeThreshold } from "moment";

const { Option } = Select;

// function handleChange(value) {
//   console.log(`selected ${value}`);
// }

const { confirm } = Modal;

class BasicGrid extends React.Component {

  constructor(){
    super();
    this.state={
      searchBox:null,
      gotData:false,
      visible: false,
      visibleSearch: false,
      api:"http://192.168:8091/GetClientDetailsbyid/1",
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
  columns : [
{
  key:'riskcover',
  title: 'Risk Cover',
  dataIndex: 'riskcover',
},
{
  key:'riskitem',
  title: 'Risk Item',
  dataIndex: 'riskitem',
},
{
  key:'address',
  title: 'Address',
  dataIndex: 'address',
},
{
  key:'covertype',
  title: 'Cover Type',
  dataIndex: 'covertype',
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
  title: 'Actions',
  render: () => (
    <button onClick={() => this.deleteRecord()}><DeleteOutlined/></button>
  )
}],
}
  this.updateInput = this.updateInput.bind(this);
  this.handleChange = this.handleChange.bind(this);
  this.setVisible = this.setVisible.bind(this);
  this.setVisibleFalse = this.setVisibleFalse.bind(this);
  this.hideModal = this.hideModal.bind(this);
  this.setVisibleSearch = this.setVisibleSearch.bind(this);
  this.riskcover = this.riskcover.bind(this);
  this.riskitem = this.riskitem.bind(this);
  this.covertype = this.covertype.bind(this);
  }; 

  componentDidMount(){
     fetch(process.env.REACT_APP_BASE_URL+'/Product/GetRiskCoverbyId/3')
    .then(res => res.json())
    .then(data => {this.setState({riskCoverDrop: data,})
      console.log(this.state.riskCoverDrop);
    })
  }

  // Functions for search functionality (if data not found)
  // Hide function to hide the modal after user clicked on cancel button
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

  // Functions for search functionality 
   handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }
  
  updateInput(){
  const current=[];
  fetch('https://localhost:7279//GetClientDetailsbyid/1')
      .then((response) => response.json())
      .then((data) => current.push(data.result));
  const userRoles = JSON.parse(localStorage.getItem("roles"));
  }

  riskcover(value){
    var riskcovertable;
    this.setState({
      riskVar:value
    })
    fetch(process.env.REACT_APP_BASE_URL+'/Product/GetRiskItembyId/'+value)
      .then((response) => response.json())
      .then(data => {this.setState({riskItemList: data})   
    })
    fetch(process.env.REACT_APP_BASE_URL+'/Product/GetRiskCoverbyId/3')
    .then(res => res.json())
    .then(data => {
        riskcovertable = data;
      for(let i=0;i<riskcovertable.length;i++){
      if(riskcovertable[i].riskcoverid == value){
        this.setState({riskcoverfortable : riskcovertable[i].riskname})
      }
    }
    });
  }

  riskitem(value){ 
    var riskitemtable;
    fetch(process.env.REACT_APP_BASE_URL+'/Product/GetRiskItembyId/'+this.state.riskVar)
      .then((response) => response.json())
      .then(data => {this.setState({ratePercentage: data,})   
      for(let i=0;i<this.state.ratePercentage.length;i++){
        if(this.state.ratePercentage[i].riskitemid === value){
          this.setState({rate:this.state.ratePercentage[i].ratepercentage})
        }
      }
    })
    fetch(process.env.REACT_APP_BASE_URL+'/Product/GetRiskItembyId/'+this.state.riskVar)
    .then(res => res.json())
    .then(data => {
      riskitemtable = data;
      for(let i=0;i<riskitemtable.length;i++){
      if(riskitemtable[i].riskitemid == value){
        this.setState({riskitemfortable : riskitemtable[i].riskitemname})
      }
    }
    })
  }

  covertype(value){
    this.state.coverType = value;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.state.newProduct = {
          riskcover : this.state.riskcoverfortable,
          riskitem : this.state.riskitemfortable,
          covertype : this.state.coverType,
          address : values.address,
          suminsured : values.sumInsured,
          rate : this.state.rate,
          annualpremium : this.state.rate * values.sumInsured,
          termpremium : values.sumInsured * this.state.rate/3,
        };
        // Converting object into array to be used in table as dataSource
        this.state.data.push(this.state.newProduct) ;
        for(let i=0;i<this.state.data.length;i++){
        this.setState({termPremiumTotal:this.state.data[i].termpremium + this.state.termPremiumTotal});
        this.setState({annualPremiumTotal:this.state.annualPremiumTotal + this.state.data[i].annualpremium});
      }
    }
    });
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
        <h5
          style={{
            color: "#0C1362",
            fontWeight: "300",
            fontSize: "16px",
            marginTop: "20px",
          }}
        >
          Product Name:<label>Home Insurance</label>
        </h5>
        <h3
          style={{
            color: "#0C1362",
            fontWeight: "600",
            fontSize: "24px",
            marginTop: "30px",
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
              }}
            >
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
              </div>
              <Button
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
              <BasicGrid2/>
              </Modal>
            </div>
          </Col>
        </Row>
        <Row gutter={(2, [12])} style={{ marginTop: "10px" }}>
          <Col xs={24} md={12} lg={4}>
            <Form.Item label="Entity Type">
              <Input placeholder="Enter Entity Type" value={this.state.access} disabled/>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={4}>
            <Form.Item label="First Name">
              <Input placeholder="Enter Firstname"/>
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={4}>
            <Form.Item label="Sur Name">
              <Input placeholder="Enter surname" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={4}>
            <Form.Item label="Corporate Name">
              <Input placeholder="Enter Corporate name" />
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
          <h3
            style={{
              color: "#0C1362",
              fontWeight: "600",
              fontSize: "24px",
              marginTop: "20px",
            }}
          >
            Product Details
          </h3>
          <Form onSubmit={this.handleSubmit}>
          <Row gutter={[8, 24]} style={{ marginTop: "10px" }}>
            <Col xs={24} md={12} lg={4}>
              <Form.Item>
              <Select defaultValue="Risk Cover" onChange={this.riskcover} style={{ display: "inline" }}>
              {riskCoverList}
              </Select>
              </Form.Item>
            </Col>
            
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
                            })(<Input placeholder="Address" id="addres"/>)}
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
                            })(<Input placeholder="Sum insured" />)}
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
        <Table columns={this.state.columns} dataSource={this.state.data} scroll={{x: 768}} pagination={false} />
        <div style={{textAlign:"right"}}>
        <label><b>Annual Premium Total : </b></label><label>{this.state.annualPremiumTotal}</label><br/>
        <label><b>Term Premium Total : </b></label><label>{this.state.termPremiumTotal}</label><br/>
        <label><b>Stamp Duty on Annual Premium total : </b></label><label>{this.state.annualPremiumTotal/100 * 5}</label><br/>
        <label><b>Stamp Duty on Term Premium total : </b></label><label>{this.state.termPremiumTotal/100 * 5}</label><br/>
        <label><b>Total Annual premium : </b></label><label>{this.state.annualPremiumTotal/100 * 5 + this.state.annualPremiumTotal}</label><br/>
        <label><b>Total Term premium : </b></label><label>{this.state.termPremiumTotal/100 * 5 + this.state.termPremiumTotal}</label><br/>
        </div>
        </div>
      </div>
    );
  }
}

const WrappedProductList = Form.create({ name: "product_list" })(
  BasicGrid
);

export default WrappedProductList;

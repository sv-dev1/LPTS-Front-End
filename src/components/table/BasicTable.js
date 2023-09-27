







import * as React from 'react';
import {Table, Divider, Tag} from 'antd';
import {EditOutlined,DeleteOutlined} from '@ant-design/icons';


class Index extends React.Component {
  constructor(){
    super()
    this.state = {      
    columns : [{
  key:'1',
  title: 'name',
  dataIndex: 'name',
},
{
  key:'2',
  title: 'domains',
  dataIndex: 'domains',
},
{
  key:'3',
  title: 'country',
  dataIndex: 'country',
},
{
  key:'4',
  title: 'web_pages',
  dataIndex: 'web_pages',
},
{
  title: 'Actions',
  render: (record) => (
    <button onClick={() => this.deleteRecord(record.name)}><DeleteOutlined/></button>
  )

  // render() {
  //  return ();
}]
    }
  }

 state = {
    data: []
  };

  componentDidMount(){
    //Api call
    this.setState();
    fetch('http://universities.hipolabs.com/search?country=United+States')
    .then(res => res.json())
    .then(data => {
      this.setState({
        data: data,
      })
    })
  }

  deleteRecord(val){
	  alert(val);
  alert("In delete");
}

  render () {
    const {data} = this.state;    
    return (
      <Table columns={this.state.columns} dataSource={data} scroll={{x: 768}} />
    ); 
    }
  }
export default Index;

import React, { useState, useEffect } from 'react'
import Layouts from '../../../components/Layouts'

import { Link, useHistory } from "react-router-dom";
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
const baseUrl = process.env.REACT_APP_BASE_URL



export default function Proficiency(props) {
  const history = useHistory()
 

  
    const [filterTable , setFilterTable] = useState([]);
    const [studentsList , setStudentLIst] = useState([]);
    const [RosterData , setRosterData] =   useState({
      "rosterid" : props.location.state.rosterId,
      "rosterName": "",
      "teacherId": 0,
      "teacher": "",
      "rotation": '',
      "block": 0,
      "advisory": true,
      "teamId": 0,
      "team": "",
      "subjectId": 0,
      "subject": "",
      "phaseId": 0,
      "phase": "",
      "categoryId": 0,
      "category": "",
      "learningTargetFrom": 0,
      "learningTargetTo": 0,
      "learningYearFrom": 0,
      "learningYearTo": 0,
    });
   var [columns , setColumns] = useState([]);
   var user = JSON.parse(localStorage.getItem('user'));

   let headers = { "Content-Type": "application/json" };
      const token = user.token;
      console.log("token", token)
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

const updateTableValue= (studentsData , roster)=>{
  let columnData = [];
  let studentProgressionData = []
  for (let i = roster.learningTargetFrom; i <= roster.learningTargetTo; i++) {
    let ProficiencyColumn = {
      title: i,
      dataIndex: i,
      className:"Ab",
      key: i,
      render: (text, record) =>{
        
        console.log("2")
        return( <Link className='link-text' style={{backgroundColor: text === "P" ? "#b8fcc5" : '#fff'}}
          to={{
            pathname: "/proficiency",
            state: {
              studentId: record.id,
              studentName: record.firstName + record.lastName,
              subject: roster.subject,
              phase: roster.phase,
              categoryId:roster.categoryId,
              category:roster.category,
              learningTarget:i,
            },
          }}
        >
          {text}
        </Link>)
      },
      onCell: (record, rowIndex) => {
        return {
            onClick: (ev) => {
            console.log("1")
                if( record.inProgressTarget){
                  history.push('/proficiency',{
                    studentId: record.id,
                    studentName: record.firstName + record.lastName,
                    subject: roster.subject,
                    phase: roster.phase,
                    categoryId:roster.categoryId,
                    category:roster.category,
                    learningTarget:record.inProgressTarget
                  })
                }else if(record.lastCompletedTarget ){
                    if(record.lastCompletedTarget < roster.learningTargetTo){
                      history.push('/proficiency',{
                        studentId: record.id,
                        studentName: record.firstName + record.lastName,
                        subject: roster.subject,
                        phase: roster.phase,
                        categoryId:roster.categoryId,
                        category:roster.category,
                        learningTarget:record.lastCompletedTarget + 1,
                      })
                    }else{
                          message.info(`${record.firstName} has completed all targets.`)
                    }

                } else{
                  history.push('/proficiency',{
                    studentId: record.id,
                    studentName: record.firstName + record.lastName,
                    subject: roster.subject,
                    phase: roster.phase,
                    categoryId:roster.categoryId,
                    category:roster.category,
                    learningTarget:roster.learningTargetFrom
                  })
                }
            },
        };
    },
      
    };
    columnData.push(ProficiencyColumn);
  }


  //let length =   studentsData.lastCompletedTarget -roster.learningTargetFrom ;
  const TableData = (n)=>{
   // debugger;
    let jsObj = studentsData[n];
      let length =   studentsData[n].lastCompletedTarget -roster.learningTargetFrom ;
  for (var i = 0; i <= length; i++) {
    jsObj[roster.learningTargetFrom + i] = 'P';
  }
  if(studentsData[n].inProgressTarget ){
    jsObj[studentsData[n].inProgressTarget ] = 'IP';
  }
  return jsObj;
  }
  
  
   let column = [
    {
    dataIndex: 'FullName',
    key: 'name',
    width: 100,
    render: (text, record) => (
      <span>
        {record.firstName} {record.lastName}
      </span>
    ),
  },
  {
    title: 'Learning Target',
    children: [...columnData],
  }];
  


  for (let i = 0; i < studentsData.length ; i++) {
    
    let mergedData =  TableData(i);
  
    studentProgressionData.push(mergedData)
    console.log(mergedData)
  }
  
  setColumns([...column])
  setFilterTable(studentProgressionData)
}


    useEffect(() => {

      // Rosters/Get?id=5
      
        fetch(`${baseUrl}/Rosters/Get?id=${parseInt(RosterData.rosterid)}`, { headers })
          .then(res => res.json())
          .then(data => {
              // data.data.Roster
              setRosterData(data.data.Roster)
              //data.data.Students
              let studentsData = data.data.Students
              setStudentLIst([...studentsData])
              updateTableValue(studentsData, data.data.Roster)
             
          }).catch((e) => {
              message.info('Your session is expired .Please Login again.')
              history.replace({ pathname: '/', state: { isActive: true } })
          })



  }, [])


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
                {' '} Proficiency Level {' '}
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
          style={{margin: "15px 0"}}
          name="basic"
          initialValues={{remember: true}}
          autoComplete="off">        
  
  

         <Row gutter={[24, 16]}>
          
           
           <Col xs={24} sm={12} md={6} lg={6}>
           <Form.Item >
           <label className='text-label' >Teacher :
            <span> {RosterData.teacher}</span>
            </label>
           </Form.Item>
           </Col>
           
           <Col xs={24} sm={12} md={6} lg={6}>
           <Form.Item >
           <label className='text-label' >Subject :
            <span  > {RosterData.subject}</span>
            </label>
           </Form.Item>
          </Col>
           
            
          <Col xs={24} sm={12} md={6} lg={6}>
             <Form.Item >
             <label className='text-label' >Phase : 
              <span >{RosterData.phase}</span>
              </label>
             </Form.Item>
</Col>

<Col xs={24} sm={12} md={24} lg={6}>
               <Form.Item  >
               <label className='text-label' >Category :
                <span > {RosterData.category}</span>
                </label>
               </Form.Item>
               </Col>
         
          
         </Row>
        </Form>

          


            <div className="table-grid-bx width-11">
            <Table
            className="Table-scroll-auto"
            columns={columns}
            dataSource={filterTable}
            scroll={{ x: 'max-content' }}
          />
        </div>
    </Layouts>
  </>

  )
}

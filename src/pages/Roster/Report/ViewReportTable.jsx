import React, { useState, useEffect } from 'react'
import { Table,Form } from 'antd'
const baseUrl = process.env.REACT_APP_BASE_URL
var user = JSON.parse(localStorage.getItem('user'))

const ViewReportTable = (props) => {
    const [studentsData, setStudentsData] = useState([])
    const [phases, setPhases] = useState()
    const [category, setcategory] = useState()
    const [learningTargets, setLearningTargets] = useState([])
    const [phasesInProgress, setPhasesInProgress] = useState([])

    const columns = [
        {
          title: 'Learning Targets',
          dataIndex: 'learningTarget',
          key: 'learningTarget',
          render(text, record) {
            return {
              children: <div>{record.learningTarget}</div>
            };
          },
        },
        {
          title: 'I Can Statements',
          dataIndex: 'iCanStatement',
          key: 'iCanStatement',
          render(text, record) {
            return {
                children: <div>{record.iCanStatement}</div>
            };
          },
        },
        {
            title: 'Proficiency',
            dataIndex: 'proficiency',
            key: 'proficiency',
            render(text, record) {
              return {
                  children: <div>{record.proficiency[0]}</div>
              };
            },
          }
      ]


    let headers = { 'Content-Type': 'application/json' }
    const token = user.token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    useEffect(() => {
        console.log(props)
        fetch(`${baseUrl}/Timelines/StudentTimeline?studentId=${props.parentToChild}&schoolId=1`, { headers })
            .then((res) => res.json())
            .then((data) => {
                console.log("data", data);
                setStudentsData(...data.data.subjects)
                setDataForTable(data.data.subjects);
            })
    }, []);

    const setDataForTable = (Subjects) =>{
        let phaseArray = [];
        Subjects.map(data => {
        data.phases.map(data1 => {
            console.log(data1)
            data1.categories.map(data2 => {
                console.log(data2)
                if(data2.learningTargets != null){
                    phaseArray.push([data1])
                    setPhases(data1.phaseName)
                    setcategory(data2.categoryName)
                    console.log(data2.learningTargets) 
                    data2.learningTargets.map(data3 => {
                    console.log(data3)
                    setLearningTargets([data3])
                    })                
                }
            })
        })
        setPhasesInProgress([...phaseArray])
       })
     }   

    return (
        <div>
            Hello
        </div>
    )
}

export default Form.create()(ViewReportTable);;

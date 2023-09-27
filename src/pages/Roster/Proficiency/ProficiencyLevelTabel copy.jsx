import React , { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
function DynamicTable(props){
// debugger
   let {studentsList ,rosterData ,totalLearningTargets ,learningTargets} = props;
   let totalColoums =  props.learningTargets;
//   debugger
// get table column
 const [column , setColumns]= useState(totalColoums);
 const [students , setstudentsList] = useState([]);
 useEffect(()=>{
  setstudentsList(studentsList);
  setColumns(totalColoums)
//  totalLearningTargets.length && 
 },[props ])
 // get table heading data


const RostersTabledata = (studentData)=>{
 // debugger
let stdtData  = students.find((element)=>element.id === studentData.id)
if(stdtData){
 // let rsterData = props.NewRoster.find((element)=>element.id === studentData.rosterId);
  return stdtData;
}
return null;
 
}

 const ThData =()=>{
    
     return(
        <>




        {totalLearningTargets.length ? (
          <>
          <th key="fullName"></th>

          {        totalLearningTargets.map((data ,key)=>{
                  
            return <th  key={data.progression.learningTarget }>{data.progression.learningTarget}</th>
        })}

         
        {/*        [...Array(column)].map((data ,key)=>{
                  
          return <th  key={rosterData.learningTargetFrom + key}>{rosterData.learningTargetFrom + key}</th>
      })  */}
        </>
        ) : (
          <>
          <th key="fullName"></th>
          {        column.map((data ,key)=>{
                  
            return <th  key={data.learningTarget}>{data.learningTarget }</th>
        })}

        </>
        )}
        </>

     )
 }
 console.log(rosterData.id)
// get table row data
const tdData =() =>{
   
     return students.map((student)=>{
     

        let completedTarget = student.completedTarget.split(",")
        const myData = (learnTarget )=>{
            let index = completedTarget.findIndex(
                data => parseInt(data) === learnTarget,
              )
              if(index > -1){
                  return "P"
              }else{
                //debugger
                if(student.inProgressingTarget){
                  let inProgressingTarget = student.inProgressingTarget.split(",");

                  let indexForinProgressing = inProgressingTarget.findIndex(
                    data => parseInt(data) === learnTarget,
                  )
                  if (indexForinProgressing > -1) {
                    return 'IP'
                  }
                } else if(student.inProgressTarget === learnTarget){
                  return 'IP'
                } else{
                      return ''
                  }
                  
              }
              return ''
        }

      //   const disableLink = (learnTarget )=>{
      //     let index = completedTarget.findIndex(
      //         data => parseInt(data) === learnTarget,
      //       )
      //       if(index > -1){
      //           return true
      //       }else{
      //         //debugger 
      //             return false
                
      //       }
          
      // }
       return(
           <tr style={{borderBottom: "1px solid #e8e8e8",color:"333",fontSize:"13px"}}>
           {rosterData.advisory ?
           ( <Link 
                  to={{
                    pathname: "/student-timeline",
                    state: {
                    studentId: student.id,
                    studentName: student.firstName + student.lastName,
                    },
                }}
                 > <td>{student.firstName} {student.lastName} </td> 
            </Link> ): <td>{student.firstName} {student.lastName} </td> }
{totalLearningTargets.length > 0 ?(
  
                
  totalLearningTargets.length > 0 && [...Array(totalLearningTargets.length )].map((data , key)=>{
 //   debugger
       return (
           <>
        
           <td className="unselectable" style={{textAlign: 'left'}}>
                 <Link  className='link-text diable-link'  style={{backgroundColor: myData(totalLearningTargets[key].progression.learningTarget  ) === "P" ? "#b8fcc5" : '#e8e8e8'}}
                        to={{
                            pathname: "/proficiency",
                            state: {
                            studentId: student.id,
                            studentName: student.firstName + student.lastName,
                            subject: rosterData.subject,
                            phase: rosterData.phase,
                            categoryId:rosterData.categoryId,
                            category:rosterData.category,
                            learningTarget:  totalLearningTargets[key].progression.learningTarget,
                            status:myData(totalLearningTargets[key].progression.learningTarget ),
                           
                            },
                        }}
                        >
                        {myData( totalLearningTargets[key].progression.learningTarget) }
                        </Link>
            </td>
           </>
           )
   })

):(  
      
  column.map((data , key)=>{
   
     return (
         <>
      
         <td style={{textAlign: 'left'}}>
               <Link className='link-text'  style={{backgroundColor: myData(data.learningTarget ) === "P" ? "#b8fcc5" : '#e8e8e8'}}
                      to={{
                          pathname: "/proficiency",
                          state: {
                          studentId: student.id,
                          studentName: student.firstName + student.lastName,
                          subject: rosterData.subject,
                          phase: rosterData.phase,
                          categoryId:rosterData.categoryId,
                          category:rosterData.category,
                          learningTarget:data.learningTarget,
                          status:myData(data.learningTarget ),
                          rosterId:rosterData.id
                          },
                      }}
                      >
                      {myData(data.learningTarget ) }
                      </Link>
          </td>
         </>
         )
 })
)}        
           
              
           </tr>
       )
     })
}
  return (
    <div className="grand-total-bx " style={{textAlign: 'left',overflowX:"auto",overflowY:"hidden"}}>
    <table style={{borderCollapse: "collapse",
  borderSpacing: "0",
  width: "100%",
  border: "1px solid #ddd"}}>
        <thead> 
         <tr >{ThData()}</tr>
        </thead>
        <tbody style={{borderBottom: "1px solid #e8e8e8",color:"333",fontSize:"13px"}}>
        {tdData()}
        </tbody>
       </table>
       </div>
  )
}
export default DynamicTable;
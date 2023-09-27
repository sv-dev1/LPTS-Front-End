import React, {useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
const baseUrl = process.env.REACT_APP_BASE_URL
function DynamicTable(props) {
  //
  console.log(props)
  let {studentsList, rosterData, totalLearningTargets, learningTargets} = props
  let totalColoums = props.learningTargets

  const [column, setColumns] = useState(totalColoums)
  const [students, setstudentsList] = useState([])

  useEffect(() => {
    setstudentsList(studentsList)
    setColumns(totalColoums)
  }, [props])

  var user = JSON.parse(localStorage.getItem('user'))

  const RostersTabledata = studentData => {
    let stdtData = students.find(element => element.id === studentData.id)
    if (stdtData) {
      return stdtData
    }
    return null
  }

  const getColorOfLearningTarget = (d, Name) => {
    for (let i = 0; i <= students.length - 1; i++) {
      if (students[i].id === Name.id) {
        console.log(students[i])
        for (let j = 0; j <= students[i].allInProgress.length - 1; j++) {
          if (students[i].allInProgress[j].learningTarget == d.learningTarget) {
            if (
              students[i].allInProgress[j].imported === true &&
              students[i].allInProgress[j].status === 'P'
            ) {
              return true
            } else {
              return false
            }
          }
        }
      }
    }
  }

  const ThData = () => {
    return (
      <>
        {totalLearningTargets.length ? (
          <>
            <th key="fullName"></th>
            {totalLearningTargets.map((data, key) => {
              return (
                <th key={data.progression.learningTarget}>
                  {data.progression.learningTarget}
                </th>
              )
            })}
          </>
        ) : (
          <>
            <th key="fullName"></th>
            {column.map((data, key) => {
              return (
                <th
                  className={data.seprater ? 'table-th-bx' : ''}
                  key={data.learningTarget}>
                  {data.learningTarget}
                </th>
              )
            })}
          </>
        )}
      </>
    )
  }

  const tdData = () => {
    return students.map(student => {
      let completedTarget = student.completedTarget.split(',')
      if (completedTarget.length > 0) {
      }
      const myData = learnTarget => {
        var found = null
        let lastInprogressTarget = -1
        if (student.allInProgress) {
          var found = student.allInProgress.find(
            e => e.learningTarget == learnTarget,
          )
        }
        if (found) {
          return found.status
        } else {
          return ''
        }
      }

      return (
        <tr
          style={{
            borderBottom: '1px solid #e8e8e8',
            color: '333',
            fontSize: '13px',
          }}>
          {rosterData.advisory ? (
            <Link
              to={{
                pathname: '/student-timeline',
                state: {
                  studentId: student.id,
                  studentName: student.firstName + ' ' + student.lastName,
                },
              }}>
              {' '}
              <td>
                {student.firstName} {student.lastName}{' '}
              </td>
            </Link>
          ) : (
            <td>
              {student.firstName} {student.lastName}{' '}
            </td>
          )}
          {totalLearningTargets.length > 0
            ? totalLearningTargets.length > 0 &&
              [...Array(totalLearningTargets.length)].map((data, key) => {
                console.log(totalLearningTargets[key].progression)
                return (
                  <>
                    <td className="unselectable" style={{textAlign: 'left'}}>
                      <Link
                        className="link-text "
                        style={{
                          backgroundColor:
                            myData(
                              totalLearningTargets[key].progression
                                .learningTarget,
                            ) === 'P'
                              ? '#b8fcc5'
                              : '#e8e8e8',
                        }}
                        to={{
                          pathname: '/proficiency',
                          state: {
                            studentId: student.id,
                            studentName:
                              student.firstName + ' ' + student.lastName,
                            subject: rosterData?.subject
                              ? rosterData?.subject
                              : props?.names?.subject,
                            phase: rosterData?.phase
                              ? rosterData.phase
                              : props?.names?.phase,
                            categoryId: rosterData?.categoryId
                              ? rosterData.categoryId
                              : props?.names?.categoryID,
                            category: rosterData?.category
                              ? rosterData.category
                              : props?.names?.category,
                            rosterId: rosterData.id ? rosterData.id : 0,
                            learningTarget:
                              totalLearningTargets[key].progression
                                .learningTarget,
                            status: myData(
                              totalLearningTargets[key].progression
                                .learningTarget,
                            ),
                            isAdvisory: props.isAdvisory,
                          },
                        }}>
                        {myData(
                          totalLearningTargets[key].progression.learningTarget,
                        )}
                      </Link>
                    </td>
                  </>
                )
              })
            : column?.map((data, key) => {
                let myTargetStatus = myData(data.learningTarget)
                return (
                  <>
                    <td
                      className={data.seprater ? 'table-td-bx' : ''}
                      style={{textAlign: 'left'}}>
                      <Link
                        className={
                          data.id && data.id != -1
                            ? 'link-text'
                            : 'link-text diable-link'
                        }
                        style={{
                          backgroundColor:
                            myTargetStatus === 'P'
                              ? getColorOfLearningTarget(data, student)
                                ? '#056608 '
                                : '#28a745'
                              : '#868686',
                          color: 'white',
                        }}
                        to={{
                          pathname: '/proficiency',
                          state: {
                            studentId: student.id,
                            studentName:
                              student.firstName + ' ' + student.lastName,
                            subject: rosterData.subject,
                            phase: rosterData.phase,
                            categoryId: rosterData.categoryId,
                            category: rosterData.category,
                            learningTarget: data.learningTarget,
                            status: myTargetStatus,
                            rosterId: rosterData.id,
                          },
                        }}>
                        {myTargetStatus}
                      </Link>
                    </td>
                  </>
                )
              })}
        </tr>
      )
    })
  }

  return (
    <div
      className="grand-total-bx "
      style={{textAlign: 'left', overflowX: 'auto', overflowY: 'hidden'}}>
      <table
        style={{
          borderCollapse: 'collapse',
          borderSpacing: '0',
          width: '100%',
          border: '1px solid #ddd',
        }}>
        <thead>
          <tr>{ThData()}</tr>
        </thead>
        <tbody
          style={{
            borderBottom: '1px solid #e8e8e8',
            color: '333',
            fontSize: '13px',
          }}>
          {tdData()}
        </tbody>
      </table>
    </div>
  )
}
export default DynamicTable

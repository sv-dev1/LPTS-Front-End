import React, {useEffect, useState} from 'react'
import {Row, Col, Tooltip, Card, Button, Form, message, Tabs, Modal} from 'antd'
import {Link, useHistory, useLocation} from 'react-router-dom'
import isJwtTokenExpired from 'jwt-check-expiry'
import passwordValidator from 'password-validator';

import Messages from '../Message/Message'
import AddSchool from './School/AddSchool'
import SchoolInfo from './School/SchoolInfo'
import {EditOutlined, EllipsisOutlined, InfoOutlined} from '@ant-design/icons'
import EditSchool from './School/EditSchool'

const {Meta} = Card

const SchoolSelect = () => {
  var schema = new passwordValidator();
  const [school, setSchool] = useState([])
  const [visible, setVisible] = React.useState(false)
  const [visibleInfo, setVisibleInfo] = React.useState(false)
  const [visibleEdit, setVisibleEdit] = React.useState(false)

  const [schoolData, setSchoolData] = useState()

  const history = useHistory();

    // password schema

    schema
    .is().min(8)
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                // Must have digits
    .has().symbols()

  // // Validate against a password string
  // console.log(schema.validate('validPASS123'));

  const baseUrl = process.env.REACT_APP_BASE_URL
  var myAccount = JSON.parse(localStorage.getItem('user'))
  var user = JSON.parse(localStorage.getItem('user'))
  const token = user.token
  const schoolID = user.schoolId
  if (user) {
    var isExpired = isJwtTokenExpired(user.token)

    if (isExpired) {
      message.error(`${Messages.unHandledErrorMsg}`)
      history.replace({pathname: '/', state: {isActive: true}})
    }
  } else {
    message.error(`${Messages.unHandledErrorMsg}`)
    history.replace({pathname: '/', state: {isActive: true}})
  }
  let headers = {'Content-Type': 'application/json'}

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const addSchool = () => {
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }
  const handleCancelInfo = () => {
    setVisibleInfo(false)
  }
  const handleCancelEdit = () => {
    setVisibleEdit(false)
  }

  const fetchSchoolList = () => {
    let schoolArray = []
    //  let studentID = 4;
    fetch(`${baseUrl}/Schools/GetAll`, {headers})
      .then(res => res.json())
      .then(data => {
        //  debugger
        // console.log(data)
        if (data.statusCode === 200) {
          for (let i = 0; i < data.data.length; i++) {
            schoolArray.push({
              key: data.data[i].id,
              value: data.data[i].schoolName,
              logo: data.data[i].logo,
            })
          }
       //   debugger
          if(schoolArray.length){
            let updateUserData = user
            updateUserData.schoolId = schoolArray[0].key
            updateUserData.schoolName = schoolArray[0].value
            localStorage.setItem('user', JSON.stringify(updateUserData))
            window.location.href = '/dashboard' ;
          }
          setSchool(schoolArray) ;
         // console.log(schoolArray)
        } else {
          message.error(`${data.message}`)
        }
        //  console.log("userList" ,data );
      })
  }

  useEffect(() => {
    fetchSchoolList()
  }, [])

  // useEffect(() => {
  //   let headers = {'Content-Type': 'application/json'}
  //   const token = user.token
  //   //const schoolID = user.schoolId
  //   // console.log("token" ,token )
  //   if (token) {
  //     headers['Authorization'] = `Bearer ${token}`
  //   }
  //   let schoolArray = []
  //   //  let studentID = 4;
  //   fetch(`${baseUrl}/Schools/GetAll`, {headers})
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log(data)
  //       if (data.statusCode === 200) {
  //         for (let i = 0; i < data.data.length; i++) {
  //           schoolArray.push({
  //             key: data.data[i].id,
  //             value: data.data[i].schoolName,
  //             logo: data.data[i].logo,
  //           })
  //         }
  //         setSchool(schoolArray)
  //         console.log(schoolArray)
  //       } else {
  //         message.error(`${data.message}`)
  //       }
  //       //  console.log("userList" ,data );
  //     })
  // }, [])

  // const handleClick = e => {
  //   console.log(e)
  //   let headers = {'Content-Type': 'application/json'}
  //   const token = user.token
  //   if (token) {
  //     headers['Authorization'] = `Bearer ${token}`
  //   }
  //   fetch(`${baseUrl}/Schools/Get?id=${parseInt(e)}`, {headers})
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log(data.data.schoolName)
  //       console.log(data.data.id)
  //       localStorage.setItem('school', data.data.schoolName)
  //       localStorage.setItem('schoolId', data.data.id)
  //       window.location.href = '/dashboard'
  //     })
  // }

  const handleClick = e => {
    // console.log(e)
    let headers = {'Content-Type': 'application/json'}
    const token = user.token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    fetch(`${baseUrl}/Schools/Get?id=${parseInt(e)}`, {headers})
      .then(res => res.json())
      .then(data => {
        let updateUserData = user
        updateUserData.schoolId = data.data.id
        updateUserData.schoolName = data.data.schoolName
        localStorage.setItem('user', JSON.stringify(updateUserData))
        window.location.href = '/dashboard'
      })
      .catch(e => {
        message.error(`${Messages.unHandledErrorMsg}`)
        console.log(e)
      })
  }

  const handleEdit = e => {
    
      setSchoolData(e)
      setVisibleEdit(true)
  }

  const handleInfo = e => {
    let headers = {'Content-Type': 'application/json'}
    const token = user.token
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    fetch(`${baseUrl}/Schools/Get?id=${parseInt(e)}`, {headers})
      .then(res => res.json())
      .then(data => {
        setSchoolData(data)
        setVisibleInfo(true)
      })
  }

  // const updateSchool = () => {
  //   fetchSubjects()
  // }

  // const fetchSubjects = () => {
  //   let headers = {'Content-Type': 'application/json'}
  //   let schoolArray = []
  //   const token = user.token
  //   fetch(`${baseUrl}/Schools/GetAll`, {
  //     headers,
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data.statusCode === 200) {
  //         for (let i = 0; i < data.data.length; i++) {
  //           schoolArray.push({
  //             key: data.data[i].id,
  //             value: data.data[i].schoolName,
  //             logo: data.data[i].logo,
  //           })
  //         }
  //         setSchool(schoolArray)
  //         console.log(schoolArray)
  //       } else {
  //         message.error(`${data.message}`)
  //       }
  //     })
  // }
  console.log(schoolData)

  return (
    <div className="container container-center">
     {school.length === 0 && <Button
        onClick={addSchool}
        className="primary"
        size="default"
        style={{
          width: 220,
          textAlign: 'center',
        }}>
        Add School
      </Button>}

      <Row className="row-grid-center cards_row" gutter={[16, 16]}>
        {school.map((i ,key) => (
          <Card key={key}
            style={{
              width: 240,
            }}
            cover={
              <img
                src={`data:image/png;base64,${i.logo}`}
                onClick={e => handleClick(i.key)}
              />
            }
            className="primary card-body-bx yellow-bg text-left"
            actions={[
              <Tooltip title="View">
                <InfoOutlined key={key} onClick={e => handleInfo(i.key)} />
              </Tooltip>,
              <Tooltip title="Edit">
                <EditOutlined  key={key} onClick={e => handleEdit(i.key)} />
              </Tooltip>,
            ]}>
            <Meta title={i.value} />
          </Card>
        ))}
      </Row>

      <Modal
        title="Add New School"
        visible={visible}
        footer={null}
        width="800px"
        onCancel={handleCancel}>
        <AddSchool updateSchoolList={fetchSchoolList} />
      </Modal>

      <Modal
        title="School Info"
        visible={visibleInfo}
        footer={null}
        width="800px"
        onCancel={handleCancelInfo}>
        <SchoolInfo parentToChild={schoolData} />
      </Modal>

      <Modal
        title="Edit School"
        visible={visibleEdit}
        footer={null}
        width="800px"
        onCancel={handleCancelEdit}>
        <EditSchool
          updateSchoolList={fetchSchoolList}
          id={schoolData}
        />
      </Modal>
    </div>
  )
}
export default SchoolSelect

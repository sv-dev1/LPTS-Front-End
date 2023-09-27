import React from 'react'
import Layouts from '../../components/Layouts'
import {useHistory} from 'react-router-dom'
import {message} from 'antd'
import isJwtTokenExpired from 'jwt-check-expiry'
import Messages from '../../Message/Message'
import {Anchor} from 'antd'
const {Link} = Anchor

const Dashboard = () => {
  const history = useHistory()
  var myAccount = JSON.parse(localStorage.getItem('user'))
  console.log(myAccount)
  var user = JSON.parse(localStorage.getItem('user'))
  // console.log("users" , user)
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

  var role = user && user.role.toLowerCase()
  return (
    <>
      {role === 'admin' || role === 'superadmin' ? (
        <Layouts title="assets" clasName="dashboard">
          <div className="dashboard-heading-top">
            {user.schoolName ? (
              <h1>Dashboard for {user.schoolName} School </h1>
            ) : (
              <h1>Dashboard </h1>
            )}
          </div>
          <div className="dashboard-text-center">
            Welcome {role == 'admin' ? 'Admin' : 'Superadmin'}
          </div>
        </Layouts>
      ) : role === 'teacher' ? (
        <Layouts title="assets" className="dashboard">
          <div className="dashboard-heading-top"></div>
        </Layouts>
      ) : role === 'parent' ? (
        <h2 className="dashboard-text-center">Welcome , Parent</h2>
      ) : role === 'student' ? (
        <h2 className="dashboard-text-center">Welcome , student</h2>
      ) : (
        <h2>Hey , We are facing some issue. Please Login after sometime.</h2>
      )}
    </>
  )
}

export default Dashboard

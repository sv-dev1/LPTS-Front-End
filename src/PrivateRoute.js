import React from 'react'
import {Navigate} from 'react-router-dom'

const PrivateRoute = ({children}) => {
  const Token = localStorage.getItem('token')

  return false ? children : <Navigate to="/" />
}

export default PrivateRoute
import { useState, useEffect } from "react";
import {message } from 'antd'
import {useHistory} from 'react-router-dom'
const baseUrl = process.env.REACT_APP_BASE_URL
import Messages from "../../Message/Message";
const useVerifyJwtToken = (url) => {

  const [data, setData] = useState(null);
  const history = useHistory()
  var myAccount = JSON.parse(localStorage.getItem('user'))
  let headers = {'Content-Type': 'application/json'}
  const token = myAccount.token
  console.log('token', token)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }


const verifyToken = async()=>{
    console.log()
    var isExpired = false;
   // const token = localStorage.getItem('id_token');
    var decodedToken=jwt.decode(token, {complete: true});
    var dateNow = new Date();
    
    if(decodedToken.exp < dateNow.getTime()){
        console.log("expired token")
        isExpired = true;
       message.error(`${Messages.unHandledErrorMsg}`)
        history.replace({pathname: '/', state: {isActive: true}})
    } 
}
  
     

  useEffect(() => {
    verifyToken()
  }, []);


  return true;
};

export default useVerifyJwtToken;
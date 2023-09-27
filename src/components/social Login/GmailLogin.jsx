
import React, { useEffect, useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import {useSelector , useDispatch } from 'react-redux';
import {gapi} from 'gapi-script';

import {updateMyAccount , deleteMyAccount  } from '../../Slicers/myAccountSlice'

import {
  Spin, 
  Icon ,
  message,
  Alert
} from 'antd'
const clientId =process.env.REACT_APP_GOOGLE_LOGIN_KEY;
const baseUrl = process.env.REACT_APP_BASE_URL ;

const antIcon = <Icon type="loading" style={{ fontSize: 48 }} spin />;
function GmailLogin() {
  
const initialValue = {
  "username": "",
  "password": "",
  "isSocial": true
}

const [userInfo , setUserInfo] = useState(initialValue)
const [loader , setLoader] = useState(false)
const [Message , setMessage] = useState({error:""})
const dispatch = useDispatch();

const login =async(user)=>{
  try{
    const requestMetadata = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
   }

   const UserData = await fetch(`${baseUrl}/Auth/Login`, requestMetadata);
   const resJson = await UserData.json();
    console.log("Userdata" , resJson.statusCode);
    
    if (resJson.statusCode === 200) {
      console.log(resJson.data)
      localStorage.setItem('user', JSON.stringify(resJson.data))
      if (resJson.data.role.toLowerCase() === 'admin') {
        window.location.href = '/dashboard'
      } else if (resJson.data.role.toLowerCase() === 'teacher') {
        window.location.href = '/ManageRosters'
      } else if (resJson.data.role.toLowerCase() === 'student') {
        window.location.href = '/student-timeline'
      } else if (resJson.data.role.toLowerCase() === 'superadmin') {
        window.location.href = '/school-select'
      } else {
        window.location.href = '/dashboard'
      }
    } else {

      setMessage({error:resJson.message})
    }
  


    // if(resJson.statusCode === 200) {
    //  // dispatch(resJson.data)
     
    //   ///message.success(' Login successfully !!')
    //   window.location.href = '/dashboard'
    // } else{
    //     setMessage({error:resJson.message})
    // }
 
  } catch(error){
    setMessage({error:" Internal server error, Please try after some time !!"})
    
  }
}



  const onLoginSuccess = (res) => {
    setLoader(true)
    console.log("Login Success:", res.profileObj);
    let user = res.profileObj
    setUserInfo({
      "username": user.email,
      "name": user.name ,
      "password": process.env.REACT_APP_SOCIAL_LOGIN_KEY,
      "isSocial": true
    })
    const userData = {
        "username": user.email,
        "name": user.name ,
        "password": process.env.REACT_APP_SOCIAL_LOGIN_KEY,
        "isSocial": true
      }
    
   login(userData)
   setLoader(false)
  };


  const onFailureSuccess = (res) => {
   // message.error(' Login failed !!');
    setMessage({warning:" Login failed !!"})
    console.log("Failure Success:", res);
  };

 
  const onSignoutSuccess = () => {
  //  debugger;

  setLoader(true);

// const auth2 = gapi.auth2.getAuthInstance();

// if (auth2 != null) {
//     auth2.signOut().then(
//          auth2.disconnect().then(console.log('LOGOUT SUCCESSFUL'))
//      )
//    }  
// browser.cookieStore.getAll().then(cookies => cookies.forEach(cookie => {
//   console.log('Cookie deleted:', cookie);
//   cookieStore.delete(cookie.name);
// }));
// function start() {
//   gapi.client.init({
//     clientId:clientId,
//     scope:"profile email"
//   })
// };
// gapi.load('client:auth', start);




   setUserInfo({

      "username": "",
      "name": "" ,
      "password": process.env.REACT_APP_SOCIAL_LOGIN_KEY,
      "isSocial": true
    })
    setLoader(false)
    setMessage({error:""})
 //   message.success(' Sign Out Successfully !!')
   // console.log("Sign Out Successfully");
  };

  return (
    <>
     
     {userInfo.username ? (
            <div>
              <GoogleLogout
              clientId={clientId}
              buttonText="Logout"
              onLogoutSuccess={onSignoutSuccess}
                 ></GoogleLogout>
               
            </div>
          ) : loader ? <Spin className="loader-icon-fixed" indicator={antIcon} /> :( <GoogleLogin
              clientId={clientId}
              buttonText="Login"
              onSuccess={onLoginSuccess}
              onFailure={onFailureSuccess}
              cookiePolicy={"single_host_origin"}
             />)
          }
     
        { Message.error ?( <Alert
            message={`Hello, ${userInfo.name}`}
            description={Message.error ? Message.error : Message.warning }
            type={Message.error ? "error" : "warning"}
           
         />) : "" }

    </>
  );
}

export default GmailLogin;
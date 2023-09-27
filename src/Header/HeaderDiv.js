import * as React from 'react'
import logo from '../static/images/logo.png'
import avatar from '../static/images/flat-avatar.png'
import {UserOutlined} from '@ant-design/icons'
import {deleteMyAccount} from '../Slicers/myAccountSlice'
import {connect} from 'react-redux'
import {Route, Link, BrowserRouter as Router} from 'react-router-dom'
//var logoImg= 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

import {Menu, Input, Avatar} from 'antd'

const SubMenu = Menu.SubMenu

const Search = Input.Search
const baseUrl = process.env.REACT_APP_BASE_URL
var userData = JSON.parse(localStorage.getItem('user'))
// const trgLogout = () => {
//   localStorage.clear()

//   window.location.href = '/'
// }

class HeaderDiv extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      current: 'search',
      rtl: true,
      schoolData: JSON.parse(localStorage.getItem('schoolData')),
    }
    this.sidebarToggle = this.sidebarToggle.bind(this)
  }

  sidebarToggle() {
    this.setState({
      rtl: !this.state.rtl,
    })
    var body = document.body
    body.classList.toggle('rtl')
  }
  trgLogout = () => {
    //console.log("1")
    localStorage.clear()
    this.props.deleteMyAccount()
    window.location.href = '/'
  }
  componentDidMount(prevProps, prevState, snapshot) {
     
    // if (this.props.id !== prevProps.id) {
    var myAccount = JSON.parse(localStorage.getItem('user'))
    let headers = {'Content-Type': 'application/json'}
    const token = myAccount.token
    // console.log('token', token)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    let schoolID = myAccount.schoolId;
   // debugger
   
    if(schoolID != this.state.schoolData?.schoolID){

      fetch(`${baseUrl}/Schools/Get?id=${parseInt(schoolID)}`, {headers})
        .then(res => res.json())
        .then(data => {
        // debugger
          // this.setState({ ...this.state , logoImg:data.data.logo})
          //    console.log("logo in header" ,data.data.logo)
          
          let schoolData = {
            schoolID :data.data.id ,
            logo: data.data.logo,
            schoolName: data.data.schoolName,
            studentYears: data.data.studentYears
          }
          this.setState({
            schoolData: schoolData,
          })
          localStorage.setItem('schoolData', JSON.stringify(schoolData))
          //  dispatch(addAllSubjects(data.data))
          // console.log('addAllSubjects', data.data)
        })
      }
  }

  handleClick = e => {
    console.log('click ', e)
    this.setState({
      current: e.key,
    })
  }

  render() {
    const classBox = `primaryBg box`

    return (
      <Menu
        mode="horizontal"
        theme="dark"
        className="d-flex align-items-center custom-navigation">
        <Menu.Item key="brand-logo" className="brand-logo">
          {/* <Link to="/dashboard"> */}
          {this.state.logoIMg === '' ? (
            ''
          ) : (
            <img
              src={`data:image/png;base64,${this.state.schoolData?this.state.schoolData.logo :''}`}
              alt="Logo"
            />
          )}

          {/* <span>Ant Dashboard</span> */}
          {/* </Link> */}
        </Menu.Item>

        {/* <Menu.Item key="sidebar-toggle" onClick={this.sidebarToggle}>
          <span>LTR/RTR</span>
        </Menu.Item>  */}
        {/* <SubMenu
          title={
            <span className="submenu-title-wrapper">
              Language{' '}
            </span>
          }
          className="custom-dropdown language-list"
        >
          <Menu.Item key="setting:1">English</Menu.Item>
          <Menu.Item key="setting:2">Dutch</Menu.Item>
          <Menu.Item key="setting:3">Hindi</Menu.Item>
          <Menu.Item key="setting:4">Urdu</Menu.Item>
        </SubMenu> */}

        <SubMenu
          key="profile"
          title={
            <span>
              <div className=" avatar-profile">
                <Avatar size={32} icon={<UserOutlined />} />
                <span className='header-username'
                  style={{fontSize: '12px', fontWeight: '500', height: '28px'}}>
                  {' '}
                  {userData && userData.name}
                </span>
              </div>
            </span>
          }
          className="avatar-round auto">
          <Menu.Item key="logout">
            <div
              onClick={() => {
                this.trgLogout()
              }}>
              Logout
            </div>
          </Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

export default connect(null, {deleteMyAccount})(HeaderDiv)

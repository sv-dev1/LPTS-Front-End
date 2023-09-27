import React, {Component, PropTypes} from 'react'
import {Route, Link, BrowserRouter as Router} from 'react-router-dom'
import {Layout, Menu, Icon} from 'antd'
import {
  TeamOutlined,
  SolutionOutlined,
  IdcardOutlined,
  SettingOutlined,
  BookOutlined,
  ApartmentOutlined,
  UnorderedListOutlined,
  AimOutlined,
  DeploymentUnitOutlined
} from '@ant-design/icons'
const {SubMenu} = Menu
const {Header, Sider, Content} = Layout

var user = JSON.parse(localStorage.getItem('user'))
var role = user && user.role?.toLowerCase()

class AdminSidebar extends React.Component {
  state = {
    collapsed: true,
    uni: '',
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }
  rootSubmenuKeys = ['sub1', 'sub2', 'sub4', 'sub5', 'sub3', 'sub6']

  state = {
    openKeys: '',
    collapsed: false,
  }

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(
      key => this.state.openKeys.indexOf(key) === -1,
    )
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({openKeys})
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      })
    }
  }
  render() {
    const active = this.props.active
    // const classname = (this.props, "classname", " ");
    return (
      
        <>
               <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={[active]}
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange}
            // mode="vertical"
          >
         
            <Menu.Item key="1">
            
            <Link to="/dashboard">
              <div>
              <Icon type="home" />
                <span>Dashboard</span>
              </div>
            </Link>
          </Menu.Item>
            <Menu.Item key="2">
            
              <Link to="/manage-Subject">
                <div>
                  <BookOutlined />
                  <span>Manage Subject</span>
                </div>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/manage-phase">
                <div>
                <ApartmentOutlined />
                  <span>Manage Phase</span>
                </div>
              </Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/manage-category">
                <div>
                <DeploymentUnitOutlined />
                  <span>Manage Category</span>
                </div>
              </Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/learning-targets">
                <div>
                <AimOutlined />
                  <span>Learning Targets</span>
                </div>
              </Link>
            </Menu.Item>
            <Menu.Item key="6">
          <Link to="/teams">
              <div>
              <TeamOutlined />
                <span>Teams </span>
              </div>
            </Link>
          </Menu.Item>
            <Menu.Item key="7">
            <Link to="/users-list">
              <div>
              <UnorderedListOutlined />
                <span>Users List </span>
              </div>
            </Link>
            
          </Menu.Item>

      
          {/* <Menu.Item key="8">
          <Link to="/settings">
              <div>
              <SettingOutlined />
                <span>Settings</span>
              </div>
            </Link>
          </Menu.Item> */}
           <Menu.Item key="8">
          <Link to="/CreateRoster">
              <div>
              <Icon type="schedule" />
                <span>Create Roster </span>
              </div>
            </Link>
          </Menu.Item> 

          <Menu.Item key="9">
          <Link to="/ManageRosters">
              <div>
              <Icon type="schedule" />
                <span>Manage Roster </span>
              </div>
            </Link>
          </Menu.Item> 
          <Menu.Item key="10">
          <Link to="/manage-sessions">
              <div>
              <Icon type="schedule" />
                <span>Manage School Years</span>
              </div>
            </Link>
          </Menu.Item> 
          <Menu.Item key="11">
          <Link to="/manage-tutorials">
              <div>
              <Icon type="schedule" />
                <span>Manage Tutorials</span>
              </div>
            </Link>
          </Menu.Item> 
    { role ==='superadmin' && <Menu.Item key="12">
          <Link to="/manage-schools">
              <div>
              <Icon type="schedule" />
                <span>Manage School </span>
              </div>
            </Link>
          </Menu.Item> }
          <Menu.Item key="13">
          <Link to="/Manage-Reports">
              <div>
              <Icon type="schedule" />
                <span>Reports</span>
              </div>
            </Link>
          </Menu.Item> 
           </Menu> 
        </>
    )
  }
}
export default AdminSidebar
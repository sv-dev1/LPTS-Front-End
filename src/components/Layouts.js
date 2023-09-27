import React, {Component, PropTypes} from 'react'
import {Route, Link, BrowserRouter as Router} from 'react-router-dom'
import HeaderDiv from '../Header/HeaderDiv'
import {Layout, Menu, Icon, Select} from 'antd'
import TeacherSidebar from './layout components/TeacherSidebar'
import AdminSidebar from './layout components/AdminSidebar'

import {
  TeamOutlined,
  SolutionOutlined,
  IdcardOutlined,
  SettingOutlined,
  BookOutlined,
  ApartmentOutlined,
  UnorderedListOutlined,
  AimOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons'
const {SubMenu} = Menu
const {Header, Sider, Content} = Layout

const {option, OptGroup} = Select

var user = JSON.parse(localStorage.getItem('user'))
var role = user && user?.role?.toLowerCase()

class Layouts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openKeys: '',
      collapsed: false,
    }
  }

  reportWindowSize = () => {
    //  console.log('window.innerWidth', window.innerWidth)
    if (window.innerWidth < 568 && !this.state.collapsed) {
      console.log(this.state)
      this.setState({
        collapsed: true,
      })
    } else if (this.state.collapsed) {
      this.setState({collapsed: false})
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.reportWindowSize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.reportWindowSize)
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
      <Layout className={`${this.props.classname}`}>
        <Sider
          trigger={null}
          collapsedWidth={0}
          collapsible
          collapsed={this.state.collapsed}
          width={250}
          style={{
            background: '#001529',
          }}
          className="sidebar-left"
          onCollapse={this.onCollapse}>
          <div className="logo" />

          {role === 'admin' || role === 'superadmin' ? (
            <AdminSidebar />
          ) : role === 'teacher' ? (
            <TeacherSidebar />
          ) : (
            ''
          )}
        </Sider>
        <Layout>
          <Header className="headerTop">
            <HeaderDiv />
            <Icon
              className="trigger layout-trigger header-toggle"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content
            style={{
              padding: '65px , 35px',
              minHeight: '100vh',
            }}
            className={
              this.state.collapsed ? 'collapsed mainContnet ' : 'mainContnet'
            }>
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}
export default Layouts

import React from 'react'
import {Route, Redirect, Link, BrowserRouter as Router} from 'react-router-dom'
import {Button, Col, Form, Input, Row, Checkbox, Spin, Icon} from 'antd'
import '../styles/authPage/login.css'
import logo from '../styles/authPage/images/logo.png'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LayoutLogin from '../components/LayoutLogin'
import GmailLogin from '../components/social Login/GmailLogin'
import {useSelector, useDispatch} from 'react-redux'
import {updateMyAccount, deleteMyAccount} from '../Slicers/myAccountSlice'
import {connect} from 'react-redux'
import {gapi} from 'gapi-script'
const clientId = process.env.REACT_APP_GOOGLE_LOGIN_KEY
toast.configure()

const antIcon = <Icon type="loading" style={{fontSize: 48}} spin />

class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      loggedIn: false,
      api: '',
      checked: false,
      loader: false,
    }
  }
  componentDidMount() {
    //console.log('enter')
    localStorage.clear();
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: 'profile email',
      })
    }
    gapi.load('client:auth', start)
  }
  toggeleCheckBox = e => {
    this.setState({checked: e.target.checked})
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({loader: true})
        console.log('values', values)
        this.login(values)
      }
    })
  }
  async login(data) {
    data.rememberMe = this.state.checked
    const postData = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    }
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/Auth/Login`,
      postData,
    )

    const jsonResponse = await response.json()
    console.log('jsonResponse', jsonResponse)
    console.log('statusCode', jsonResponse.StatusCode)
    if (jsonResponse.statusCode === 200) {
      this.setState({loggedIn: true})
      localStorage.setItem('user', JSON.stringify(jsonResponse.data))
      this.props.updateMyAccount(jsonResponse.data)
      this.setState({loader: false})
      if (jsonResponse.data.role.toLowerCase() === 'admin') {
        window.location.href = '/dashboard'
      } else if (jsonResponse.data.role.toLowerCase() === 'teacher') {
        window.location.href = '/ManageRosters'
      } else if (jsonResponse.data.role.toLowerCase() === 'student') {
        window.location.href = '/student-timeline'
      } else if (jsonResponse.data.role.toLowerCase() === 'superadmin') {
        window.location.href = '/school-select'
      } else {
        window.location.href = '/dashboard'
      }
    } else if (jsonResponse.statusCode === 404 || 400) {
      this.setState({loader: false})
      toast.error(
        'Invalid Email or Password',
        {position: toast.POSITION.TOP_CENTER},
        {autoClose: false},
      )
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form

    return (
      <div className="body-height">
        <div
          className="bg-white container-mw-100"
          style={{
            boxShadow: '0 0 16px grey',
            marginTop: '10px',
            borderRadius: '10px',
          }}>
          <Row className="d-flex flex-wrap">
            <Col md={12} sm={12} xs={24}>
              <div className="login-aside bg-blue ">
                <div className="login-head-section text-center">
                  <h2 className="heading-aside-h2 ">Welcome</h2>
                </div>
                <div className="welcome-img">
                  <img src={require('../static/images/login-bg-preview.png')} />
                </div>
              </div>
            </Col>
            <Col md={12} sm={12} xs={24}>
              <div className="parentlogin h-100">
                <div>
                  <div className="welcome-title text-center">
                    <h4>Hello ! Welcome back.</h4>
                    <p>
                      Login with your data that you entered during Your
                      registration.
                    </p>
                  </div>
                  <div className="form-group-container">
                    <Form
                      onSubmit={this.handleSubmit}
                      className="form-group-login">
                      <Form.Item label="Username">
                        {getFieldDecorator('username', {
                          rules: [
                            {
                              required: true,
                              message: 'Please input your username',
                            },
                          ],
                        })(
                          <Input placeholder="E-mail" className="input-box" />,
                        )}
                      </Form.Item>
                      <Form.Item label="Password" className="input-box svg-icon">
                        {getFieldDecorator('password', {
                          rules: [
                            {
                              required: true,
                              message: 'Please input your password!',
                            },
                          ],
                        })(<Input.Password placeholder="Password" />)}
                      </Form.Item>
                      {/* <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{
                          span: 16,
                        }}
                      >
                        <Checkbox onChange={this.toggeleCheckBox} checked={this.state.checked}>Remember me</Checkbox>
                      </Form.Item> */}
                      {/*  <div className='text-right forgot-link'>
                      Forgot Password
                    </div> */}
                      <Form.Item>
                        {this.state.loader ? (
                          <Spin
                            className="loader-icon-fixed"
                            indicator={antIcon}
                          />
                        ) : (
                          <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className="btn-bg-primary">
                            LOG-IN
                          </Button>
                        )}
                      </Form.Item>
                    </Form>
                    <GmailLogin />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

const WrappedNormalLoginForm = Form.create({name: 'normal_login'})(Login)

export default connect(null, {updateMyAccount})(WrappedNormalLoginForm)

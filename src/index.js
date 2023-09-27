import React from 'react'
import ReactDOM from 'react-dom'
import '../src/styles/global.scss'
import {Card, Row, Col} from 'antd'
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './index.scss'

//// import App from './App'
import Login from './pages/login'
import Register from './pages/register'

import Dashboard from './pages/Dashboard/Dashboard'
import ManageSubject from './pages/subjects/ManageSubject'
import Phase from './pages/phase/Phase'
import UserList from './pages/userList/UserList'
import LearningTarget from './pages/Learning target/LearningTarget'
import Category from './pages/category/Category'
import ManageTeams from './pages/teams/ManageTeam'
import FileUploadPage from './components/upload File/UploadFIle'
import ManageSettings from './pages/settings/ManageSettings'
import CreateRoster from './pages/Roster/CreateRoster'
import ManageRosters from './pages/Roster/ManageRosters'
import EditRoster from './pages/Roster/EditRoster'
import Proficiency from './pages/Roster/Proficiency/Proficiency'
import ProficiencyWithLayout from './pages/Roster/Proficiency/ProficiencyWithLayout'
import ProficiencyLevel from './pages/Roster/Proficiency/ProficiencyLevel'
import SystemSetting from './pages/system setting/SystemSetting'
import RosterDateRange from './pages/Roster/Date Range/RosterDateRange'
import TimlineWithLayout from './pages/Timeline/TimlineWithLayout'
import TimeLine from './pages/Timeline/TimeLine'
import SchoolSelect from './pages/SchoolSelect' ;
import ManageTutorials from './pages/Tutorials/ManageTutorials'
import EditSchoolWithLayout from './pages/School/EditSchoolWithLayout'
import Reports from './pages/Roster/Report/Reports'
import ViewReports from './pages/Roster/Report/ViewReport'


import {
  Route,
  Link,
  Redirect,
  Switch,
  BrowserRouter as Router,
} from 'react-router-dom'
import {store} from './store/store'
import {Provider} from 'react-redux'
import CreateDateRange from './pages/system setting/CreateDateRange'
// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

// roles Student  Parent Teacher Admin
var user = JSON.parse(localStorage.getItem('user'))
// console.log("users" , user)
var role = user && user.role?.toLowerCase()
// console.log("role" , role)

// serviceWorker.unregister();
const NoMatchPage = () => {
  return (
    <Row style={{marginTop: '20%'}}>
      <Col xs={{span: 12, offset: 6}}>
        <Card>
          <div className="card-body">
            <div className="d-flex flex-column align-items-center justify-content-center">
              <h2>Page not found</h2>
              {role === 'teacher' ? (
                <Link to="/ManageRosters">back to Manage Rosters</Link>
              ) : role === 'student' ? (
                <Link to="/student-timeline">back to timeline page</Link>
              ) : (
                <Link to="/dashboard">back to dashboard</Link>
              )}
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  )
}

const NoRoleMatches = () => {
  return (
    <Row style={{marginTop: '20%'}}>
      <Col xs={{span: 12, offset: 6}}>
        <Card>
          <div className="card-body">
            <div className="d-flex flex-column align-items-center justify-content-center">
              <h2>Page not found</h2>

              <Link to="/">back to Login</Link>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  )
}
const AdminRouting = () => {
  return (
    // user = JSON.parse(localStorage.getItem('user'))
    // condition1 ? true_expression1 : condition2 ? true_expression2 : else_expression2
    <>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/manage-phase" component={Phase} />
            <Route exact path="/CreateRoster" component={CreateRoster} />
            <Route exact path="/ManageRosters" component={ManageRosters} />
            <Route exact path="/Manage-Reports" component={Reports} />
            <Route exact path="/users-list" component={UserList} />
            <Route exact path="/manage-Subject" component={ManageSubject} />
            <Route exact path="/learning-targets" component={LearningTarget} />
            <Route exact path="/manage-category" component={Category} />
            <Route exact path="/teams" component={ManageTeams} />
            <Route exact path="/school-select" component={SchoolSelect} />
            <Route exact path="/proficiency-level" component={ProficiencyLevel} />
            <Route exact path="/proficiency" component={ProficiencyWithLayout} />
            <Route exact path="/manage-sessions" component={SystemSetting} />
            <Route exact path="/create-dateRange" component={CreateDateRange} />
            <Route exact path="/student-timeline" component={TimlineWithLayout} />
            <Route exact path="/manage-tutorials" component={ManageTutorials} />
            <Route exact path="/manage-schools" component={EditSchoolWithLayout} />
            <Route exact path="/view-reports" component={ViewReports} />
            <Route path="*" component={NoMatchPage} />
          </Switch>
        </Router>
      </Provider>
    </>
  )
}
const StudentRouting = () => {
  return (
    // user = JSON.parse(localStorage.getItem('user'))
    // condition1 ? true_expression1 : condition2 ? true_expression2 : else_expression2
    <>
      <Provider store={store}>
        <Router>
          <Switch>
            {/*  <Route exact path="/dashboard" component={Dashboard} /> */}
            <Route exact path="/" component={Login} />
            <Route excat path="/student-timeline" component={TimeLine} />
            <Route path="*" component={NoMatchPage} />
          </Switch>
        </Router>
      </Provider>
    </>
  )
}

const ParentRouting = () => {
  return (
    // user = JSON.parse(localStorage.getItem('user'))
    // condition1 ? true_expression1 : condition2 ? true_expression2 : else_expression2
    <>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/" component={Login} />

            <Route path="*" component={NoMatchPage} />
          </Switch>
        </Router>
      </Provider>
    </>
  )
}
const TeacherRouting = () => {
  return (
    // user = JSON.parse(localStorage.getItem('user'))
    // condition1 ? true_expression1 : condition2 ? true_expression2 : else_expression2
    <>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/ManageRosters" component={ManageRosters} />
            <Route exact path="/CreateRoster" component={CreateRoster} />
            <Route
              exact
              path="/proficiency-level"
              component={ProficiencyLevel}
            />
            <Route
              exact
              path="/proficiency"
              component={ProficiencyWithLayout}
            />
            <Route
              excat
              path="/student-timeline"
              component={TimlineWithLayout}
            />
            <Route path="*" component={NoMatchPage} />
          </Switch>
        </Router>
      </Provider>
    </>
  )
}

const CommonRouting = () => {
  return (
    // user = JSON.parse(localStorage.getItem('user'))
    // condition1 ? true_expression1 : condition2 ? true_expression2 : else_expression2
    <>
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="*" component={NoRoleMatches} />
          </Switch>
        </Router>
      </Provider>
    </>
  )
}

ReactDOM.render(
  role === 'admin' || role === 'superadmin' ? (
    <AdminRouting />
  ) : role === 'teacher' ? (
    <TeacherRouting />
  ) : role === 'parent' ? (
    <ParentRouting />
  ) : role === 'student' ? (
    <StudentRouting />
  ) : (
    <CommonRouting />
  ),
  document.getElementById('root'),
)

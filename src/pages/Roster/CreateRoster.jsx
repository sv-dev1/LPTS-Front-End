import Layouts from '../../components/Layouts'
import React, {useState, useEffect} from 'react'
import CreateRosterCompoenet from './CreateRosterCompoenet'
import EditRoster from './EditRoster'
import {useLocation, useHistory} from 'react-router-dom'
import {LeftOutlined} from '@ant-design/icons'

import {Col, Row, Input, Button, Table, Spin} from 'antd'

const baseUrl = process.env.REACT_APP_BASE_URL
// let id = 15;
const CreateRoster = props => {
  const {Search} = Input
  const history = useHistory()
  const [studentsList, setstudentList] = useState([])
  const [filteredStudentList, setFilteredStudentList] = useState([])

  const [columns, setColumns] = useState([])
  const [studentIdCount, setStudentIdCount] = useState(0)
  const [showTable, setShowTable] = useState(true)
  const location = useLocation()
  let rosterId = ''
  let olderRosterId = ''
  if (props.location.state && props.location.state.rosterId) {
    rosterId = props.location.state.rosterId
  }
  if (props.location.state && props.location.state.olderRosterId) {
    olderRosterId = props.location.state.olderRosterId
  }

  const handleTable = (students, columns, showtable) => {
    setColumns(columns)
    setstudentList([...students])
    setFilteredStudentList([...students])
    showtable && setShowTable(showtable)
  }

  const onSearch = value => {
    const searchRes = studentsList.filter(
      o =>
        Object.keys(o.firstName).some(k =>
          String(o.firstName[k]).toLowerCase().includes(value.toLowerCase()),
        ) ||
        Object.keys(o).some(k =>
          String(o[k]).toLowerCase().includes(value.toLowerCase()),
        ),
    )
    setFilteredStudentList([...searchRes])
  }

  const handleStudentList = students => {
    setstudentList([...students])
    setFilteredStudentList([...students])
  }

  return (
    <>
      <Layouts title="assets" className="dashboard">
        {rosterId && (
          <Button
            className="Add-btn-top"
            type="primary"
            onClick={() => history.goBack()}>
            <LeftOutlined /> Back
          </Button>
        )}
        <div className="border-bx">
          <Row>
            <div className="dash-bg-white bg-blue-dark">
              <Col xs={12} sm={20} md={24} lg={12}>
                <div className="section-top-heading">
                  <h3
                    style={{
                      color: '#fff',
                      fontWeight: '600',
                      fontSize: '20px',
                    }}>
                    {' '}
                    Create Roster{' '}
                  </h3>
                </div>
              </Col>
            </div>
          </Row>
          <Row>
            <Col xs={24} sm={12} md={24} lg={24}>
              <div className="px-2 CreateRosterform">
                {rosterId !== '' ? (
                  <EditRoster
                    handleTable={handleTable}
                    rosterId={rosterId}
                    handleStudentList={handleStudentList}
                  />
                ) : (
                  <CreateRosterCompoenet
                    handleTable={handleTable}
                    handleStudentList={handleStudentList}
                    olderRosterId={olderRosterId}
                  />
                )}
              </div>
            </Col>
            <Col xs={24} sm={12} md={24} lg={24}>
              {(studentsList.length > 0 || showTable) && (
                <>
                  {studentsList.length > 0 && (
                    <div>
                      <Search
                        className="search-input create-roaster-search"
                        placeholder="Input search text"
                        onChange={e => onSearch(e.target.value)}
                      />
                      <div className="px-2">
                        <div className="table-grid-bx">
                          <Table
                            columns={columns}
                            dataSource={filteredStudentList}
                            loading={{
                              indicator: (
                                <div>
                                  <Spin />
                                </div>
                              ),
                              spinning:
                                filteredStudentList?.length === 0
                                  ? true
                                  : false,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Col>
          </Row>
        </div>
      </Layouts>
    </>
  )
}

export default CreateRoster

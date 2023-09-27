import React, {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import isJwtTokenExpired from 'jwt-check-expiry'
import Layouts from '../../components/Layouts'
import TimeLine from './TimeLine'
import {
  Form,
  Col,
  Select,
  Row,
  Icon,
  Input,
  Tooltip,
  Button,
  Modal,
  Popconfirm,
  Table,
  Tag,
  Checkbox,
  Space,
  message,
} from 'antd'
import {LeftOutlined} from '@ant-design/icons'

export default function TimlineWithLayout() {
  const history = useHistory()
  return (
    <>
      <Layouts title="assets" className="dashboard">
        <div className="dash-bg-white">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={24} md={24} lg={12}>
              <div className="section-top-heading">
                <h3
                  style={{
                    color: '#0C1362',
                    fontWeight: '600',
                    fontSize: '20px',
                  }}>
                  {' '}
                  Student Proficiency Timeline
                </h3>
              </div>
            </Col>
            <Col xs={10} sm={24} md={24} lg={8}>
              <Row gutter={[16, 16]}>
                <Col xs={10} sm={24} md={24} lg={20}>
                  <div className="section-top-heading"></div>
                </Col>
                <Col xs={10} sm={20} md={24} lg={4}>
                  <Button
                    className="Add-btn-top"
                    type="primary"
                    onClick={() => history.goBack()}>
                    <LeftOutlined /> Back
                  </Button>{' '}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <TimeLine />
      </Layouts>
    </>
  )
}

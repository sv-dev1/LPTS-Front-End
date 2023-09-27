import Layouts from '../../components/Layouts'
import React, { useState, useEffect } from 'react'
import AddSettingForm from './AddSettingForm'

import {
    EditOutlined,
    DeleteOutlined,
    CloseOutlined,
    EyeOutlined,
} from '@ant-design/icons'
import {
    Form,
    Col,
    Select,
    Row,
    Input,
    Tooltip,
    Button,
    Modal,
    Popconfirm,
    Table, Tag, Checkbox,
} from 'antd'

const baseUrl = process.env.REACT_APP_BASE_URL

const Settings = () => {
    return (
        <>
            <Layouts title="assets" className="dashboard">
                <div className="dash-bg-white bg-blue-light">
                    <Row gutter={[16, 16]}>
                        <Col xs={12} sm={24} md={24} lg={12}>
                            <div className="section-top-heading">
                                <h3
                                    style={{
                                        color: '#0C1362',
                                        fontWeight: '600',
                                        fontSize: '20px',
                                    }}>
                                    {' '}Add Settings{' '}
                                </h3>
                            </div>
                        </Col>
                    </Row>
                </div>
                <AddSettingForm />
            </Layouts>
        </>
    )
}

export default Settings;
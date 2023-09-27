import React, { useState } from 'react'
import ReactDOM from 'react-dom';

import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd'
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
const { SubMenu } = Menu
const { Header, Sider, Content } = Layout


const TeacherSidebar = (props) => {
    const [openKeys, setOpenKeys] = useState('')
    var rootSubmenuKeys = ['sub1', 'sub2', 'sub4', 'sub5', 'sub3', 'sub6']

    const onOpenChange = openKey => {
        const latestOpenKey = openKey.find(
            key => openKeys.indexOf(key) === -1,
        )
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys({ openKeys })
        } else {
            setOpenKeys({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            })
        }
    }
    var active = props.active
    return (
        <>
            <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={[active]}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
            // mode="vertical"
            >



                <Menu.Item key="1">
                    <Link to="/ManageRosters">
                        <div>
                        <Icon type="schedule" />
                            <span>Manage Roster </span>
                        </div>
                    </Link>
                </Menu.Item>
                <Menu.Item key="2">
                    <Link to="/CreateRoster">
                        <div>
                        <Icon type="schedule" />
                            <span>Create Roster </span>
                        </div>
                    </Link>
                </Menu.Item>
            </Menu>
        </>
    )
}

export default TeacherSidebar;
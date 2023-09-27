import Layouts from '../../components/Layouts'
import EditSchool from './EditSchool';
import React from 'react'
import { useHistory } from "react-router-dom";
import {
  Button
} from 'antd'

import { LeftOutlined } from '@ant-design/icons'
function EditSchoolWithLayout() {

  const history = useHistory();

  return (
    <>
      < Layouts title="assets" className="dashboard">
        <Button
          className="Add-btn-top"
          type="primary"
          onClick={() => history.goBack()}  >
          <LeftOutlined /> Back
        </Button>{' '}
        <br></br>
        <EditSchool />
      </Layouts>
    </>
  )
}

export default EditSchoolWithLayout

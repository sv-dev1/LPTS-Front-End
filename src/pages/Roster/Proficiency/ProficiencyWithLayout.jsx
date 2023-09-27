import React from 'react'
import Layouts from '../../../components/Layouts'
import Proficiency from './Proficiency'
import { useHistory } from "react-router-dom";
import {
  Button
} from 'antd'

import { LeftOutlined } from '@ant-design/icons'
function ProficiencyWithLayout() {

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
        <Proficiency />
      </Layouts>
    </>
  )
}

export default ProficiencyWithLayout

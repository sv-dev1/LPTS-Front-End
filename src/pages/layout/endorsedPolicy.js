import * as React from 'react'
import Layouts from '../../components/Layouts'
import {Row, Col, Card, Button} from 'antd'

import WrappedEndoresePolicy from '../../components/grid/EndoresePolicy'

class endoresedPolicy extends React.Component {
  render() {
    return (
      <Layouts title="assets" classname="grid">
        <Row gutter={16}>
          <Col xs={24} lg={24}>
            <Card bordered={false}>
              <WrappedEndoresePolicy />
            </Card>
          </Col>
        </Row>
      </Layouts>
    )
  }
}

export default endoresedPolicy

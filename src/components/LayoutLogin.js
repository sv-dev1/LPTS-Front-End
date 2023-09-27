import React from 'react'
import {Layout, Menu, Icon} from 'antd'
import family from '../styles/authPage/images/family.png'
import {Button, Col, Form, Input, Row} from 'antd'

class LayoutLogin extends React.Component {
  render() {
    // const classname = (this.props, "classname", " ");
    return (
      <Col md={12} sm={12} xs={24} className="aside_image">
        <div className="image-aside flex items-center justify-center bg-blue h-full w-full">
          <div className="img-wrapper">
            <img src={family} alt="Outrisk" />
          </div>
        </div>
      </Col>
    )
  }
}
export default LayoutLogin

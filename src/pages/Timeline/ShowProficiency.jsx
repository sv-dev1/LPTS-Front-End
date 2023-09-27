import { Modal, Button } from 'antd';
import React, { useEffect, useState } from 'react'
// import CreatePhase from './CreatePhase'
import Proficiency  from '../Roster/Proficiency/Proficiency';
import {
  PlusOutlined
} from '@ant-design/icons'

import {
  message
} from 'antd'


const ShowProficiency = (props) => {
var width = 1000;
//debugger
console.log("Show Proficiency ---" , props)
  const [visible, setVisible] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [modalText, setModalText] = React.useState('thsis cont')
  const [mergedData, setMergedData] = useState('')
  const [expandProgressions, setExpandProgressions] = useState('')
//console.log("Props---2@" , props ,mergedData)
  const showModal = () => {
    setVisible(true);
  };
useEffect(()=>{
setExpandProgressions(props?.expandProgressions)
},[props?.expandProgressions])
  const handleOk = () => {
    setModalText("this");
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 5000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };

  const showAlert = ()=>{
    message.info(`Please Expand Learning Targets to View & Update!`)
  }

  const getClass = ()=>{
    if(true){
      return "process-count";
    }
  }

  useEffect(() => {
    let myData = props.proficiencyData
    console.log('myData------', myData)
    setMergedData({
      ...myData,
      learningTarget: props.learningTarget,
      status: props.status,
      rosterId: props.rosterId,
    })
  }, [props.learningTarget, props.proficiencyData, props.rosterId])

  return (
    <>
       <li className={getClass()} type="primary" onClick={expandProgressions?  showModal:showAlert}>
         {props.learningTarget}
      </li>
      <Modal      
        visible={visible}
        onOk={handleOk}
        width= {parseInt(width)}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
       {mergedData &&  <Proficiency updateTimeLineData={props.updateTimeLineData} data={mergedData} />}
      </Modal>
    </>
  );
};

export default ShowProficiency;
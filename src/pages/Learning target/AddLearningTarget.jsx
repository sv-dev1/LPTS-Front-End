import { Modal, Button } from 'antd';
import React from 'react'
import CreateLearningTarget from './CreateLearningTarget'
import {
  PlusOutlined,
  UploadOutlined
} from '@ant-design/icons'
const AddLearningTarget = (props) => {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [modalText, setModalText] = React.useState("thsis cont");

  const showModal = () => {
    setVisible(true);
  };

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

  return (
    <>
      <Button className="Add-btn-top" type="primary" onClick={showModal}>
         <PlusOutlined />Add
      </Button>
     
      <Modal
        title="Add New Learning Target"
        visible={visible}
        onOk={handleOk}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <CreateLearningTarget handleOk={props.handleOk} updateLearningTargetList={props.updateLearningTargetList} />
      </Modal>
    </>
  );
};

export default AddLearningTarget;
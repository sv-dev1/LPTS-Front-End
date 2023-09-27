import { Modal, Button } from 'antd';
import React from 'react'
import CreateUser from './CreateUser'
import {
  PlusOutlined
} from '@ant-design/icons'
const AddUser = (props) => {
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
        title="Add New User"
        visible={visible}
        onOk={handleOk}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <CreateUser addNewUserInList={props.addNewUserInList}/>
      </Modal>
    </>
  );
};

export default AddUser;
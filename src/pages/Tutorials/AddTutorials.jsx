import { Modal, Button } from 'antd';
import React from 'react'
// import {useSelector , useDispatch } from 'react-redux';
import CreateTutorialsForm from './CreateTutorialsForm'
import {
  PlusOutlined
} from '@ant-design/icons'
const AddTutorials = (props) => {
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
    }, 3000);
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
        title="Add New Tutorial"
        visible={visible}
        onOk={handleOk}
        footer={null}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
      <CreateTutorialsForm handleOk={handleOk} updateTutorials= {props.updateTutorials} />
      </Modal>
    </>
  );
};

export default AddTutorials;
import { Modal, Button } from 'antd';
import React from 'react'
import UploadFIle from '../../components/upload File/UploadFIle'
import {
  PlusOutlined,
  UploadOutlined
} from '@ant-design/icons'
const UploadLearningTarget = (props) => {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [modalText, setModalText] = React.useState("thsis cont");
 var width = 900
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
      <Button className="Add-btn-top-upload" style={{marginTop: "15px"}} type="primary" onClick={()=>showModal()}>
           <UploadOutlined />Upload
      </Button>
      <Modal
        title="Upload Learning Target"
        visible={visible}
        onOk={handleOk}
        footer={null}
        width= {parseInt(width)}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <UploadFIle ClosePopUp={props.ClosePopUp} updateLearningTargetList={props.updateLearningTargetList} />
      </Modal>
    </>
  );
};

export default UploadLearningTarget;
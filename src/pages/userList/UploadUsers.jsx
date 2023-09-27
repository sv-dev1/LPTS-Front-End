import { Modal, Button ,Tag } from 'antd';
import React from 'react'
import UploadFIle from '../../components/upload File/UploadFiles'
import {
  PlusOutlined,
  UploadOutlined
} from '@ant-design/icons'
const UploadLearningTarget = (props) => {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [modalText, setModalText] = React.useState("thsis cont");
 const user = JSON.parse(localStorage.getItem('user'));
 const schoolID = user.schoolId;

  const FileTypeErrorMessaage = 'Select an excel file type only.'
  let Columns = [
    {
      title: 'Name',
      dataIndex: "fullname",
      render: (text, record) => (
           <span>{record.firstName} {record.lastName}</span>
    )
    },
    {
      title: 'Email',
      dataIndex: 'email',
   
      
    },
    {
      title: 'Team',
      dataIndex: 'team',
       render: (text, record) => record.team && <Tag key={text} color="#40a9ff">
                             {record.team}
                        </Tag>
        
    },
    {
      title: 'Student ID',
      dataIndex: 'studentId',
    },
    {
      title: 'Role',
      dataIndex: 'roleName',
       render: role =>  <Tag key={role}>
                            {role && role.toUpperCase()}
                        </Tag>
        
    },
    {
      title: 'Year',
      dataIndex: 'year',
      render: year => <p>{year ? year : ''}</p>
    },
  ];
  const FileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const EndPointUrl = `/Users/Upload?schoolId=${parseInt(schoolID)}`

let data = {
  FileTypeErrorMessaage,
  Columns,
  FileType,
  EndPointUrl
}
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


  // send by props
    // FileTypeErrorMessaage
    //Columns
    //FileType
    // updateList
    // EndPointUrl
    // ClosePopUp
  return (
    <>
      <Button className="Add-btn-top-upload" style={{marginTop: "15px"}} type="primary" onClick={()=>showModal()}>
           <UploadOutlined />Upload
      </Button>
      <Modal
        title="Upload Users List"
        visible={visible}
        onOk={handleOk}
        footer={null}
        width= {parseInt(width)}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <UploadFIle Data={data} updateData={props.updateData} ClosePopUp={props.ClosePopUp}  />
      </Modal>
    </>
  );
};

export default UploadLearningTarget;
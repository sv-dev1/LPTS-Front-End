import React, { useState } from 'react';
import {
    Spin,
    Icon,
    message,
    Alert,
    Button,
    Table
    , Row, Col, Tag
} from 'antd'
import { useSelector, useDispatch } from 'react-redux';
import { AntDesignOutlined } from '@ant-design/icons';
import axios from "axios";
const baseUrl = process.env.REACT_APP_BASE_URL;

function UploadFiles(props) {
    
 
    //props data
    // FileTypeErrorMessaage
    //Columns
    //FileType
    // updateList
    // EndPointUrl
    // ClosePopUp
    const [selectedFile, setSelectedFile] = useState();
    const [isSelected, setIsSelected] = useState(false);
    const [columns, setColumns] = useState(props.Data.Columns);
    const [Message, setMessage] = useState({ error: "", info: "" })
    const [loading, setLoading] = useState(false)
    const [filterTable, setFilterTable] = useState([])
    var myAccount = JSON.parse(localStorage.getItem('user'))
    const schoolID = myAccount.schoolId;
    let headers = { "Content-Type": "application/json" };
    var token = myAccount.token;
    console.log("token", token)

console.log("columns" , columns)



    const changeHandler = (event) => {
        if (event.target.files[0].type === props.Data.FileType) {
            setMessage({ error: "" })
            setSelectedFile(event.target.files[0]);
            console.log(event.target.files[0])
            setIsSelected(true);
        } else {
            setSelectedFile('')
            setMessage({ error: "Plase upload excel file type " })
        }
    };

    // for exiting data 
    const handleSubmitForExitng = () => {
        //setLoading(true)
       
      //      console.log("data ", data)
        //     let { id, categoryId, learningTarget } = data;
        //    // let iCanStatement = data.iCanNew
        //    // let inputs = { id, categoryId, learningTarget, iCanStatement }
            const requestMetadata = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(filterTable),
            }
            console.log("requestMetadata", requestMetadata)
            fetch(`${baseUrl}/Users/Update?schoolId=${parseInt(schoolID)}`, requestMetadata)
                .then(res => res.json())
                .then(data => {

                    // if(data.data.statusCode === 200) {
                        message.success('Users data is updated successfully !!');
                        setSelectedFile('')
                        props.updateData()
                        props.ClosePopUp()
                        setFilterTable([])

                    //   } else{
                    //  	message.info(data.data.message)
                    //   } 


                    //	console.log("target", data.data)
                })
  

       
     
        //setSelectedFile()
      //  props.updateList();
        setMessage({ info: "" })
        //	props.handleOk()
        //	setLoading(false)
    }

    const handleSubmission = async () => {
        //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
        if (selectedFile) {
            if (selectedFile.type === props.Data.FileType) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                //debugger
                try {
                    const res = await axios.post(`${baseUrl}${props.Data.EndPointUrl}`, formData, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                    });
                  //  debugger
                    console.log(res.data);
                    if (res.data.statusCode === 208) {
                        props.updateData()
                        setFilterTable([...res.data.data.newData])
                        setMessage({ info: res.data.message })

                    } else if (res.data.statusCode === 200) {
                        //setFilterTable([...res.data.data])
                        props.updateData()
                        setSelectedFile('')
                        message.success(res.data.message)
                    } else {
                        message.info(res.data.message)
                    }
                    //	console.log("dta" ,jsonINData) 
                } catch (error) {
                    console.log(error);
                }
            } else {
                setSelectedFile()
                setMessage({ error: "Plase upload excel file type " })
            }
        }
    };

    const handleCancel = () => {
        setFilterTable([])
        setMessage({ info: "" })
        setSelectedFile('')
        props.ClosePopUp()
    }


    return (
        <div>
            {filterTable.length === 0 ? <input type="file" name="file" onChange={changeHandler} /> : ""}
            {isSelected ? (
                <div>
                    <p>Filename: {selectedFile.name}</p>
                    {/* <p>Filetype: {selectedFile.type}</p>
					<p>Size in bytes: {selectedFile.size}</p>
					<p>
						lastModifiedDate:{' '}
						{selectedFile.lastModifiedDate.toLocaleDateString()}
					</p> */}
                </div>
            ) : (
                <p>{props.Data.FileTypeErrorMessaage}</p>
            )}

            {Message.info ? (<div style={{
                display: "flex",
                alignItems: "center"
            }}>
                <Row>
                    <Col xs={24} sm={24} md={18} lg={20}><p className="para-warning">{Message.info}</p></Col>
                     <Col xs={24} sm={24} md={3} lg={4}><Button type="primary" style={{ marginRight: "20px" }} onClick={handleSubmitForExitng}>
                        Yes
                    </Button>
        <Button type="primary" onClick={handleCancel} >NO</Button></Col> 
                </Row>



            </div>

            ) : ""}


            {filterTable.length === 0 ? (<div>
                <button onClick={handleSubmission}>Submit</button>
            </div>) : ""}
            {Message.error ? (<Alert
                description={Message.error ? Message.error : Message.warning}
                type={Message.error ? "error" : "warning"}

            />) : ""}

            {filterTable.length > 0 ? (<div className="table-grid-bx">
                <Table columns={columns} dataSource={filterTable}  rowKey="id" />

            </div>) : ""
            }
        </div>

    )
}

export default UploadFiles;
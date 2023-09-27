import React, {useState} from 'react';
import {
	Spin, 
	Icon ,
	message,
	Alert,
	Button,
	Table
	,Row,Col
  } from 'antd'
import { useSelector, useDispatch } from 'react-redux';
import { AntDesignOutlined } from '@ant-design/icons';
import axios from "axios";
const baseUrl = process.env.REACT_APP_BASE_URL ;



const antIcon = <Icon type="loading" style={{ fontSize: 48 }} spin />;
function FileUploadPage(props){
	const [selectedFile, setSelectedFile] = useState();
	const [isSelected, setIsSelected] = useState(false);
	const [Message , setMessage] = useState({error:"" ,info:""})
	const [loading , setLoading] = useState(false)
	const [filterTable , setFilterTable] = useState([])
	const [loader, setLoader] = useState(false);
	var myAccount = JSON.parse(localStorage.getItem('user'))
	  const schoolID = myAccount.schoolId;
  let headers = {"Content-Type": "application/json"};
  var token = myAccount.token ;
  console.log("token" ,token )
  


  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subjectName',
      key: 'subject',
      
    },
    {
      title: 'Phase',
      dataIndex: 'phaseName',
      key: 'phase',
    },
    {
      title: 'Category',
      dataIndex: "categoryName",
      key: 'category',
    
    },
    {
      title: 'Learning Target',
      dataIndex: 'learningTarget',
      key: 'learningTarget',
      defaultSortOrder: 'descend',
    
        
    },
    {
      title: 'I Can Statement',
      dataIndex: 'iCanOld',
      key: 'ican',
      width: 350,
    
     
    },
   
    
  ];

	const changeHandler = (event) => {
	if(event.target.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
		setMessage({error:""})
		setSelectedFile(event.target.files[0]);
		console.log(event.target.files[0])
		setIsSelected(true);
	}else {
		setSelectedFile()
		setMessage({error:"Plase upload excel file type "})
	}
	};

	// for exiting data 
	const handleSubmitForExitng =()=>{
		//setLoading(true)
		filterTable.map((data, index)=>{
			console.log("data " , data)
			let {	id, categoryId, learningTarget } = data;
			let iCanStatement = data.iCanNew
			let inputs = {id, categoryId, learningTarget , iCanStatement}
			inputs.schoolId = schoolID;
			const requestMetadata = {
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json',
				  'Authorization': `Bearer ${token}`, 
				},
				body: JSON.stringify(inputs),
			  }
		console.log("requestMetadata"  , requestMetadata)
			  fetch(`${baseUrl}/Progressions/Save`, requestMetadata)
			  .then(res => res.json())
			  .then(data => {
				
				//if(data.data.statusCode === 200) {
					//message.success('Learning target is added successfully !!')
					filterTable.shift();
					setFilterTable([...filterTable])
					
				//  } else{
				// 	message.info(data.data.message)
				//  } 
			
				
			//	console.log("target", data.data)
			  })
			}
			
		)
		message.success('Learning target is added successfully !!')
		//setSelectedFile()
		props.updateLearningTargetList();
		setMessage({info:""})
	//	props.handleOk()
	//	setLoading(false)
	}

	const handleSubmission = async() => {
//application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
	if(selectedFile){
		if( selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
			const formData = new FormData();
			formData.append("file", selectedFile);
			//debugger
			try {
				setLoader(true);
				
			  const res = await axios.post(`${baseUrl}/Progressions/ImportProgression?schoolId=${parseInt(schoolID)}`, formData ,{ headers: {
				'Authorization': `Bearer ${token}`
			  },});
			  console.log(res.data);
			 if(res.data.statusCode === 208) {
				setFilterTable([...res.data.data])
				setMessage({info:res.data.message})
				props.updateLearningTargetList();
			 } else if(res.data.statusCode === 200){
				props.updateLearningTargetList();
				message.success(res.data.message)
			 } else{
				props.updateLearningTargetList();
				message.info(res.data.message)
			 }
		//	console.log("dta" ,jsonINData) 
			} catch (error) {
			  console.log(error);
			}
	}else {
		setSelectedFile('')
		setMessage({error:"Plase upload excel file type "})
	}
	}
	setLoader(false);
	};

	const handleCancel = ()=>{
		setFilterTable([])
		setMessage({info:""})
		setSelectedFile('')
		props.ClosePopUp()
	}


	return(
   <div>
			{filterTable.length ===0 ? <input type="file" name="file" onChange={changeHandler} /> : ""}
			{isSelected   ? (
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
				 <p>Select an excel file type only.</p> 
			)}

	{	Message.info ?	(<div style={{display:"flex",
    alignItems: "center"}}>
	<Row>
		<Col xs={24} sm={24} md={18} lg={20}><p className="para-warning">{Message.info}</p></Col>
		<Col xs={24} sm={24} md={3} lg={4}><Button type="primary" style={{marginRight:"20px"}}  onClick={handleSubmitForExitng}>
					Yes
     			   </Button>
		<Button type="primary" onClick={handleCancel} >NO</Button></Col>
	</Row>
			
				
			
		</div> 
		
		) :""}
		{loader ? <Spin className="loader-icon-fixed" indicator={antIcon} /> :""}


			{filterTable.length ===0 ? (	<div>
				<button onClick={handleSubmission}>Submit</button>
			</div>) :  ""}
			{ Message.error ?( <Alert
            description={Message.error ? Message.error : Message.warning }
            type={Message.error ? "error" : "warning"}
           
         />) : "" }

		{filterTable.length > 0 ? ( <div className="table-grid-bx">
   	 			<Table columns={columns} dataSource={filterTable} rowKey='id' />
					
  		 </div> ) : ""
		   }
		</div>
		
	)
}

export default FileUploadPage;
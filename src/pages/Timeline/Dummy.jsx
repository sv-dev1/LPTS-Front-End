import React , {useState ,useEffect} from 'react'
import {useSelector , useDispatch } from 'react-redux';
import { Link, useHistory ,useLocation } from "react-router-dom";
import useScript from '../../hooks/custom hooks/UseScript'
import './assets/css/style.css';
import './assets/css/bootstrap.min.css';
 import './assets/css/icofont.min.css';
 import {
  PlusOutlined
} from '@ant-design/icons'
import Layouts from '../../components/Layouts'
import isJwtTokenExpired from 'jwt-check-expiry';

import {
  Form,
  Col,
  Select,
  Row,
  Input,
  Tooltip,
  Button,
  Modal,
  Popconfirm,
  Table,
  Tag,
  message,
  Icon
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  EyeOutlined,
} from '@ant-design/icons'

const baseUrl = process.env.REACT_APP_BASE_URL


const StudentProficiency = (props) => {
  useScript('https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js')
  useScript('https://code.jquery.com/jquery-1.12.4.min.js')
 useScript('assets/js/bootstrap.bundle.min.js')
  useScript('assets/js/toggleScript.js')
  const history = useHistory()
  const { Search } = Input;
  const [data , setData] = useState('');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idForVisibleModel , setIdForVisibleModel] = useState(0);
  const [sLength , setSLength] = useState(0);
  const [pLength , setPLength] = useState(0);
  const [cLength , setCLength] = useState(0);
  const [openedAccordance , setOpenedAccordance] = useState([0]);
  const [searchKey , setSearchKey] = useState('')
  const [filterTable , setFilterTable] = useState([]);
  var myAccount = JSON.parse(localStorage.getItem('user'))
  const location = useLocation()
  if(myAccount.role.toLowerCase() === 'student'){
    var studentId = myAccount.userId;
  }
  if(location.state){
    var { studentId} = location.state;
  }else {
    if(myAccount.role.toLowerCase() !== 'student'){
    var { studentId } = props.location.state
  }
  }
  
  //console.log("myAccount" , myAccount)
  const dispatch = useDispatch();
  var user = JSON.parse(localStorage.getItem('user')) ;
  const token =  user.token;
  const schoolID = user.schoolId
  if(user){
    var isExpired = isJwtTokenExpired(user.token)
   
    if(isExpired){
    
      message.info('Your session is expired .Please Login again.')
      history.replace({ pathname: '/', state: { isActive: true } })
    }
  }else{
    
    message.info('Your session is expired .Please Login again.')
    history.replace({ pathname: '/', state: { isActive: true } })
  }

const fetctData = ()=>{
 
  }


  // useEffects
  useEffect(()=>{
    fetctData();
  })



  const handleChangePhase = (key)=>{
    setPLength(key);
  }
   

  const handleChangeCategories = (key)=>{
    setCLength(key);
  }

 // "nav-link active"
  const classNameValue = (key) =>{
    if(pLength === key ){
      return "nav-link active";
    }
    return "nav-link";
  }



  // open Accordance
  const dataExpend = (key) =>{
    let isValue = openedAccordance.find(element => element === key);
    if(isValue ){
      return "true";
    }
    return "false";
  }

  // accordion-button collapsed
  const dataExpendClass = (key) =>{
    let isValue = openedAccordance.find(element => element === key);
    if(isValue ){
      return "accordion-button";
    }
    return "accordion-button collapsed";
  }
  const openAccordance = (key) =>{
    let m = openedAccordance.filter((d)=>  key !== d);
    if(openedAccordance.length != m.length){
      setOpenedAccordance([...m])
      setSLength(0);
      setPLength(0);
      setCLength(0)
    }else{
      setOpenedAccordance([...m , key])
    }
  }

  //accordion-collapse collapse show
  const dataExpendClassShow = (key) =>{
    let isValue = openedAccordance.find(element => element === key);
    if(isValue ){
      return "accordion-collapse collapse show";
    }
    return "accordion-collapse collapse ";
  }
  return (
    <>
   

  <head>
  
  </head>
	<body id="body-pd" class="body-pd timeline-page p-0">
		<header class="header shadow-sm body-pd bg-white" id="header">
			<div class="header_toggle"> <i class='bx bx-menu bx-x' id="header-toggle"></i> </div>
			<div class="header_img d-flex">
			   <img src="https://i.imgur.com/hczKIze.jpg" class="rounded-circle" alt="" />
			   <div class="ms-2 user-item-desc">
					<span class="user-name"></span><br />
					<span class="user-sub-title">Administrator</span>
				</div>
			</div>
		</header>
		<div class="l-navbar show-sidebar" id="nav-bar">
		
		</div>
	
		<div class="height-100 py-4">
			<div class="bg-white border shadow-sm rounded overflow-hidden p-1">
			   <div class="student-block-details position-relative ps-5">
			       <span class="student-icon">
				       <i class="icofont-ui-user"></i>
				   </span>
				   <div class="p-2">
					  <h5>Student Name: Mary</h5>
				   </div>
			   </div>
			</div>
			
			<div class="student-data-section mt-4">
			    <div class="accordion" id="accordionExample">
					  <div class="accordion-item shadow-sm">
						<h2 class="accordion-header" id="headingOne">
						  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Subject Name: Math	</button>
						</h2>
						<div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
						  <div class="accordion-body">
							  <div class="dash-tabs-box">
							      <nav>
									  <div class="nav nav-tabs" id="nav-tab" role="tablist">
										<button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Phase 1</button>
										<button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Phase 2</button>
										<button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Phase 3</button>
									  </div>
									</nav>
									<div class="tab-content" id="nav-tabContent">
									  <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
									      <div class="subject-list mb-3">
										      <ul class="list-inline">
											      <li class="list-inline-item me-1 me-md-4"><a href="javascript:void(0);" id="ReadinessLink" class="active">Readiness</a></li>
											      <li class="list-inline-item me-1 me-md-4"><a href="javascript:void(0);" id="GeometryLink">Geometry</a></li>
											      <li class="list-inline-item me-0 me-md-4"><a href="javascript:void(0);" id="AlgebraicLink">Algebraic</a></li>
											  </ul>
										  </div>
										  <div id="ReadinessIDSection">
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">100</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed pi rounded">
														  <ul class="process mb-3">
																<li class="process-status2 new me-2"><i class="icofont-spinner pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status status_ip me-2">IP</li>
																<li class="process-count">101</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">102</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">103</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">104</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												
											  </div>
										  </div>
										  <div id="GeometryIDSection" style={{display : "none"}}>
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">105</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed pi rounded">
														  <ul class="process mb-3">
																<li class="process-status2 new me-2"><i class="icofont-spinner pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status status_ip me-2">IP</li>
																<li class="process-count">106</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">107</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
											  </div>
										  </div>
										  <div id="AlgebraicIDSection" style={{display : "none"}}>
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">108</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed pi rounded">
														  <ul class="process mb-3">
																<li class="process-status2 new me-2"><i class="icofont-spinner pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status status_ip me-2">IP</li>
																<li class="process-count">109</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">110</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">111</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">112</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												
											  </div>
										  </div>
									  </div>
									  <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
										<div class="subject-list mb-3">
										      <ul class="list-inline">
											      <li class="list-inline-item me-4"><a href="javascript:void(0);" id="ReadinessLinkDemo" class="active">Demo1</a></li>
											      <li class="list-inline-item me-4"><a href="javascript:void(0);" id="GeometryLinkDemo" href="">Demo2</a></li>
											      <li class="list-inline-item me-0 md-me-4"><a href="javascript:void(0);" id="AlgebraicLinkDemo" href="">Demo3</a></li>
											  </ul>
										  </div>
										  <div id="ReadinessIDSectionDemo">
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">113</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">114</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">115</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">116</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">117</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
											  </div>
										  </div>
										  <div id="GeometryIDSectionDemo" style={{display : "none"}}>
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">118</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed pi rounded">
														  <ul class="process mb-3">
																<li class="process-status2 new me-2"><i class="icofont-spinner pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status status_ip me-2">IP</li>
																<li class="process-count">119</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">120</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">121</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">122</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">123</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
											  </div>
										  </div>
										  <div id="AlgebraicIDSectionDemo" style={{display : "none"}}>
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">124</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed pi rounded">
														  <ul class="process mb-3">
																<li class="process-status2 new me-2"><i class="icofont-spinner pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status status_ip me-2">IP</li>
																<li class="process-count">125</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">126</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">127</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
											  </div>
										  </div>
									  </div>
									  <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
										<div class="subject-list mb-3">
										       <ul class="list-inline">
											      <li class="list-inline-item me-4"><a href="javascript:void(0);" id="ReadinessLinkDemo2" class="active">Demo4</a></li>
											      <li class="list-inline-item me-4"><a href="javascript:void(0);" id="GeometryLinkDemo2" href="">Demo5</a></li>
											      <li class="list-inline-item me-0 md-me-4"><a href="javascript:void(0);" id="AlgebraicLinkDemo2" href="">Demo6</a></li>
											  </ul>
										  </div>
										  <div id="ReadinessIDSectionDemo2">
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">128</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed pi rounded">
														  <ul class="process mb-3">
																<li class="process-status2 new me-2"><i class="icofont-spinner pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status status_ip me-2">IP</li>
																<li class="process-count">129</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">130</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">131</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												
											  </div>
										  </div>
										  <div id="GeometryIDSectionDemo2" style={{display : "none"}}>
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">132</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed pi rounded">
														  <ul class="process mb-3">
																<li class="process-status2 new me-2"><i class="icofont-spinner pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status status_ip me-2">IP</li>
																<li class="process-count">133</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">134</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">135</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">136</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">137</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
											  </div>
										  </div>
										  <div id="AlgebraicIDSectionDemo2" style={{display : "none"}}>
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">138</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed pi rounded">
														  <ul class="process mb-3">
																<li class="process-status2 new me-2"><i class="icofont-spinner pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status status_ip me-2">IP</li>
																<li class="process-count">139</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">140</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
											  </div>
										  </div>
									</div>
									</div>
							  </div>
						  </div>
						</div>
					  </div>
					  <div class="accordion-item shadow-sm">
						<h2 class="accordion-header" id="headingTwo">
						  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
							Subject Name: ELA
						  </button>
						</h2>
						<div id="collapseTwo" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample" style="">
						  <div class="accordion-body">
							  <div class="dash-tabs-box">
							      <nav>
									  <div class="nav nav-tabs" id="nav-tab" role="tablist">
										<button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home1" type="button" role="tab" aria-controls="nav-home1" aria-selected="false">Phase 1</button>
										<button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile1" type="button" role="tab" aria-controls="nav-profile1" aria-selected="false">Phase 2</button>
										<button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact1" type="button" role="tab" aria-controls="nav-contact1" aria-selected="true">Phase 3</button>
									  </div>
									</nav>
									<div class="tab-content" id="nav-tabContent">
									  <div class="tab-pane fade active show" id="nav-home1" role="tabpanel" aria-labelledby="nav-home-tab">
									      <div class="subject-list mb-3">
										      <ul class="list-inline">
											      <li class="list-inline-item me-1 me-md-4"><a href="javascript:void(0);" id="ReadinessLinkELA" class="active">Readiness</a></li>
											      <li class="list-inline-item me-1 me-md-4"><a href="javascript:void(0);" id="GeometryLinkELA">Geometry</a></li>
											      <li class="list-inline-item me-0 me-md-4"><a href="javascript:void(0);" id="AlgebraicLinkELA">Algebraic</a></li>
											  </ul>
										  </div>
										  <div id="ReadinessIDSectionELA">
										    <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">BH1</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed pi rounded">
														  <ul class="process mb-3">
																<li class="process-status2 new me-2"><i class="icofont-spinner pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status status_ip me-2">IP</li>
																<li class="process-count">BH2</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH3</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH4</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
											  </div>
										  </div>
										  <div id="GeometryIDSectionELA" style={{display : "none"}}>
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">BH5</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed pi rounded">
														  <ul class="process mb-3">
																<li class="process-status2 new me-2"><i class="icofont-spinner pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status status_ip me-2">IP</li>
																<li class="process-count">BH6</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH7</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH8</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH9</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH10</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH11</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
											  </div>
										  </div>
										  <div id="AlgebraicIDSectionELA" style={{display : "none"}}>
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">BH12</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed pi rounded">
														  <ul class="process mb-3">
																<li class="process-status2 new me-2"><i class="icofont-spinner pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status status_ip me-2">IP</li>
																<li class="process-count">BH13</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH14</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH15</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH16</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
											  </div>
										  </div>
									  </div>
									  <div class="tab-pane fade" id="nav-profile1" role="tabpanel" aria-labelledby="nav-profile-tab">
										<div class="subject-list mb-3">
										      <ul class="list-inline">
											      <li class="list-inline-item me-4"><a href="javascript:void(0);" id="ReadinessLinkDemoELA" class="active">Demo1</a></li>
											      <li class="list-inline-item me-4"><a href="javascript:void(0);" id="GeometryLinkDemoELA">Demo2</a></li>
											      <li class="list-inline-item me-0 md-me-4"><a href="javascript:void(0);" id="AlgebraicLinkDemoELA">Demo3</a></li>
											  </ul>
										  </div>
										  <div id="ReadinessIDSectionDemoELA">
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">BH17</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed pi rounded">
														  <ul class="process mb-3">
																<li class="process-status2 new me-2"><i class="icofont-spinner pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status status_ip me-2">IP</li>
																<li class="process-count">BH18</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH19</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH20</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
											  </div>
										  </div>
										  <div id="GeometryIDSectionDemoELA" style={{display : "none"}}>
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">BH21</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed pi rounded">
														  <ul class="process mb-3">
																<li class="process-status2 new me-2"><i class="icofont-spinner pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status status_ip me-2">IP</li>
																<li class="process-count">BH22</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH23</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
											  </div>
										  </div>
										  <div id="AlgebraicIDSectionDemoELA" style={{display : "none"}}>
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">BH24</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed pi rounded">
														  <ul class="process mb-3">
																<li class="process-status2 new me-2"><i class="icofont-spinner pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status status_ip me-2">IP</li>
																<li class="process-count">BH25</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH26</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH27</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH28</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
											  </div>
									  </div>
									  </div>
									  <div class="tab-pane fade" id="nav-contact1" role="tabpanel" aria-labelledby="nav-contact-tab">
										<div class="subject-list mb-5">
										      <ul class="list-inline">
											      <li class="list-inline-item me-4"><a href="javascript:void(0);" id="ReadinessLinkDemo2ELA" class="active">Demo4</a></li>
											      <li class="list-inline-item me-4"><a href="javascript:void(0);" id="GeometryLinkDemo2ELA">Demo5</a></li>
											      <li class="list-inline-item me-0 md-me-4"><a href="javascript:void(0);" id="AlgebraicLinkDemo2ELA">Demo6</a></li>
											  </ul>
										  </div>
										  <div id="ReadinessIDSectionDemo2ELA" style="display: block;">
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">BH29</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed pi rounded">
														  <ul class="process mb-3">
																<li class="process-status2 new me-2"><i class="icofont-spinner pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status status_ip me-2">IP</li>
																<li class="process-count">BH30</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH31</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
											  </div>
										  </div>
										  <div id="GeometryIDSectionDemo2ELA" style={{display : "none"}}>
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">BH32</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed pi rounded">
														  <ul class="process mb-3">
																<li class="process-status2 new me-2"><i class="icofont-spinner pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status status_ip me-2">IP</li>
																<li class="process-count">BH33</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH34</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH35</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
											  </div>
										  </div>
										  <div id="AlgebraicIDSectionDemo2ELA" style={{display : "none"}}>
										     <div class="row">
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														  <div class="card-body processed rounded">
														  <ul class="process mb-3">
																<li class="process-status2 me-2"><i class="icofont-thumbs-up pe-2"></i></li>
															</ul>
															<ul class="process justify-content-end d-flex mb-3">
																<li class="process-status me-2">P</li>
																<li class="process-count">BH36</li>
															</ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
												<div class="col-lg-3">
													<div class="card mt-5 position-relative border-0">
														   
														  <div class="card-body processed rounded">
															<ul class="process justify-content-end d-flex mt-3 mb-3">
																<li class="process-count">BH37</li>
															  </ul>
															<p class="card-text">I can count to tell the number of objects to 10</p>
														  </div>
														</div>
												</div>
											  </div>
										  </div>
									</div>
									</div>
							  </div>
						  </div>
						</div>
					  </div>
					  
					</div>
			</div>
			
		</div>

  </body>

    </>
  )
};

export default StudentProficiency;
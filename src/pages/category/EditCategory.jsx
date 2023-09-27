import { Form, Input, Button, Checkbox, Select ,message } from 'antd';
import {addAllSubjects , deleteAllSubjects } from '../../Slicers/subjectSlice'
import {addAllphases , deleteAllphases } from '../../Slicers/phaseSlice'
import React , {useState , useEffect} from 'react'
import {useSelector , useDispatch } from 'react-redux';
const baseUrl = process.env.REACT_APP_BASE_URL


const EditCategory = (props) => {
  const { getFieldDecorator } = props.form
    const { Option } = Select;
    const initialValues = {
      "id": props.category.id,
      "subjectId" : props.category.subjectId,
      "phaseId" : props.category.phaseId,
      "categoryName": props.category.categoryName,
      "isActive":  props.category.isActive
    }
    const [inputs  , setInputs] = useState(initialValues)
    const [subjectList , setSubjectList ] = useState([]);
    var subject = useSelector((state)=> state.subject.value)
    const [subjectInSelect , setSubjectInSelect] = useState(null)
    const [phaseList , setPhaseList ] = useState([]);
    var phase = useSelector((state)=> state.phase.value)
    const [phaseInSelect , setPhaseInSelect] = useState(null)
    const dispatch = useDispatch();
     var myAccount = useSelector((state)=> state.myAccount.value);
     const schoolID = myAccount.schoolId;
   let headers = {"Content-Type": "application/json"};
   const token = myAccount.token;
   console.log("token" ,token )
   if (token) {
     headers["Authorization"] = `Bearer ${token}`;
   }

    // return  subject name in select option
    // const subjectName = ()=>{
    //     const subjectName = ()=>{
    //         fetch(`${baseUrl}/Subjects//Get?id=${}`)
    //         .then((res) => res.json())
    //         .then((data) => {
    //           setSubjectList([...data.data ])
    //         dispatch(addAllSubjects(data.data))
    //            console.log("addAllSubjects" ,data.data );
    //         }) ;
    //     const subjectData = subject.filter(data => (data.id === inputs.subjectId))
    //     console.log("subjectData" ,subjectData.subjectName)
    //     return subjectData.subjectName;
    // }


    // ater 
    useEffect(()=>{
  
      (subject.length === 0) && 
      fetch(`${baseUrl}/Subjects/GetAll?schoolId=${parseInt(schoolID)}` , {headers,})
                    .then((res) => res.json())
                    .then((data) => {
                      setSubjectList([...data.data ])
                    dispatch(addAllSubjects(data.data))
                       console.log("addAllSubjects" ,data.data );
                    }) ;
            
        (subject.length > 0) &&
        setSubjectList([...subject])
    
        // get subject name
       
        fetch(`${baseUrl}/Subjects/Get?id=${inputs.subjectId}&schoolId=${parseInt(schoolID)}` , {headers,})
            .then((res) => res.json())
            .then((data) => {
                setSubjectInSelect(data.data.subjectName)
                  console.log("data.data.subjectName" ,data.data.subjectName );
            }) ;

            (phase.length === 0) && 
            fetch(`${baseUrl}/Phases/GetAll?schoolId=${parseInt(schoolID)}` , {headers,})
                          .then((res) => res.json())
                          .then((data) => {
                            setPhaseList([...data.data ])
                          dispatch(addAllphases(data.data))
                             console.log("addAllPhases" ,data.data );
                          }) ;
                  
              (phase.length > 0) &&
              setPhaseList([...phase])
          
              // get subject name
             
              fetch(`${baseUrl}/Phases/Get?id=${inputs.phaseId}&schoolId=${parseInt(schoolID)}` , {headers,})
                  .then((res) => res.json())
                  .then((data) => {
                      setPhaseInSelect(data.data.phaseName)
                        console.log("data.data.phaseName" ,data.data.phaseName );
                  }) ;

                  fetch(`${baseUrl}/Categories/Get?id=${props.category.id}&schoolId=${parseInt(schoolID)}` , {headers,})
                  .then((res) => res.json())
                  .then((data) => {                     
                        console.log("Category" ,data.data.serialNo );
                        setInputs({...inputs, serialNo:data.data.serialNo})
                  }) ;
    }, [])

    console.log("CategoryOrder" ,inputs);

    console.log("subjectInSelect" ,subjectInSelect);
    // handle Submit
    const  handleSubmit= (e)=>{
      e.preventDefault();
      props.form.validateFields((err, values) => {
        if (!err) {
          let data = inputs;
          data.schoolId = schoolID;
            const requestMetadata = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }
   
    //  inputs.subjectId &&( inputs.subjectId !=="Select") &&
    //     inputs.phaseData &&
          fetch(`${baseUrl}/Categories/Save`, requestMetadata)
          .then(res => res.json())
          .then(categoryData => {
            // message.success('Quotation created successfully !!')
            // window.location.href = '/quotationList'
            // this.setState({loading: false})

            if(categoryData.statusCode === 200 ){
              message.success('Category name Is updated successfully !!')
              // props.addNewSubjectInList(subjectData.data)
              //setInputs(initialValues);
              props.updateCategoryList({category:categoryData.data , categoryName:phaseInSelect})
            //  console.log("added new category" ,categoryData.data)
            }else if(categoryData.statusCode === 208) {
              message.warning(categoryData.message)
            } else{
              message.info(categoryData.message)
            }

  
       })      
      
     console.log("ok");
    }})
    }
   
   const  handleChangeInputs = (e)=>{
 
    let {name , value }= e.target;
    //  console.log("name" , name , value)
     name === 'isActive' &&
      (value = !value);
     setInputs((prevData)=>({...prevData , [name]: value}))   
   }

   // Handle change select
   //{(setInputs({...inputs, subjectId:value.id}) setSubjectInSelect(data.data.subjectName))}
    const handleChangeSelect = (value)=>{
        console.log("value Select"  , value);
        setInputs({...inputs, subjectId:value.id})
        setSubjectInSelect(value.subjectName)
    }
   console.log("inputs" ,inputs)

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onSubmit={handleSubmit}
      autoComplete="off"
    >

      <Form.Item
        label="Subject"
        name="subjectId"     
      > 
      {getFieldDecorator('subjectId', {
          rules: [
              {
                  required: true,
                  message: 'Please select subject!',
              },
          ],
          initialValue: subjectInSelect,
      })   
        (<Select 
             
            value={subjectInSelect ? subjectInSelect : "select"} 
            onChange={(value) => handleChangeSelect(value)} 
            name='subjectId' style={{ width: 120 }} 
             disabled>
        {  
            
          subjectList && subjectList.map((subject , key)=>(
               <Option key={key} value={ subject}>{subject.subjectName}</Option>
            ))}
        </Select>)}
      </Form.Item>

      <Form.Item
        label="Phase"
        name="phaseId"
      > {getFieldDecorator('phaseId', {
        rules: [
            {
                required: true,
                message: 'Please select phase!',
            },
        ],
        initialValue: phaseInSelect,
    })   
      (<Select 

            value={phaseInSelect ? phaseInSelect : "select"} 
            onChange={(value) => handleChangeSelect(value)} 
            name='phaseId' style={{ width: 120 }} 
             disabled >
        {  
            
          phaseList && phaseList.map((phase , key)=>(
               <Option key={key} value={ phase}>{phase.subjectName}</Option>
            ))}
        </Select>)}
      </Form.Item>

      <Form.Item
      label="Category"
      name="categoryName"
    >
    {getFieldDecorator('categoryName', {
    rules: [
        {
            required: true,
            message: 'Please input your category name!',
        },
    ],
    initialValue: inputs.categoryName,
})(
      <Input name="categoryName" value={inputs.categoryName} onChange={handleChangeInputs} />)}
    </Form.Item>

    {/* <Form.Item
      label="Order No."
      name="serialNo"
    >
    {getFieldDecorator('serialNo', {
    rules: [
        {
            required: true,
            message: 'Please input Order number for this Category!',
        },
    ],
    initialValue: inputs.serialNo,
})(
      <Input name="serialNo" value={inputs.serialNo} onChange={handleChangeInputs} />)}
    </Form.Item>
 */}
      <Form.Item name="status" label="Is Active" valuePropName="checked" wrapperCol={{  span: 16 }}>
        <Checkbox className="input-check" onChange={handleChangeInputs}  name="isActive"     value={inputs.isActive}  checked={inputs.isActive} ></Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(EditCategory);
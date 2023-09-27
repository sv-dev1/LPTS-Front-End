import { Form, Input, Button, Checkbox, Select ,message } from 'antd';
import {addAllSubjects , deleteAllSubjects } from '../../Slicers/subjectSlice'
import React , {useState , useEffect} from 'react'
import {useSelector , useDispatch } from 'react-redux';
const baseUrl = process.env.REACT_APP_BASE_URL


const EditPhase = (props) => {
  const { getFieldDecorator } = props.form
    const { Option } = Select;
    const initialValues = {
       "id": props.phase.id,
      "subjectId" : props.phase.subjectId,
      "phaseName": props.phase.phaseName,
       "isActive":  props.phase.isActive
    }
    const [inputs  , setInputs] = useState(initialValues)
    const [subjectList , setSubjectList ] = useState([]);
    var subject = useSelector((state)=> state.subject.value)
    const [subjectInSelect , setSubjectInSelect] = useState(null)
    const dispatch = useDispatch();
  var myAccount = useSelector((state)=> state.myAccount.value)
   let headers = {"Content-Type": "application/json"};
   const token = myAccount.token;
   const schoolID = myAccount.schoolId
   console.log("token" ,token )
   if (token) {
     headers["Authorization"] = `Bearer ${token}`;
   }

    useEffect(()=>{
       inputs.subjectId && 
        fetch(`${baseUrl}/Subjects/Get?id=${inputs.subjectId}&schoolId=${parseInt(schoolID)}` ,{headers})
            .then((res) => res.json())
            .then((data) => {
                setSubjectInSelect(data.data.subjectName)
                  console.log("data.data.subjectName" ,data.data );
            }) ;
            fetch(`${baseUrl}/Phases/Get?id=${props.phase.id}&schoolId=${parseInt(schoolID)}` , {headers,})
            .then((res) => res.json())
            .then((data) => {                     
                  console.log("Phases" ,data.data.orderNo );
                  setInputs({...inputs, orderNo:data.data.orderNo})
            }) ;
    }, [inputs.subjectId])


    console.log("subjectInSelect" ,subjectInSelect);
    const  handleSubmit= (e)=>{
      e.preventDefault();
      props.form.validateFields((err, values) => {
        if (!err) {
          let data = inputs;
          data.schoolId = schoolID
            const requestMetadata = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }
          fetch(`${baseUrl}/Phases/Save`, requestMetadata)
          .then(res => res.json())
          .then(phaseData => {
            if(phaseData.statusCode === 200 ){
              message.success('Phase name is updated successfully !!')
              props.updatePhaseList({phase:phaseData.data , subjectName:subjectInSelect})
              console.log("added new subject" ,phaseData.data)
            }else if(phaseData.statusCode === 208) {
              message.warning(phaseData.message)
            } else{
              message.info(phaseData.message)
            }    
       })    
     console.log("ok");
    }})
    }
   
   const  handleChangeInputs = (e)=>{ 
    let {name , value }= e.target;
     name === 'isActive' &&
      (value = !value);
     setInputs((prevData)=>({...prevData , [name]: value}))   
   }

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
      <Form.Item label="Subject" name="subjectId">
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
            disabled="true" 
            value={subjectInSelect ? subjectInSelect : "select"} 
            onChange={(value) => handleChangeSelect(value)} 
            name='subjectId' style={{ width: 120 }}>
        { subjectList && subjectList.map((subject , key)=>(
               <Option key={key} value={ subject}>{subject.subjectName}</Option>
            ))}
        </Select>)}
      </Form.Item>
      <Form.Item label="Phase" name="phaseName">
      {getFieldDecorator('phaseName', {
          rules: [
              {
                  required: true,
                  message: 'Please input your phase name!',
              },
          ],
          initialValue: inputs.phaseName
      })
      (<Input name="phaseName" value={inputs.phaseName} onChange={handleChangeInputs} />)}
    </Form.Item>
    <Form.Item label="Order No." name="orderNo">
    {getFieldDecorator('orderNo', {
    rules: [
    ],
    initialValue: inputs.orderNo,
})(
      <Input name="orderNo" disabled value={inputs.orderNo} onChange={handleChangeInputs} />)}
    </Form.Item>
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

export default Form.create()(EditPhase);
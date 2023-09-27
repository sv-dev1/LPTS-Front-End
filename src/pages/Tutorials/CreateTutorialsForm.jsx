import { Form, Input, Button, Checkbox , message} from 'antd';
import React , {useState , useEffect} from 'react'
import {useSelector , useDispatch } from 'react-redux';
import { Axios } from 'axios';
const baseUrl = process.env.REACT_APP_BASE_URL
const CreateTutorialsForm = (props) => {
  const {getFieldDecorator} = props.form
  const initialvalues = {
    "name" : "",
    "url": "",
  }
const [inputs  , setInputs] = useState(initialvalues) ;
const [isValidUrl , setIsValidUrl] = useState(true)
   var myAccount = JSON.parse(localStorage.getItem('user'))
   const schoolID = myAccount.schoolId;
  let headers = {"Content-Type": "application/json"};
  const token = myAccount.token;
  console.log("token" ,token )
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // const validateUrl= (value)=> {
  //   return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  // }

  const isValidUrls = urlString=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
  return !!urlPattern.test(urlString);
}

  


 const  handleSubmit= (e)=>{
   e.preventDefault();
   // 'http://192.168.5.58/api/Subjects/Save

   props.form.validateFields((err, values) => {
    if (!err){
      let data = inputs;
          data.schoolId = schoolID
      console.log("enter valid")
      const requestMetadata = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(data),
      }
    
      fetch(`${baseUrl}/Tutorials/Save`, requestMetadata)
        .then(res => res.json())
        .then(data => {
          // message.success('Quotation created successfully !!')
          // window.location.href = '/quotationList'
          // this.setState({loading: false})
          if(data.statusCode === 200 ){
            message.success('Tutorial Is added successfully !!')
            props.updateTutorials(data.data)
            props.form.resetFields()
            setInputs({
              "subjectName" : "",
               "isActive": false
            });
            props.handleOk()
        //   console.log("added new tutorial" ,data.data)
          }else if(data.statusCode === 208) {
            message.warning(data.message)
          } else{
            message.info(data.message)
          }
         
         
        })
       
       
    }
  })

  

 }

const  handleChangeInputs =(e)=>{
 
  

  let {name , value }= e.target;
  console.log("name" , name , value)
if(name === 'url'){
  let isValid =  isValidUrls(value);
  setIsValidUrl(isValid) ;
}
  //console.log("isvalid" ,isValid )
  name === 'isActive' &&
   (value = !value);
  setInputs((prevData)=>({...prevData , [name]: value}))

}

console.log("inputs" ,inputs)
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <Form.Item
        label="Name"
        name="tutorialname"
      >
      {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input  tutorial name!',

                      },
                    ],
                  })(
                    <Input name="name" setFieldsValue={inputs.name} onChange={handleChangeInputs}/>,
                  )}
      </Form.Item>

      <Form.Item
      label="Tutorial Video Url"
      name="url"
    >
    {getFieldDecorator('url', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input tutorial video url!',

                    },
                  ],
                })(
                  <Input name="url" setFieldsValue={inputs.url} onChange={handleChangeInputs}/>,
                )}
    </Form.Item>
    {isValidUrl ?"":<p style={{"textAlign":"center" ,"color": "#f5222d" , "marginLeft":"50px" }}>Please add a valid url format!</p>}

{  /*    <Form.Item name="isActive" label="Is Active" valuePropName="checked" wrapperCol={{  span: 16 }}>
        <Checkbox className="input-check" onChange={handleChangeInputs} checked={inputs.isActive}  name="isActive" value={inputs.isActive}></Checkbox>
                  </Form.Item>*/}

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>

    </Form>
  );
};


export default Form.create()(CreateTutorialsForm);
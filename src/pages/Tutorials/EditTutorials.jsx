import {Form, Input, Button, Checkbox, message} from 'antd'
import React, {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
const baseUrl = process.env.REACT_APP_BASE_URL

const EditTutorials = props => {
  console.log('props', props.data)
  const {getFieldDecorator} = props.form
  let {id , name , url} = props.data
  const initialValues = {
    id,
    name,
    url,
  }
  const [inputs, setInputs] = useState(initialValues)
  const [isValidUrl , setIsValidUrl] = useState(true)
  var myAccount = JSON.parse(localStorage.getItem('user'))
  const schoolID = myAccount.schoolId;
  let headers = {'Content-Type': 'application/json'}
  const token = myAccount.token
  console.log('token', token)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  // useEffect(() => {
  //   // get subject name
  //   // debugger
  //   fetch(`${baseUrl}/Subjects/Get?id=${inputs.id}&schoolId=${parseInt(schoolID)}`, {headers})
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log('data edit subject', data.data)
  //       setInputs({
  //         id: data.data.id,
  //         subjectName: data.data.subjectName,
  //         isActive: data.data.isActive,
  //       })
  //     })
  // }, [])


  const isValidUrls = urlString=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
  return !!urlPattern.test(urlString);
}

  const handleSubmit = e => {
    e.preventDefault()
    // 'http://192.168.5.58/api/Subjects/Save
    props.form.validateFields((err, values) => {
      let data = inputs;
      data.schoolId = schoolID;
      if (!err) {
        console.log('enter valid')
        const requestMetadata = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }

        inputs.name &&
          fetch(`${baseUrl}/Tutorials/Save`, requestMetadata)
            .then(res => res.json())
            .then(data => {
              // message.success('Quotation created successfully !!')
              // window.location.href = '/quotationList'
              // this.setState({loading: false})
              if (data.statusCode === 200) {
                message.success('Updated successfully !!')
                props.updateTutorials()
                //     setInputs(initialValues)
                props.handleOk()
              //  console.log('added new subject', data.data)
              } else if (data.statusCode === 208) {
                message.warning(data.message)
              } else {
                message.info(data.message)
              }
            })

        console.log('ok')
      }
    })
  }

  const handleChangeInputs = e => {
    let {name, value} = e.target
    //console.log('name', name, value)
    if(name === 'url'){
      let isValid =  isValidUrls(value);
      setIsValidUrl(isValid) ;
    }
    name === 'isActive' && (value = !value)
    setInputs(prevData => ({...prevData, [name]: value}))
  }

 // console.log('inputs', inputs)
  return (
    <Form
      name="basic"
      labelCol={{span: 8}}
      wrapperCol={{span: 16}}
      initialValues={{remember: true}}
      onSubmit={handleSubmit}
      autoComplete="off">
      
      <Form.Item
        label="Name"
        name="name"
      >
      {getFieldDecorator('name', {
                      rules: [
                        {
                          required: true,
                          message: 'Please input subject name!',
                        },
                      ],
                      initialValue: inputs.name,
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
                  initialValue: inputs.url,
                })(
                  <Input name="url" setFieldsValue={inputs.url} onChange={handleChangeInputs}/>,
                )}
    </Form.Item>
    {isValidUrl ?"":<p style={{"textAlign":"center" ,"color": "#f5222d" , "marginLeft":"50px" }}>Please add a valid url format!</p>}


      <Form.Item wrapperCol={{offset: 8, span: 16}}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Form.create()(EditTutorials)

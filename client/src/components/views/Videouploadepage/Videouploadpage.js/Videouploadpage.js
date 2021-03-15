import React, {useState} from 'react';
import {Typography, Button, Form, message, Input, Icon} from 'antd';
import Dropzone from 'react-dropzone';
import { use } from '../../../../../../server/routes/video';

const { TextArea } = Input;
const {Title} = Typography;

const Privateoption = [
    {value:0, label:"private"},
    {value:1, label:"public"}
]

const categoryoption = [
    {value:0, label:"film & animation"},
    {value:1, label:"auto & vehicales"},
    {value:2, label:"music"},
    {value:3, label:"pets & animals"}
]


function Videouploadpage(){
    const [videotitle, setvideotitle] = useState("");
    const [description, setdescription] = useState("");
    const [private, setprivate] = useState(0);
    const [category, setcategory] = useState("Film and animation");
    const [filepath,filepath] = useState("");
    const [duration, setduration] = useState("");
    const [thumnail, setthumnail] = useState("");

    const onTitlechange = (e) => {
        setvideotitle(e.currentTarget.value)
    }
    const ondescriptionchange =(e) => {
        setdescription(e.currentTarget.value)
    }
    const onprivatechange = (e) => {
        setprivate(e.currentTarget.value)
    }
    const oncategorychange =(e) => {
        setcategory(e.currentTarget.value)
    }

    const ondrop = (files) => {
        let formData = new FormData;
        const config = {
        header : {'content-type': 'multipart/form-dara'}
        }
        formData.append("file", files[0])
        Axios.post('/api/video/uploadfiles', formData, config)
        .then(response => {
            if(response.data.success) {
            
                let variable = {
                    url : response.data.url,
                    fileName : response.data.fileName
                }

                setFilePath(response.data.url)

                Axios.post('/api/video/thumbnail', variable).then(response => {
                    if(response.data.success){
                    
                        setduration(response.data.fileDuration);
                        setthumnail(response.data.url)
                    
                    }else{
                        alert('썸네일 생성에 실패하였습니다.')
                    }
                })


            } else{
                alert('비디오 업로드를 실패했습니다.')
            }   
        })
    }

    return (
        <div style={{ maxWidth:'700px', margin: '2rem auto'}}>
            <div style={{ textAlign:'center', marginBottom: '2rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                   {/* {drop zone}  */}
                   <Dropzone
                    onDrop ={ondrop}
                    multiple = {false}
                    maxSize = {1000000}
                   >
                    {({ getRootProps,    getInputProps}) => (
                        <div style={{ width = '300px', height: '240px', border:'1px solid lightgray', alignItems:'center', justifyContent:'center'}} {...getRootProps()}>
                            <input {...getRootProps()}/>
                            <Icon type="plus" style={{ fontSize: '3rem'}} />
                        </div>
                    ) }
                   </Dropzone>
                   {/* {thumbnail zone} */}

                { thumnail &&
                    <div>
                        <img src={`http://localhost:5000/${thumnail}`} alt="thumnail"/>
                    </div>
                }
                </div>
        
                <br/>
                <br/>
                <label>Title</label>
                <Input  
                    onChange={onTitlechange}
                    value={videotitle}
                />
                <br/>
                <br/>
                <label>Description</label>
                <TextArea
                    onChange={ondescriptionchange}
                    value = {description}
                />
                <br/>
                <br/>

                <select onChange={onprivatechange}>
                        {Privateoption.map((item, index) => (
                            <option key={index} value= {item.value}>{item.label}</option>
                        ))}
                </select>

                <br/>
                <br/>
                <select onChange={oncategorychange}>
                        {categoryoption.map((item, index) => (
                            <option key={index} value= {item.value}>{item.label}</option>
                        ))}
                    
                </select>
                <br/>
                <br/>
                <Button type="primary" size="large" onClick>
                    submit
                </Button>

            </Form>
        </div>
    )
}

export default Videouploadpage

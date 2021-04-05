import React, { useState } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import DropZone from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
const { TextArea } = Input;
const { Title } = Typography;

const privateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];
const categoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
];

function VideoUploadPage(props) {
  const [form, setForm] = useState({
    videoTitle: "",
    description: "",
  });
  const [privateFlag, setPrivateFlag] = useState(0);
  const [category, setCategory] = useState("Film & Animation");
  const [videoInfo, setVideoInfo] = useState({
    filePath: "",
    duration: "",
    thumbnailPath: "",
  });
  const user = useSelector((state) => state.user);
  const { videoTitle, description } = form;
  const onChange = (e) => {
    console.log(`${e.target.name} and ${e.target.value}`);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const onPrivateChange = (e) => {
    setPrivateFlag(e.target.value);
  };
  const onCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();

    const data = {
      writer: user.userData._id,
      title: form.videoTitle,
      description: form.description,
      privacy: privateFlag,
      filePath: videoInfo.filePath,
      category: category,
      duration: videoInfo.duration,
      thumbnail: videoInfo.thumbnailPath,
    };
    axios.post("/api/video/uploadVideo", data).then((res) => {
      if (res.data.success) {
        message.success("성공적으로 업로드를 했습니다.");
        setTimeout(() => {
          props.history.push("/");
        }, 3000);
      } else {
        alert("비디오 업로드에 실패했습니다.");
      }
    });
  };

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "config-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    axios.post("/api/video/uploadfiles", formData, config).then((res) => {
      if (res.data.success) {
        console.log(res.data);
        let { filePath } = res.data;

        let variable = {
          filePath,
          fileName: res.data.fileName,
        };

        axios.post("/api/video/thumbnail", variable).then((res) => {
          if (res.data.success) {
            console.log(res.data);
            setVideoInfo({
              ...videoInfo,
              filePath,
              duration: res.data.fileDuration,
              thumbnailPath: res.data.thumbsFilePath,
            });
          } else {
            alert("Failed to make the thumbnails");
          }
        });
      } else {
        alert("비디어 업로드가 실패하였습니다.");
      }
    });
  };
  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>Upload Video</Title>
      </div>
      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <DropZone onDrop={onDrop} multiple={false} maxSize={1000000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: "3rem" }} />
              </div>
            )}
          </DropZone>
          {videoInfo.thumbnailPath && (
            <div>
              <img
                src={`http://localhost:5000/${videoInfo.thumbnailPath}`}
                alt="thumbnail"
              />
            </div>
          )}
        </div>
        <br />
        <br />
        <label>Title</label>
        <Input onChange={onChange} name="videoTitle" value={videoTitle} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onChange} name="description" value={description} />
        <br />
        <br />
        <select onChange={onPrivateChange}>
          {privateOptions.map((item, idx) => (
            <option key={idx} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange}>
          {categoryOptions.map((item, idx) => (
            <option key={idx} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default withRouter(VideoUploadPage);
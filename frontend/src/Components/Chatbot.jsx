import React from "react";
import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { IoCloudUpload } from "react-icons/io5";
import styled, { keyframes, css } from "styled-components";

export const Chatbot = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const [chooseName, setChooseName] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [chatResult, setChatResult] = useState([]);

  console.log(isAnimationActive);
  console.log(selectedFile);
  console.log(chooseName);
  console.log("res", chatResult);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      setIsAnimationActive(false);
      setTimeout(() => {
        setIsAnimationActive(true);
      }, 0);

      setTimeout(() => {
        setChooseName("File Uploaded")
      },7000)
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const res = await axios.post("http://127.0.0.1:5000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res.data);
        const { original_filename, file_path } = res.data;
        console.log("Original Filename:", original_filename);
        console.log("Unique Filename:", file_path);
        setSelectedFile(file_path);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
      setChooseName(file.name);
  };

  const handleSubmitChat = async (e) => {
    e.preventDefault();

    try {
      let res = await axios.post("http://127.0.0.1:5000/chat", {
        query: userMessage,
        file_path: selectedFile ? `${selectedFile}` : null,
      });
      console.log("Response from server:", res);
      const chatReply = await res.data.result;
      console.log("Chat Reply:", chatReply);

      const updatedConversation = [
        ...chatResult,
        { role: "user", content: userMessage },
        { role: "bot", content: chatReply },
      ];

      setChatResult(updatedConversation);
      console.log("Updated Chat Reply:", updatedConversation);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Text fontSize={"6xl"}>Study Ease</Text>

      <Box border = "1px solid red" >
        <form action="" onSubmit={handleSubmit} style = {{border : "1px solid green" , width : "20%", margin : "auto"}} >
          <Text pos = "absolute" left = "50%" top = "52%" transform={"translate(-50%)"}>{chooseName ? chooseName : "Choose File"}</Text>
          <LoadingStyle
            isAnimationActive={isAnimationActive}
          >
            <Input
              border="1px solid red"
              opacity="0"
              type="file"
              w="100%"
              h="100%"
              borderRadius={"50%"}
              accept=".pdf"
              onChange={handleFileChange}
              cursor="pointer"
            />
          </LoadingStyle>
          <Button mt = "10px" type="submit">Upload</Button>
        </form>
      </Box>

      {/* <Box border="1px solid red" h="100px" w="70%" m="auto">
        <form action="" onSubmit={handleSubmitChat}>
          <Input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
          <Input type="submit" />
        </form>
      </Box> */}
    </>
  );
};

const fill = keyframes`
  
  from {
    top : 200px;
    transform : translateX(-50%) rotate(0deg);
  }

  to {
    top : -50px;
    transform : translateX(-50%) rotate(360deg);
  }

`;

const LoadingStyle = styled.div`

border : 1px solid red;
width : 160px;
height : 160px;
border-radius : 50%;
margin : auto;
position : relative;
overflow : hidden;

&:before{
  content : "";
  position : absolute;
  width : 300px;
  height : 300px;
  background-color : #00acee;
  left : 50%;
  transform : translateX(-50%);
  top : 200px;
  border-radius : 40%;
  z-index : -10;
  animation: ${(props) =>
    props.isAnimationActive
      ? css`
          ${fill} 7s ease-in-out
        `
      : "none"};
  }
}

`;

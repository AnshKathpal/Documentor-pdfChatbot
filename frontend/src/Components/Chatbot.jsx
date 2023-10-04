import React from "react";
import { Box, Button, Input, Text, Flex } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { FcUpload } from "react-icons/fc";
import styled, { keyframes, css } from "styled-components";

export const Chatbot = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnimationActive, setIsAnimationActive] = useState(false);
  const [chooseName, setChooseName] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [chatResult, setChatResult] = useState([]);
  const [isChatFormVisible, setIsChatFormVisible] = useState(false);

  console.log(isAnimationActive);
  console.log(selectedFile, "selectedFile");
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
        setChooseName("File Uploaded");
        setIsChatFormVisible(true);
      }, 7000);
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
    <Flex h="100vh" bg="#F8F0E5">
      <Flex
        pos="relative"
        bg="#0F2C59"
        p="20px"
        w="30%"
        direction={"column"}
        align={"center"}
      >
        <Text
          fontSize={"6xl"}
          color="#DAC0A3"
          fontFamily={"'Lilita One', cursive"}
        >
          DocuMentor
        </Text>

        <form action="" onSubmit={handleSubmit} style={{ margin: "auto" }}>
          <Text
            pos="absolute"
            left="50%"
            top="50%"
            transform={"translate(-50%)"}
            zIndex="3"
            fontSize={"xl"}
            fontFamily={"'Lilita One', cursive"}
          >
            {chooseName ? chooseName : "Choose File"}
          </Text>
          <LoadingStyle isAnimationActive={isAnimationActive}>
            <Box
              pos={"absolute"}
              left="50%"
              top="5%"
              transform="translate(-50%)"
              borderRadius="30%"
              border="2px dashed #0F2C59"
              w="90%"
              h="90%"
              m="auto"
            ></Box>
            <Input
              // border="1px solid red"
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
          <Button mt="10px" type="submit">
            Upload
          </Button>
        </form>
      </Flex>

      <Box bg="#EADBC8" w="60%" h="70vh" m="auto" borderRadius="30px">
        {isChatFormVisible && (
          <form
            onSubmit={handleSubmitChat}
            action=""
            style={{ padding: "20px", height: "20%" }}
          >
            <Input
              border="1px solid black"
              h="50px"
              fontSize={"xl"}
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              textAlign="center"
              placeholder="Ask from your PDF here.."
            />
            <Button mt="15px" type="submit">
              Submit
            </Button>
          </form>
        )}
        <Box h="80%" overflowY="scroll">
          {chatResult.map((message, index) => (
            <div
              key={index}
              className={`message-container ${
                message.role === "user" ? "user-message" : "bot-message"
              }`}
              style={{
                display: "flex",
                justifyContent: `${
                  message.role == "user" ? "flex-end" : "flex-start"
                }`,
                width: "100%",
                padding: "10px 30px 10px 30px",
              }}
            >
              <div
                className={`message-container ${
                  message.role === "user" ? "user-message" : "bot-message"
                }`}
                style={{
                  width: `${message.role == "user" ? "30%" : "70%"}`,
                  backgroundColor: "#0F2C59",
                  color: "white",
                  padding: "10px",
                  borderRadius: "30px",
                  boxShadow:
                    "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
                }}
              >
                <strong>{message.role === "user" ? "You" : "Bot"}:</strong>{" "}
                {message.content}
              </div>
            </div>
          ))}
        </Box>
      </Box>
    </Flex>
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

width : 200px;
height : 200px;
border-radius : 30%;
margin : auto;
position : relative;
overflow : hidden;
background-color : #DAC0A3;
z-index : 2;

&:before{
  content : "";
  position : absolute;
  width : 400px;
  height : 400px;
  background-color : #00acee;
  left : 50%;
  transform : translateX(-50%);
  top : 200px;
  border-radius : 40%;
  z-index : -2;
  animation: ${(props) =>
    props.isAnimationActive
      ? css`
          ${fill} 7s ease-in-out
        `
      : "none"};
  }
}

`;

import React from "react";
import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export const Chatbot = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const [userMessage,setUserMessage]= useState("");
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const res = await axios.post("http://127.0.0.1:5000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  };


  const handleSubmitChat = async (e) => {

    e.preventDefault();

    try {
  let res = await axios.post("http://127.0.0.1:5000/chat", {
    query : userMessage
  } )
  const chatReply = await res.data.result;
  console.log(chatReply)
  
} catch (error) {
  
  console.log(error.message)
  
}

  }

  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        {/* <input type="submit" /> */}
        <button type="submit">Upload</button>
      </form>

      <Box border="1px solid red" h="100px" w="70%" m="auto">
        <form action="" onSubmit={handleSubmitChat} >
          <input type="text" value={userMessage} onChange = {(e) => setUserMessage(e.target.value)} />
          <input type="submit" />
        </form>
      </Box>
    </>
  );
};

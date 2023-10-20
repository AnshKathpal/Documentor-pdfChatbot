# DocuMentor PDF Chatbot Readme

## Description
DocuMentor is a sophisticated chatbot application designed to assist users in extracting valuable information from uploaded PDF documents. Users can upload PDF files, chat with the AI chatbot to ask questions or seek information related to the document, and receive well-informed responses. This readme provides an overview of the DocuMentor PDF Chatbot, including its features and the technology stack used.

## Features
- **PDF Upload**: Users can upload PDF documents for analysis and conversation with the AI chatbot.

- **AI Chatbot**: Engage in a chat conversation with the AI chatbot to ask questions or discuss the content of the PDF.

- **Document Analysis**: The chatbot creates chunks and embeddings to analyze the document and understand its content.

- **Similarity Search**: Utilize Langchain for similarity search to find related content within the document.

- **ChromaDB Integration**: Store vector searches in ChromaDB for efficient retrieval of similar content.

## Tech Stack
### Frontend
- **React**: The user interface of DocuMentor is built using React, offering a modern and responsive design.

- **Chakra UI**: Chakra UI provides a set of accessible and customizable components for creating a visually appealing and user-friendly interface.

### Backend
- **Python Flask**: The server-side logic of the chatbot is implemented using Flask, a micro web framework for Python.

### Packages and Technologies
- **Langchain**: Langchain is used for creating embeddings and performing similarity searches.

- **OpenAI**: OpenAI's ChatGPT model 3.5 powers the chatbot, offering natural language understanding and generation capabilities.

- **Embeddings**: Embeddings are generated to analyze and represent the content of the PDF.

- **Tiktoken**: Tiktoken is used for tokenization and counting words in the text.

- **PyPDF**: PyPDF is used for parsing and extracting text from PDF documents.

### Database
- **ChromaDB**: ChromaDB is integrated to store vector searches for efficient retrieval and similarity searching.

<img width="1680" alt="Screenshot 2023-10-21 at 2 55 40 AM" src="https://github.com/AnshKathpal/Documentor-pdfChatbot/assets/115460552/c929a0eb-8e66-4fbe-bb74-2f4fadc6ff1f">

<img width="1680" alt="Screenshot 2023-10-21 at 2 57 41 AM" src="https://github.com/AnshKathpal/Documentor-pdfChatbot/assets/115460552/7bb6bd05-3079-4322-8ae6-271b40c78e02">

<img width="1680" alt="Screenshot 2023-10-21 at 2 58 35 AM" src="https://github.com/AnshKathpal/Documentor-pdfChatbot/assets/115460552/fde17306-c79d-4c82-835f-b2fb5d9125b9">

<img width="1680" alt="Screenshot 2023-10-21 at 3 00 22 AM" src="https://github.com/AnshKathpal/Documentor-pdfChatbot/assets/115460552/54dbfbf7-e092-46bc-93b8-6e5ceef53507">

## Installation and Setup
1. Clone the repository from GitHub.

2. Navigate to the project directory and install the required dependencies for both the frontend and backend using `npm install` for React and `pip install -r requirements.txt` for Python.

3. Set up a database connection to ChromaDB, and configure the database settings in the backend.

4. Create environment variables for sensitive information, such as API keys and database connections.

5. Start the frontend and backend servers using `npm start` for React and `python app.py` for Python Flask.

6. Access the DocuMentor PDF Chatbot via a web browser by navigating to the specified URL (usually `http://localhost:3000`).

## Usage
1. Open the DocuMentor PDF Chatbot in your web browser.

2. Upload a PDF document for analysis and conversation.

3. Engage in a chat conversation with the AI chatbot to ask questions or discuss the content of the PDF.

4. The chatbot will analyze the document, create embeddings, and perform similarity searches to provide informed responses.

5. Store vector searches in ChromaDB for efficient retrieval of similar content in the future.

6. Use DocuMentor to unlock valuable insights from your PDF documents.

## Contributing
Contributions to the DocuMentor PDF Chatbot are welcome. Please follow the guidelines outlined in the CONTRIBUTING.md file.

## License
This project is open-source and available under the [MIT License](LICENSE).

## Author
- Ansh Kathpal

## Acknowledgments
Special thanks to the React, Flask, and OpenAI communities for providing resources and libraries that made this advanced PDF chatbot possible.
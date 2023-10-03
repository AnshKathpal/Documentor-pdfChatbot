from dotenv import load_dotenv, find_dotenv
from langchain.chains import RetrievalQA, ConversationalRetrievalChain
from langchain.chat_models import ChatOpenAI
from langchain.vectorstores import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.memory import ConversationBufferMemory
from langchain.document_loaders import PyPDFLoader
import os
import openai
import sys
# from PyPDF2 import PdfReader
from flask import Flask, request, jsonify
from flask_cors import CORS

sys.path.append("../..")

_ = load_dotenv(find_dotenv())

openai.api_key = os.environ["OPENAI_API_KEY"]

app = Flask(__name__)
CORS(app)

# def extract_pdf_text(pdf_file_path):
#     pdf_text = ""
#     pdf_reader = PdfReader(pdf_file_path)
#     for page in pdf_reader.pages:
#         pdf_text += page.extract_text()
#     return pdf_text

@app.route('/upload', methods=['POST'])
def upload_pdf():
    try:
        uploaded_file = request.files['file']
        if uploaded_file.filename != '':
            target_directory = "./docs"
            os.makedirs(target_directory, exist_ok=True)
            file_path = os.path.join(target_directory, uploaded_file.filename)
            uploaded_file.save(file_path)
            return jsonify({"message": "PDF file uploaded and saved successfully"})
        else:
            return jsonify({"error": "No file selected"})
    except Exception as e:
        return jsonify({"error": str(e)})


@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Get the question from the request JSON
        data = request.get_json()
        query = data.get('query')


        print(f"Query: {query}")

        # pdf_files = [f for f in os.listdir("/docs") if f.endswith('.pdf')]
        # if not pdf_files:
        #     return jsonify({"error": "No PDF file found in the 'docs' directory"})
        # latest_pdf_file = max(pdf_files, key=os.path.getctime)
        # pdf_file_path = os.path.join('/docs', latest_pdf_file)

        # print(f"Using PDF file: {pdf_file_path}")

        # Load the PDF and perform text processing
        pdf_file_path = "docs/text.pdf"
        print(f"Attempting to load PDF from: {pdf_file_path}")

        # pdf_text = extract_pdf_text(pdf_file_path)

        loader = PyPDFLoader(pdf_file_path)
        pages = loader.load()

        

        # loader = PyPDFLoader("./docs/text.pdf")
        # pages = loader.load()
        len(pages)
        print(len)



        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        splits = text_splitter.split_documents(pages)
        len(splits)
        # print(splits)

        persist_directory = "docs/chroma/"
        vectordb = Chroma.from_documents(
            documents=splits,
            embedding=OpenAIEmbeddings(),
            persist_directory=persist_directory
        )
        
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )

        llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.5)
        retriever = vectordb.as_retriever()
        qa_chain = RetrievalQA.from_chain_type(
            llm,
            retriever=retriever,
            memory=memory
        )

        result = qa_chain({"query": query})
        answer = result.get("result")
        print(answer)


        # similar_documents = vectordb.similarity_search(query, k=3)
        # similar_documents_json = []
        # for document in similar_documents:
        #     document_dict = {
        #         "title": document.title,
        #         "content": document.content,
        # # Include any other relevant fields here
        #     }
        #     similar_documents_json.append(document_dict)
        

        conversation_chain = ConversationalRetrievalChain.from_llm(
            llm,
            retriever=retriever,
            memory=memory
        )


        conversation_result = conversation_chain({"question": query})
        conversation_answer = conversation_result["answer"]

        response = {
            "result": answer,
            "conversation_result": conversation_answer
            # "similar_documents": similar_documents_json
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
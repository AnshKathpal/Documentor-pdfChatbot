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
from PyPDF2 import PdfReader
from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid


sys.path.append("../..")


old_db_path = "./docs/chroma"
if os.path.exists(old_db_path):
    os.system(f"rm -rf {old_db_path}")

_ = load_dotenv(find_dotenv())

openai.api_key = os.environ["OPENAI_API_KEY"]

app = Flask(__name__)
CORS(app)


@app.route('/upload', methods=['POST'])
def upload_pdf():
    try:
        uploaded_file = request.files['file']
        if uploaded_file.filename != '':
            target_directory = "./docs"
            os.makedirs(target_directory, exist_ok=True)
            unique_filename = str(uuid.uuid4()) + ".pdf"
            file_path = os.path.join(target_directory, unique_filename)
            uploaded_file.save(file_path)
            return jsonify({
                "message": "PDF file uploaded and saved successfully",
                "original_filename": uploaded_file.filename,
                "file_path": file_path
            })
        else:
            return jsonify({"error": "No file selected"})
    except Exception as e:
        return jsonify({"error": str(e)})


@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        query = data.get('query')

        print(f"Query: {query}")

        uploaded_file_path = data.get('file_path')
        print(uploaded_file_path)
        if uploaded_file_path:
            print(f"Using PDF from: {uploaded_file_path}")
            loader = PyPDFLoader(uploaded_file_path)
            pages = loader.load()

        # Load the PDF and perform text processing
        # pdf_file_path = "docs/the-tortoise-and-the-hare-story.pdf"
        # print(f"Attempting to load PDF from: {pdf_file_path}")
        # loader = PyPDFLoader(pdf_file_path)
        # pages = loader.load()

            len(pages)
            print(len)

            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
            splits = text_splitter.split_documents(pages)
            len(splits)

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
        else:
            return jsonify({"error": "No PDF file path provided in the request"})

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == '__main__':
    app.run(debug=False)

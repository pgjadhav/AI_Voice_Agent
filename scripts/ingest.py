from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from app.core.embeddings import embedding_model
loader = TextLoader("app/data/documents/data.txt", encoding="utf-8")
documents = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
docs = splitter.split_documents(documents)

# embeddings = embedding_model

db = FAISS.from_documents(docs, embedding_model)
db.save_local("app/vectorstore/faiss_index")
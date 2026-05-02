from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from core.embeddings import embedding_model
# embedding_model = HuggingFaceEmbeddings(
#     model_name="sentence-transformers/all-MiniLM-L6-v2"
# )
allow_dangerous_deserialization=True
def load_vectorstore():
    return FAISS.load_local(
        "app/vectorstore/faiss_index",
        embedding_model,
        allow_dangerous_deserialization=True
    )

# def retrieve_docs(query):
#     db = load_vectorstore()
#     docs = db.similarity_search(query, k=5)
#     return docs

def retrieve_context(query):
    db = load_vectorstore()
    docs = db.similarity_search(query, k=5)

    context = "\n\n".join([doc.page_content for doc in docs])
    return context
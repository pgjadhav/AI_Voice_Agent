from app.services.rag_service import retrieve_context

query = "Tell me about your experience"
docs = retrieve_context(query)

for d in docs:
    print("\n---\n")
    print(d.page_content)
from fastapi import APIRouter
from services.rag_service import retrieve_context
from services.llm_service import get_llm_response
from acore.prompts import SYSTEM_PROMPT
from pydantic import BaseModel

class QueryRequest(BaseModel):
    query: str
    
router = APIRouter()

@router.post("/chat")
def chat(request: QueryRequest):
    query = request.query.lower().strip()
    # Step 1: Retrieve context
    context = retrieve_context(query)

    # Step 2: Build final prompt
    final_prompt = f"""
{SYSTEM_PROMPT}

Context:
{context}

Question:
{query}
"""

    # Step 3: Get response from LLM
    response = get_llm_response(final_prompt)

    return {"response": response}
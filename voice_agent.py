from app.services.stt_service import listen
from app.services.rag_service import retrieve_context
from app.services.llm_service import get_llm_response,get_llm_response_with_cache
from app.services.tts_service import speak
from app.core.prompts import SYSTEM_PROMPT

def run_voice_agent():
    while True:
        query = listen()
        query = query.lower().strip()

        context = retrieve_context(query)

        prompt = f"""
{SYSTEM_PROMPT}

Context:
{context}

Question:
{query}
"""

        # response = get_llm_response(prompt)
        response = get_llm_response_with_cache(query, context, prompt)

        speak(response)

if __name__ == "__main__":
    run_voice_agent()
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import GEMINI_API_KEY
from app.core.cache import get_from_cache, save_to_cache

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    google_api_key=GEMINI_API_KEY,
    temperature=0.3
)

# ✅ Existing function (keep as-is)
def get_llm_response(prompt):
    response = llm.invoke(prompt)
    return response.content


# ✅ NEW: Cached version
def get_llm_response_with_cache(query, context, prompt):
    
    # Normalize query (important)
    normalized_query = query.lower().strip()

    # Create cache key (lightweight)
    key = normalized_query

    # 🔍 Step 1: Check cache
    cached = get_from_cache(key)
    if cached:
        print("⚡ Cache hit")
        return cached

    # 🧠 Step 2: Call LLM
    print("🧠 Calling Gemini API")
    response = get_llm_response(prompt)

    # 💾 Step 3: Save cache
    save_to_cache(key, response)

    return response
cache = {}

MAX_CACHE_SIZE = 500  # limit

def get_from_cache(key):
    return cache.get(key)

def save_to_cache(key, value):
    
    # 🔥 Add limit check HERE
    if len(cache) > MAX_CACHE_SIZE:
        cache.pop(next(iter(cache)))
        print("🧹 Cache cleared (limit reached)")
        cache.clear()

    cache[key] = value
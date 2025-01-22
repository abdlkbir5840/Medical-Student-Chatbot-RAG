from transformers import AutoModelForCausalLM, AutoTokenizer
import time
from datetime import datetime
from config.db_config import client, sentence_transformer_ef
from helpers import load_model_and_tokenizer

def get_generate_response(query: str, collection_name: str, model_name: str, search_type: str):
    print("in generating method")
    
    collection_name = "general_collection" if search_type != "user_collection" else collection_name

    query_timestamp = datetime.utcnow().isoformat()
    total_start_time = time.time()
    retrieval_start_time = time.time()

    model, tokenizer = load_model_and_tokenizer(model_name)

    collection = client.get_collection(collection_name)

    query_embedding = sentence_transformer_ef([query])[0]
    print("start reterival")
    results = collection.query(
                query_embeddings=query_embedding,
                n_results=6
            )
    retrieval_time = time.time() - retrieval_start_time

    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    similarities = results.get("distances", [])[0]

    context = "\n".join(documents)
    resources = [meta.get("source", "Unknown source") for meta in metadatas]
    unique_resources = list(set(resources))

    messages = [
        {"role": "system", "content": "You are an AI assistant that answers questions based on the provided context.\n"},
        {"role": "system", "content": f"Context: {context}\n"},
        {"role": "user", "content": query}
    ]
    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )
    print("begin generating a response")
    model_inputs = tokenizer([text], return_tensors="pt").to(model.device)
    input_tokens = model_inputs.input_ids.shape[-1]

    generation_start_time = time.time()
    generated_ids = model.generate(
        **model_inputs,
        max_new_tokens=512
    )
    generation_time = time.time() - generation_start_time 

    output_tokens = sum(len(ids) for ids in generated_ids)

    generated_ids = [
        output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
    ]
    
    response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
    print("end of generated")
    retrieved_docs = [
            {
                "content": doc,
                "similarity": round(similarity * 100, 2),  # Convert to percentage
                "source": meta.get("source", "Unknown source")
            }
            for doc, similarity, meta in zip(documents, similarities, metadatas)
    ]
    total_time = time.time() - total_start_time
    StackTrace = {
        "userQuery": query,
        "chatbotResponse": response,
        "retrievedDocs": retrieved_docs,
        "inputTokens": input_tokens,
        "outputTokens": output_tokens,
        "queryTimestamp": query_timestamp,
        "model_name": model_name,
        "sources": unique_resources,
        "performanceMetrics": {
            "totalTime": round(total_time, 4),
            "retrievalTime": round(retrieval_time, 4),
            "generationTime": round(generation_time, 4)
        }

    }

    return response, unique_resources, StackTrace
    

def get_translation(query):
    print("\n ------------------------------- begin translation ----------------------------------------------")
    model_name = "Qwen/Qwen2.5-0.5B-Instruct"

    model, tokenizer = load_model_and_tokenizer(model_name)

    messages = [
        {"role": "system", "content": "You are Qwen, a multilingual assistant. If the user provides a query, you should automatically translate it to user wanted language."},
        {"role": "user", "content": query}
    ]

    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )

    model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

    generated_ids = model.generate(
        **model_inputs,
        max_new_tokens=512
    )

    generated_ids = [
        output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
    ]
    response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
    print("\n ------------------------------- end translation ----------------------------------------------")

    return response

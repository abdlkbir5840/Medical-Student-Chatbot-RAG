import json
from config.db_config import sentence_transformer_ef, general_collection
from config.config import MODELS as models, TOKENIZERS as tokenizers
from transformers import AutoModelForCausalLM, AutoTokenizer

def init_genral_collection ():
    print("Initializing general collection...")
    file_path = "./data-json/general_data.json"
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)

    embeddings = []
    metadata_list = []
    for item in data:
        embedding = sentence_transformer_ef([item["text"]]) 
        embeddings.append(embedding[0])
        metadata = {"chunk_id": item["chunk_id"], "source": item["source"]}
        metadata_list.append(metadata)
    general_collection.add(
        ids=[str(index) for index, _ in enumerate(data)],
        documents=[item["text"] for item in data],
        embeddings=embeddings,
        metadatas=metadata_list
    )
    print(f"Uploaded and indexed {len(data)} chunks from JSON file.")
    return {"message": f"Uploaded and indexed {len(data)} chunks from JSON file."}

def load_model_and_tokenizer(model_name):
    if model_name not in models:
        raise ValueError(f"Model {model_name} is not supported.")
    if models[model_name] is None:
        models[model_name] = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype="auto",
            device_map="auto"
        )
        tokenizers[model_name] = AutoTokenizer.from_pretrained(model_name)
    return models[model_name], tokenizers[model_name]
import chromadb
from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings
from chromadb.utils import embedding_functions

EMBED_MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2"
CHROMA_DB_PATH = "./.chroma_db"

sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name = EMBED_MODEL_ID
)

client = chromadb.PersistentClient(
    path = CHROMA_DB_PATH,
    settings = Settings(),
    tenant = DEFAULT_TENANT,
    database = DEFAULT_DATABASE,
)

general_collection = client.get_or_create_collection(
    name = "general_collection",
    embedding_function = sentence_transformer_ef,
    metadata = {
        "hnsw:space":"cosine",
        "hnsw:search_ef":100
    }
)

def get_or_create_collection(name):
    return client.get_or_create_collection(
        name=name,
        embedding_function=sentence_transformer_ef,
        metadata={
            "hnsw:space": "cosine",
            "hnsw:search_ef": 100
        }
    )
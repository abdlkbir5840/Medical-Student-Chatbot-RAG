import chromadb
from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings
from sentence_transformers import SentenceTransformer
from chromadb.utils import embedding_functions
import json

# Initialize the embedding model
print("Initializing the embedding model...")

sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

print("Embedding model initialized.")

with open("./decoded_output.json", "r") as file:
    data = json.load(file)

# Generate embeddings and metadata
print("Generating embeddings and metadata...")
embeddings = []
metadata_list = []

for item in data:
    embedding = sentence_transformer_ef([item["text"]])  # Use the Chroma embedding function
    embeddings.append(embedding[0])  # Extract the embedding from the returned list
    metadata = {"chunk_id": str(item["chunk_id"]), "source": item["source"]}
    metadata_list.append(metadata)


print("Embeddings and metadata generation complete.")

# Initialize Chroma client
print("Initializing Chroma client...")
client = chromadb.PersistentClient(
    path="./.chroma_db",
    settings=Settings(),
    tenant=DEFAULT_TENANT,
    database=DEFAULT_DATABASE,
)

print("Chroma client initialized.")

# Create the collection
print("Creating collection 'book_chunks'...")
collection = client.get_or_create_collection(
    name="collection", 
    embedding_function=sentence_transformer_ef,
    metadata={
        "hnsw:space": "cosine",
        "hnsw:search_ef": 100
    }
)
print("Collection 'book_chunks' created.")

# Add data to the collection
print("Adding data to the collection...")
collection.add(
    ids=[str(index) for index, _ in enumerate(data)],
    documents=[item["text"] for item in data],
    embeddings=embeddings,
    metadatas=metadata_list
)
print("Data added to the collection.")

# Query the collection
query_text = "what is anatomy?"
print("Encoding query text")
query_embedding = sentence_transformer_ef([query_text])[0]  # Use the Chroma embedding function
print("Query embedding generated.")

print("Querying the collection...")
results = collection.query(
    query_embeddings=query_embedding,
    n_results=3  # Return top 3 results
)
print("Query results obtained.")

# Display the results
print("Displaying results:")
for doc, meta in zip(results["documents"], results["metadatas"]):
    print("Chunk:", doc)
    print("Metadata:", meta)

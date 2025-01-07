from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
from sentence_transformers import SentenceTransformer
from io import BytesIO
from docling.backend.pypdfium2_backend import PyPdfiumDocumentBackend
from docling.datamodel.base_models import InputFormat, DocumentStream
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.chunking import HybridChunker
import json
import os
import chromadb
from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings
# from sentence_transformers import SentenceTransformer
from chromadb.utils import embedding_functions
import logging


app = FastAPI()

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

model_name = "Qwen/Qwen2.5-0.5B-Instruct"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# configuration chroma db
sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)
client = chromadb.PersistentClient(
    path="./.chroma_db",
    settings=Settings(),
    tenant=DEFAULT_TENANT,
    database=DEFAULT_DATABASE,
)



# Create or get collections
user_collection = client.get_or_create_collection(
    name="user_collection",
    embedding_function=sentence_transformer_ef,
    metadata={
        "hnsw:space": "cosine",
        "hnsw:search_ef": 100
    }
)

general_collection = client.get_or_create_collection(
    name="general_collection",
    embedding_function=sentence_transformer_ef,
    metadata={
        "hnsw:space": "cosine",
        "hnsw:search_ef": 100
    }
)

pipeline_options = PdfPipelineOptions()
pipeline_options.do_ocr = True
pipeline_options.do_table_structure = True
pipeline_options.table_structure_options.do_cell_matching = True

doc_converter = DocumentConverter(
    format_options={
        InputFormat.PDF: PdfFormatOption(
            pipeline_options=pipeline_options, backend=PyPdfiumDocumentBackend
        )
    }
)

MAX_TOKENS = 1000
OVERLAP_TOKENS = 200 
EMBED_MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2"
tokenizer = AutoTokenizer.from_pretrained(EMBED_MODEL_ID)
chunker = HybridChunker(
    tokenizer=tokenizer, 
    max_tokens=MAX_TOKENS,
)

# chunker = HybridChunker(tokenizer=AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2"))

@app.get('/get_collections/')
async def delete_collection_by_name():
    collection = client.get_collection('general_collection')
    
    return {"collection":collection}

@app.delete('/delete/')
async def delete_collection_by_name():
    client.delete_collection(name="user_collection")
    return {"message":"collection deletef success"}

@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    """Handles user-specific PDF uploads and stores chunks in the user collection."""
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    print(f"File uploaded: {file.filename}")
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Uploaded file is not a PDF")
    
    if len(await file.read()) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
        
    file.file.seek(0)
    try:
        pdf_bytes = await file.read()
        buf = BytesIO(pdf_bytes)
        file_name = file.filename
        source = DocumentStream(name=file.filename, stream=buf)
        print("before doc converter")
        result = doc_converter.convert(source)
        print("after doc converter")
        doc = result.document

        chunk_iter = chunker.chunk(doc)
        chunks = []
        prev_text = ""
        for i, chunk in enumerate(chunk_iter):
            overlap_text = prev_text[-OVERLAP_TOKENS:] if len(prev_text) > OVERLAP_TOKENS else prev_text
            combined_text = overlap_text + chunk.text
            chunks.append({"chunk_id": i, "text": combined_text})
            prev_text = chunk.text

        embeddings = []
        metadata_list = []

        for chunk in chunks:
            embedding = sentence_transformer_ef([chunk["text"]]) 
            embeddings.append(embedding[0])
            metadata = {"chunk_id": chunk["chunk_id"], "source": file_name}
            metadata_list.append(metadata)
        

        user_collection.add(
            ids=[str(index) for index, _ in enumerate(chunks)],
            documents=[chunk["text"] for chunk in chunks],
            embeddings=embeddings,
            metadatas=metadata_list
        )

        return {"message": f"Uploaded and indexed {len(chunks)} chunks from user PDF {file_name}."}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing PDF: {str(e)}")

@app.get("/upload-json/")
async def upload_json_from_file():
    """Reads a JSON file from the directory and processes it."""
    file_path = "./data-json/decoded_output.json"

    # Check if the file exists
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found in the specified directory.")

    try:
        # Read and parse the JSON file
        with open(file_path, "r", encoding="utf-8") as file:
            data = json.load(file)

        if not isinstance(data, list):
            raise HTTPException(status_code=400, detail="Invalid JSON format. Expected a list of chunks.")

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

        return {"message": f"Uploaded and indexed {len(data)} chunks from JSON file."}

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file format.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing JSON: {str(e)}")
# Query Endpoint
class QueryInput(BaseModel):
    query: str
    index: str


# Query Endpoint
# @app.post("/query/")
# async def query_index(input: QueryInput):
#     if input.index == "general":
#         collection = general_collection
#     elif input.index == "user":
#         collection = user_collection
#     else:
#         raise HTTPException(status_code=400, detail="Invalid index specified. Use 'general' or 'user'.")
#     print("before query embedded")
#     query_embedding = sentence_transformer_ef([input.query])[0] 
#     print("after query embedded")
#     print("before query search")
#     results = collection.query(
#         query_embeddings=query_embedding,
#         n_results=5
#     )

#     documents = results.get("documents", [[]])[0] 
#     context = "\n".join(documents)   
#     metadatas = results.get("metadatas", [[]])[0] 
#     resources = [meta.get("source", "Unknown source") for meta in metadatas]
#     unique_resources = list(set(resources))

#     # "If the user greets you (e.g., hi, hello, how are you), respond only with 'Hello! How can I assist you today? 😊' and nothing else.\n"
#     template = (
#         "You are an AI assistant that answers questions based on the provided context.\n"
#         "If the information is not found in the context, respond with 'I don't know' and nothing else.\n"
#         f"Context:\n{context}\n"
#         f"User: {input.query}\n"
#         "Assistant: "
#     )

#     # Prepare model inputs
#     model_inputs = tokenizer([template], return_tensors="pt").to(model.device)

#     # Generate response from model
#     generated_ids = model.generate(
#         **model_inputs,
#         max_new_tokens=528,
#         pad_token_id=tokenizer.pad_token_id,
#         eos_token_id=tokenizer.eos_token_id,
#     )


#     generated_text = tokenizer.decode(generated_ids[0], skip_special_tokens=True)
#     response_start = generated_text.find("Assistant:") + len("Assistant:")
#     response = generated_text[response_start:].strip()

#     # if response.startswith("Hello! How can I assist you today? 😊"):
#     #     response = "Hello! How can I assist you today? 😊"
#     return {"response": response, "sources": unique_resources}

@app.post("/query/")
async def query_index(input: QueryInput):
    # Determine the appropriate collection
    if input.index == "general":
        collection = general_collection
    elif input.index == "user":
        collection = user_collection
    else:
        raise HTTPException(status_code=400, detail="Invalid index specified. Use 'general' or 'user'.")

    # Generate query embedding and retrieve results
    query_embedding = sentence_transformer_ef([input.query])[0]
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=5
    )

    # Extract context and metadata
    documents = results.get("documents", [[]])[0]
    context = "\n".join(documents)
    metadatas = results.get("metadatas", [[]])[0]
    resources = [meta.get("source", "Unknown source") for meta in metadatas]
    unique_resources = list(set(resources))

    # Prepare Qwen-style chat template
    messages = [
        {"role": "system", "content": "You are an AI assistant that answers questions based on the provided context. If the information is not found in the context, respond with 'I don't know' and nothing else."},
        {"role": "system", "content": f"Context:\n{context}"},
        {"role": "user", "content": input.query}
    ]

    chat_template = """
        System: You are a helpful assistant.
        User: {user_message}
        Assistant:
    """
    chat_text = chat_template.format(user_message=input.query)
    model_inputs = tokenizer([chat_text], return_tensors="pt").to(model.device)

    generated_ids = model.generate(
        **model_inputs,
        max_new_tokens=512,
        pad_token_id=tokenizer.pad_token_id,
        eos_token_id=tokenizer.eos_token_id,
    )

    response = tokenizer.decode(generated_ids[0], skip_special_tokens=True).strip()

    return {"response": response, "sources": unique_resources}

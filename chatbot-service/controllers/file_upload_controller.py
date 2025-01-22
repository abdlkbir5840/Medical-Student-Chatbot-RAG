from fastapi import UploadFile, WebSocket, HTTPException
import uuid
from io import BytesIO
from docling.datamodel.base_models import DocumentStream
from config.docling_scrapper_config import doc_converter, chunker
from config.config import OVERLAP_TOKENS
from config.db_config import client, sentence_transformer_ef, general_collection

async def upload_pdf(file: UploadFile,  store_type: str, indexName: str, websocket: WebSocket):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Uploaded file is not a PDF")
    
    if len(await file.read()) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
        
    file.file.seek(0)
    file_name = file.filename
    pdf_bytes = await file.read()
    buf = BytesIO(pdf_bytes)

    print(f"Processing PDF: Scrapping content...")
    await websocket.send_text("Processing PDF: Scraping content...")
    source = DocumentStream(name=file.filename, stream=buf)
    result = doc_converter.convert(source)
    doc = result.document

    print(f"Processing PDF: Chunk results...")
    await websocket.send_text("Processing PDF: Chunking results...")
    chunk_iter = chunker.chunk(doc)
    chunks = []
    prev_text = ""
    for i, chunk in enumerate(chunk_iter):
        overlap_text = prev_text[-OVERLAP_TOKENS:] if len(prev_text) > OVERLAP_TOKENS else prev_text
        combined_text = overlap_text + chunk.text
        chunks.append({"chunk_id": i, "text": combined_text})
        prev_text = chunk.text

    print(f"Processing PDF: Embedding results...")
    await websocket.send_text("Processing PDF: Embedding results...")
    embeddings = []
    metadata_list = []
    for chunk in chunks:
        embedding = sentence_transformer_ef([chunk["text"]]) 
        embeddings.append(embedding[0])
        metadata = {"chunk_id": chunk["chunk_id"], "source": file_name}
        metadata_list.append(metadata)
    
    unique_ids = [str(uuid.uuid4()) for _ in chunks]

    print(f"Processing PDF: Storing data in Vector DB...")
    await websocket.send_text("Processing PDF: Storing data in Vector DB (user index)...")
    user_collection = client.get_or_create_collection(
        name = indexName,
        embedding_function = sentence_transformer_ef,
        metadata = {
            "hnsw:space":"cosine",
            "hnsw:search_ef":100
        }
    )
    user_collection.add(
        ids=unique_ids,
        documents=[chunk["text"] for chunk in chunks],
        embeddings=embeddings,
        metadatas=metadata_list
    )
    if store_type == "user_and_general":
        await websocket.send_text("Processing PDF: Storing data in Vector DB (general index)...")
        general_collection.add(
            ids=unique_ids,
            documents=[chunk["text"] for chunk in chunks],
            embeddings=embeddings,
            metadatas=metadata_list
        )
    await websocket.send_text(f"Uploaded and indexed {len(chunks)} chunks from user PDF {file_name} to index {store_type}.")
    return f"Uploaded and indexed {len(chunks)} chunks from user PDF {file_name} to index {store_type}."
import os
import json
from pathlib import Path
from docling.backend.pypdfium2_backend import PyPdfiumDocumentBackend
from docling.datamodel.base_models import InputFormat, DocumentStream
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.chunking import HybridChunker
from io import BytesIO
from transformers import AutoTokenizer

# Configure the pipeline options and document converter
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

EMBED_MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2"
tokenizer = AutoTokenizer.from_pretrained(EMBED_MODEL_ID)

MAX_TOKENS = 1000
OVERLAP_TOKENS = 200 

chunker = HybridChunker(
    tokenizer=tokenizer, 
    max_tokens=MAX_TOKENS,
)

# Path to the folder containing PDFs
folder_path = "./z-library-pdf"  # Replace with your actual folder path

# Directory to save the JSON file
output_dir = Path("./rag-data")
output_dir.mkdir(parents=True, exist_ok=True)  # Create directory if it doesn't exist

output_file = output_dir / "rag-chunks.json"

try:
    folder = Path(folder_path)
    if not folder.is_dir():
        raise Exception(f"Provided path {folder_path} is not a directory.")
    
    all_chunks = []

    # Iterate through all PDFs in the folder
    for pdf_file in folder.glob("*.pdf"):
        print(f"Processing PDF: {pdf_file.name}")  # Print which PDF is being processed
        
        with open(pdf_file, "rb") as f:
            pdf_bytes = f.read()
        print(f"Read {len(pdf_bytes)} bytes from {pdf_file.name}.")  # Debug for reading file
        
        buf = BytesIO(pdf_bytes)
        source = DocumentStream(name=pdf_file.name, stream=buf)
        
        print(f"Converting PDF {pdf_file.name} to DocumentStream.")  # Debug for conversion
        result = doc_converter.convert(source)
        doc = result.document
        print(f"Document conversion completed for {pdf_file.name}.")  # Debug for conversion complete
        
        print("Starting chunking process.")
        chunk_iter = chunker.chunk(doc)
        print("Chunking process initialized.")
        
        prev_text = ""
        for i, chunk in enumerate(chunk_iter):
            print(f"Processing chunk {i} for {pdf_file.name}.")
            overlap_text = prev_text[-OVERLAP_TOKENS:] if len(prev_text) > OVERLAP_TOKENS else prev_text
            combined_text = overlap_text + chunk.text
            all_chunks.append({
                "chunk_id": i, 
                "text": combined_text,
                "source": pdf_file.name  # Include the source PDF file name
            })
            prev_text = chunk.text
        print(f"Finished processing chunks for {pdf_file.name}.")
        print(f"End Processing PDF: {pdf_file.name}")  # Print which PDF is being processed

    # Save all chunks to the specified JSON file
    print(f"Saving all chunks to {output_file}.")
    with open(output_file, "w") as json_file:
        json.dump(all_chunks, json_file, indent=4)
    print(f"PDF processing completed. Chunks saved to '{output_file}'.")

except Exception as e:
    print(f"Error processing folder: {str(e)}")

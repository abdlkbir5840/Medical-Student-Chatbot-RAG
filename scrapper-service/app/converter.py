from docling.backend.pypdfium2_backend import PyPdfiumDocumentBackend
from docling.datamodel.base_models import InputFormat, DocumentStream
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.chunking import HybridChunker
from io import BytesIO
from fastapi import HTTPException, UploadFile, File
from transformers import AutoTokenizer


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

async def convert_pdf_to_chunks(file: UploadFile = File(...)):
    """
    Converts the uploaded PDF file to text chunks with overlap.
    """
    try:
        pdf_bytes = await file.read()
        
        buf = BytesIO(pdf_bytes)
        source = DocumentStream(name=file.filename, stream=buf)
        result = doc_converter.convert(source)
        doc = result.document
        
        chunk_iter = chunker.chunk(doc)
        
        chunks = []
        prev_text = ""
        for i, chunk in enumerate(chunk_iter):
            overlap_text = prev_text[-OVERLAP_TOKENS:] if len(prev_text) > OVERLAP_TOKENS else prev_text
            combined_text = overlap_text + chunk.text
            chunks.append({"chunk_id": i, "text": combined_text})
            prev_text = chunk.text
        
        return chunks
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing PDF: {str(e)}")
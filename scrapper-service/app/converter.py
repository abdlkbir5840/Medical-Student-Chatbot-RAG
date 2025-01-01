from docling.backend.pypdfium2_backend import PyPdfiumDocumentBackend
from docling.datamodel.base_models import InputFormat, DocumentStream
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.chunking import HybridChunker
from io import BytesIO
from fastapi import HTTPException, UploadFile, File

# Initialize the pipeline options and document converter
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

tokenizer = "BAAI/bge-small-en-v1.5"
MAX_TOKENS = 512

chunker = HybridChunker(
    tokenizer=tokenizer, 
    max_tokens=MAX_TOKENS,
)

async def convert_pdf_to_chunks(file: UploadFile = File(...)):
    """
    Converts the uploaded PDF file to text chunks.
    """
    try:
        # Read the file bytes
        pdf_bytes = await file.read()
        
        # Convert the PDF to a document using DocumentStream
        buf = BytesIO(pdf_bytes)
        source = DocumentStream(name=file.filename, stream=buf)
        result = doc_converter.convert(source)
        doc = result.document
        
        # Chunk the document
        chunk_iter = chunker.chunk(doc)
        
        # Collect the chunks into a list of dictionaries
        chunks = []
        for i, chunk in enumerate(chunk_iter):
            chunks.append({"chunk_id": i, "text": chunk.text})
        
        return chunks
    
    except Exception as e:
        # If any error occurs, raise an HTTP exception with the error message
        raise HTTPException(status_code=400, detail=f"Error processing PDF: {str(e)}")


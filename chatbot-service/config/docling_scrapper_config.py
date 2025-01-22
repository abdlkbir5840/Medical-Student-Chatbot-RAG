from docling.backend.pypdfium2_backend import PyPdfiumDocumentBackend
from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.chunking import HybridChunker
from transformers import AutoTokenizer
from config.config import  MAX_TOKENS, EMBED_MODEL_ID

pipeline_options = PdfPipelineOptions()
pipeline_options.do_ocr = True
pipeline_options.do_table_structure = True
pipeline_options.table_structure_options.do_cell_matching = True

doc_converter = DocumentConverter(
    format_options = {
        InputFormat.PDF: PdfFormatOption(
            pipeline_options = pipeline_options, 
            backend = PyPdfiumDocumentBackend
        )
    }
)

tokenizer = AutoTokenizer.from_pretrained(EMBED_MODEL_ID)
chunker = HybridChunker(
    tokmizer = tokenizer,
    max_tokens = MAX_TOKENS,
)


from fastapi import FastAPI, File, UploadFile, HTTPException
from app.converter import convert_pdf_to_chunks

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the PDF to Text Chunks API!"}

@app.post("/convert_pdf/")
async def convert_pdf(file: UploadFile = File(...)):
    print("Converting PDF...")
    """
    Convert uploaded PDF file to text chunks.
    """
    # Check if file is uploaded
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    print(f"File uploaded: {file.filename}")
    # Check the file content type
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Uploaded file is not a PDF")
    
    # Check the file size (example: ensure it's not empty)
    if len(await file.read()) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    
    # Reset file pointer after reading to ensure we can process the file
    file.file.seek(0)

    # Your existing code to process the PDF file goes here
    chunks = await convert_pdf_to_chunks(file)
    
    return {"chunks": chunks}
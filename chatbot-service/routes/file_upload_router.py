from fastapi import UploadFile, File, Form, HTTPException, Depends
from fastapi import APIRouter
from pydantic import BaseModel
from controllers.file_upload_controller import upload_pdf
from connections import active_connections 

router = APIRouter()

class UploadPDFInput(BaseModel):
    store_type: str
    indexName: str
    process_id: str

@router.post("/upload-pdf")
async def upload_user_pdf(file: UploadFile = File(...),  store_type: str = Form(...), indexName: str = Form(...), process_id: str = Form(...),):
    if process_id in active_connections:
        websocket = active_connections[process_id]
        response = await upload_pdf(file, store_type, indexName, websocket)
        return {"message": response}
    else:
        raise HTTPException(status_code=400, detail="Invalid process_id or WebSocket connection not active")
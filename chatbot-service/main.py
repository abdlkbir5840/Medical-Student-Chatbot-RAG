from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.init_general_collection_router import router as init_general_collection_router
from routes.websocket_router import router as websocket_router
from routes.llm_router import router as llm_router
from routes.file_upload_router import router as file_upload_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (replace '*' with specific domains in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Register routes
app.include_router(init_general_collection_router, prefix="/init", tags=["INIT"])
app.include_router(websocket_router, prefix="/ws", tags=["WS"])
app.include_router(llm_router, prefix="/llm", tags=["LLM"])
app.include_router(file_upload_router, prefix="/files", tags=["File Upload"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Assistant API!"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import APIRouter, WebSocket
from connections import active_connections 

router = APIRouter()


@router.websocket("/{process_id}")
async def websocket_endpoint(websocket: WebSocket, process_id: str):
    if not process_id or process_id == "undefined":  
        await websocket.close(code=403)
        return
    print(f"New connection with process_id: {process_id}")
    await websocket.accept()
    active_connections[process_id] = websocket
    try:
        while True:
            await websocket.receive_text()
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        # Clean up the active connections
        active_connections.pop(process_id, None)
        await websocket.close()
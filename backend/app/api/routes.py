from fastapi import APIRouter, HTTPException,FastAPI, WebSocket, WebSocketDisconnect

from app.models.filters import FilterRequest,Data
from typing import List
from app.services.filter_service import detect_filters
from app.scraping.amazon.main_scripts import start_scraping

router = APIRouter()

@router.post("/detect-filters")
def detect_user_filters(request: FilterRequest):
    try:    
        result = detect_filters(request.query)
        return result
    except ValueError as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid query: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/get-data")
async def get_data(data: List[Data]):
    filters=None
    for item in data:
        query = item.query  # Access the query
        filters = item.filters  # Access the filters dictionary
        print(query, filters)
    try:    
        result = start_scraping(filters)
        return result
    except ValueError as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid query: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
# WebSocket endpoint for streaming product data
@router.websocket("/ws/get-data")
async def websocket_get_data(websocket: WebSocket):
    await websocket.accept()
    
    try:
        data = await websocket.receive_json()  # Receive data from client
        print(f"Received data: {data}")
        #
        result = await start_scraping(data, websocket)
        await websocket.send_json(result)

        await websocket.close()
    
    except WebSocketDisconnect:
        print("Client disconnected")
        await websocket.close()
from fastapi import APIRouter
from helpers import init_genral_collection
router = APIRouter()


@router.get("/genral-collection")
async def init_general_index():
    return init_genral_collection()
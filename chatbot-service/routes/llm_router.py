from fastapi import APIRouter
from pydantic import BaseModel
from controllers.llm_controller import get_generate_response, get_translation

router = APIRouter()

class QueryInput(BaseModel):
    query: str
    index_name: str
    model_name: str
    search_type: str

@router.post("/query/")
async def query_index(input: QueryInput):
    print("From Query Endpoint")
    query = input.query
    collection_name = input.index_name
    model_name = input.model_name
    search_type = input.search_type
    response, unique_resources, StackTrace = get_generate_response(query, collection_name, model_name, search_type)
    return {"response": response, "sources": unique_resources, "stackTrace": StackTrace}


class TranslateQuery(BaseModel):
    query: str

@router.post("/translate/")
async def translate_query(input: TranslateQuery):
    query = input.query
    translated_query = get_translation(query)
    return {"translatedQuery": translated_query}
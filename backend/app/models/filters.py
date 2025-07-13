from pydantic import BaseModel
from typing import Dict, Any

class FilterRequest(BaseModel):
    query: str


class Data(BaseModel):
    query: str
    filters: Dict[str, Any]  # This will accept any additional filter keys as key-value pairs

    class Config:
        extra = "allow"
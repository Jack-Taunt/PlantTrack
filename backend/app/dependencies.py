from typing import Annotated
from fastapi import Header, HTTPException

async def get_token_header(x_token: Annotated[str, Header()]):
    if x_token != "sample_token_1":
        raise HTTPException(status_code=400, detail="X-Token header invalid")
    
async def get_query_token(token: str):
    if token != "sample_token_2":
        raise HTTPException(status_code=400, detail="no token provided")
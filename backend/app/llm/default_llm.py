from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
import os
from dotenv import load_dotenv

load_dotenv()  

default_llm = ChatGroq(
    model="deepseek-r1-distill-llama-70b",
    temperature=1,
    groq_api_key= os.getenv('groq_api_key')
)

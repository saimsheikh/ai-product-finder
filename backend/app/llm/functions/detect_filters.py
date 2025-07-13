from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
import os
import json
from app.llm.default_llm import default_llm


def generate_filters(user_input):
    """
    This function takes a user's natural language input,
    sends it to a Groq model, and parses the returned filters.
    """
    # Prepare the prompt for the LLM to parse the query
    prompt = PromptTemplate.from_template("Extract filters and search input from this product query: {user_input}. Return the results as a JSON object with the following filter categories: 'query','gender', 'category', 'color', 'price_range', 'brand', 'size', 'material', 'ratings', 'style', 'season', 'occasion' and 'features', also add filters which are not mentioned but user input giving a gesture of that.customer reviews and price should be a number and in range like min and max. If a filter type is not present in the user's input, set its value to None.")
    chain_extract = prompt | default_llm
    res = chain_extract.invoke(input={"user_input": user_input})
    try:
        json_parser = JsonOutputParser()
        res = json_parser.parse(res.content)
    except OutputParserException:
            raise OutputParserException("Context too big. Unable to parse jobs.")
    return res if isinstance(res, list) else [res]

def generate_needful_filters(aval, need):
    """
    This function takes a user's needed filters and all available filters,
    sends it to a Groq model, and returns the final list of filters to apply.
    """
    # Check if available filters is empty or None
    if not aval or aval == {}:
        print("No available filters found, returning empty list")
        return []
    
    # Prepare the prompt for the LLM to parse the query
    prompt = PromptTemplate(
        template=f"""
        You are given a list of available filters and a user's query with specific needs. 
        Your task is to match the user's needs with the available filters and provide a final list of filters to apply.
        
        The available filters are as follows (filter names and their types):
        {{aval}}
        
        The needed filters provided by the user are:
        {{need}}
        
        Your response should return the final list of filters with keys matching the available filter names, and the values 
        should be taken from the user's needs. If a filter type is not present in the user's input, set its value to None.
        Please match the needed filters as follows:
        1. Match 'gender' to 'Gender' filter, 'price_range' to 'Price Range' filter, 'ratings' to 'Customer Reviews' filter, etc.
        2. The value should come from the needed filters, like the 'gender' value of 'men' should be applied to the 'Gender' filter.
 
 
        Make sure to match the needed filters with the available filters, and return the result.
        """,
        input_variables=["aval", "need"]  # Define the input variables here
    )
    chain_extract = prompt | default_llm
    res = chain_extract.invoke(input={"aval": json.dumps(aval, indent=4),"need": json.dumps(need, indent=4)})
    try:
        json_parser = JsonOutputParser()
        res = json_parser.parse(res.content)
    except Exception as e:
        print(f"Error parsing LLM response: {e}")
        print(f"Available filters: {aval}")
        print(f"Needed filters: {need}")
        raise Exception("Context too big. Unable to parse jobs.")
    return res if isinstance(res, list) else [res]
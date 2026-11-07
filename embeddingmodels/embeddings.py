import os
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings

load_dotenv()

embeddings = OpenAIEmbeddings(
    model = "openai/text-embedding-3-large",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    openai_api_base="https://openrouter.ai/api/v1",
    dimensions=64
)

texts = [
    "Hi how are you",
    "What are you doing",
    "What is your Name"
]

vector = embeddings.embed_documents(texts)

print(vector)

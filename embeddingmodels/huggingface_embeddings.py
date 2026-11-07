from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
load_dotenv()

embedding = HuggingFaceEmbeddings(
    model_name = "all-MiniLM-L6-v2"
)

texts = [
    "Hi how are you",
    "What are you doing",
    "What is your Name"
]

vector = embedding.embed_documents(texts)

print(vector)
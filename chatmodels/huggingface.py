from dotenv import load_dotenv
load_dotenv()

from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint

llm = HuggingFaceEndpoint(
    repo_id= "meta-llama/Llama-3.2-3B-Instruct"
)

model = ChatHuggingFace(llm = llm)

response = model.invoke("What is the date and day today in india")

print(response.content)
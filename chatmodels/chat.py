from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI

load_dotenv()

#temperature less = reasoning , good for math , low creativity 
# high temperature = more creativity 
model = ChatMistralAI(
    model = "ministral-3b-2512",
    temperature=0.9    
) 


response = model.invoke("write a poem on beautiful woman named akanksha it should be rhyming ")

print(response.content)
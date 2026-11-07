from dotenv import load_dotenv
load_dotenv()
from langchain_openrouter import ChatOpenRouter

model = ChatOpenRouter(model = "auto")

response = model.invoke("tell me in detail about laquora in ai engineer field along with its variatans ")

print(response.content)
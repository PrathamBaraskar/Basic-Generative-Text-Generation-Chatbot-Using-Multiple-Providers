from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI
from langchain_core.messages import AIMessage, SystemMessage, HumanMessage

load_dotenv()

#temperature less = reasoning , good for math , low creativity 
# high temperature = more creativity 
model = ChatMistralAI(
    model = "ministral-3b-2512",
    temperature=0.5    
) 

print("Choose your AI Mode")
print("Press 1 for Angry Mode")
print("Press 2 for Sad Mode")
print("Press 3 for Funny Mode")
choice = int(input("Enter your Choice"))

if choice == 1:
    mode = "You are an angry ai agent. you should respond aggresively and impatiently"
elif choice == 2:
    mode = "you are a sad ai agent. you should respond sadly and depressingly"
else:
    mode = "you are a funny ai agent"  


messages = [
    SystemMessage(content = mode)
]
print("-----------------Welcome type 0 to exit the application----------------------")
while True:
    
    prompt = input("You :")
    messages.append(HumanMessage(content = prompt))
    if prompt == "0":
        break
    response = model.invoke(messages)
    messages.append(AIMessage(content = response.content))

    print("Bot :",response.content)

print(messages)    
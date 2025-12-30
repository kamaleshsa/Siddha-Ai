import asyncio
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found in .env")
    exit(1)

genai.configure(api_key=api_key)

model = genai.GenerativeModel(
    "gemini-1.5-flash"
)  # Fallback to known stable model first
# model = genai.GenerativeModel("gemini-2.0-flash-exp")


async def test_chat():
    try:
        print("Starting chat session...")
        chat = model.start_chat(history=[])
        print("Sending message async...")
        response = await chat.send_message_async("Hello, can you hear me?")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    asyncio.run(test_chat())

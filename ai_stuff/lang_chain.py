from langchain.llms import HuggingFacePipeline
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

# Load LLaMA model and tokenizer
model_name = "meta-llama/Llama-2-7b-chat-hf"  # Example: LLaMA-2 7B Chat
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, device_map="auto")

# Create a pipeline for text generation
pipeline = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    max_length=200,
    temperature=0.7,
    top_p=0.9
)

# Use in LangChain
llm = HuggingFacePipeline(pipeline=pipeline)

# Test the model
response = llm("What is the capital of France?")
print(response)

from langchain_core.prompts import ChatPromptTemplate
system = """
You are a world-class technical documentation writer for source code. 
Make sure to provide clear, concise documentation, adhering to the following guidelines:

1. Use simple and understandable language, keeping the documentation accessible to both beginners and advanced users.
2. Include references to installed packages and explain their purpose, usage, and examples where relevant.
3. Format the documentation in **Markdown** with proper headers, lists, and code blocks for clarity.
4. Keep the documentation brief but informative, focusing on key details like function/method purpose, parameters, and expected output.
5. Specify any npm package installations that are required, and provide installation commands when relevant.
6. For npm packages, provide a brief explanation of the tool or library's purpose, how it integrates with the code, and usage examples.
"""
prompt = ChatPromptTemplate.from_messages([
    ("system", system),
    ("user", "{input}")
])
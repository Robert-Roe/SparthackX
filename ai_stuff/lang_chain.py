from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Load the model and tokenizer
#model_name = "from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Load the model and tokenizer
model_name = "deepseek-ai/DeepSeek-R1"

tokenizer = AutoTokenizer.from_pretrained(model_name)

# Load the model with FP8 support
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,  # Change this to torch.float8_e5m2 if FP8 is supported
    device_map="auto"
)

# Define the input prompt
prompt = "Write a Python function to compute the Fibonacci sequence."

# Tokenize the input
inputs = tokenizer(prompt, return_tensors="pt").to("cuda")

# Generate output
with torch.no_grad():
    output = model.generate(**inputs, max_length=200)

# Decode and print the output
print(tokenizer.decode(output[0], skip_special_tokens=True))


tokenizer = AutoTokenizer.from_pretrained(model_name)

# Load the model with FP8 support
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float16,  # Change this to torch.float8_e5m2 if FP8 is supported
    device_map="auto"
)

# Define the input prompt
prompt = "Write a Python function to compute the Fibonacci sequence."

# Tokenize the input
inputs = tokenizer(prompt, return_tensors="pt").to("cuda")

# Generate output
with torch.no_grad():
    output = model.generate(**inputs, max_length=200)

# Decode and print the output
print(tokenizer.decode(output[0], skip_special_tokens=True))

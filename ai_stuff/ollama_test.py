import ollama  # Local import to avoid circular issues
import json

def generate_documentation():
    # Load examples from the JSON file
    with open('training.json', 'r') as f:
        data = json.load(f)

    # Build the prompt dynamically from the examples in the JSON file
    standard = """You are an expert in writing clear and detailed code documentation. Please use the following examples to guide your responses \n\n"""
    
    
    for example in data["examples"]:
        standard += f"Example:\nCode: {example['code']}\nDocumentation: {example['documentation']}\n\n"
    
    standard += """
            Do not include any <think> sections in your response!
            1. Use simple and understandable language, keeping the documentation accessible to both beginners and advanced users.
            2. Include references to installed packages and explain their purpose, usage, and examples where relevant.
            3. Format the documentation in **Markdown** with proper headers, lists, and code blocks for clarity.
            4. Keep the documentation brief but informative, focusing on key details like function/method purpose, parameters, and expected output.
            5. Specify any npm package installations that are required, and provide installation commands when relevant.
            6. For npm packages, provide a brief explanation of the tool or library's purpose, how it integrates with the code, and usage examples.
            7. make sure to use the escape /n every line

            The following line of code will be what we would like documentation for. Please use all prior input to help format your documentation.
            """

    run = True
    while(run):
        input_code = input("Enter Your Code: ")
        prompt = standard + input_code

        # Call the Ollama model
        response = ollama.chat(model='deepseek-r1:1.5b', messages=[{"role": "user", "content": prompt}])

        # Print the generated documentation
        print(response['message']['content'])

generate_documentation()

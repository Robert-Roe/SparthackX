import google.generativeai as genai
import sys

genai.configure(api_key="AIzaSyCJuehOEYSedPH2cy1BblrrJc_ljFGyYag")
model = genai.GenerativeModel("gemini-1.5-flash")

standard = """
Write consise, clear code documentation. Use the following guideline: \n
1. Identify the language \n
2. Write the proper documentation based on the selected language
3. Use simple and understandable language \n
4. Format the documentation in **Markdown** with proper headers, lists, and code blocks for clarity. \n
5. Keep the documentation brief but informative \n
Here's some examples: \n
C++: \n
/** \n
 * @param num1 The first integer to be added \n
* @param num2 The second integer to be added \n
 * @return The sum of num1 and num2 \n
 */ \n

Python: \n
output": "\"\"\"\nfibonacci - Returns the nth Fibonacci number.\n\n@param n: The position in the Fibonacci sequence.\n@return: The nth Fibonacci number.\n\"\"\"" \n

JavaScript: \n
output: "/**\n * findIndex - Finds the index of a value in an array.\n * \n * @param {array} arr - The array to search.\n * @param {any} value - The value to find.\n * @returns {number} The index of the value in the array, or -1 if not found.\n */" \n
HERE's the code: \n
"""
input_code = sys.argv[-1]
question = standard + input_code
response = model.generate_content(question)
print(response.text)
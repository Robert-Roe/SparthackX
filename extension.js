// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const fs = require('fs')
	
const execSync = require('child_process');

const { GoogleGenerativeAI } = require("@google/generative-ai");

class CodeLensProvider {
	async provideCodeLenses(document, token){
		const symbols = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', document.uri);
		if (!Array.isArray(symbols)) {
			console.error("Failed to retrieve document symbols.");
			return [];
		}
		const documentation = [];
		console.log(symbols);
		symbols.forEach(symbol => {
			if(symbol.kind === vscode.SymbolKind.Function || symbol.kind === vscode.SymbolKind.Method){
				const start_pos = symbol.location.range.start;
				const function_name = symbol.name; 
				
				//symbol.detail = 1;
				

				const function_return_type = symbol.return_type;


			
			const codeLens = new vscode.CodeLens(new vscode.Range(start_pos,start_pos)); 
			codeLens.command = {
				title: `Generate Documentation for ${function_name}`,
				command: 'architext.generateDocumentation',
				arguments: [document, function_name, start_pos, symbol.range]
			}; 
			documentation.push(codeLens)
		} 
		});
		return documentation; 
	}
}


async function clearJsonFile() {
    const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const filePath = path.join(workspaceFolder, 'api_docs.json');
    
    try {
        // Clear the contents of the file by writing an empty object or array
        await vscode.workspace.fs.writeFile(vscode.Uri.file(filePath), Buffer.from(JSON.stringify([]))); // Empty array
        vscode.window.showInformationMessage('api_docs.json has been cleared!');
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to clear file: ${error.message}`);
    }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	const genAI = new GoogleGenerativeAI("AIzaSyAh6Y7o7a-mmXCunX8t6WY-3z_NdxcTz9M");
	const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

	const standard = `
		Write consise, clear code documentation. Use the following guideline: \n
		1. Write the proper documentation based on the selected language
		2. Use simple and understandable language \n
		3. Format the documentation in **Markdown** with proper headers, lists, and code blocks for clarity. \n
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
		output: "/**\n * findIndex - Finds the index of a value in an array.\n * \n * @param {array} arr - The array to search.\n * @param {any} value - The value to find.\n * @returns {number} The index of the value in the array, or -1 if not found.\n */" \n`;

	console.log('Congratulations, your extension "architext" is now active!');



	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	//const disposable = vscode.commands.registerCommand('architext.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World from Architext!');
	//});
	//context.subscriptions.push(disposable);

	let totDocuments = []; 
	const documentation = vscode.commands.registerCommand('architext.generateDocumentation', async function(document_uri, function_name, function_pos, range, detail) { 
		const editor = await vscode.window.activeTextEditor; 
		if(!editor){
			vscode.window.showErrorMessage('No active editor currently');
			return; 
		}
		vscode.window.showInformationMessage('Generate documents...'); 
		const language = editor.document.languageId; 
		console.log(document_uri," ",function_name," ",language, " ", function_pos); 

		let command = ""
		command = "give me documentation for this " + language + " function " + function_name + " function but leave out the function in your response and use \n to break lines and always make it exactly 65 lines long counting each \n as a line.";
		command = command+"\n"+ editor.document.getText(range);
		// console.log("This is being passed to ai:\n", command);

		const question = standard + command;
		
    	const result = await model.generateContent(question);
    	const output = await result.response.text();

		// const temp_description = await model.generateContent("Now take this documentation:\n " + output + "and return just the description portion of it, unaltered.");
		// const formatted_description = await temp_description.response.text();


		// const output_json = {"func_name":function_name, "parameter_names": function_params,"parameter_types": function_params, "return_type": function_return_type,"description": formatted_description, "documented_text":output};
		// console.log(typeof(output_json));

		// const output = execSync.execSync("python3 /home/tutu/ArchiText/SparthackX/ai_stuff/ollama_test.py", {
		// 	input: command, 
		// 	encoding: "utf-8"
		// });

		
		let documentation_template = "";
		let begin = ""
		let end = ""
		switch (language) {
			case "javascript":
			case "typescript":
				documentation_template =`/**\n ${output} **/\n`;
				begin = `/**`;
				end = `**/`;
				break
			case "python":
				documentation_template = `"""\n${function_name} - Description\n\n:param param1: Description\n:return: Description\n"""\n`;
				begin = `"""`;
				end = `"""`;
				break;
			case "java":
			case "csharp":
				begin = `/**`;
				end = `**/`;
				documentation_template = `/**\n ${output} **/\n`;
				break;
			case "c":
			case "cpp":
				documentation_template = `/**\n * ${function_name} - Description\n *\n * @param param1 Description\n * @return Description\n */\n`;
				begin = `/**`;
				end = `**/`;
				break;
			case "ruby":
				documentation_template = `/**\n ${output} **/\n`;
				break;
			case "php":
				documentation_template = `/**\n ${output} **/\n`;
				break;
			case "go":
				documentation_template = `/**\n ${output} **/\n`;
				break; 
			case "rust":
				documentation_template = `/**\n ${output} **/\n`;
				break; 
		}; 
		console.log(function_pos); 
		editor.edit(editBuilder => { 
			// check for hint above
			const line_above = function_pos.line - 1;
			const line_above_text = editor.document.lineAt(line_above).text;
			if(line_above_text.includes(end)) {
				// there alr exists a documentation, find the true begining
				let true_begin_line = line_above - 1
				while(true_begin_line >= 0 && !(editor.document.lineAt(true_begin_line).text.trim().startsWith(begin))) {
					true_begin_line--;
				}

				const new_begin = new vscode.Position(true_begin_line, function_pos.character)
				const end_pos = new vscode.Position(function_pos.line, function_pos.character)
				const new_range = new vscode.Range(new_begin, end_pos);
				editBuilder.replace(new_range, documentation_template)
			}
			else {
				editBuilder.insert(function_pos, documentation_template);
			}
        });
		totDocuments.push({
			func_name: function_name,
			description: documentation_template
		});
		
		const docsFilePath = path.join(__dirname, 'api_docs.json');
		fs.writeFileSync(docsFilePath, JSON.stringify(totDocuments, null, 2));
		console.log("e",totDocuments); 
		
	}); 
	
	console.log("success"); 
	context.subscriptions.push(documentation); 
	const doc_to_code = new CodeLensProvider ();
    context.subscriptions.push(vscode.languages.registerCodeLensProvider('*', doc_to_code));
	console.log("temp",context); 

	clearJsonFile();
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
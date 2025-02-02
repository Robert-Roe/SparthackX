// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
	
const execSync = require('child_process');

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
			
			const codeLens = new vscode.CodeLens(new vscode.Range(start_pos,start_pos)); 
			codeLens.command = {
				title: `Generate Documentation for ${function_name}`,
				command: 'architext.generateDocumentation',
				arguments: [document, function_name, start_pos]
			}; 
			documentation.push(codeLens)
		} 
		});
		return documentation; 
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

	const documentation = vscode.commands.registerCommand('architext.generateDocumentation', async function(document_uri, function_name, function_pos) { 
		const editor = await vscode.window.activeTextEditor; 
		if(!editor){
			vscode.window.showErrorMessage('No active editor currently');
			return; 
		}
		vscode.window.showInformationMessage('Generate documents...'); 
		const language = editor.document.languageId; 
		console.log(document_uri," ",function_name," ",language, " ", function_pos); 

		let command = ""
		command = "Generate documentation for the function " + function_name + ". This documentation should include details on the functions role, its inputs, and its output if any. Include whitespace between each of these sections.";
		const output = execSync.execSync("python3 /home/tutu/ArchiText/SparthackX/ai_stuff/ollama_test.py", {
			input: command, 
			encoding: "utf-8"
		});

		
		let documentation_template = "";
		switch (language) {
			case "javascript":
			case "typescript":
				documentation_template = `/**\n * ${function_name} - Description\n *\n * @param {any} param1 - Description\n * @returns {any} Description\n */\n`;
				break; 
			case "python":
				documentation_template = `"""\n${output}"""\n`;
				break;
			case "java":
			case "csharp":
				documentation_template = `/**\n * ${function_name} - Description\n *\n * @param param1 Description\n * @return Description\n */\n`;
				break;
			case "c":
			case "cpp":
				documentation_template = `/**\n ${function_name} /\n`;
				break;
			case "ruby":
				documentation_template = `# ${function_name} - Description\n#\n# @param param1 Description\n# @return Description\n`;
				break;
			case "php":
				documentation_template = `/**\n * ${function_name} - Description\n *\n * @param mixed $param1 Description\n * @return mixed Description\n */\n`;
				break;
			case "go":
				documentation_template = `// ${function_name} - Description\n`;
				break; 
		}; 
		console.log(documentation_template);
		console.log(function_pos); 
		editor.edit(editBuilder => {
            editBuilder.insert(function_pos, documentation_template);
        });
	}); 
	console.log("success"); 
	context.subscriptions.push(documentation); 
	const doc_to_code = new CodeLensProvider();
    context.subscriptions.push(vscode.languages.registerCodeLensProvider('*', doc_to_code));
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
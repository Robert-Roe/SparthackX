// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
import CodeLensProvider from './generation';

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


	const documentation = vscode.commands.registerCommand('architext.generateDocumentation', async function(document_uri, function_name) { 
			if(!document_uri){
				vscode.window.showErrorMessage('No active editor currently');
				return; 
			}
		const document = document_uri.document; 
		try {
			console.log('pp'); 
			const temp = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider',document.uri);
			var i = 0; 
			while(Array.isArray(temp[i])){
				console.log(temp[i]); 
				++i; 
			}
			
		} catch (err) {
			console.log('ppp'); 
			vscode.window.showErrorMessage(`Error retrieving document symbols: ${err.message || err}`); 
		}

		const language = document.languageId; 
		const doc_to_code = new CodeLensProvider();
    	vscode.languages.registerCodeLensProvider('*', doc_to_code);
		switch (language) {
			case "javascript":
			case "typescript":
				return `/**\n * ${function_name} - Description\n *\n * @param {any} param1 - Description\n * @returns {any} Description\n */\n`;
	
			case "python":
				return `"""\n${function_name} - Description\n\n:param param1: Description\n:return: Description\n"""\n`;
	
			case "java":
			case "csharp":
				return `/**\n * ${function_name} - Description\n *\n * @param param1 Description\n * @return Description\n */\n`;
	
			case "c":
			case "cpp":
				return `/**\n * ${function_name} - Description\n *\n * @param param1 Description\n * @return Description\n */\n`;
	
			case "ruby":
				return `# ${function_name} - Description\n#\n# @param param1 Description\n# @return Description\n`;
	
			case "php":
				return `/**\n * ${function_name} - Description\n *\n * @param mixed $param1 Description\n * @return mixed Description\n */\n`;
	
			case "go":
				return `// ${function_name} - Description\n`;
		};

	});

	console.log("success"); 
	context.subscriptions.push(documentation); 



	const docfile = vscode.commands.registerCommand('architext.generateDocFile', async function(document_uri, function_name) { 
	if(!document_uri){
		vscode.window.showErrorMessage('No active editor currently');
		return; 
	}
	const document = document_uri.document;
	vscode.window.showInformationMessage('Generating documents..'); 

        const code = document.getText();
		let response = "";
		fetchData(code).then(response => {

		const outputPath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, 'api_output.txt');
		fs.writeFileSync(outputPath, response, 'utf8');

		const newFileUri = vscode.Uri.file(outputPath);
        vscode.workspace.openTextDocument(newFileUri).then(doc => {
            vscode.window.showTextDocument(doc);
        });
		});
		vscode.window.showInformationMessage('API output saved to api_output.txt');

	});
}
async function fetchData(code) {
    const response = await fetch('https://api.com', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: "AI COMMAND"+JSON.stringify({code}),
	});
	const apiOutput = await response.text();
	return apiOutput;
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}

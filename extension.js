// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
import * as path from 'path';
import * as fs from 'fs';

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
	const disposable = vscode.commands.registerCommand('architext.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		const editor = vscode.window.activeTextEditor;//Selects the file to read in from
		if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

		const document = editor.document;
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

	context.subscriptions.push(disposable);
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

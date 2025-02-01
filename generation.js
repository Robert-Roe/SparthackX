const vscode = require('vscode'); 
const document = vscode.window.activeTextEditor.document; 
class CodeLensProvider {
    constructor(symbols_in){
        this.symbols = symbols_in; 
    }
    provideCodeLenses(document, token){
        const documentation = [];
        this.symbols.forEach(symbol => {
            const start_pos = document.positionAt(symbol.location.range.start.character);
            const function_name = symbol.name; 

            const codeLens = new vscode.CodeLens(new vscode.Range(start_pos, start_pos));
            codeLens.command = {
                title: `Generate Documentation for ${function_name}`,
                command: 'architext.generateDocumentation',
                arguments: [document.uri, function_name]
            }; 
            
            documentation.push(codeLens)
        });
        return documentation; 
    }
}
module.exports = CodeLensProvider; 
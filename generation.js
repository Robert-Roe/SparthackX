const vscode = require('vscode'); 
const document = vscode.window.activeTextEditor.document; 
class CodeLensProvider {
    constructor(symbols_in){
        this.symbols = symbols_in; 
    }
    provideCodeLenses(document, token){
        const documentation = [];
        this.symbols.forEach(symbol => {
            const start_pos = document.positionAt(this.symbols.location.range.start);
            const function_name = this.symbols.name; 
            const codeLens = new vscode.CodeLens(new vscode.Range(start_pos,start_pos)); 
            codeLens.command= {
                title: `Generate Documentation for ${function_name}`,
                command: 'architext.generateDocumentation',
                arguments: [document.uri,function_name]
            }; 
            documentation.push(codeLens)
        });
        return documentation; 
    }
}
module.exports = CodeLensProvider; 

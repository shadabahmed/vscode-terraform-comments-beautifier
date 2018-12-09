'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  function getComment(text: String): String {
    let comment = [];
    for(let i = 0; i < text.length; i++){
      comment.push('#');
    }
    return comment.join('');
  }

  let command = vscode.commands.registerCommand('extension.beautifyTerraformComments', () => {

  const {activeTextEditor} = vscode.window;    
  if (activeTextEditor && activeTextEditor.document.languageId === 'hcl') {
      const {document} = activeTextEditor;
      const edit = new vscode.WorkspaceEdit();
      for(let i = 0; i < document.lineCount; i++) {
        let line = document.lineAt(i);
        if(line.text.startsWith('#'))
        {
          let prevNotComment = i == 0 || (!document.lineAt(i - 1).text.startsWith('#'));
          let nextNotComment = (i == document.lineCount - 1) || (!document.lineAt(i + 1).text.startsWith('#'));
          if(prevNotComment && nextNotComment){
            let comment = getComment(line.text);
            edit.insert(document.uri, line.range.start, comment +'\n');
            edit.insert(document.uri, line.range.end, '\n' + comment);              
          }
        }
      }
      return vscode.workspace.applyEdit(edit);
    }
  });
  context.subscriptions.push(command);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
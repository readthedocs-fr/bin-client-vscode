import * as vscode from 'vscode';
import { createBin } from './helpers/bin';
import { input } from './helpers/input';

export function activate(): void {
  vscode.commands.registerCommand('rtdbin.createBin', async () => {
    const window = vscode.window;
    const editor = window.activeTextEditor;

    if (!editor) {
      window.showErrorMessage('There is no active text editor.');
      return;
    }

    const selection = editor.selection;
    const code = editor.document.getText(selection.isEmpty ? undefined : selection);

    const language = await input({
      prompt: 'The language of your bin',
      placeHolder: 'Language',
      value: editor.document.languageId,
    });
    if (!language) {
      return;
    }

    const configuration = vscode.workspace.getConfiguration('rtdbin');

    const lifetime = await input({
      prompt: 'The lifetime of your bin (0 for never, else in this format: 1d1h1m1s)',
      placeHolder: 'Expiration',
      value: configuration.get('defaultExpiration'),
      validateInput(value: string) {
        return !/^[0-9dhms]+$/.test(value) ? 'Please enter a valid number (0 or 1d1h1m1s)' : undefined;
      },
    });
    if (!lifetime) {
      return;
    }

    const maxUsages = await input({
      prompt: 'The max usages of your bin (0 for infinity)',
      placeHolder: 'Max usages',
      value: configuration.get('defaultMaxUsages'),
      validateInput(value: string) {
        const maxUsages = parseInt(value, 10);
        return !isNaN(maxUsages) && maxUsages < 0
          ? 'Please enter a valid number greater than or equal to 0'
          : undefined;
      },
    });
    if (!maxUsages) {
      return;
    }

    try {
      const bin = await createBin({ code, lang: language, maxusages: maxUsages, lifetime });
      const selection = await window.showInformationMessage(`[${bin}](${bin})`, 'Open');
      if (selection === 'Open') {
        vscode.env.openExternal(vscode.Uri.parse(bin));
      }
    } catch (error) {
      window.showErrorMessage(error.toString());
    }
  });
}

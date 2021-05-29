"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const path_1 = require("path");
const vscode_1 = require("vscode");
const bin_1 = require("./helpers/bin");
const input_1 = require("./helpers/input");
function activate(context) {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    const disposable = vscode_1.commands.registerCommand('rtdbin.createBin', async (_, filePath) => {
        const editor = 
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        filePath ? await vscode_1.window.showTextDocument(filePath[0]).then(undefined, () => { }) : vscode_1.window.activeTextEditor;
        if (!editor) {
            vscode_1.window.showErrorMessage('There is no active text editor.');
            return;
        }
        const selection = editor.selection;
        const code = editor.document.getText(selection.isEmpty ? undefined : selection);
        if (!code) {
            return;
        }
        const language = await input_1.input({
            prompt: 'The language of your bin',
            placeHolder: 'Language',
            value: editor.document.languageId,
        });
        if (!language) {
            return;
        }
        const configuration = vscode_1.workspace.getConfiguration('rtdbin');
        const lifetime = await input_1.input({
            prompt: 'The lifetime of your bin (0 for never, else in this format: 1d1h1m1s)',
            placeHolder: 'Lifetime',
            value: configuration.get('defaultLifetime'),
            validateInput(value) {
                return !/^[\ddhms]+$/.test(value) ? 'Please enter a valid duration (0 or 1d1h1m1s).' : undefined;
            },
        });
        if (!lifetime) {
            return;
        }
        const maxUses = await input_1.input({
            prompt: 'The max uses of your bin (0 for infinity)',
            placeHolder: 'Max uses',
            value: configuration.get('defaultMaxUses'),
            validateInput(value) {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const maxUses = parseInt(value, 10);
                return isNaN(maxUses) || maxUses < 0 ? 'Please enter a valid integer greater than or equal to 0.' : undefined;
            },
        });
        if (!maxUses) {
            return;
        }
        try {
            const binUrl = await bin_1.createBin({
                code,
                filename: path_1.basename(editor.document.fileName),
                extension: language,
                maxUses: parseInt(maxUses),
                lifetime: parseInt(lifetime),
            });
            const action = await vscode_1.window.showInformationMessage(`[${binUrl}](${binUrl})`, 'Open', 'Copy');
            if (action === 'Open') {
                vscode_1.env.openExternal(vscode_1.Uri.parse(binUrl));
            }
            else {
                vscode_1.env.clipboard.writeText(binUrl);
            }
        }
        catch (error) {
            vscode_1.window.showErrorMessage(error);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// eslint-disable-next-line @typescript-eslint/no-empty-function
function deactivate() { }
exports.deactivate = deactivate;

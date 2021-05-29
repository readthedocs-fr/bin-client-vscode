"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.input = void 0;
const vscode_1 = require("vscode");
function input(options) {
    var _a, _b;
    const valueEnd = (_b = (_a = options.value) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    return vscode_1.window.showInputBox({ valueSelection: [valueEnd, valueEnd], ...options });
}
exports.input = input;

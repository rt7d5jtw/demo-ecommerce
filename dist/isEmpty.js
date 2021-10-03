"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = void 0;
const isEmpty = (obj) => Object.values(obj).some(x => (x !== null && x !== ''));
exports.isEmpty = isEmpty;
//# sourceMappingURL=isEmpty.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var transaction_manager_1 = __importDefault(require("../transaction-manager"));
var Block = /** @class */ (function () {
    function Block(blockId, axios, userId) {
        this.blockId = blockId;
        this.axios = axios;
        this.userId = userId;
        this.transactionManager = new transaction_manager_1.default(this.axios, this.userId);
    }
    Block.prototype.update = function (content) {
        return this.transactionManager.update([
            {
                id: this.blockId,
                data: [
                    {
                        id: 'title',
                        type: 'pre-formatted',
                        value: [[content]],
                    },
                ],
            },
        ]);
    };
    return Block;
}());
exports.default = Block;

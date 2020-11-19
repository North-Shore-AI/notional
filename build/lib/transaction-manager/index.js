"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var moment_1 = __importDefault(require("moment"));
var flatten_1 = __importDefault(require("lodash/flatten"));
var NOTION_STAND_IN_NOTATION = '‣';
var NOTION_LIST_SEPARATOR = [','];
var TransactionManager = /** @class */ (function () {
    function TransactionManager(axios, userId, keys) {
        this.axios = axios;
        this.userId = userId;
        this.keys = keys;
    }
    TransactionManager.prototype.formatToDateNode = function (dateNode) {
        if (Array.isArray(dateNode)) {
            var startDate = moment_1.default(dateNode[0]);
            var endDate = moment_1.default(dateNode[1]);
            return {
                type: 'datetimerange',
                start_date: startDate.format('YYYY-MM-DD'),
                start_time: startDate.format('HH:mm'),
                end_date: endDate.format('YYYY-MM-DD'),
                end_time: endDate.format('HH:mm'),
            };
        }
        return {
            type: 'datetime',
            start_date: moment_1.default(dateNode).format('YYYY-MM-DD'),
            start_time: moment_1.default(dateNode).format('HH:mm'),
        };
    };
    TransactionManager.prototype.formatUserType = function (value) {
        if (!Array.isArray(value)) {
            return [[NOTION_STAND_IN_NOTATION, [['u', value]]]];
        }
        var users = [];
        value.forEach(function (userId, index) {
            users.push([NOTION_STAND_IN_NOTATION, [['u', userId]]]);
            if (index !== value.length - 1) {
                users.push(NOTION_LIST_SEPARATOR);
            }
        });
        return users;
    };
    TransactionManager.prototype.formatToNotionTextNode = function (type, value) {
        switch (type) {
            case 'pre-formatted':
                return value;
            case 'url':
            case 'email':
            case 'phone_number':
            case 'file':
                return [[value, ['a', value]]];
            case 'date':
                return [
                    [NOTION_STAND_IN_NOTATION, [['d', this.formatToDateNode(value)]]],
                ];
            case 'multi_select':
                return [[value.join(',')]];
            case 'user':
            case 'person':
                return this.formatUserType(value);
            case 'checkbox':
                return value ? [['Yes']] : null;
            default:
                return [[value]];
        }
    };
    TransactionManager.prototype.submitTransaction = function (transactions) {
        return this.axios.post('submitTransaction', {
            requestId: uuid_1.v4(),
            transactions: transactions,
        });
    };
    TransactionManager.prototype.update = function (insertionData) {
        return __awaiter(this, void 0, void 0, function () {
            var now, transactions;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date().getTime();
                        transactions = insertionData.map(function (_a) {
                            var id = _a.id, data = _a.data;
                            return ({
                                id: uuid_1.v4(),
                                operations: __spreadArrays(data.map(function (entry) { return ({
                                    id: id,
                                    table: 'block',
                                    path: ['properties', entry.id],
                                    command: 'set',
                                    args: _this.formatToNotionTextNode(entry.type, entry.value),
                                }); }), [
                                    {
                                        id: id,
                                        table: 'block',
                                        path: ['last_edited_time'],
                                        command: 'set',
                                        args: now,
                                    },
                                ]),
                            });
                        });
                        return [4 /*yield*/, this.submitTransaction(transactions)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TransactionManager.prototype.delete = function (blockIds) {
        return __awaiter(this, void 0, void 0, function () {
            var now, transactions;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date().getTime();
                        transactions = blockIds.map(function (id) {
                            var _a;
                            return ({
                                id: uuid_1.v4(),
                                operations: [
                                    {
                                        id: id,
                                        table: 'block',
                                        path: [],
                                        command: 'update',
                                        args: {
                                            parent_id: (_a = _this.keys) === null || _a === void 0 ? void 0 : _a.collectionId,
                                            parent_table: 'collection',
                                            alive: false,
                                        },
                                    },
                                    {
                                        id: id,
                                        table: 'block',
                                        path: ['last_edited_time'],
                                        command: 'set',
                                        args: now,
                                    },
                                ],
                            });
                        });
                        return [4 /*yield*/, this.submitTransaction(transactions)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TransactionManager.prototype.setSchema = function (schema) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var transactions;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        transactions = [
                            {
                                id: uuid_1.v4(),
                                operations: [
                                    {
                                        id: (_a = this.keys) === null || _a === void 0 ? void 0 : _a.collectionId,
                                        table: 'collection',
                                        path: [],
                                        command: 'update',
                                        args: {
                                            schema: schema,
                                        },
                                    },
                                ],
                            },
                        ];
                        return [4 /*yield*/, this.submitTransaction(transactions)];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    TransactionManager.prototype.insert = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var now, newBlockIds, dataToInsert, transactions;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        now = new Date().getTime();
                        newBlockIds = data.map(function (_) { return uuid_1.v4(); });
                        dataToInsert = data.map(function (row, index) { return ({
                            id: uuid_1.v4(),
                            operations: row.map(function (entry) { return ({
                                id: newBlockIds[index],
                                table: 'block',
                                path: ['properties', entry.id],
                                command: 'set',
                                args: _this.formatToNotionTextNode(entry.type, entry.value),
                            }); }),
                        }); });
                        transactions = __spreadArrays([
                            {
                                id: uuid_1.v4(),
                                operations: flatten_1.default(newBlockIds.map(function (newBlockId) {
                                    var _a, _b;
                                    return [
                                        {
                                            id: newBlockId,
                                            table: 'block',
                                            path: [],
                                            command: 'set',
                                            args: {
                                                type: 'page',
                                                id: newBlockId,
                                                version: 1,
                                            },
                                        },
                                        {
                                            table: 'collection_view',
                                            id: (_a = _this.keys) === null || _a === void 0 ? void 0 : _a.collectionViewId,
                                            path: ['page_sort'],
                                            command: 'listAfter',
                                            args: {
                                                id: newBlockId,
                                            },
                                        },
                                        {
                                            id: newBlockId,
                                            table: 'block',
                                            path: [],
                                            command: 'update',
                                            args: {
                                                parent_id: (_b = _this.keys) === null || _b === void 0 ? void 0 : _b.collectionId,
                                                parent_table: 'collection',
                                                alive: true,
                                            },
                                        },
                                        {
                                            table: 'block',
                                            id: newBlockId,
                                            path: ['created_by_id'],
                                            command: 'set',
                                            args: _this.userId,
                                        },
                                        {
                                            table: 'block',
                                            id: newBlockId,
                                            path: ['created_by_table'],
                                            command: 'set',
                                            args: 'notion_user',
                                        },
                                        {
                                            table: 'block',
                                            id: newBlockId,
                                            path: ['created_time'],
                                            command: 'set',
                                            args: now,
                                        },
                                        {
                                            table: 'block',
                                            id: newBlockId,
                                            path: ['last_edited_time'],
                                            command: 'set',
                                            args: now,
                                        },
                                        {
                                            table: 'block',
                                            id: newBlockId,
                                            path: ['last_edited_by_id'],
                                            command: 'set',
                                            args: _this.userId,
                                        },
                                        {
                                            table: 'block',
                                            id: newBlockId,
                                            path: ['last_edited_by_table'],
                                            command: 'set',
                                            args: 'notion_user',
                                        },
                                    ];
                                })),
                            }
                        ], dataToInsert);
                        return [4 /*yield*/, this.submitTransaction(transactions)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return TransactionManager;
}());
exports.default = TransactionManager;

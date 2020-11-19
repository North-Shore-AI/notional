"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var url_1 = require("url");
var table_1 = __importDefault(require("../table"));
var block_1 = __importDefault(require("../block"));
var Notional = /** @class */ (function () {
    function Notional(_a) {
        var apiKey = _a.apiKey, userId = _a.userId, cache = _a.cache;
        this.baseConfig = {
            limit: 100000,
            chunkNumber: 0,
            cursor: { stack: [] },
            verticalColumns: false,
        };
        if (!apiKey || !userId) {
            throw new Error('Both an apiKey and userId are required');
        }
        this.userId = userId;
        this.tableKeyCache = cache || {};
        this.http = axios_1.default.create({
            baseURL: 'https://www.notion.so/api/v3/',
            headers: {
                Cookie: "token_v2=" + apiKey,
                'Content-Type': 'application/json',
            },
        });
    }
    Notional.prototype.toUUID = function (input) {
        return input.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
    };
    Notional.prototype.getBaseUrl = function (pageUrl) {
        var url = new url_1.URL(pageUrl);
        var urlHost = pageUrl.split(url.pathname)[0];
        var company = url.pathname.split('/')[1];
        return urlHost + "/" + company;
    };
    Notional.prototype.formatUriFromURL = function (pageUrl) {
        var pathname = new url_1.URL(pageUrl).pathname;
        var baseUrl = this.getBaseUrl(pageUrl);
        var collectionId = pathname.substring(pathname.length - 32);
        return baseUrl + "/" + collectionId;
    };
    Notional.prototype.loadPageChunk = function (pageId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.post('/loadPageChunk', __assign(__assign({}, this.baseConfig), { pageId: pageId }))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    Notional.prototype.getTableKeysFromUrl = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var uri, tableIds, keys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uri = this.formatUriFromURL(url);
                        if (this.tableKeyCache[uri]) {
                            return [2 /*return*/, this.tableKeyCache[uri]];
                        }
                        return [4 /*yield*/, this.getTableIdsFromPage(uri)];
                    case 1:
                        tableIds = _a.sent();
                        keys = Object.keys(tableIds);
                        if (keys.length === 0) {
                            throw new Error("No table found on URL \"" + url + "\"");
                        }
                        if (keys.length > 1) {
                            throw new Error("Multiple tables found on URL \"" + url + "\"");
                        }
                        return [2 /*return*/, tableIds[keys[0]]];
                }
            });
        });
    };
    Notional.prototype.getCachedTableKeys = function () {
        return this.tableKeyCache;
    };
    Notional.prototype.cacheTableKeys = function (tableKeys) {
        this.tableKeyCache = __assign(__assign({}, this.tableKeyCache), tableKeys);
        return this.tableKeyCache;
    };
    Notional.prototype.getTableIdsFromPage = function (pageUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var pathname, baseUrl, pageId, recordMap, tableKeys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pathname = new url_1.URL(pageUrl).pathname;
                        baseUrl = this.getBaseUrl(pageUrl);
                        pageId = this.toUUID(pathname.substring(pathname.length - 32));
                        return [4 /*yield*/, this.loadPageChunk(pageId)];
                    case 1:
                        recordMap = (_a.sent()).recordMap;
                        tableKeys = Object.values(recordMap.block)
                            .filter(function (block) { return block.value && (block.value.type === 'collection_view' || block.value.type === 'collection_view_page'); })
                            .reduce(function (keyObject, collection) {
                            var collectionId = collection.value.collection_id;
                            var tableUrl = baseUrl + "/" + collectionId;
                            keyObject[tableUrl] = {
                                collectionId: collectionId,
                                // TODO: Be more flexible in choice of view
                                collectionViewId: collection.value.view_ids[0],
                            };
                            return keyObject;
                        }, {});
                        this.cacheTableKeys(tableKeys);
                        return [2 /*return*/, tableKeys];
                }
            });
        });
    };
    Notional.prototype.table = function (tableUrlOrKeySet, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, getUsers, _b, getCollectionSchema, tableKeys, table;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = options.getUsers, getUsers = _a === void 0 ? true : _a, _b = options.getCollectionSchema, getCollectionSchema = _b === void 0 ? true : _b;
                        if (!(typeof tableUrlOrKeySet === 'string')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getTableKeysFromUrl(tableUrlOrKeySet)];
                    case 1:
                        tableKeys = _c.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        tableKeys = tableUrlOrKeySet;
                        _c.label = 3;
                    case 3:
                        table = new table_1.default(tableKeys, this.http, this.userId);
                        if (!getCollectionSchema) return [3 /*break*/, 5];
                        // Load table schema
                        return [4 /*yield*/, table.getCollectionSchema()];
                    case 4:
                        // Load table schema
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        if (!getUsers) return [3 /*break*/, 7];
                        // Load users
                        return [4 /*yield*/, table.getUsers()];
                    case 6:
                        // Load users
                        _c.sent();
                        _c.label = 7;
                    case 7: return [2 /*return*/, table];
                }
            });
        });
    };
    Notional.prototype.block = function (blockId) {
        return new block_1.default(blockId, this.http, this.userId);
    };
    return Notional;
}());
exports.Notional = Notional;
function notional(_a) {
    var apiKey = _a.apiKey, userId = _a.userId;
    var notion = new Notional({ apiKey: apiKey, userId: userId });
    return {
        block: notion.block.bind(notion),
        table: notion.table.bind(notion),
    };
}
exports.default = notional;
